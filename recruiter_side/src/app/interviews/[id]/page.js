'use client';

import { ArrowLeft, Play, Pause, MessageSquare, Brain, ThumbsUp, ThumbsDown, Edit2, Save } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';

export default function InterviewReviewPage() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [score, setScore] = useState(92);
  const [isEditingScore, setIsEditingScore] = useState(false);

  return (
    <div className="space-y-6 h-[calc(100vh-140px)] flex flex-col">
      {/* Header */}
      <div className="flex flex-col gap-4">
        <Link href="/interviews" className="flex items-center gap-2 text-gray-500 hover:text-gray-900 transition-colors w-fit">
          <ArrowLeft size={20} />
          Back to Interviews
        </Link>
        <div className="flex justify-between items-end">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Interview Review: Rahul Sharma</h1>
            <p className="text-gray-500 mt-1">Product Analyst Intern • 45 mins • AI Interviewer</p>
          </div>
          <div className="text-right flex items-end gap-3">
            <div className="flex flex-col items-end">
              {isEditingScore ? (
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={score}
                    onChange={(e) => {
                      const val = Number(e.target.value);
                      if (val >= 0 && val <= 100) setScore(val);
                    }}
                    className="text-4xl font-bold text-green-600 w-24 text-right border-b-2 border-green-600 focus:outline-none bg-transparent"
                    autoFocus
                  />
                </div>
              ) : (
                <span className="block text-4xl font-bold text-green-600 leading-none">{score}</span>
              )}
              <span className="text-xs text-gray-500 uppercase tracking-wider">Overall Score</span>
            </div>
            <button
              onClick={() => setIsEditingScore(!isEditingScore)}
              className="mb-2 p-2 text-gray-400 hover:text-primary hover:bg-orange-50 rounded-full transition-colors"
              title={isEditingScore ? "Save Score" : "Edit Score"}
            >
              {isEditingScore ? <Save size={20} /> : <Edit2 size={20} />}
            </button>
          </div>
        </div>
      </div>

      {/* Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 flex-1 min-h-0">
        {/* Video Column */}
        <div className="lg:col-span-3 flex flex-col gap-6 min-h-0">
          <div className="bg-black rounded-lg overflow-hidden aspect-video relative flex flex-col group">
            <div className="flex-1 flex items-center justify-center relative bg-gradient-to-br from-slate-800 to-slate-900">
              <button
                className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center text-white backdrop-blur-sm hover:bg-white/30 hover:scale-110 transition-all"
                onClick={() => setIsPlaying(!isPlaying)}
              >
                {isPlaying ? <Pause size={32} /> : <Play size={32} />}
              </button>
              <span className="absolute bottom-4 right-4 text-white font-mono bg-black/50 px-2 py-1 rounded text-sm">12:45 / 45:00</span>
            </div>
            <div className="h-10 bg-slate-800 flex items-center px-4 gap-4">
              <button className="text-xs text-white border border-white/20 px-2 py-1 rounded hover:bg-white/10">1x</button>
              <div className="flex-1 h-1 bg-white/20 rounded-full relative cursor-pointer group/timeline">
                <div className="absolute top-0 left-0 h-full bg-primary rounded-full" style={{ width: '28%' }}></div>
                <div className="absolute top-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full shadow-sm opacity-0 group-hover/timeline:opacity-100 transition-opacity" style={{ left: '28%' }}></div>
              </div>
            </div>
          </div>
        </div>

        {/* Transcript Column */}
        <div className="lg:col-span-2 flex flex-col min-h-0">
          <div className="bg-white border border-gray-200 rounded-lg flex flex-col h-full shadow-sm">
            <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center bg-gray-50 rounded-t-lg">
              <h3 className="flex items-center gap-2 font-semibold text-gray-900">
                <MessageSquare size={20} className="text-primary" /> Transcript
              </h3>
              <button className="text-sm text-primary hover:text-orange-700 font-medium">Download</button>
            </div>
            <div className="p-6 overflow-y-auto flex-1 space-y-6 transcript-container">
              <div className="space-y-1">
                <div className="flex justify-between text-xs font-semibold text-gray-500 mb-1">
                  <span className="text-primary">AI Interviewer</span>
                  <span className="font-normal opacity-70">12:30</span>
                </div>
                <p className="text-sm text-gray-800 leading-relaxed bg-blue-50 p-3 rounded-lg rounded-tl-none">
                  Can you describe a time when you had to prioritize features for a product?
                </p>
              </div>

              <div className="space-y-1">
                <div className="flex justify-between text-xs font-semibold text-gray-500 mb-1">
                  <span>Rahul Sharma</span>
                  <span className="font-normal opacity-70">12:45</span>
                </div>
                <div className="space-y-2">
                  <p className="text-sm text-gray-800 leading-relaxed">
                    Yes, absolutely. In my previous internship, we were building a task management app. We had a long backlog of features requested by users.
                  </p>
                  <div className="inline-flex items-center gap-2 bg-green-50 text-green-700 px-2 py-1 rounded text-xs font-medium border border-green-100">
                    <ThumbsUp size={12} /> Good context setting
                  </div>
                </div>
              </div>

              <div className="space-y-1">
                <div className="space-y-2">
                  <p className="text-sm text-gray-800 leading-relaxed">
                    I used the RICE framework (Reach, Impact, Confidence, Effort) to score each feature. This helped us objectively rank them.
                  </p>
                  <div className="inline-flex items-center gap-2 bg-green-50 text-green-700 px-2 py-1 rounded text-xs font-medium border border-green-100">
                    <ThumbsUp size={12} /> Mentioned specific framework (RICE)
                  </div>
                </div>
              </div>

              <div className="space-y-1">
                <p className="text-sm text-gray-800 leading-relaxed">
                  For example, "Dark Mode" had high user request volume (Reach) but low effort, so it scored high.
                </p>
              </div>

              <div className="space-y-1">
                <div className="flex justify-between text-xs font-semibold text-gray-500 mb-1">
                  <span className="text-primary">AI Interviewer</span>
                  <span className="font-normal opacity-70">13:50</span>
                </div>
                <p className="text-sm text-gray-800 leading-relaxed bg-blue-50 p-3 rounded-lg rounded-tl-none">
                  That's a great approach. How did you handle stakeholders who disagreed with the prioritization?
                </p>
              </div>
              {/* Added extra content to force scroll for demonstration if needed */}
              <div className="space-y-1">
                <div className="flex justify-between text-xs font-semibold text-gray-500 mb-1">
                  <span>Rahul Sharma</span>
                  <span className="font-normal opacity-70">14:10</span>
                </div>
                <p className="text-sm text-gray-800 leading-relaxed">
                  I focused on data. I showed them the RICE scores and explained that while their feature was important, other features had a higher impact-to-effort ratio.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* AI Analysis - Full Width Bottom */}
      <div className="bg-white border border-gray-200 rounded-lg shadow-sm">
        <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
          <h3 className="flex items-center gap-2 font-semibold text-gray-900">
            <Brain size={20} className="text-primary" /> AI Analysis
          </h3>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-6">
              <h4 className="text-sm font-semibold text-gray-900 mb-3">Performance Metrics</h4>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-600">Communication</span>
                    <span className="font-bold text-green-600">95%</span>
                  </div>
                  <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                    <div className="h-full bg-green-500 rounded-full" style={{ width: '95%' }}></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-600">Technical Knowledge</span>
                    <span className="font-bold text-yellow-600">85%</span>
                  </div>
                  <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                    <div className="h-full bg-yellow-500 rounded-full" style={{ width: '85%' }}></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-600">Problem Solving</span>
                    <span className="font-bold text-green-600">90%</span>
                  </div>
                  <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                    <div className="h-full bg-green-500 rounded-full" style={{ width: '90%' }}></div>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h4 className="text-sm font-semibold text-gray-900 mb-3">Key Moments</h4>
              <div className="space-y-2">
                <div className="flex items-center gap-3 p-2 bg-gray-50 rounded-lg hover:bg-gray-100 cursor-pointer transition-colors group">
                  <span className="font-mono text-primary font-semibold text-sm group-hover:underline">05:20</span>
                  <span className="text-sm text-gray-700">Explained Product Lifecycle</span>
                </div>
                <div className="flex items-center gap-3 p-2 bg-gray-50 rounded-lg hover:bg-gray-100 cursor-pointer transition-colors group">
                  <span className="font-mono text-primary font-semibold text-sm group-hover:underline">15:45</span>
                  <span className="text-sm text-gray-700">SQL Query Optimization</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <style jsx global>{`
        .transcript-container::-webkit-scrollbar {
          width: 16px;
        }
        .transcript-container::-webkit-scrollbar-track {
          background: #f1f1f1;
          border-radius: 8px;
        }
        .transcript-container::-webkit-scrollbar-thumb {
          background: #cbd5e1;
          border-radius: 8px;
          border: 4px solid #f1f1f1;
        }
        .transcript-container::-webkit-scrollbar-thumb:hover {
          background: #94a3b8;
        }
      `}</style>
    </div>
  );
}
