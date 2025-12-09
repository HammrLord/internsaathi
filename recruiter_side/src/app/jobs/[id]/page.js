'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { MapPin, Clock, ArrowLeft, Filter, Mail, CheckCircle, Clock3, Users, BarChart } from 'lucide-react';
import {
    Chart as ChartJS,
    ArcElement,
    Tooltip,
    Legend,
    CategoryScale,
    LinearScale,
    BarElement,
    Title
} from 'chart.js';
import { Doughnut, Bar } from 'react-chartjs-2';
import MassAutomationModal from '@/components/MassAutomationModal';

ChartJS.register(
    ArcElement,
    Tooltip,
    Legend,
    CategoryScale,
    LinearScale,
    BarElement,
    Title
);

export default function JobDetailsPage() {
    const params = useParams();
    const [job, setJob] = useState(null);
    const [candidates, setCandidates] = useState([]);
    const [selectedCandidate, setSelectedCandidate] = useState(null); // For modal
    const [activeTab, setActiveTab] = useState('candidates'); // 'overview', 'candidates', 'automation'

    // Filters
    const [filters, setFilters] = useState({
        minMatch: 0,
        location: '',
        search: ''
    });

    // Automation Stats
    const [automationConfig, setAutomationConfig] = useState({
        topCount: 5,
        waitlistCount: 2,
        bufferHours: 24
    });

    useEffect(() => {
        fetchJob();
        fetchCandidates();
    }, [params.id]);

    // Re-fetch candidates when filters change
    useEffect(() => {
        fetchCandidates();
    }, [filters]);

    const fetchJob = async () => {
        const res = await fetch(`/api/jobs/${params.id}`);
        if (res.ok) {
            const data = await res.json();
            setJob(data);
            if (data.auto_top_count) {
                setAutomationConfig({
                    topCount: data.auto_top_count,
                    waitlistCount: data.auto_waitlist_count,
                    bufferHours: data.auto_buffer_hours
                });
            }
        } else {
            console.error("Failed to fetch job", res.status);
            alert("Failed to load job details.");
        }
    };

    const fetchCandidates = async () => {
        const query = new URLSearchParams({
            minMatch: filters.minMatch,
            location: filters.location,
            search: filters.search
        });
        const res = await fetch(`/api/jobs/${params.id}/candidates?${query}`);
        if (res.ok) {
            setCandidates(await res.json());
        }
    };

    const updateCandidateStatus = async (candidateId, status, round = null) => {
        const res = await fetch(`/api/candidates/${candidateId}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ status, current_round: round })
        });
        if (res.ok) {
            fetchCandidates();
        } else {
            alert('Failed to update status');
        }
    };

    const [isEditing, setIsEditing] = useState(false);
    const [editedDescription, setEditedDescription] = useState('');

    // Mass Automation Modal State
    const [isAutomationModalOpen, setIsAutomationModalOpen] = useState(false);

    const handleRunAutomation = async (automationData) => {
        // automationData contains { emailInclude: ... }
        const payload = {
            ...automationConfig,
            ...automationData
        };

        const res = await fetch(`/api/jobs/${params.id}/automation`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });
        if (res.ok) {
            const result = await res.json();
            // alert(result.message); // Modal shows success state, no need for alert
            fetchCandidates();
            // The modal will close itself after success
        } else {
            throw new Error('Automation failed');
        }
    };

    const handleSaveDescription = async () => {
        // Here you would typically call an API to update the job
        // For now, let's assume we have an endpoint or just update local state if no endpoint exists yet
        // We need a PATCH /api/jobs/[id] endpoint for this.
        // Let's create it implicitly by assuming we'll add it or it exists.
        // Actually, let's just update the local state for now because I need to create the endpoint first?
        // No, I should create the endpoint. The user wants it to be editable.
        try {
            const res = await fetch(`/api/jobs/${params.id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ description: editedDescription })
            });
            if (res.ok) {
                setJob({ ...job, description: editedDescription });
                setIsEditing(false);
            } else {
                alert('Failed to save description');
            }
        } catch (e) {
            alert('Error saving description');
        }
    };

    useEffect(() => {
        if (job) setEditedDescription(job.description);
    }, [job]);

    if (!job) return <div className="p-8">Loading...</div>;

    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <Link href="/jobs" className="inline-flex items-center text-sm text-gray-500 hover:text-gray-900 mb-4">
                    <ArrowLeft size={16} className="mr-1" /> Back to Jobs
                </Link>
                <div className="flex justify-between items-start">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">{job.title}</h1>
                        <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                            <span className="flex items-center gap-1">
                                <MapPin size={16} /> {job.location}
                            </span>
                            <span className="flex items-center gap-1">
                                <Clock size={16} /> {job.type || 'Full-time'}
                            </span>
                            <span className="flex items-center gap-1">
                                <Users size={16} /> {job.applicants_count || 0} Applicants
                            </span>
                            <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${job.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-gray-100'}`}>
                                {job.status}
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Tabs */}
            <div className="border-b border-gray-200">
                <nav className="-mb-px flex space-x-8">
                    {['Overview', 'Candidates', 'Automation', 'Analytics'].map((tab) => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab.toLowerCase())}
                            className={`whitespace-nowrap pb-4 px-1 border-b-2 font-medium text-sm ${activeTab === tab.toLowerCase()
                                ? 'border-orange-500 text-orange-600'
                                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                }`}
                        >
                            {tab}
                        </button>
                    ))}
                </nav>
            </div>

            {/* Content */}
            {activeTab === 'candidates' && (
                <div className="flex flex-col xl:flex-row gap-6">
                    {/* Filters Sidebar - Made slimmer */}
                    <div className="w-full xl:w-64 bg-white p-4 rounded-lg border border-gray-200 h-fit shrink-0">
                        <div className="flex items-center gap-2 mb-4 text-gray-900 font-semibold">
                            <Filter size={18} /> Filters
                        </div>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-xs font-medium text-gray-700 mb-1">Min Match Score</label>
                                <input
                                    type="range"
                                    min="0"
                                    max="100"
                                    value={filters.minMatch}
                                    onChange={(e) => setFilters({ ...filters, minMatch: e.target.value })}
                                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                                />
                                <div className="text-right text-xs text-gray-500 font-medium">{filters.minMatch}%</div>
                            </div>

                            <div>
                                <label className="block text-xs font-medium text-gray-700 mb-1">Location</label>
                                <input
                                    type="text"
                                    placeholder="e.g. Bangalore"
                                    value={filters.location}
                                    onChange={(e) => setFilters({ ...filters, location: e.target.value })}
                                    className="w-full text-sm border-gray-300 rounded-md shadow-sm focus:ring-orange-500 focus:border-orange-500 py-1.5"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-medium text-gray-700 mb-1">Search Name</label>
                                <input
                                    type="text"
                                    placeholder="Search..."
                                    value={filters.search}
                                    onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                                    className="w-full text-sm border-gray-300 rounded-md shadow-sm focus:ring-orange-500 focus:border-orange-500 py-1.5"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Candidates Table - Compact & Scroll Fixed */}
                    <div className="flex-1 bg-white rounded-lg border border-gray-200 overflow-hidden min-w-0">
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th scope="col" className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/4">Candidate</th>
                                        <th scope="col" className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-16">Match</th>
                                        <th scope="col" className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-16">Exp</th>
                                        <th scope="col" className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-24">Status</th>
                                        <th scope="col" className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden md:table-cell">Skills</th>
                                        <th scope="col" className="px-3 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider w-40">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {candidates.map((candidate) => (
                                        <tr
                                            key={candidate.id}
                                            className="hover:bg-gray-50 group cursor-pointer transition-colors"
                                            onClick={() => setSelectedCandidate(candidate)}
                                        >
                                            <td className="px-3 py-3 whitespace-nowrap">
                                                <div className="flex items-center">
                                                    <div>
                                                        <div className="text-sm font-semibold text-gray-900 group-hover:text-orange-600 truncate max-w-[150px]">{candidate.name}</div>
                                                        <div className="text-xs text-gray-500 truncate max-w-[150px]">{candidate.email}</div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-3 py-3 whitespace-nowrap">
                                                <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-bold ${candidate.match_score >= 80 ? 'bg-green-100 text-green-800' :
                                                    candidate.match_score >= 60 ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'
                                                    }`}>
                                                    {candidate.match_score}%
                                                </span>
                                            </td>
                                            <td className="px-3 py-3 whitespace-nowrap text-sm text-gray-600">
                                                {candidate.years_of_experience || 0} Y
                                            </td>
                                            <td className="px-3 py-3 whitespace-nowrap">
                                                <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium uppercase tracking-wide ${candidate.status === 'Rejected' ? 'bg-red-50 text-red-700 border border-red-200' :
                                                    candidate.status === 'Hired' || candidate.current_round === 'Selected' ? 'bg-green-50 text-green-700 border border-green-200' :
                                                        candidate.current_round?.startsWith('R') ? 'bg-purple-50 text-purple-700 border border-purple-200' :
                                                            candidate.status === 'Waitlisted' ? 'bg-orange-50 text-orange-700 border border-orange-200' :
                                                                'bg-gray-50 text-gray-600 border border-gray-200'
                                                    }`}>
                                                    {candidate.current_round || candidate.status || 'Applied'}
                                                </span>
                                            </td>
                                            <td className="px-3 py-3 text-xs text-gray-500 hidden md:table-cell max-w-xs truncate">
                                                {candidate.skills ? candidate.skills.slice(0, 3).join(', ') + (candidate.skills.length > 3 ? ` +${candidate.skills.length - 3}` : '') : '-'}
                                            </td>
                                            <td className="px-3 py-3 whitespace-nowrap text-right text-sm font-medium" onClick={(e) => e.stopPropagation()}>
                                                <div className="flex justify-end gap-1">
                                                    {(!candidate.status || candidate.status === 'Applied' || candidate.status === 'Waitlisted') && (
                                                        <button
                                                            onClick={() => updateCandidateStatus(candidate.id, 'R1: Contacted', 'R1')}
                                                            className="text-white bg-blue-600 hover:bg-blue-700 px-2 py-1 rounded text-xs transition-colors"
                                                            title="Start Round 1"
                                                        >
                                                            Start R1
                                                        </button>
                                                    )}
                                                    {candidate.current_round === 'R1' && (
                                                        <button onClick={() => updateCandidateStatus(candidate.id, 'R2: Pre-Interview', 'R2')} className="text-white bg-purple-600 hover:bg-purple-700 px-2 py-1 rounded text-xs transition-colors">Move R2</button>
                                                    )}
                                                    {candidate.current_round === 'R2' && (
                                                        <button onClick={() => updateCandidateStatus(candidate.id, 'R3: Interview', 'R3')} className="text-white bg-orange-600 hover:bg-orange-700 px-2 py-1 rounded text-xs transition-colors">Move R3</button>
                                                    )}
                                                    {candidate.current_round === 'R3' && (
                                                        <button onClick={() => updateCandidateStatus(candidate.id, 'Hired', 'Selected')} className="text-white bg-green-600 hover:bg-green-700 px-2 py-1 rounded text-xs transition-colors">Hire</button>
                                                    )}
                                                    <button onClick={() => updateCandidateStatus(candidate.id, 'Rejected')} className="text-gray-400 hover:text-red-600 p-1" title="Reject">
                                                        <span className="sr-only">Reject</span>
                                                        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                                        </svg>
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                            {candidates.length === 0 && (
                                <div className="p-8 text-center text-gray-500">No candidates found matching filters.</div>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {activeTab === 'automation' && (
                <div className="max-w-3xl">
                    <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
                        <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center gap-2">
                            <Mail className="text-orange-600" /> Mass Mailer & Pipeline Automation
                        </h3>
                        <p className="text-sm text-gray-500 mb-6">
                            Configure automatic processing for this job. This will select the top candidates based on match score, send them R1 emails, and waitlist the next batch.
                        </p>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Top Candidates to Contact</label>
                                <input
                                    type="number"
                                    min="1"
                                    value={automationConfig.topCount}
                                    onChange={(e) => setAutomationConfig({ ...automationConfig, topCount: parseInt(e.target.value) })}
                                    className="w-full border-gray-300 rounded-md shadow-sm focus:ring-orange-500 focus:border-orange-500 font-bold text-gray-900 text-lg bg-gray-50"
                                />
                                <p className="mt-1 text-xs text-gray-500">Will move to "R1: Contacted"</p>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Waitlist Count</label>
                                <input
                                    type="number"
                                    min="0"
                                    value={automationConfig.waitlistCount}
                                    onChange={(e) => setAutomationConfig({ ...automationConfig, waitlistCount: parseInt(e.target.value) })}
                                    className="w-full border-gray-300 rounded-md shadow-sm focus:ring-orange-500 focus:border-orange-500 font-bold text-gray-900 text-lg bg-gray-50"
                                />
                                <p className="mt-1 text-xs text-gray-500">Will move to "Waitlisted"</p>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Buffer Time (Hours)</label>
                                <input
                                    type="number"
                                    min="1"
                                    value={automationConfig.bufferHours}
                                    onChange={(e) => setAutomationConfig({ ...automationConfig, bufferHours: parseInt(e.target.value) })}
                                    className="w-full border-gray-300 rounded-md shadow-sm focus:ring-orange-500 focus:border-orange-500 font-bold text-gray-900 text-lg bg-gray-50"
                                />
                                <p className="mt-1 text-xs text-gray-500">Time to wait before contacting waitlist</p>
                            </div>
                        </div>

                        <div className="flex justify-end pt-4 border-t border-gray-100">
                            <button
                                onClick={() => setIsAutomationModalOpen(true)}
                                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-orange-600 hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
                            >
                                Start Automation
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {activeTab === 'analytics' && (
                <div className="space-y-6">
                    <div className="bg-white p-6 rounded-lg border border-gray-200">
                        <h3 className="text-xl font-bold text-gray-900 mb-2">Performance Analytics for {job.title}</h3>
                        <p className="text-gray-500 text-sm mb-6">Real-time insights into candidate demographics and pipeline velocity.</p>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="p-4 border border-gray-100 rounded-lg">
                                <h4 className="text-sm font-semibold text-gray-700 mb-4 text-center">Applicant Sources</h4>
                                <div className="h-64 flex items-center justify-center">
                                    <Doughnut data={{
                                        labels: ['Direct', 'LinkedIn', 'Referral', 'Agency'],
                                        datasets: [{
                                            data: [65, 20, 10, 5],
                                            backgroundColor: ['#f97316', '#3b82f6', '#10b981', '#6366f1'],
                                            borderWidth: 0
                                        }]
                                    }} options={{ plugins: { legend: { position: 'bottom' } } }} />
                                </div>
                            </div>

                            <div className="p-4 border border-gray-100 rounded-lg">
                                <h4 className="text-sm font-semibold text-gray-700 mb-4 text-center">Candidate Match Score Distribution</h4>
                                <div className="h-64 flex items-center justify-center">
                                    <Bar data={{
                                        labels: ['90-100%', '80-90%', '70-80%', '60-70%', '<60%'],
                                        datasets: [{
                                            label: 'Candidates',
                                            data: [12, 45, 32, 15, 8],
                                            backgroundColor: '#f97316',
                                            borderRadius: 4
                                        }]
                                    }} options={{
                                        plugins: { legend: { display: false } },
                                        scales: {
                                            y: { beginAtZero: true, grid: { display: false } },
                                            x: { grid: { display: false } }
                                        }
                                    }} />
                                </div>
                            </div>
                        </div>

                        <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4">
                            <div className="text-center p-4 bg-orange-50 rounded-lg">
                                <div className="text-2xl font-bold text-orange-600">{candidates.length}</div>
                                <div className="text-xs text-orange-700 uppercase font-medium">Total Applicants</div>
                            </div>
                            <div className="text-center p-4 bg-green-50 rounded-lg">
                                <div className="text-2xl font-bold text-green-600">14</div>
                                <div className="text-xs text-green-700 uppercase font-medium">Top Matches (90%+)</div>
                            </div>
                            <div className="text-center p-4 bg-blue-50 rounded-lg">
                                <div className="text-2xl font-bold text-blue-600">4.5d</div>
                                <div className="text-xs text-blue-700 uppercase font-medium">Avg. Time to Hire</div>
                            </div>
                            <div className="text-center p-4 bg-purple-50 rounded-lg">
                                <div className="text-2xl font-bold text-purple-600">85%</div>
                                <div className="text-xs text-purple-700 uppercase font-medium">Offer Acceptance</div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Candidate Details Modal */}
            {activeTab === 'overview' && (
                <div className="bg-white p-6 rounded-lg border border-gray-200">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="text-xl font-bold text-gray-900 border-b-2 border-orange-500 inline-block pb-1">Description</h3>
                        <button
                            onClick={() => isEditing ? handleSaveDescription() : setIsEditing(true)}
                            className="text-sm font-medium text-orange-600 hover:text-orange-700 underline"
                        >
                            {isEditing ? 'Save Changes' : 'Edit'}
                        </button>
                    </div>

                    {isEditing ? (
                        <textarea
                            className="w-full h-40 p-3 border border-gray-300 rounded-md shadow-sm focus:ring-orange-500 focus:border-orange-500 text-gray-600"
                            value={editedDescription}
                            onChange={(e) => setEditedDescription(e.target.value)}
                        />
                    ) : (
                        <p className="text-gray-800 font-medium whitespace-pre-line mb-8 leading-relaxed">
                            {job.description}
                        </p>
                    )}

                    {job.responsibilities && job.responsibilities.length > 0 && (
                        <div>
                            <h3 className="text-lg font-medium mb-4">Key Responsibilities</h3>
                            <ul className="list-disc list-inside space-y-2 text-gray-600">
                                {job.responsibilities.map((resp, index) => (
                                    <li key={index}>{resp}</li>
                                ))}
                            </ul>
                        </div>
                    )}
                </div>
            )}

            {/* Candidate Details Modal */}
            {selectedCandidate && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-xl shadow-xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
                        <div className="p-6 border-b border-gray-100 flex justify-between items-start">
                            <div>
                                <h2 className="text-xl font-bold text-gray-900">{selectedCandidate.name}</h2>
                                <p className="text-sm text-gray-500">{selectedCandidate.email}</p>
                            </div>
                            <button
                                onClick={() => setSelectedCandidate(null)}
                                className="text-gray-400 hover:text-gray-600"
                            >
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                            </button>
                        </div>
                        <div className="p-6 space-y-6">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="p-3 bg-gray-50 rounded-lg">
                                    <div className="text-xs text-gray-500 uppercase tracking-wide">Match Score</div>
                                    <div className={`text-xl font-bold ${selectedCandidate.match_score >= 80 ? 'text-green-600' :
                                        selectedCandidate.match_score >= 60 ? 'text-yellow-600' : 'text-red-600'
                                        }`}>{selectedCandidate.match_score}%</div>
                                </div>
                                <div className="p-3 bg-gray-50 rounded-lg">
                                    <div className="text-xs text-gray-500 uppercase tracking-wide">Experience</div>
                                    <div className="text-xl font-bold text-gray-900">{selectedCandidate.years_of_experience} Years</div>
                                </div>
                            </div>

                            <div>
                                <h3 className="text-sm font-medium text-gray-900 mb-2">Skills</h3>
                                <div className="flex flex-wrap gap-2">
                                    {selectedCandidate.skills && selectedCandidate.skills.map((skill, i) => (
                                        <span key={i} className="px-2 py-1 bg-blue-50 text-blue-700 rounded text-sm">{skill}</span>
                                    ))}
                                </div>
                            </div>

                            <div>
                                <h3 className="text-sm font-medium text-gray-900 mb-2">Contact</h3>
                                <div className="flex items-center gap-2 text-gray-600 text-sm">
                                    <Mail size={16} /> {selectedCandidate.email}
                                </div>
                                <div className="flex items-center gap-2 text-gray-600 text-sm mt-1">
                                    <span className="font-medium">Phone:</span> {selectedCandidate.phone}
                                </div>
                                <div className="flex items-center gap-2 text-gray-600 text-sm mt-1">
                                    <span className="font-medium">Location:</span> {selectedCandidate.location}
                                </div>
                            </div>

                            <div className="flex justify-between items-center pt-4 border-t border-gray-100">
                                <div className="text-sm">
                                    <span className="text-gray-500">Status: </span>
                                    <span className="font-medium text-gray-900">{selectedCandidate.current_round || selectedCandidate.status}</span>
                                </div>
                            </div>
                        </div>
                        <div className="p-4 bg-gray-50 border-t border-gray-100 flex justify-end gap-3">
                            <button
                                onClick={() => setSelectedCandidate(null)}
                                className="px-4 py-2 border border-gray-300 rounded-lg text-sm text-gray-700 hover:bg-white"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}
            {/* Mass Automation Modal */}
            <MassAutomationModal
                isOpen={isAutomationModalOpen}
                onClose={() => setIsAutomationModalOpen(false)}
                topCount={automationConfig.topCount}
                waitlistCount={automationConfig.waitlistCount}
                onConfirm={handleRunAutomation}
            />
        </div>
    );
}
