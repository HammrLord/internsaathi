'use client';

import { useState, useEffect } from 'react';
import { Briefcase, MapPin, Zap, TrendingUp, Bell, Search, User } from 'lucide-react';
import Link from 'next/link';

export default function StudentDashboard() {
    const [jobs, setJobs] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        async function fetchJobs() {
            try {
                const res = await fetch('/api/student/recommendations');
                const data = await res.json();
                setJobs(data.recommendations || []);
            } catch (error) {
                console.error("Failed to load jobs", error);
            } finally {
                setIsLoading(false);
            }
        }
        fetchJobs();
    }, []);

    return (
        <div className="min-h-screen bg-gray-50 font-sans">
            {/* Student Header */}
            <header className="bg-white border-b border-gray-200 sticky top-0 z-30">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-12 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <span className="font-bold text-xl text-blue-700 tracking-tight">Student<span className="text-gray-900">Portal</span></span>
                    </div>
                    <div className="flex items-center gap-4">
                        <button className="p-2 text-gray-500 hover:text-blue-600 transition-colors relative">
                            <Bell size={20} />
                            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border border-white"></span>
                        </button>
                        <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold text-sm">
                            S
                        </div>
                    </div>
                </div>
            </header>

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

                {/* Welcome Block */}
                <div className="mb-8">
                    <h1 className="text-2xl font-bold text-gray-900">Welcome back, Soldier! 👋</h1>
                    <p className="text-gray-600">Here are the top opportunities matched to your skills.</p>
                </div>

                {/* Stats Row */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                    <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-6 text-white shadow-lg">
                        <div className="flex justify-between items-start mb-4">
                            <div className="p-2 bg-white/20 rounded-lg"><Briefcase size={20} /></div>
                            <span className="text-xs font-medium bg-white/20 px-2 py-1 rounded">Live</span>
                        </div>
                        <div className="text-3xl font-bold mb-1">12</div>
                        <div className="text-blue-100 text-sm">Matched Jobs</div>
                    </div>
                    <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
                        <div className="flex justify-between items-start mb-4">
                            <div className="p-2 bg-green-50 text-green-600 rounded-lg"><TrendingUp size={20} /></div>
                        </div>
                        <div className="text-3xl font-bold mb-1 text-gray-900">85%</div>
                        <div className="text-gray-500 text-sm">Profile Completeness</div>
                    </div>
                    <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
                        <div className="flex justify-between items-start mb-4">
                            <div className="p-2 bg-purple-50 text-purple-600 rounded-lg"><Zap size={20} /></div>
                        </div>
                        <div className="text-3xl font-bold mb-1 text-gray-900">2</div>
                        <div className="text-gray-500 text-sm">Interviews Scheduled</div>
                    </div>
                </div>

                {/* Recommendations Section */}
                <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <Zap size={18} className="text-yellow-500 fill-current" />
                    Top Recommendations For You
                </h2>

                {isLoading ? (
                    <div className="flex justify-center py-12">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                    </div>
                ) : jobs.length === 0 ? (
                    <div className="text-center py-12 bg-white rounded-xl border border-gray-200">
                        <p className="text-gray-500">No matching jobs found yet.</p>
                    </div>
                ) : (
                    <div className="grid gap-4">
                        {jobs.map((job) => (
                            <div key={job.id} className="group bg-white rounded-xl border border-gray-200 p-5 hover:shadow-md transition-shadow flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                                <div className="flex items-start gap-4">
                                    <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center text-gray-600 font-bold text-xl shrink-0">
                                        {job.title.charAt(0)}
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-gray-900 group-hover:text-blue-600 transition-colors">{job.title}</h3>
                                        <div className="flex items-center gap-3 text-sm text-gray-500 mt-1">
                                            <span className="flex items-center gap-1"><MapPin size={14} /> {job.location}</span>
                                            <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
                                            <span>{job.type}</span>
                                        </div>
                                        <div className="mt-3 flex flex-wrap gap-2">
                                            {job.skills_required && job.skills_required.map((skill, i) => (
                                                <span key={i} className="px-2 py-0.5 bg-gray-50 text-gray-600 text-xs rounded border border-gray-100">{skill}</span>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                <div className="flex flex-col items-end gap-2 w-full sm:w-auto">
                                    {job.match_score > 0 && (
                                        <div className="flex items-center gap-1.5 px-3 py-1 bg-green-50 text-green-700 text-sm font-bold rounded-full border border-green-100">
                                            <Zap size={14} className="fill-current" />
                                            {job.match_score}% Match
                                        </div>
                                    )}
                                    <button className="w-full sm:w-auto px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors">
                                        Apply Now
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </main>
        </div>
    );
}
