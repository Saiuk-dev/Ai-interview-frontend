'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Mic, MicOff, Volume2, VolumeX, Play, Brain, Eye, Clock, SkipForward, Loader2, Code, Type } from 'lucide-react'; // Added 'Type' icon

import Editor from 'react-simple-code-editor';
import { highlight, languages } from 'prismjs/components/prism-core';
import 'prismjs/components/prism-clike';
import 'prismjs/components/prism-javascript';
import 'prismjs/themes/prism-tomorrow.css';

type Round = 'Core Concepts' | 'Coding' | 'HR';
const interviewRounds: Round[] = ['Core Concepts', 'Coding', 'HR'];

const AIVoiceInterview = () => {
  const [code, setCode] = useState<string>(`function solve() {\n  // Your code here\n}`);
  const [currentRoundIndex, setCurrentRoundIndex] = useState(0);
  const [isLoadingNextRound, setIsLoadingNextRound] = useState(true);
  const [isListening, setIsListening] = useState(false);
  const [isAISpeaking, setIsAISpeaking] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userTranscript, setUserTranscript] = useState('');
  
  // NEW: State for the microphone fix (interim results)
  const [finalizedTranscript, setFinalizedTranscript] = useState('');
  
  // NEW: State for toggling between speech and text input
  const [inputMode, setInputMode] = useState<'speak' | 'type'>('speak');

  const [currentAIMessage, setCurrentAIMessage] = useState('');
  const [interviewStarted, setInterviewStarted] = useState(false);
  const [timeLeft, setTimeLeft] = useState(120);
  const [interviewQuestions, setInterviewQuestions] = useState<string[]>([]);
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const recognitionRef = useRef<any>(null);
  const [facialMetrics, setFacialMetrics] = useState({ eyeContact: 75, confidence: 80, engagement: 85, currentExpression: 'focused' });

  const fetchQuestionsForRound = async (roundIndex: number) => {
    const roundName = interviewRounds[roundIndex];
    if (!roundName) return [];

    setIsLoadingNextRound(true);
    setCurrentAIMessage('');

    try {
      const storedUserData = sessionStorage.getItem('userData');
      const storedDifficulty = sessionStorage.getItem('difficulty');
      if (!storedUserData || !storedDifficulty) throw new Error("User data or difficulty not found.");
      const userData = JSON.parse(storedUserData);
      const difficulty = storedDifficulty;
      const response = await fetch('http://localhost:5000/api/interview/questions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ role: userData.role, skills: userData.skills, difficulty: difficulty, round: roundName }),
      });
      if (!response.ok) throw new Error('Failed to fetch questions');
      
      const data = await response.json();
      setInterviewQuestions(data);
      setCurrentQuestionIndex(0);
      return data;
    } catch (error) {
      console.error(`Error fetching questions for ${roundName}:`, error);
      const fallback = [`There was an issue preparing the next question.`];
      setInterviewQuestions(fallback);
      return fallback;
    } finally {
      setIsLoadingNextRound(false);
    }
  };

  const speakAIMessage = (message: string) => {
    if (!window.speechSynthesis) return;
    window.speechSynthesis.cancel(); // Fix for speech synthesis error
    setCurrentAIMessage(message);
    setIsAISpeaking(true);
    const utterance = new SpeechSynthesisUtterance(message);
    const voices = window.speechSynthesis.getVoices();
    const chosenVoice = voices.find(voice => voice.name === 'Google UK English Male') || voices.find(voice => voice.lang.includes('en'));
    if (chosenVoice) utterance.voice = chosenVoice;
    utterance.rate = 0.9;
    utterance.onend = () => setIsAISpeaking(false);
    utterance.onerror = (e) => { console.error("Speech synthesis error:", e); setIsAISpeaking(false); };
    window.speechSynthesis.speak(utterance);
  };

  const initializeCamera = async () => {
    try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        if (videoRef.current) {
            videoRef.current.srcObject = stream;
        }
    } catch (error) {
        console.error("Camera access error:", error);
    }
  };

  // NEW: This function is replaced with the "interim results" fix
  const initializeSpeechRecognition = () => {
      if ('webkitSpeechRecognition' in window) {
          const SpeechRecognition = (window as any).webkitSpeechRecognition;
          recognitionRef.current = new SpeechRecognition();
          recognitionRef.current.continuous = true; // Keep listening
          recognitionRef.current.interimResults = true; // Get results as they come

          recognitionRef.current.onresult = (event: any) => {
              let interimTranscript = '';
              let newFinalTranscript = finalizedTranscript; // Start with the last final text

              for (let i = event.resultIndex; i < event.results.length; ++i) {
                const transcriptChunk = event.results[i][0].transcript;
                if (event.results[i].isFinal) {
                  newFinalTranscript += transcriptChunk + ' '; // Add to the final text
                } else {
                  interimTranscript += transcriptChunk; // This is the in-progress text
                }
              }
              
              setFinalizedTranscript(newFinalTranscript);
              setUserTranscript(newFinalTranscript + interimTranscript); // Show final + interim
          };

          recognitionRef.current.onend = () => {
            setIsListening(false);
            // Don't reset transcripts here, wait for handleNextQuestion
          };
      }
  };

  const cleanup = () => {
      if (videoRef.current?.srcObject) {
          const stream = videoRef.current.srcObject as MediaStream;
          stream.getTracks().forEach(track => track.stop());
      }
      if (recognitionRef.current) {
          recognitionRef.current.stop();
      }
      if (window.speechSynthesis) {
          window.speechSynthesis.cancel();
      }
  };
  
  useEffect(() => {
    initializeCamera();
    initializeSpeechRecognition(); // This now calls the new version
    return () => cleanup();
  }, []);

  useEffect(() => {
    if (!interviewStarted || isLoadingNextRound) return;
    if (timeLeft <= 0) {
      handleNextQuestion();
      return;
    }
    const timer = setInterval(() => {
      setTimeLeft(prevTime => prevTime - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [interviewStarted, isLoadingNextRound, timeLeft]);

  const startInterview = async () => {
    setInterviewStarted(true);
    const firstQuestions = await fetchQuestionsForRound(0);
    if (firstQuestions && firstQuestions.length > 0) {
      speakAIMessage(firstQuestions[0]);
    }
  };

  // NEW: Updated handleNextQuestion to handle both modes and mic fix
  const handleNextQuestion = async () => {
    if (isListening) recognitionRef.current?.stop();
    
    // Evaluate code if it's the coding round
    if (interviewRounds[currentRoundIndex] === 'Coding') {
      try {
        const response = await fetch('http://localhost:5000/api/code/evaluate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            question: interviewQuestions[currentQuestionIndex],
            userCode: code,
          }),
        });
        const evaluation = await response.json();
        sessionStorage.setItem(`code_evaluation_${currentQuestionIndex}`, JSON.stringify(evaluation));
        console.log(`Code evaluation for question ${currentQuestionIndex} stored.`);
      } catch (error) {
        console.error("Failed to evaluate code:", error);
      }
    } else {
      // NEW: Save the correct transcript based on the input mode
      const answerToSave = (inputMode === 'speak') ? finalizedTranscript : userTranscript;
      sessionStorage.setItem(`voice_transcript_${currentRoundIndex}_${currentQuestionIndex}`, JSON.stringify({
        question: interviewQuestions[currentQuestionIndex],
        answer: answerToSave
      }));
    }
    
    // NEW: Reset both transcript states
    setUserTranscript('');
    setFinalizedTranscript('');
    
    // Logic to move to the next question or round
    if (currentQuestionIndex >= interviewQuestions.length - 1) {
      // End of a round
      if (currentRoundIndex < interviewRounds.length - 1) {
        // Move to next round
        const nextRoundIndex = currentRoundIndex + 1;
        setCurrentRoundIndex(nextRoundIndex);
        setCode(`function solve() {\n  // Your code for the new problem here\n}`); 
        const nextQuestions = await fetchQuestionsForRound(nextRoundIndex);
        if (nextQuestions && nextQuestions.length > 0) {
          speakAIMessage(nextQuestions[0]);
          setTimeLeft(120);
        }
      } else {
        // End of interview
        speakAIMessage("Thank you for completing all rounds. Redirecting to your results...");
        setTimeout(() => window.location.href = '/interview/results', 4000);
      }
    } else {
      // Still in the same round, just move to the next question
      setCode(`function solve() {\n  // Your code for the next problem here\n}`);
      const nextIndex = currentQuestionIndex + 1;
      setCurrentQuestionIndex(nextIndex);
      setTimeLeft(120);
      speakAIMessage(interviewQuestions[nextIndex]);
    }
  };

  const toggleListening = () => {
    if (!recognitionRef.current) return;
    if (isListening) {
      recognitionRef.current.stop();
    } else {
      // NEW: Clear old transcripts before starting
      setUserTranscript('');
      setFinalizedTranscript('');
      recognitionRef.current.start();
    }
    setIsListening(!isListening);
  };
  
  const stopAISpeaking = () => {
    if (window.speechSynthesis) {
        window.speechSynthesis.cancel();
        setIsAISpeaking(false);
    }
  };
  
  const formatTime = (seconds: number) => { 
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (!interviewStarted) {
    return (
        <div className="min-h-screen bg-gradient-to-br from-[#1a0b2e] to-[#16213e] text-white flex items-center justify-center p-6">
            <div className="max-w-2xl text-center space-y-8">
                <div><h1 className="text-4xl font-bold mb-4">AI Interview Ready</h1><p className="text-xl text-gray-300">Your camera and microphone are set up. Click start when you're ready.</p></div>
                <div className="aspect-video bg-black rounded-lg overflow-hidden max-w-md mx-auto"><video ref={videoRef} autoPlay playsInline muted className="w-full h-full object-cover" /></div>
                <div className="space-y-4">
                    <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4"><h3 className="font-semibold mb-2">Interview Format:</h3><ul className="text-sm text-gray-300 space-y-1"><li>• {interviewRounds.length} structured rounds</li><li>• Covers Core Concepts, Coding, and HR</li><li>• Real-time AI conversation</li></ul></div>
                    <button onClick={startInterview} className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-8 py-4 rounded-lg text-lg font-semibold transition-all transform hover:scale-105 shadow-lg"><Play className="inline h-5 w-5 mr-2" />Start Interview</button>
                </div>
            </div>
        </div>
    );
  }

  // --- JSX Below is Updated With Toggles and Conditional Rendering ---

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1a0b2e] to-[#16213e] text-white p-6">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 space-y-4">
          <div className="relative bg-black rounded-lg overflow-hidden">
            <video ref={videoRef} autoPlay playsInline muted className="w-full aspect-video object-cover" />
            <div className="absolute top-3 left-3 bg-black/70 backdrop-blur-sm rounded-lg p-2 text-xs space-y-1">
              <div className="flex items-center text-green-400"><Eye className="h-3 w-3 mr-1" /><span>AI Active</span></div>
              <div className="text-white">
                <div>Eye Contact: {facialMetrics.eyeContact}%</div>
                <div>Confidence: {facialMetrics.confidence}%</div>
                <div>Engagement: {facialMetrics.engagement}%</div>
              </div>
            </div>
          </div>

          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 space-y-3">
            <div className="text-center">
              <div className={`text-2xl font-bold mb-1 ${timeLeft < 30 ? 'text-red-400' : 'text-white'}`}>{formatTime(timeLeft)}</div>
              <p className="text-xs text-gray-300">Time remaining</p>
            </div>
            
            {/* NEW: Input Mode Toggle */}
            {interviewRounds[currentRoundIndex] !== 'Coding' && (
              <div className="flex w-full bg-black/20 rounded-lg p-1">
                <button
                  onClick={() => setInputMode('speak')}
                  className={`w-1/2 flex items-center justify-center gap-2 py-2 rounded-md text-sm transition-colors ${inputMode === 'speak' ? 'bg-white/20 text-white' : 'text-gray-400 hover:bg-white/10'}`}
                >
                  <Mic className="h-4 w-4" /> Speak
                </button>
                <button
                  onClick={() => setInputMode('type')}
                  className={`w-1/2 flex items-center justify-center gap-2 py-2 rounded-md text-sm transition-colors ${inputMode === 'type' ? 'bg-white/20 text-white' : 'text-gray-400 hover:bg-white/10'}`}
                >
                  <Type className="h-4 w-4" /> Type
                </button>
              </div>
            )}

            {/* NEW: Conditional Microphone Button */}
            {interviewRounds[currentRoundIndex] !== 'Coding' && inputMode === 'speak' && (
              <button onClick={toggleListening} disabled={isAISpeaking} className={`w-full flex items-center justify-center px-4 py-3 rounded-lg font-medium transition-all ${isListening ? 'bg-red-600 hover:bg-red-700' : 'bg-green-600 hover:bg-green-700'} disabled:opacity-50`}>
                {isListening ? (<><MicOff className="h-4 w-4 mr-2" />Stop Speaking</>) : (<><Mic className="h-4 w-4 mr-2" />Start Speaking</>)}
              </button>
            )}

            /*<button onClick={handleNextQuestion} disabled={ isListening} className="w-full bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg font-medium transition-colors disabled:opacity-50">*/
              <SkipForward className="h-4 w-4 inline mr-2" />
              {interviewRounds[currentRoundIndex] === 'Coding' ? 'Submit Code & Next' : 'Next Question'}
            </button>
          </div>

          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
            <div className="flex justify-between text-sm mb-1">
              <span>Overall Progress</span>
              <span>Round {currentRoundIndex + 1} / {interviewRounds.length}</span>
            </div>
            <div className="w-full bg-white/20 rounded-full h-2 mb-4">
              <div className="bg-gradient-to-r from-purple-500 to-blue-500 h-2 rounded-full" style={{ width: `${((currentRoundIndex + 1) / interviewRounds.length) * 100}%` }} />
            </div>
            <div className="flex justify-between text-sm mb-1">
              <span>Round Progress</span>
              <span>Question {currentQuestionIndex + 1} / {interviewQuestions.length || 1}</span>
            </div>
            <div className="w-full bg-white/20 rounded-full h-2">
              <div className="bg-gradient-to-r from-green-500 to-teal-500 h-2 rounded-full" style={{ width: `${interviewQuestions.length > 0 ? ((currentQuestionIndex + 1) / interviewQuestions.length) * 100 : 0}%` }} />
            </div>
          </div>
        </div>

        <div className="lg:col-span-2 space-y-4">
          <div className="bg-gradient-to-r from-purple-600/20 to-blue-600/20 backdrop-blur-sm rounded-lg p-6 border border-purple-500/30 min-h-[150px] flex flex-col justify-center">
            <div className="flex items-center mb-3">
              <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center mr-3 flex-shrink-0"><Brain className="h-4 w-4 text-white" /></div>
              <div>
                <h3 className="font-semibold text-purple-300">AI Interviewer</h3>
                <p className="text-xs text-gray-400">Round {currentRoundIndex + 1}: {interviewRounds[currentRoundIndex]}</p>
              </div>
              {isAISpeaking && (<div className="ml-auto flex items-center text-blue-400 text-sm"><Volume2 className="h-4 w-4 mr-1 animate-pulse" />Speaking</div>)}
            </div>
            {isLoadingNextRound ? (
              <div className="flex items-center text-lg leading-relaxed"><Loader2 className="animate-spin h-5 w-5 mr-3" />Preparing the next round...</div>
            ) : (
              <p className="text-lg leading-relaxed whitespace-pre-wrap">{currentAIMessage || interviewQuestions[currentQuestionIndex] || "..."}</p>
            )}
          </div>
          
          {interviewRounds[currentRoundIndex] === 'Coding' ? (
            <div className="bg-gray-900 backdrop-blur-sm rounded-lg p-4">
                <div className="flex items-center mb-3">
                    <div className="w-8 h-8 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full flex items-center justify-center mr-3 flex-shrink-0"><Code className="h-4 w-4 text-white" /></div>
                    <h3 className="font-semibold text-cyan-300">Code Editor</h3>
                </div>
                <div className="bg-black/30 rounded-lg font-mono text-sm" style={{ maxHeight: '400px', overflow: 'auto' }}>
                    <Editor
                        value={code}
                        onValueChange={code => setCode(code)}
                        highlight={code => highlight(code, languages.javascript, 'javascript')}
                        padding={15}
                        style={{ fontFamily: '"Fira Code", "Fira Mono", monospace', fontSize: 14 }}
                        className="editor-styles"
                    />
                </div>
            </div>
          ) : (
            // NEW: This entire block is now conditional (Speak vs Type)
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6">
              <div className="flex items-center mb-3">
                <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-teal-500 rounded-full flex items-center justify-center mr-3 flex-shrink-0">
                  {inputMode === 'speak' ? <Mic className="h-4 w-4 text-white" /> : <Type className="h-4 w-4 text-white" />}
                </div>
                <h3 className="font-semibold text-green-300">Your Response</h3>
                {isListening && (<div className="ml-auto flex items-center text-green-400 text-sm"><div className="animate-pulse h-2 w-2 bg-green-400 rounded-full mr-2" />Listening</div>)}
              </div>
              
              {inputMode === 'speak' ? (
                <div className="bg-black/30 rounded-lg p-4 min-h-[150px]">
                  <p className="text-gray-300 whitespace-pre-wrap">{userTranscript || "Click 'Start Speaking' and begin your response..."}</p>
                </div>
              ) : (
                <div className="bg-black/30 rounded-lg p-2">
                  <textarea
                    value={userTranscript}
                    onChange={(e) => setUserTranscript(e.target.value)}
                    placeholder="Type your answer here..."
                    className="w-full min-h-[150px] bg-transparent text-gray-300 p-2 focus:outline-none resize-none border-0"
                    disabled={isAISpeaking}
                  />
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AIVoiceInterview;