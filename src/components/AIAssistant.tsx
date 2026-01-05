import React, { useState, useEffect, useRef } from 'react';
import { Send, Mic, Bot, User, Paperclip, X } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { ChatMessage } from '../types';
import { useReactMediaRecorder } from 'react-media-recorder';
import { useTranslation } from 'react-i18next';
import { LanguageSwitcher } from './LanguageSwitcher';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

export function AIAssistant() {
  const { t, i18n } = useTranslation();
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      message: t('HI I AM ECO BOT.HOW CAN I HELP YOU?'),
      sender: 'bot',
      timestamp: new Date().toISOString(),
    },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { status, startRecording, stopRecording } = useReactMediaRecorder({
    audio: true,
    onStop: (blobUrl, blob) => transcribeAudio(blob),
  });

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const removeImage = () => {
    setImageFile(null);
    setImagePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleSendMessage = async (messageText: string) => {
    if (!messageText.trim() && !imageFile) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      message: messageText,
      sender: 'user',
      timestamp: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const chatHistory = [...messages, userMessage].map((msg) => ({
        sender: msg.sender,
        message: msg.message,
      }));

      const formData = new FormData();
      formData.append('messages', JSON.stringify(chatHistory));
      formData.append('language', i18n.language);
      if (imageFile) {
        formData.append('image', imageFile);
      }
      
      const res = await fetch(`${API_URL}/api/chat`, {
        method: 'POST',
        body: formData,
      });
      
      removeImage();

      if (!res.ok) throw new Error('Failed to get a response from the server.');

      const data = await res.json();
      const botMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        message: data.response || t('emptyResponseError'),
        sender: 'bot',
        timestamp: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      console.error('Failed to fetch AI response:', error);
      const errorMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        message: t('connectionError'),
        sender: 'bot',
        timestamp: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const transcribeAudio = async (audioBlob: Blob) => {
    const formData = new FormData();
    formData.append('audio', audioBlob, 'recording.webm');
    setIsLoading(true);

    try {
      const res = await fetch(`${API_URL}/api/speech-to-text`, {
        method: 'POST',
        body: formData,
      });
      if (!res.ok) throw new Error('Speech-to-text request failed.');

      const data = await res.json();
      if (data.transcription) {
        setInput(data.transcription);
      }
    } catch (error) {
      console.error('Failed to transcribe audio:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const isRecording = status === 'recording';

  return (
    <div className="max-w-4xl mx-auto p-4 flex flex-col h-[85vh] bg-white rounded-lg shadow-xl border">
      <div className="flex justify-between items-center mb-4 pb-4 border-b">
        <h2 className="text-xl font-bold">{t('aiAssistant')}</h2>
        <LanguageSwitcher />
      </div>

      {/* --- THIS VISUAL PART WAS MISSING --- */}
      <div className="flex-1 overflow-y-auto pr-2 space-y-6">
        {messages.map((msg) => (
          <div key={msg.id} className={`flex items-start gap-3 ${msg.sender === 'user' ? 'justify-end' : ''}`}>
            {msg.sender === 'bot' && (
              <div className="flex-shrink-0 h-8 w-8 rounded-full bg-green-600 flex items-center justify-center text-white">
                <Bot size={20} />
              </div>
            )}
            <div className={`px-4 py-3 rounded-2xl max-w-lg ${msg.sender === 'user' ? 'bg-blue-500 text-white rounded-br-none' : 'bg-gray-100 text-gray-800 rounded-bl-none'}`}>
              <div className="prose prose-sm"><ReactMarkdown>{msg.message || ''}</ReactMarkdown></div>
            </div>
            {msg.sender === 'user' && (
              <div className="flex-shrink-0 h-8 w-8 rounded-full bg-gray-300 flex items-center justify-center"><User size={20} /></div>
            )}
          </div>
        ))}
        {isLoading && (
          <div className="flex items-start gap-3">
             <div className="flex-shrink-0 h-8 w-8 rounded-full bg-green-600 flex items-center justify-center text-white"><Bot size={20} /></div>
            <div className="px-4 py-3 rounded-2xl bg-gray-100 text-gray-600 animate-pulse">{t('thinking')}...</div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="mt-4 border-t pt-4">
        {imagePreview && (
          <div className="relative w-24 h-24 mb-2">
            <img src={imagePreview} alt="upload preview" className="w-full h-full object-cover rounded-md" />
            <button onClick={removeImage} className="absolute -top-2 -right-2 bg-gray-700 text-white rounded-full p-1 hover:bg-red-600 transition-colors">
              <X size={14} />
            </button>
          </div>
        )}
        <div className="flex items-center gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage(input)}
            placeholder={t('askPlaceholder')}
            className="flex-1 w-full px-4 py-3 bg-gray-100 rounded-full"
            disabled={isLoading}
          />
          <input type="file" accept="image/*" ref={fileInputRef} onChange={handleImageChange} className="hidden" />
          <button onClick={() => fileInputRef.current?.click()} className="p-3 rounded-full bg-gray-200 hover:bg-gray-300 transition-colors">
            <Paperclip size={20} />
          </button>
          <button onClick={isRecording ? stopRecording : startRecording} className={`p-3 rounded-full transition-colors ${isRecording ? 'bg-red-500 text-white animate-pulse' : 'bg-blue-500 text-white hover:bg-blue-600'}`}>
            <Mic size={20} />
          </button>
          <button onClick={() => handleSendMessage(input)} className="bg-green-600 text-white rounded-full p-3 hover:bg-green-700 disabled:bg-gray-400" disabled={isLoading || (!input.trim() && !imageFile)}>
            <Send size={20} />
          </button>
        </div>
      </div>
      {/* ------------------------------------- */}
    </div>
  );
}