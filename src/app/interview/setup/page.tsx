'use client';

import React, { useState, useEffect, useRef } from 'react';
import {
  User,
  Briefcase,
  Cpu,
  Video,
  Mic,
  Settings,
  ArrowRight,
  Loader2,
  AlertTriangle,
  CheckCircle,
  Zap,
} from 'lucide-react';

const SkillTag = ({ skill }: { skill: string }) => (
  <div className="bg-gradient-to-r from-[#932B5B]/20 to-[#854F6C]/20 border border-[#932B5B]/30 text-[#190019] text-xs font-medium px-3 py-1 rounded-full">
    {skill}
  </div>
);

const useSearchParams = () => {
  const [params, setParams] = useState<URLSearchParams>(new URLSearchParams());
  useEffect(() => {
    if (typeof window !== 'undefined') {
      setParams(new URLSearchParams(window.location.search));
    }
  }, []);
  return params;
};

const Link = ({ href, children, className }: { href: string; children: React.ReactNode; className?: string }) => (
  <a href={href} className={className}>
    {children}
  </a>
);

export default function InterviewSetupPage() {
  const searchParams = useSearchParams();
  const videoRef = useRef<HTMLVideoElement>(null);

  const [isLoading, setIsLoading] = useState(true);
  const [userData, setUserData] = useState({ role: '', skills: [] as string[] });
  const [selectedDifficulty, setSelectedDifficulty] = useState<'Easy' | 'Medium' | 'Hard' | null>(null);
  const [permissions, setPermissions] = useState<{ video: boolean; audio: boolean }>({ video: false, audio: false });
  const [permissionError, setPermissionError] = useState<string | null>(null);

  useEffect(() => {
    const roleFromURL = searchParams.get('role') || '';
    const skillsFromURL = searchParams.get('skills')?.split(',') || [];
    
    if(roleFromURL) {
      setUserData({
        role: roleFromURL,
        skills: skillsFromURL.map(skill => skill.trim()),
      });
    }
    setIsLoading(false);
  }, [searchParams]);

  const handleStartInterview = () => {
    if (userData.role && selectedDifficulty && permissions.video && permissions.audio) {
      sessionStorage.setItem('userData', JSON.stringify(userData));
      sessionStorage.setItem('difficulty', selectedDifficulty);
      window.location.href = `/interview/live`;
    } else {
      alert("Please select a difficulty and enable permissions before starting.");
    }
  };

  const requestPermissions = async () => {
    setPermissionError(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      setPermissions({ video: true, audio: true });
    } catch (err: unknown) {
      console.error("Error accessing media devices.", err);
      let errorMessage = "An unknown error occurred while accessing media devices.";
      if (err instanceof DOMException) {
        if (err.name === "NotAllowedError" || err.name === "PermissionDeniedError") {
          errorMessage = "Camera and microphone access was denied. Please enable it in your browser settings.";
        } else {
          errorMessage = "Could not access camera or microphone. Please ensure they are not in use by another application.";
        }
      }
      setPermissionError(errorMessage);
      setPermissions({ video: false, audio: false });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FBE4D8] via-[#DF86B2] to-[#932B5B] to-[#190019]">
      <nav className="bg-white/90 backdrop-blur-sm shadow-sm border-b border-white/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="flex items-center">
              <h1 className="text-2xl font-bold bg-gradient-to-r from-[#190019] to-[#932B5B] bg-clip-text text-transparent">
                Mockmate 
              </h1>
            </Link>
          </div>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-4 drop-shadow-lg">
            Setup Your Interview Session
          </h1>
          <p className="text-xl text-white/90 max-w-2xl mx-auto">
            Review your profile, select a difficulty, and test your devices.
          </p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          <div className="lg:col-span-3 space-y-8">
            <div className="bg-gradient-to-br from-white/95 to-[#FBE4D8]/95 backdrop-blur-sm rounded-lg shadow-2xl p-6 border border-white/30">
              <h2 className="text-2xl font-bold mb-4 flex items-center text-[#190019]">
                <User className="mr-3 text-[#932B5B]" /> Your Profile
              </h2>
              {isLoading ? (
                <div className="flex items-center justify-center h-24"><Loader2 className="animate-spin h-8 w-8 text-[#932B5B]" /></div>
              ) : (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-sm font-semibold text-[#932B5B] flex items-center mb-2"><Briefcase className="w-4 h-4 mr-2" /> Target Role</h3>
                    <p className="text-lg text-[#190019] font-medium">{userData.role}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-[#932B5B] flex items-center mb-3"><Cpu className="w-4 h-4 mr-2" /> Key Skills</h3>
                    <div className="flex flex-wrap gap-2">{userData.skills.map((skill) => <SkillTag key={skill} skill={skill} />)}</div>
                  </div>
                </div>
              )}
            </div>

            <div className="bg-gradient-to-br from-white/95 to-[#FBE4D8]/95 backdrop-blur-sm rounded-lg shadow-2xl p-6 border border-white/30">
              <h2 className="text-2xl font-bold mb-4 flex items-center text-[#190019]"><Zap className="mr-3 text-[#932B5B]" /> Select Difficulty</h2>
              <p className="text-sm text-[#932B5B] mb-4">The AI will adjust the complexity of questions based on your selection.</p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {(['Easy', 'Medium', 'Hard'] as const).map((level) => (
                  <button key={level} onClick={() => setSelectedDifficulty(level)} className={`p-4 rounded-lg border-2 text-center font-bold transition-all duration-200 ${selectedDifficulty === level ? 'bg-[#190019] text-white border-transparent shadow-lg scale-105' : 'bg-white/50 text-[#190019] border-transparent hover:border-[#190019]/50'}`}>
                    {level}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="lg:col-span-2">
            <div className="bg-gradient-to-br from-white/95 to-[#FBE4D8]/95 backdrop-blur-sm rounded-lg shadow-2xl p-6 border border-white/30">
              <h2 className="text-2xl font-bold mb-4 flex items-center text-[#190019]"><Settings className="mr-3 text-[#932B5B]" /> Device Setup</h2>
              <div className="aspect-video bg-gradient-to-br from-[#190019] to-[#2B124C] rounded-lg mb-4 flex items-center justify-center overflow-hidden border border-[#932B5B]/30">
                <video ref={videoRef} autoPlay playsInline muted className="w-full h-full object-cover rounded-lg"></video>
                {!permissions.video && (<div className="text-center text-white/70"><Video className="h-12 w-12 mx-auto mb-2" /><p className="text-sm">Your camera feed will appear here</p></div>)}
              </div>
              <div className="space-y-4">
                <div className={`flex items-center p-3 rounded-lg text-sm border ${permissions.video ? 'bg-green-50 text-green-700 border-green-200' : 'bg-yellow-50 text-yellow-700 border-yellow-200'}`}>
                  {permissions.video ? <CheckCircle className="w-5 h-5 mr-3" /> : <AlertTriangle className="w-5 h-5 mr-3" />}
                  <span>Camera Access: {permissions.video ? 'Enabled' : 'Disabled'}</span>
                </div>
                <div className={`flex items-center p-3 rounded-lg text-sm border ${permissions.audio ? 'bg-green-50 text-green-700 border-green-200' : 'bg-yellow-50 text-yellow-700 border-yellow-200'}`}>
                  {permissions.audio ? <CheckCircle className="w-5 h-5 mr-3" /> : <AlertTriangle className="w-5 h-5 mr-3" />}
                  <span>Microphone Access: {permissions.audio ? 'Enabled' : 'Disabled'}</span>
                </div>
                {permissionError && (<div className="bg-red-50 border border-red-200 text-red-700 p-3 rounded-lg"><p className="text-xs">{permissionError}</p></div>)}
                {(!permissions.video || !permissions.audio) && (<button onClick={requestPermissions} className="w-full flex items-center justify-center bg-gradient-to-r from-[#190019] via-[#2B124C] to-[#932B5B] text-white px-6 py-3 rounded-lg font-medium hover:opacity-90 transition-opacity shadow-lg"><Settings className="mr-2 h-5 w-5" />Enable Camera & Mic</button>)}
              </div>
            </div>
          </div>
        </div>

        <div className="mt-12 text-center">
          <button
            disabled={!selectedDifficulty || isLoading || !permissions.video || !permissions.audio}
            onClick={handleStartInterview}
            className="inline-flex items-center bg-gradient-to-r from-[#190019] via-[#2B124C] to-[#932B5B] text-white px-12 py-4 rounded-lg text-lg font-bold hover:opacity-90 transition-opacity shadow-2xl disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Start Your Interview<ArrowRight className="ml-3 h-6 w-6" />
          </button>
          {!selectedDifficulty && (<p className="text-sm text-white/80 mt-3">Please select a difficulty level to begin.</p>)}
        </div>
      </div>
    </div>
  );
}