'use client';

import { X, ExternalLink, BookOpen, Users, CheckCircle, Clock, MapPin, Briefcase, IndianRupee } from 'lucide-react';
import { useState } from 'react';
import { createPortal } from 'react-dom';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function JobDetailsPanel({ job, isOpen, onClose, onEdit }) {
    const [activeTab, setActiveTab] = useState('details'); // details, analytics

    if (!isOpen || !job) return null;

    // Use portal to render outside the current DOM hierarchy (at body level)
    // This ensures fixed positioning works relative to the viewport
    if (typeof document === 'undefined') return null;

    return createPortal(
        <div className="fixed inset-0 z-50 overflow-hidden">
            <div className="absolute inset-0 bg-black bg-opacity-50 transition-opacity backdrop-blur-sm" onClick={onClose} />

            <div className="absolute inset-y-0 right-0 max-w-2xl w-full bg-white shadow-2xl transform transition-transform duration-300 ease-in-out flex flex-col">
                {/* Header */}
                <div className="px-8 py-6 border-b border-gray-100 flex items-start justify-between bg-white">
                    <div>
                        <h2 className="text-2xl font-bold text-gray-900 leading-tight">{job.title}</h2>
                        <div className="flex items-center gap-3 mt-2 text-sm text-gray-500">
                            <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium border ${job.status === 'Active' ? 'bg-green-50 text-green-700 border-green-200' : 'bg-gray-100 text-gray-700 border-gray-200'
                                }`}>
                                {job.status}
                            </span>
                            <span>•</span>
                            <span>Posted {job.postedDate}</span>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => onEdit(job)}
                            className="px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 hover:border-gray-300 transition-all"
                        >
                            Edit Job
                        </button>
                        <button onClick={onClose} className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition-colors">
                            <X size={24} />
                        </button>
                    </div>
                </div>

                {/* Tabs */}
                <div className="px-8 border-b border-gray-100 flex gap-8">
                    <button
                        className={`py-4 text-sm font-medium border-b-2 transition-colors ${activeTab === 'details' ? 'border-primary text-primary' : 'border-transparent text-gray-500 hover:text-gray-700'
                            }`}
                        onClick={() => setActiveTab('details')}
                    >
                        Job Details
                    </button>
                    <button
                        className={`py-4 text-sm font-medium border-b-2 transition-colors ${activeTab === 'analytics' ? 'border-primary text-primary' : 'border-transparent text-gray-500 hover:text-gray-700'
                            }`}
                        onClick={() => setActiveTab('analytics')}
                    >
                        Analytics
                    </button>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-8">
                    {activeTab === 'details' ? (
                        <div className="space-y-8">
                            {/* Key Info Grid - Prominent Display */}
                            <div className="grid grid-cols-2 gap-4">

                                <div className="p-4 bg-blue-50 rounded-xl border border-blue-100 flex flex-col items-center text-center group hover:shadow-sm transition-shadow">
                                    <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-blue-600 mb-3 shadow-sm group-hover:scale-110 transition-transform">
                                        <Clock size={20} />
                                    </div>
                                    <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Duration</span>
                                    <div className="font-bold text-gray-900">{job.duration}</div>
                                </div>
                                <div className="p-4 bg-purple-50 rounded-xl border border-purple-100 flex flex-col items-center text-center group hover:shadow-sm transition-shadow">
                                    <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-purple-600 mb-3 shadow-sm group-hover:scale-110 transition-transform">
                                        <MapPin size={20} />
                                    </div>
                                    <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Location</span>
                                    <div className="font-bold text-gray-900">{job.location}</div>
                                </div>
                            </div>

                            {/* Description */}
                            <div>
                                <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wide mb-4 flex items-center gap-2">
                                    About the Role
                                </h3>
                                <p className="text-gray-600 leading-relaxed whitespace-pre-line text-base">{job.description}</p>
                            </div>

                            {/* Responsibilities */}
                            {job.responsibilities && (
                                <div>
                                    <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wide mb-4">Key Responsibilities</h3>
                                    <ul className="space-y-3">
                                        {job.responsibilities.map((resp, i) => (
                                            <li key={i} className="flex items-start gap-3 text-gray-600">
                                                <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-primary shrink-0" />
                                                <span className="leading-relaxed">{resp}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}

                            {/* Skills */}
                            <div>
                                <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wide mb-4">Required Skills</h3>
                                <div className="flex flex-wrap gap-2">
                                    {job.skills?.map((skill, i) => (
                                        <span key={i} className="px-4 py-1.5 bg-gray-100 text-gray-700 rounded-full text-sm font-medium border border-gray-200 hover:bg-gray-200 transition-colors cursor-default">
                                            {skill}
                                        </span>
                                    ))}
                                </div>
                            </div>


                        </div>
                    ) : (
                        <div className="space-y-8">
                            {/* Analytics Overview */}
                            <div className="grid grid-cols-3 gap-4">
                                <div className="p-6 border border-gray-200 rounded-xl text-center bg-gray-50">
                                    <div className="text-3xl font-bold text-gray-900">{job.analytics?.applicants || 0}</div>
                                    <div className="text-xs text-gray-500 uppercase mt-2 font-medium tracking-wide">Total Applicants</div>
                                </div>
                                <div className="p-6 border border-gray-200 rounded-xl text-center bg-gray-50">
                                    <div className="text-3xl font-bold text-primary">{job.analytics?.shortlisted || 0}</div>
                                    <div className="text-xs text-gray-500 uppercase mt-2 font-medium tracking-wide">Shortlisted</div>
                                </div>
                                <div className="p-6 border border-gray-200 rounded-xl text-center bg-gray-50">
                                    <div className="text-3xl font-bold text-green-600">{job.analytics?.avgMatchScore || 0}%</div>
                                    <div className="text-xs text-gray-500 uppercase mt-2 font-medium tracking-wide">Avg Match Score</div>
                                </div>
                            </div>

                            {/* Charts */}
                            <div className="p-6 border border-gray-200 rounded-xl bg-white shadow-sm">
                                <h4 className="font-bold text-gray-900 mb-6">Applicant Skills Distribution</h4>
                                <div className="h-64 w-full">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <BarChart data={[
                                            { name: 'Python', count: 45 },
                                            { name: 'SQL', count: 30 },
                                            { name: 'Product', count: 25 },
                                            { name: 'Data', count: 20 },
                                            { name: 'Comm.', count: 15 },
                                        ]}>
                                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                                            <XAxis dataKey="name" tick={{ fontSize: 12, fill: '#6B7280' }} axisLine={false} tickLine={false} />
                                            <YAxis tick={{ fontSize: 12, fill: '#6B7280' }} axisLine={false} tickLine={false} />
                                            <Tooltip
                                                cursor={{ fill: '#F3F4F6' }}
                                                contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
                                            />
                                            <Bar dataKey="count" fill="#FF9933" radius={[4, 4, 0, 0]} barSize={40} />
                                        </BarChart>
                                    </ResponsiveContainer>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>,
        document.body
    );
}
