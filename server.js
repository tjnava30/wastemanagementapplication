import express from 'express';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { SpeechClient } from '@google-cloud/speech';
import { ImageAnnotatorClient } from '@google-cloud/vision';
import cors from 'cors';
import dotenv from 'dotenv';
import multer from 'multer';
import fs from 'fs';

dotenv.config();

const app = express();
const port = 3001;

// --- On startup, check for all necessary credentials in the .env file ---
if (!process.env.GOOGLE_API_KEY || !process.env.WEATHER_API_KEY || !process.env.GOOGLE_APPLICATION_CREDENTIALS) {
  console.error("FATAL ERROR: One or more environment variables are missing. Please check your .env file.");
  process.exit(1);
}

// --- Initialize API Clients ---
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);
const speechClient = new SpeechClient();
const visionClient = new ImageAnnotatorClient();
const upload = multer({ dest: 'uploads/' });

app.use(cors());
app.use(express.json());

// --- AI Chatbot Endpoint (Handles Text & Images) ---
app.post('/api/chat', upload.single('image'), async (req, res) => {
  try {
    const { messages: messagesJSON, language } = req.body;
    const messages = JSON.parse(messagesJSON);

    if (!messages) return res.status(400).json({ error: 'Messages are required' });
    
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
    
    let systemPrompt = `You are EcoBot, a helpful AI assistant for waste management India. You must respond to all user queries ONLY in English. Use markdown for formatting.`;
    if (language === 'ta') { systemPrompt = `நீங்கள் EcoBot, சென்னையில் கழிவு மேலாண்மைக்கு உதவும் ஒரு AI உதவியாளர். பயனரின் அனைத்து கேள்விகளுக்கும் நீங்கள் தமிழில் மட்டுமே பதிலளிக்க வேண்டும்.`; }
    else if (language === 'hi') { systemPrompt = `आप EcoBot हैं, चेन्नई में कचरा प्रबंधन के लिए एक सहायक AI। आपको सभी उपयोगकर्ता प्रश्नों का उत्तर केवल हिंदी में देना होगा।`; }
    
    const history = messages.map(msg => ({
      role: msg.sender === 'bot' ? 'model' : 'user',
      parts: [{ text: msg.message }],
    }));

    if (req.file) {
      const imagePath = req.file.path;
      const imageFile = fs.readFileSync(imagePath);
      const imageBase64 = imageFile.toString('base64');
      
      const lastUserMessage = history[history.length - 1];
      
      lastUserMessage.parts.push({
        inlineData: {
          mimeType: req.file.mimetype,
          data: imageBase64,
        },
      });
      fs.unlinkSync(imagePath);
    }

    const result = await model.generateContent({
        contents: [
            { role: 'user', parts: [{ text: systemPrompt }] },
            { role: 'model', parts: [{ text: "Understood." }] },
            ...history
        ]
    });

    res.json({ response: result.response.text() });
  } catch (error) {
    console.error("Error calling Google Gemini API:", error);
    res.status(500).json({ error: 'Failed to get response from AI' });
  }
});

// --- Image Analysis Endpoint (for Waste Detection) ---
app.post('/api/analyze-image', upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No image file uploaded.' });
    }

    const [result] = await visionClient.objectLocalization(req.file.path);
    const objects = result.localizedObjectAnnotations;
    
    fs.unlinkSync(req.file.path); 

    const wasteKeywords = ['trash', 'plastic', 'bottle', 'can', 'waste', 'garbage', 'litter', 'bag', 'container'];
    
    const isWastePresent = objects.some(object => 
      wasteKeywords.some(keyword => 
        object.name.toLowerCase().includes(keyword)
      )
    );

    res.json({ isWaste: isWastePresent });
  } catch (error) {
    console.error("Error in image analysis endpoint:", error);
    res.status(500).json({ error: 'Failed to analyze image.' });
  }
});

// --- Weather Forecast Endpoint ---
app.get('/api/weather', async (req, res) => {
  try {
    const location = 'coimbatore';
    const apiKey = process.env.WEATHER_API_KEY;
    const url = `http://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${encodeURIComponent(location)}&days=7&aqi=no&alerts=yes`;

    const weatherResponse = await fetch(url);
    if (!weatherResponse.ok) {
      const errorBody = await weatherResponse.text();
      console.error("Weather API Error Body:", errorBody);
      return res.status(weatherResponse.status).json({ error: `Weather API Error: ${weatherResponse.statusText}` });
    }

    const weatherData = await weatherResponse.json();
    res.json(weatherData);
  } catch (error) {
    console.error("Error in /api/weather endpoint:", error);
    res.status(500).json({ error: 'Failed to get weather data' });
  }
});

// --- Speech-to-Text Endpoint ---
app.post('/api/speech-to-text', upload.single('audio'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No audio file uploaded.' });
    }

    const filePath = req.file.path;
    const audioFile = fs.readFileSync(filePath);
    const audioBytes = audioFile.toString('base64');

    const audio = { content: audioBytes };
    const config = {
      encoding: 'WEBM_OPUS',
      sampleRateHertz: 48000,
      languageCode: 'en-US',
    };
    const request = { audio: audio, config: config };

    const [response] = await speechClient.recognize(request);
    const transcription = response.results
      .map(result => result.alternatives[0].transcript)
      .join('\n');
    
    fs.unlinkSync(filePath);

    if (!transcription) {
      return res.status(400).json({ error: 'Could not transcribe audio. Please speak clearly.' });
    }

    res.json({ transcription: transcription });
  } catch (error) {
    console.error("Error in speech-to-text endpoint:", error);
    res.status(500).json({ error: 'Failed to process audio.' });
  }
});

app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});