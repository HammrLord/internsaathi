'use client';

import { CheckCircle, AlertCircle, Info } from 'lucide-react';

export default function MatchScoreBreakdown({ breakdown, onRecompute }) {
    if (!breakdown) return null;

    return (
        <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
            <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-bold text-gray-900">Match Score Breakdown</h3>
                <button
                    onClick={onRecompute}
                    className="text-sm text-primary hover:text-orange-700 font-medium"
                >
                    Re-run Matching
                </button>
            </div>

            <div className="space-y-6">
                {/* Overall Score */}
                <div className="flex items-center gap-4 mb-8">
                    <div className="relative w-24 h-24 flex items-center justify-center">
                        <svg className="w-full h-full transform -rotate-90">
                            <circle
                                cx="48"
                                cy="48"
                                r="40"
                                stroke="currentColor"
                                strokeWidth="8"
                                fill="transparent"
                                className="text-gray-100"
                            />
                            <circle
                                cx="48"
                                cy="48"
                                r="40"
                                stroke="currentColor"
                                strokeWidth="8"
                                fill="transparent"
                                strokeDasharray={251.2}
                                strokeDashoffset={251.2 - (251.2 * breakdown.overall) / 100}
                                className="text-primary transition-all duration-1000 ease-out"
                            />
                        </svg>
                        <span className="absolute text-2xl font-bold text-gray-900">{breakdown.overall}%</span>
                    </div>
                    <div>
                        <div className="text-sm font-medium text-gray-500 uppercase tracking-wide">Overall Match</div>
                        <div className="text-lg font-semibold text-gray-900">Excellent Fit</div>
                        <p className="text-sm text-gray-500 mt-1">Based on weighted criteria analysis.</p>
                    </div>
                </div>

                {/* Categories */}
                <div className="space-y-4">
                    {breakdown.categories.map((cat, idx) => (
                        <div key={idx} className="border-b border-gray-100 last:border-0 pb-4 last:pb-0">
                            <div className="flex items-center justify-between mb-2">
                                <span className="font-medium text-gray-700">{cat.name}</span>
                                <span className="font-bold text-gray-900">{cat.score}%</span>
                            </div>
                            <div className="w-full bg-gray-100 rounded-full h-2 mb-3">
                                <div
                                    className="bg-primary h-2 rounded-full transition-all duration-500"
                                    style={{ width: `${cat.score}%` }}
                                />
                            </div>

                            {/* Evidence/Details */}
                            <div className="bg-gray-50 rounded p-3 text-sm">
                                <ul className="space-y-1">
                                    {cat.evidence.map((item, i) => (
                                        <li key={i} className="flex items-start gap-2 text-gray-600">
                                            <CheckCircle size={14} className="mt-0.5 text-green-600 flex-shrink-0" />
                                            <span>{item}</span>
                                        </li>
                                    ))}
                                    {cat.missing?.map((item, i) => (
                                        <li key={i} className="flex items-start gap-2 text-gray-500">
                                            <AlertCircle size={14} className="mt-0.5 text-gray-400 flex-shrink-0" />
                                            <span className="italic">Missing: {item}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
