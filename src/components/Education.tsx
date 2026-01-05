import React, { useState } from 'react';
// FIX 1: Added the missing icons to the import list
import { Play, BookOpen, X, Award, Download, CheckCircle } from 'lucide-react';
import { useApp } from '../context/AppContext';

// --- Data (videos, quizzes, courses) remains the same ---
const videos = [
  { id: '4JDGFNoY-rQ', title: 'A brief history of plastic', author: 'TED-Ed', thumbnail: 'https://i.ytimg.com/vi/4JDGFNoY-rQ/hqdefault.jpg', description: 'Explore the history of plastic...' },
  { id: 'LUe31KDFjTI', title: 'Waste Management Facts', author: 'Simply E-learn', thumbnail: 'https://i.ytimg.com/vi/LUe31KDFjTI/hqdefault.jpg', description: 'Learn some interesting facts about waste management...' },
  { id: 'z_4-K0b-g9A', title: 'Explaining the Circular Economy', author: 'Ellen MacArthur Foundation', thumbnail: 'https://i.ytimg.com/vi/z_4-K0b-g9A/hqdefault.jpg', description: 'Learn about the circular economy...' },
  { id: '3e6KaEYzTh4', title: 'Zero Waste 101', author: 'Gittemary Johansen', thumbnail: 'https://i.ytimg.com/vi/3e6KaEYzTh4/hqdefault.jpg', description: 'A comprehensive introduction to the zero waste lifestyle...' }
];
const quizzes = [
  { id: 1, title: 'Recycling Basics Quiz', questions: [
    { questionText: 'Which of these common household items is generally NOT recyclable in curbside bins?', answerOptions: [ { answerText: 'Glass Bottles', isCorrect: false }, { answerText: 'Plastic Bags', isCorrect: true }, { answerText: 'Newspapers', isCorrect: false }, { answerText: 'Aluminum Cans', isCorrect: false } ] },
    { questionText: 'What does the green-colored bin typically signify in waste segregation?', answerOptions: [ { answerText: 'Plastic Waste', isCorrect: false }, { answerText: 'Paper Waste', isCorrect: false }, { answerText: 'Organic / Wet Waste', isCorrect: true }, { answerText: 'E-Waste', isCorrect: false } ] },
    { questionText: 'What is the primary benefit of composting?', answerOptions: [ { answerText: 'It reduces landfill space and creates nutrient-rich soil', isCorrect: true }, { answerText: 'It sterilizes waste', isCorrect: false }, { answerText: 'It generates electricity', isCorrect: false }, { answerText: 'It is a way to dispose of plastics', isCorrect: false } ] },
    { questionText: 'What does the number inside the recycling symbol on a plastic item indicate?', answerOptions: [ { answerText: 'How many times it has been recycled', isCorrect: false }, { answerText: 'The type of plastic resin it is made from', isCorrect: true }, { answerText: 'Its quality rating', isCorrect: false }, { answerText: 'The percentage of recycled material it contains', isCorrect: false } ] },
  ] },
];
const courses = [
  { id: 1, title: 'Waste Management Certification', description: 'A comprehensive course covering the fundamentals of waste segregation, recycling, and composting. Watch all videos to unlock the final quiz and earn your certificate!', videoIds: ['4JDGFNoY-rQ', 'LUe31KDFjTI', 'z_4-K0b-g9A'], quizId: 1, passingScore: 3 }
];


export function Education() {
  const { user } = useApp();
  const [activeTab, setActiveTab] = useState('courses');
  const [selectedVideoId, setSelectedVideoId] = useState<string | null>(null);
  
  const [activeQuizId, setActiveQuizId] = useState<number | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [showResults, setShowResults] = useState(false);

  const [activeCourseId, setActiveCourseId] = useState<number | null>(null);
  const [watchedVideos, setWatchedVideos] = useState<Set<string>>(new Set());
  const [certificateEarned, setCertificateEarned] = useState(false);

  const activeQuiz = quizzes.find(q => q.id === activeQuizId);
  const activeCourse = courses.find(c => c.id === activeCourseId);

  const handleAnswerClick = (isCorrect: boolean) => {
    let newScore = score;
    if (isCorrect) {
      newScore = score + 1;
      setScore(score + 1);
    }

    const nextQuestion = currentQuestionIndex + 1;
    if (activeQuiz && nextQuestion < activeQuiz.questions.length) {
      setCurrentQuestionIndex(nextQuestion);
    } else {
      setShowResults(true);
      if (activeCourse && newScore >= activeCourse.passingScore) {
        setCertificateEarned(true);
      }
    }
  };

  const handleStartQuiz = (quizId: number) => {
    setActiveQuizId(quizId);
    setCurrentQuestionIndex(0);
    setScore(0);
    setShowResults(false);
  };

  const handleReset = () => {
    setActiveQuizId(null);
    setActiveCourseId(null);
    setWatchedVideos(new Set());
    setCertificateEarned(false);
    setShowResults(false);
    setCurrentQuestionIndex(0);
    setScore(0);
  };
  
  const handleStartCourse = (courseId: number) => {
    setActiveCourseId(courseId);
    setWatchedVideos(new Set());
    setCertificateEarned(false);
  };

  const handleVideoWatch = (videoId: string) => {
    setSelectedVideoId(videoId);
    if (activeCourse) {
      setWatchedVideos(prev => new Set(prev).add(videoId));
    }
  };

  // This is a helper function to render the quiz UI, to avoid duplicating code.
  const renderQuizInterface = () => {
    if (!activeQuiz) return null;

    if (showResults) {
      return (
        <div className="text-center bg-white p-8 rounded-lg shadow-md max-w-lg mx-auto">
          <h3 className="text-2xl font-bold text-gray-800">Quiz Completed!</h3>
          <p className="text-lg text-gray-600 mt-4">You scored {score} out of {activeQuiz.questions.length}</p>
          {!activeCourse && ( // Only show "Choose Another Quiz" if not in a course
             <button onClick={handleReset} className="mt-6 bg-green-600 text-white px-6 py-2 rounded-lg">Choose Another Quiz</button>
          )}
        </div>
      );
    }

    const currentQuestion = activeQuiz.questions[currentQuestionIndex];
    return (
      <div className="bg-white p-8 rounded-lg shadow-md max-w-lg mx-auto">
        <div className="mb-6">
          <p className="text-gray-600">Question {currentQuestionIndex + 1}/{activeQuiz.questions.length}</p>
          <h4 className="text-xl font-semibold text-gray-800 mt-2">{currentQuestion.questionText}</h4>
        </div>
        <div className="grid grid-cols-1 gap-4">
          {currentQuestion.answerOptions.map((option, index) => (
            <button key={index} onClick={() => handleAnswerClick(option.isCorrect)} className="w-full p-4 bg-gray-100 rounded-lg text-left hover:bg-green-100">
              {option.answerText}
            </button>
          ))}
        </div>
      </div>
    );
  };


  const renderContent = () => {
    switch (activeTab) {
      case 'videos':
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {videos.map((video) => (
              <div key={video.id} className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="relative group cursor-pointer" onClick={() => handleVideoWatch(video.id)}>
                   <img src={video.thumbnail} alt={video.title} className="w-full h-48 object-cover" />
                   <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center opacity-0 group-hover:opacity-100">
                     <Play className="h-14 w-14 text-white" />
                   </div>
                </div>
                <div className="p-4">
                   <h4 className="font-semibold text-gray-900">{video.title}</h4>
                </div>
              </div>
            ))}
          </div>
        );
      
      case 'quizzes':
        if (activeQuizId) {
          return renderQuizInterface();
        }
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {quizzes.map((quiz) => (
              <div key={quiz.id} className="bg-white p-6 rounded-lg shadow-md flex flex-col justify-between">
                <div>
                  <h4 className="font-semibold text-xl text-gray-900">{quiz.title}</h4>
                </div>
                <button onClick={() => handleStartQuiz(quiz.id)} className="mt-4 bg-green-600 text-white px-4 py-2 rounded self-start">
                  Start Quiz
                </button>
              </div>
            ))}
          </div>
        );

      case 'courses':
        if (certificateEarned && activeCourse) {
          return (
            <div className="text-center bg-white p-8 rounded-lg shadow-xl max-w-2xl mx-auto border-2 border-green-500">
              <Award className="h-16 w-16 mx-auto text-yellow-500" />
              <h3 className="text-3xl font-bold text-gray-800 mt-4">Congratulations, {user?.name}!</h3>
              <p className="text-lg text-gray-600 mt-2">You have successfully completed the</p>
              <p className="text-2xl font-semibold text-green-600 mt-1">{activeCourse.title}</p>
              <p className="text-sm text-gray-500 mt-4">Issued on: {new Date().toLocaleDateString()}</p>
              <div className="flex justify-center space-x-4 mt-8">
                 <button onClick={handleReset} className="bg-gray-200 text-gray-800 px-6 py-2 rounded-lg">Back to Courses</button>
                 <button className="bg-green-600 text-white px-6 py-2 rounded-lg flex items-center space-x-2"><Download size={18} /><span>Download</span></button>
              </div>
            </div>
          );
        }

        if (activeCourse) {
            const allVideosWatched = activeCourse.videoIds.every(id => watchedVideos.has(id));
            
            // FIX 2: If the quiz for the course is active, render the full quiz interface
            if (activeQuizId === activeCourse.quizId) {
                return renderQuizInterface();
            }

            return (
            <div className="bg-white p-8 rounded-lg shadow-md max-w-4xl mx-auto">
              <h3 className="text-2xl font-bold text-gray-800">{activeCourse.title}</h3>
              <p className="text-gray-600 mt-2">{activeCourse.description}</p>
              <div className="mt-8">
                <h4 className="text-xl font-semibold text-gray-700 mb-4 border-b pb-2">Course Content</h4>
                <div className="space-y-4">
                  {activeCourse.videoIds.map(videoId => {
                    const video = videos.find(v => v.id === videoId)!;
                    const isWatched = watchedVideos.has(videoId);
                    return (
                      <div key={videoId} onClick={() => handleVideoWatch(videoId)} className="flex items-center p-4 rounded-lg hover:bg-gray-100 cursor-pointer border">
                        <Play className="h-8 w-8 text-green-500 mr-4" />
                        <div className="flex-1">
                          <p className="font-semibold text-gray-800">{video.title}</p>
                          <p className="text-sm text-gray-500">by {video.author}</p>
                        </div>
                        {isWatched && <CheckCircle className="h-6 w-6 text-green-600" />}
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="mt-8 text-center">
                <h4 className="text-xl font-semibold text-gray-700 mb-4 border-b pb-2">Final Quiz</h4>
                <button 
                  onClick={() => handleStartQuiz(activeCourse.quizId)}
                  disabled={!allVideosWatched}
                  className="bg-green-600 text-white px-8 py-3 rounded-lg hover:bg-green-700 disabled:bg-gray-400"
                >
                  {allVideosWatched ? 'Start Final Quiz' : `Watch all videos to unlock`}
                </button>
              </div>
               <button onClick={handleReset} className="text-sm text-gray-500 hover:underline mt-8 block mx-auto">Back to course list</button>
            </div>
          );
        }
        
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {courses.map((course) => (
              <div key={course.id} className="bg-white p-6 rounded-lg shadow-md flex flex-col justify-between">
                <div>
                  <h4 className="font-semibold text-xl text-gray-900">{course.title}</h4>
                </div>
                <button onClick={() => handleStartCourse(course.id)} className="mt-4 bg-blue-600 text-white px-4 py-2 rounded self-start">
                  Start Course
                </button>
              </div>
            ))}
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
       <div className="text-center mb-12">
         <BookOpen className="h-12 w-12 mx-auto text-green-600" />
         <h2 className="text-3xl font-bold text-gray-900 mt-4">Education Hub</h2>
         <p className="text-gray-600 mt-2">Learn, test your knowledge, and become an eco-champion.</p>
       </div>

       <div className="mb-8 flex justify-center border-b border-gray-200">
         <button onClick={() => {setActiveTab('courses'); handleReset();}} className={`px-6 py-3 font-medium ${activeTab === 'courses' ? 'border-b-2 border-green-600 text-green-600' : 'text-gray-500'}`}>Courses</button>
         <button onClick={() => {setActiveTab('videos'); handleReset();}} className={`px-6 py-3 font-medium ${activeTab === 'videos' ? 'border-b-2 border-green-600 text-green-600' : 'text-gray-500'}`}>Videos</button>
         <button onClick={() => {setActiveTab('quizzes'); handleReset();}} className={`px-6 py-3 font-medium ${activeTab === 'quizzes' ? 'border-b-2 border-green-600 text-green-600' : 'text-gray-500'}`}>Quizzes</button>
       </div>

       <div>{renderContent()}</div>

       {selectedVideoId && (
         <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
           <div className="relative w-full max-w-3xl">
             <button onClick={() => setSelectedVideoId(null)} className="absolute -top-10 right-0 text-white">
               <X size={32} />
             </button>
             <div className="aspect-w-16 aspect-h-9 bg-black">
               <iframe src={`https://www.youtube.com/embed/${selectedVideoId}?autoplay=1`} title="YouTube video player" frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen className="w-full h-full"></iframe>
             </div>
           </div>
         </div>
       )}
    </div>
  );
}