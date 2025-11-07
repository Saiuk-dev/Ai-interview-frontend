'use client';

import { useState } from 'react';
import { Upload, FileText, User, ArrowRight } from 'lucide-react';

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState<'resume' | 'manual'>('resume');
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  
  const [formData, setFormData] = useState({
    name: '',
    role: '',
    experience: '',
    skills: '',
    industry: ''
  });

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type === 'application/pdf') {
      setUploadedFile(file);
    } else {
      alert('Please upload a PDF file');
    }
  };

  const handleAnalyzeResume = async () => {
    // --- CHECKPOINT 1 ---
    // This message should appear in the console the moment you click the button.
    console.log('Analyze button clicked!');
    
    // --- CHECKPOINT 2 ---
    // We'll log the state of the uploaded file. If this shows `null`, we've found the problem.
    console.log('Checking for uploaded file:', uploadedFile);

    if (!uploadedFile) {
      console.error('No file found. The function will now stop.');
      return;
    }
    
    setIsAnalyzing(true);
    const formData = new FormData();
    formData.append('resume', uploadedFile);

    try {
      // --- CHECKPOINT 3 ---
      // If you see this message, it means the function is about to send the request.
      console.log('File found. Preparing to send fetch request...');

      const response = await fetch('http://localhost:5000/api/resume/upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Server responded with an error!');
      }

      const data = await response.json();
      console.log('AI Analysis from backend:', data);
      
      const params = new URLSearchParams({
        role: data.analysis.role,
        skills: data.analysis.skills.join(','),
        experience: data.analysis.experience,
        education: data.analysis.education,
      });
      
      window.location.href = `/interview/setup?type=resume&${params.toString()}`;

    } catch (error) {
      console.error('Failed to analyze resume:', error);
      alert('There was an error analyzing your resume. Please check the console for details.');
    } finally {
      setIsAnalyzing(false);
    }
  };
  
  const handleManualSubmit = () => {
    if (!formData.name || !formData.role || !formData.experience) {
      alert('Please fill in all required fields');
      return;
    }
    
    const params = new URLSearchParams(formData);
    window.location.href = `/interview/setup?type=manual&${params.toString()}`;
  };

  // The rest of your JSX remains the same...
  return (
    <div className="min-h-screen bg-[#2A2238] text-white">
      {/* Navigation */}
      <nav className="bg-[#2A2238] border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <a href="/" className="flex items-center">
              <h1 className="text-2xl font-bold text-white">
                Mockmate
              </h1>
            </a>
            <div className="flex items-center space-x-4">
              <span className="text-gray-300 text-sm">Welcome back!</span>
              <div className="w-8 h-8 bg-white/10 rounded-full flex items-center justify-center">
                <User 
                  className="h-4 w-4 text-white" />
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl lg:text-5xl font-bold text-white mb-4">
            Get Your Dream Job with AI Practice
          </h1>
          <p className="text-lg text-gray-300 max-w-2xl mx-auto">
            Upload your resume for a personalized experience, or enter your details manually to begin.
          </p>
        </div>

        {/* Tab Selector */}
        <div className="flex justify-center mb-8">
          <div className="bg-[#3E3253]/60 rounded-lg p-1 flex border border-white/10">
            <button
              onClick={() => setActiveTab('resume')}
              className={`px-6 py-2.5 rounded-md text-sm font-medium transition-all ${
                activeTab === 'resume'
                  ? 'bg-white text-[#2A2238] shadow-sm'
                  : 'text-white hover:bg-white/5'
              }`}
            >
              <FileText className="w-4 h-4 inline mr-2" />
              Upload Resume
            </button>
            <button
              onClick={() => setActiveTab('manual')}
              className={`px-6 py-2.5 rounded-md text-sm font-medium transition-all ${
                activeTab === 'manual'
                  ? 'bg-white text-[#2A2238] shadow-sm'
                  : 'text-white hover:bg-white/5'
              }`}
            >
              <User className="w-4 h-4 inline mr-2" />
              Manual Setup
            </button>
          </div>
        </div>

        {/* Main Form Area */}
        <div className="bg-[#EAE2E2] rounded-lg shadow-2xl p-8">
          {activeTab === 'resume' ? (
            // Resume Upload Section
            <div>
              <h2 className="text-2xl font-bold text-[#2A2238] mb-6 text-center">
                Start with Your Resume
              </h2>
              
              {!uploadedFile ? (
                <div className="border-2 border-dashed border-[#3E3253]/50 rounded-lg p-12 text-center hover:border-[#3E3253] transition-colors">
                  <Upload className="w-12 h-12 text-[#3E3253] mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-[#2A2238] mb-2">
                    Click to browse or drop your resume here
                  </h3>
                  <p className="text-[#3E3253] mb-4">
                    PDF files up to 10MB are supported
                  </p>
                  <input
                    type="file"
                    accept=".pdf"
                    onChange={handleFileUpload}
                    className="hidden"
                    id="resume-upload"
                  />
                  <label
                    htmlFor="resume-upload"
                    className="inline-flex items-center bg-[#2A2238] text-white px-6 py-3 rounded-lg font-semibold cursor-pointer hover:bg-[#3E3253] transition-colors shadow-lg"
                  >
                    Upload Resume
                  </label>
                </div>
              ) : (
                <div className="bg-white/60 rounded-lg p-6 border border-transparent">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center">
                      <FileText className="w-8 h-8 text-[#2A2238] mr-3" />
                      <div>
                        <h3 className="font-semibold text-[#2A2238]">{uploadedFile.name}</h3>
                        <p className="text-sm text-[#3E3253]">
                          {(uploadedFile.size / 1024 / 1024).toFixed(2)} MB
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => setUploadedFile(null)}
                      className="text-[#3E3253] hover:text-[#2A2238] text-sm font-medium"
                    >
                      Remove
                    </button>
                  </div>
                  
                  <button
                    onClick={handleAnalyzeResume}
                    disabled={isAnalyzing}
                    className="w-full bg-[#2A2238] text-white py-3 rounded-lg font-semibold hover:bg-[#3E3253] transition-colors disabled:opacity-50 flex items-center justify-center shadow-lg"
                  >
                    {isAnalyzing ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Analyzing...
                      </>
                    ) : (
                      <>
                        Start AI Analysis
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </>
                    )}
                  </button>
                </div>
              )}
            </div>
          ) : (
            // Manual Setup Section (remains the same)
            <div>
              <h2 className="text-2xl font-bold text-[#2A2238] mb-6 text-center">
                Tell Us About Yourself
              </h2>
              
              <div className="space-y-6">
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-[#3E3253] mb-2">
                        Full Name *
                      </label>
                      <input
                        type="text"
                        value={formData.name}
                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                        className="w-full px-4 py-3 border border-[#3E3253]/30 rounded-lg focus:ring-2 focus:ring-[#3E3253] focus:border-transparent outline-none bg-white/50 text-[#2A2238]"
                        placeholder="Your full name"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-[#3E3253] mb-2">
                        Target Role *
                      </label>
                      <input
                        type="text"
                        value={formData.role}
                        onChange={(e) => setFormData({...formData, role: e.target.value})}
                        className="w-full px-4 py-3 border border-[#3E3253]/30 rounded-lg focus:ring-2 focus:ring-[#3E3253] focus:border-transparent outline-none bg-white/50 text-[#2A2238]"
                        placeholder="e.g., Software Engineer"
                      />
                    </div>
                 </div>

                <div>
                  <label className="block text-sm font-medium text-[#3E3253] mb-2">
                    Experience Level *
                  </label>
                  <select
                    value={formData.experience}
                    onChange={(e) => setFormData({...formData, experience: e.target.value})}
                    className="w-full px-4 py-3 border border-[#3E3253]/30 rounded-lg focus:ring-2 focus:ring-[#3E3253] focus:border-transparent outline-none appearance-none bg-white/50 text-[#2A2238]"
                  >
                    <option value="">Select experience level</option>
                    <option value="entry">Entry Level (0-2 years)</option>
                    <option value="mid">Mid Level (2-5 years)</option>
                    <option value="senior">Senior Level (5-10 years)</option>
                    <option value="lead">Lead/Principal (10+ years)</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-[#3E3253] mb-2">
                    Key Skills (comma separated)
                  </label>
                  <textarea
                    value={formData.skills}
                    onChange={(e) => setFormData({...formData, skills: e.target.value})}
                    className="w-full px-4 py-3 border border-[#3E3253]/30 rounded-lg focus:ring-2 focus:ring-[#3E3253] focus:border-transparent outline-none bg-white/50 text-[#2A2238]"
                    rows={3}
                    placeholder="e.g., JavaScript, React, Node.js, Python..."
                  />
                </div>
                
                <button
                  onClick={handleManualSubmit}
                  className="w-full bg-[#2A2238] text-white py-3 rounded-lg font-semibold hover:bg-[#3E3253] transition-colors flex items-center justify-center shadow-lg"
                >
                  Continue
                  <ArrowRight className="w-4 h-4 ml-2" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}