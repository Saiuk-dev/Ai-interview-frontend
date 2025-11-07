import Link from "next/link";
import {
  ArrowRight,
  Video,
  Mic,
  BarChart3,
  Users,
  CheckCircle,
  Star,
} from "lucide-react";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#190019] via-[#2B124C] to-[#522B5B] text-[#FBE4D8]">
      {/* Navigation */}
      <nav className="bg-[#2B124C]/80 backdrop-blur-sm shadow-md border-b border-[#522B5B]/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold bg-gradient-to-r from-[#DFB6B2] to-[#FBE4D8] bg-clip-text text-transparent">
                MockMate
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              <Link
                href="/login"
                className="text-[#FBE4D8] hover:text-[#DFB6B2] px-3 py-2 text-sm font-medium transition-colors"
              >
                Sign In
              </Link>
              <Link
                href="/signup"
                className="bg-gradient-to-r from-[#522B5B] to-[#854F6C] text-[#FBE4D8] px-4 py-2 rounded-lg text-sm font-medium hover:opacity-90 transition-opacity"
              >
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-20 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl font-bold mb-6 drop-shadow-lg">
            Get Your Dream Job with
            <span className="text-[#DFB6B2] font-extrabold">
              {" "}
              Resume-Smart AI Practice
            </span>
          </h1>
          <p className="text-xl text-[#FBE4D8]/90 mb-8 max-w-3xl mx-auto drop-shadow-md">
            Upload your resume and get personalized interview questions tailored
            to YOUR experience. Plus practice with FAANG company-specific rounds
            and get detailed feedback on everything.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/dashboard"
              className="inline-flex items-center bg-[#DFB6B2] text-[#190019] px-8 py-3 rounded-lg text-lg font-medium hover:bg-[#FBE4D8] transition-colors shadow-lg"
            >
              Upload Resume & Start
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
            <button className="inline-flex items-center bg-white/10 backdrop-blur-sm text-[#FBE4D8] border border-white/20 px-8 py-3 rounded-lg text-lg font-medium hover:bg-white/20 transition-colors">
              <Video className="mr-2 h-5 w-5" />
              Watch Demo
            </button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-[#2B124C]/70 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-[#FBE4D8] mb-4">
              Why Choose MockMate?
            </h2>
            <p className="text-lg text-[#DFB6B2]">
              Everything you need to ace your next interview
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Feature 1 */}
            <div className="text-center group hover:scale-105 transition-all duration-300">
              <div className="bg-gradient-to-br from-[#522B5B] to-[#854F6C] rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center shadow-lg">
                <Video className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-[#FBE4D8] mb-2">
                Resume Analysis
              </h3>
              <p className="text-[#DFB6B2]">
                AI reads your resume and creates personalized questions based on
                YOUR experience
              </p>
            </div>

            {/* Feature 2 */}
            <div className="text-center group hover:scale-105 transition-all duration-300">
              <div className="bg-gradient-to-br from-[#854F6C] to-[#DFB6B2] rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center shadow-lg">
                <Mic className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-[#FBE4D8] mb-2">
                Speech & Body Language
              </h3>
              <p className="text-[#DFB6B2]">
                Detailed feedback on pronunciation, pace, filler words, eye
                contact, and posture
              </p>
            </div>

            {/* Feature 3 */}
            <div className="text-center group hover:scale-105 transition-all duration-300">
              <div className="bg-gradient-to-br from-[#2B124C] to-[#522B5B] rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center shadow-lg">
                <Users className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-[#FBE4D8] mb-2">
                FAANG Companies
              </h3>
              <p className="text-[#DFB6B2]">
                Practice with real interview rounds from Google, Meta, Amazon,
                Apple, Netflix
              </p>
            </div>

            {/* Feature 4 */}
            <div className="text-center group hover:scale-105 transition-all duration-300">
              <div className="bg-gradient-to-br from-[#DFB6B2] to-[#FBE4D8] rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center shadow-lg">
                <BarChart3 className="h-8 w-8 text-[#190019]" />
              </div>
              <h3 className="text-lg font-semibold text-[#FBE4D8] mb-2">
                Smart Analytics
              </h3>
              <p className="text-[#DFB6B2]">
                Track improvement, compare to industry standards, get
                personalized tips
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-16 bg-gradient-to-r from-[#522B5B]/90 to-[#854F6C]/90">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-[#FBE4D8] mb-6">
                Your Personal Interview Coach
              </h2>
              <div className="space-y-4">
                <div className="flex items-start">
                  <CheckCircle className="h-6 w-6 text-[#DFB6B2] mt-0.5 mr-3 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold text-[#FBE4D8]">
                      Resume-Based Questions
                    </h3>
                    <p className="text-[#DFB6B2]">
                      Get questions tailored to your actual experience and
                      skills
                    </p>
                  </div>
                </div>
                <div className="flex items-start">
                  <CheckCircle className="h-6 w-6 text-[#DFB6B2] mt-0.5 mr-3 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold text-[#FBE4D8]">
                      Complete English Analysis
                    </h3>
                    <p className="text-[#DFB6B2]">
                      Grammar, vocabulary, fluency, and pronunciation scored
                      separately
                    </p>
                  </div>
                </div>
                <div className="flex items-start">
                  <CheckCircle className="h-6 w-6 text-[#DFB6B2] mt-0.5 mr-3 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold text-[#FBE4D8]">
                      Multi-Round Practice
                    </h3>
                    <p className="text-[#DFB6B2]">
                      Technical, HR, behavioral rounds just like real company
                      interviews
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-gradient-to-br from-[#DFB6B2] to-[#FBE4D8] rounded-lg p-8 text-[#190019] shadow-2xl">
              <div className="text-center">
                <Star className="h-16 w-16 mx-auto mb-4" />
                <h3 className="text-2xl font-bold mb-2">
                  Ready to Get Started?
                </h3>
                <p className="mb-6">
                  Upload your resume and start practicing with personalized
                  questions in under 2 minutes
                </p>
                <Link
                  href="/dashboard"
                  className="inline-flex items-center bg-[#190019] text-[#FBE4D8] px-6 py-3 rounded-lg font-medium hover:bg-[#522B5B] transition-colors shadow-lg"
                >
                  Upload Resume Now
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#2B124C] text-[#FBE4D8] py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h3 className="text-2xl font-bold mb-4 bg-gradient-to-r from-[#DFB6B2] to-[#FBE4D8] bg-clip-text text-transparent">
            MockMate
          </h3>
          <p className="text-[#DFB6B2] mb-4">
            Your AI-powered interview preparation companion
          </p>
          <p className="text-sm text-[#FBE4D8]/70">
            © 2025 InterviewAI. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
