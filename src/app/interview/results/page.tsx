'use client';

import React, { useState, useEffect } from 'react';
import {
  User,
  Award,
  TrendingUp,
  TrendingDown,
  Eye,
  Volume2,
  Brain,
  Code,
  MessageSquare,
  Clock,
  Target,
  AlertCircle,
  CheckCircle,
  Star,
  Download,
  Share2,
  RotateCcw,
  ChevronDown,
  ChevronUp,
  Lightbulb,
  Zap,
  BookOpen,
  Activity
} from 'lucide-react';

// Define types for our dynamic data
type CodeEvaluation = {
  correctness: string;
  efficiency: string;
  feedback: string;
};

type UserData = {
    role: string;
    name?: string; // Name is optional from the manual entry form
};

type SectionKeys = 'technical' | 'behavioral' | 'communication' | 'nonVerbal';

const InterviewResults = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [expandedSections, setExpandedSections] = useState({
    technical: true, // Keep the coding section open by default
    behavioral: false,
    communication: false,
    nonVerbal: false
  });
  
  // State for dynamic data loaded from sessionStorage
  const [userData, setUserData] = useState<UserData | null>(null);
  const [overallScore, setOverallScore] = useState(0);
  const [codeEvaluations, setCodeEvaluations] = useState<CodeEvaluation[]>([]);
  
  // The original state for simulated data can be kept for parts we haven't made dynamic yet
  const [results, setResults] = useState({
    analysis: {
      strengths: [
        'Strong problem-solving approach demonstrated in the coding round.',
        'Clear communication in behavioral answers.',
        'Confident delivery and good use of examples.'
      ],
      improvements: [
        'Could elaborate more on system design concepts for higher complexity roles.',
        'Work on conciseness in theoretical answers to be more direct.'
      ]
    },
    // ... other parts of original `results` state can be used if needed
  });

  useEffect(() => {
    // This effect runs once to load all data from the session
    const storedUserData = sessionStorage.getItem('userData');
    if (storedUserData) {
      setUserData(JSON.parse(storedUserData));
    }

    const evaluations: CodeEvaluation[] = [];
    for (let i = 0; i < 10; i++) { // Check for up to 10 coding questions
      const storedEval = sessionStorage.getItem(`code_evaluation_${i}`);
      if (storedEval) {
        evaluations.push(JSON.parse(storedEval));
      }
    }
    setCodeEvaluations(evaluations);

    // Animate the score (this is still simulated)
    const targetScore = Math.floor(Math.random() * 20) + 75;
    setTimeout(() => {
        setIsLoading(false);
        let score = 0;
        const increment = () => {
          if (score < targetScore) {
            score++;
            setOverallScore(score);
            setTimeout(increment, 20);
          }
        };
        increment();
    }, 1500);

  }, []); // The empty array ensures this runs only once

  const toggleSection = (section: SectionKeys) => {
    setExpandedSections(prev => ({ ...prev, [section]: !prev[section] }));
  };
  
  const getScoreColor = (score: number) => {
    if (score >= 85) return 'text-green-500';
    if (score >= 70) return 'text-yellow-500';
    return 'text-red-500';
  };
  
  const getScoreBg = (score: number) => {
    if (score >= 85) return 'bg-green-500';
    if (score >= 70) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#190019] via-[#2B124C] to-[#522B5B] flex items-center justify-center text-white p-4">
        <div className="text-center">
          <div className="relative w-24 h-24 mx-auto mb-6">
            <div className="w-full h-full border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin"></div>
            <Brain className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 h-8 w-8 text-purple-600" />
          </div>
          <h2 className="text-2xl font-bold mb-2">Analyzing Your Interview</h2>
          <p className="text-gray-300">Preparing your personalized feedback report...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#190019] via-[#2B124C] to-[#522B5B] text-white">
      <div className="bg-[#2B124C]/80 backdrop-blur-sm border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h1 className="text-3xl font-bold text-white">Interview Results</h1>
              <p className="text-gray-300">{userData?.name || 'Candidate'} • {userData?.role || 'Role'}</p>
            </div>
            <div className="flex gap-3">
              <button onClick={() => window.location.href = '/'} className="bg-purple-600 hover:bg-purple-700 px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center">
                <RotateCcw className="h-4 w-4 mr-2" />
                Try Again
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-gradient-to-r from-purple-600/20 to-blue-600/20 backdrop-blur-sm rounded-xl p-8 mb-8 border border-purple-500/30">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-white mb-2">Overall Interview Score (Simulated)</h2>
            <div className="text-5xl font-bold text-purple-400 my-4">{overallScore}%</div>
            <p className="text-xl text-gray-300">
              {overallScore >= 85 ? 'Excellent Performance!' : overallScore >= 70 ? 'Good Performance' : 'Needs Improvement'}
            </p>
          </div>
        </div>

        {/* --- DYNAMIC CODE EVALUATION SECTION --- */}
        {codeEvaluations.length > 0 && (
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 mb-8 border border-cyan-500/30">
            <h3 className="flex items-center text-xl font-semibold text-cyan-400 mb-6">
              <Code className="h-5 w-5 mr-3" />
              Coding Round Feedback
            </h3>
            <div className="space-y-6">
              {codeEvaluations.map((evaluation, index) => (
                <div key={index} className="border-t border-white/10 pt-4 first:pt-0 first:border-none">
                   <h4 className="font-semibold text-lg text-white mb-3">Problem #{index + 1} Evaluation</h4>
                   <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                      <div className="bg-black/20 p-3 rounded-lg">
                          <p className="font-bold text-green-400 flex items-center mb-1"><Star className="h-4 w-4 mr-2"/>Correctness</p>
                          <p className="text-gray-300">{evaluation.correctness}</p>
                      </div>
                      <div className="bg-black/20 p-3 rounded-lg">
                          <p className="font-bold text-yellow-400 flex items-center mb-1"><Zap className="h-4 w-4 mr-2"/>Efficiency</p>
                          <p className="text-gray-300">{evaluation.efficiency}</p>
                      </div>
                      <div className="bg-black/20 p-3 rounded-lg">
                          <p className="font-bold text-blue-400 flex items-center mb-1"><BookOpen className="h-4 w-4 mr-2"/>Feedback</p>
                          <p className="text-gray-300">{evaluation.feedback}</p>
                      </div>
                   </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="bg-green-600/20 backdrop-blur-sm rounded-lg p-6 border border-green-500/30">
            <h3 className="flex items-center text-lg font-semibold text-green-400 mb-4"><TrendingUp className="h-5 w-5 mr-2" />Top Strengths (Simulated)</h3>
            <ul className="space-y-2 text-sm text-gray-200">
              {results.analysis.strengths.map((strength, index) => (
                <li key={index} className="flex items-start"><CheckCircle className="h-4 w-4 text-green-400 mt-0.5 mr-2 flex-shrink-0" /><span>{strength}</span></li>
              ))}
            </ul>
          </div>
          <div className="bg-orange-600/20 backdrop-blur-sm rounded-lg p-6 border border-orange-500/30">
            <h3 className="flex items-center text-lg font-semibold text-orange-400 mb-4"><TrendingDown className="h-5 w-5 mr-2" />Areas for Improvement (Simulated)</h3>
            <ul className="space-y-2 text-sm text-gray-200">
              {results.analysis.improvements.map((improvement, index) => (
                <li key={index} className="flex items-start"><AlertCircle className="h-4 w-4 text-orange-400 mt-0.5 mr-2 flex-shrink-0" /><span>{improvement}</span></li>
              ))}
            </ul>
          </div>
        </div>
        
        <div className="text-center text-gray-400 text-sm mt-12">
          <p>Voice round analysis and other detailed scoring metrics are coming soon.</p>
        </div>
      </div>
    </div>
  );
};

export default InterviewResults;