import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/router';
import { Briefcase, MapPin, Calendar, CheckCircle, ArrowLeft, Building, Clock, Info } from 'lucide-react';
import Head from 'next/head';
import { io } from 'socket.io-client';

export default function JobDetails() {
    const router = useRouter();
    const { id } = router.query;
    const [job, setJob] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [relocatable, setRelocatable] = useState(false);
    const [applying, setApplying] = useState(false);
    const [applied, setApplied] = useState(false);
    const socketRef = useRef<any>(null);

    useEffect(() => {
        // Connect to socket server via relative path (proxied by Next.js rewrites)
        // This ensures it works on localhost AND ngrok/mobile devices
        socketRef.current = io();

        return () => {
            if (socketRef.current) socketRef.current.disconnect();
        }
    }, []);

    useEffect(() => {
        if (!id) return;

        // Fetch individual job
        fetch(`/api/jobs/${id}`)
            .then(res => res.json())
            .then(data => {
                // API might return array or object depending on implementation, usually object for /id
                // Our existing /api/jobs/[id] likely returns the object directly
                setJob(data);
                setLoading(false);
            })
            .catch(err => {
                console.error(err);
                setLoading(false);
            });
    }, [id]);

    const handleApply = async (e: React.FormEvent) => {
        e.preventDefault();
        setApplying(true);
        const email = localStorage.getItem('student_email');

        try {
            const res = await fetch('/api/student/apply', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    jobId: id,
                    email,
                    relocatable
                })
            });

            if (res.ok) {
                setApplied(true);
                // Emit event to notify recruiter immediately
                if (socketRef.current) {
                    socketRef.current.emit('application_submitted', {
                        jobId: id,
                        studentEmail: email,
                        timestamp: new Date().toISOString()
                    });
                }
            } else {
                const data = await res.json();
                alert("Failed to apply: " + (data.error || 'Unknown error'));
            }
        } catch (e: any) {
            alert("Error applying: " + e.message);
        } finally {
            setApplying(false);
        }
    };

    const handleWithdraw = async (e: React.FormEvent) => {
        e.preventDefault();
        const email = localStorage.getItem('student_email');
        if (!confirm("Are you sure you want to withdraw your application?")) return;

        try {
            const res = await fetch('/api/student/withdraw', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ jobId: id, email })
            });

            if (res.ok) {
                setApplied(false);
                alert("Application withdrawn successfully.");
            } else {
                alert("Failed to withdraw application.");
            }
        } catch (e) {
            alert("Error withdrawing application");
        }
    };

    if (loading) return <div className="flex justify-center mt-20"><div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div></div>;
    if (!job) return <div className="text-center mt-20">Job not found</div>;

    return (
        <div className="dashboard-container relative min-h-screen bg-gray-50 pb-20">
            <Head>
                <title>{job.title} | Details</title>
            </Head>

            {/* Background & Watermark */}
            <div className="fixed inset-0 z-0 pointer-events-none">
                <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-[url('/assets/gov-india-emblem.svg')] bg-no-repeat bg-top-right opacity-5" />
            </div>

            <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 py-8 pt-12">

                {/* Header Nav */}
                <div className="flex items-center gap-4 mb-8">
                    <button onClick={() => router.back()} className="bg-white hover:bg-gray-100 text-gray-600 p-2 rounded-full shadow-sm transition-colors border border-gray-200">
                        <ArrowLeft size={24} />
                    </button>
                    <h1 className="text-3xl font-bold text-gray-900">Job Details</h1>
                </div>

                {/* Header Card */}
                <div className="bg-white/90 backdrop-blur-md rounded-2xl shadow-lg border border-gray-200/50 p-8 mb-8 relative overflow-hidden">
                    {/* Decorative Top Border */}
                    <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-primary via-white to-secondary"></div>

                    <div className="flex flex-col md:flex-row justify-between gap-8 relative z-10">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900 mb-2">{job.title}</h1>
                            <div className="flex items-center gap-2 text-gray-600 font-medium text-lg">
                                <Building size={20} className="text-primary" />
                                {job.company || 'Government of India'}
                            </div>
                            <div className="flex flex-wrap gap-4 mt-6 text-sm text-gray-600">
                                <span className="flex items-center gap-1.5 px-3 py-1 bg-gray-100 rounded-lg border border-gray-200">
                                    <MapPin size={16} /> {job.location}
                                </span>
                                <span className="flex items-center gap-1.5 px-3 py-1 bg-gray-100 rounded-lg border border-gray-200">
                                    <Briefcase size={16} /> {job.type}
                                </span>
                                <span className="flex items-center gap-1.5 px-3 py-1 bg-green-50 text-green-700 rounded-lg border border-green-200 font-medium">
                                    <Clock size={16} /> Posted recently
                                </span>
                            </div>
                        </div>

                        {/* Apply Box (Desktop) */}
                        <div className="hidden md:block w-80 shrink-0">
                            {!applied ? (
                                <div className="bg-orange-50/50 rounded-xl p-6 border border-primary/20 shadow-sm">
                                    <h3 className="font-bold text-gray-900 mb-4 text-center">Interested?</h3>
                                    <form onSubmit={handleApply}>
                                        <div className="flex items-start gap-3 mb-4">
                                            <input
                                                type="checkbox"
                                                id="relocate_desk"
                                                className="mt-1 w-4 h-4 text-primary rounded border-gray-300 focus:ring-primary"
                                                checked={relocatable}
                                                onChange={e => setRelocatable(e.target.checked)}
                                            />
                                            <label htmlFor="relocate_desk" className="text-sm text-gray-700 leading-snug cursor-pointer select-none">
                                                I am willing to relocate to <strong>{job.location}</strong> if required.
                                            </label>
                                        </div>
                                        <button
                                            type="submit"
                                            disabled={applying}
                                            className="w-full bg-primary hover:bg-orange-600 text-white font-bold py-3 rounded-lg shadow-md hover:shadow-lg transition-all transform active:scale-95 disabled:opacity-70 flex justify-center border border-primary/50"
                                        >
                                            {applying ? 'Applying...' : 'Apply Now'}
                                        </button>
                                    </form>
                                </div>
                            ) : (
                                <div className="bg-green-50 rounded-xl p-6 border border-green-200 text-center shadow-sm">
                                    <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-3 shadow-inner">
                                        <CheckCircle size={32} />
                                    </div>
                                    <h3 className="font-bold text-green-800 text-lg">Application Sent!</h3>
                                    <p className="text-sm text-green-600 mt-1 mb-4 font-medium">Recruiters will contact you shortly.</p>
                                    <button
                                        onClick={handleWithdraw}
                                        className="text-red-600 text-sm font-bold hover:underline bg-red-50 px-4 py-2 rounded-lg border border-red-100 hover:bg-red-100 transition-colors"
                                    >
                                        Withdraw Application
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Details Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {/* Main Content */}
                    <div className="md:col-span-2 space-y-8">

                        {/* Info Boxes Row */}
                        <div className="grid grid-cols-2 gap-6">
                            <div className="bg-white/85 backdrop-blur-md p-6 rounded-xl border border-gray-200/50 shadow-sm hover:shadow-md transition-shadow">
                                <span className="text-gray-500 text-xs font-bold uppercase tracking-wider block mb-2">Application Deadline</span>
                                <div className="flex items-center gap-2 text-gray-900 font-bold text-lg">
                                    <Calendar className="text-primary" />
                                    {job.deadline ? new Date(job.deadline).toLocaleDateString() : 'Open until filled'}
                                </div>
                            </div>
                            <div className="bg-white/85 backdrop-blur-md p-6 rounded-xl border border-gray-200/50 shadow-sm hover:shadow-md transition-shadow">
                                <span className="text-gray-500 text-xs font-bold uppercase tracking-wider block mb-2">Applicants</span>
                                <div className="flex items-center gap-2 text-gray-900 font-bold text-lg">
                                    <Info className="text-chakra" />
                                    {job.applicants_count || 0} People
                                </div>
                            </div>
                        </div>

                        {/* Description */}
                        <div className="bg-white/90 backdrop-blur-md p-8 rounded-2xl border border-gray-200/50 shadow-lg">
                            <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                                <span className="w-1.5 h-6 bg-primary rounded-full"></span>
                                About the Role
                            </h2>
                            <p className="text-gray-700 leading-relaxed whitespace-pre-wrap text-md">{job.description}</p>
                        </div>

                        {/* Responsibilities */}
                        {job.responsibilities && job.responsibilities.length > 0 && (
                            <div className="bg-white/90 backdrop-blur-md p-8 rounded-2xl border border-gray-200/50 shadow-lg">
                                <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                                    <span className="w-1.5 h-6 bg-secondary rounded-full"></span>
                                    Key Responsibilities
                                </h2>
                                <ul className="space-y-4">
                                    {job.responsibilities.map((resp: string, idx: number) => (
                                        <li key={idx} className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                                            <div className="w-2 h-2 rounded-full bg-secondary mt-2 shrink-0 shadow-sm"></div>
                                            <span className="text-gray-700 font-medium">{resp}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}
                    </div>

                    {/* Sidebar / Mobile Apply */}
                    <div className="md:col-span-1">
                        <div className="bg-white/90 backdrop-blur-md p-6 rounded-2xl border border-gray-200/50 shadow-lg sticky top-32">
                            <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                                <Briefcase size={18} className="text-chakra" />
                                Recommended Skills
                            </h3>
                            <div className="flex flex-wrap gap-2">
                                {job.skills_required && job.skills_required.map((skill: string, i: number) => (
                                    <span key={i} className="px-3 py-1.5 bg-gray-50 text-gray-700 text-xs font-bold rounded-lg border border-gray-200 hover:border-chakra/30 hover:bg-blue-50 transition-colors">
                                        {skill}
                                    </span>
                                ))}
                            </div>

                            {/* Mobile Apply (Visible only on small screens) */}
                            <div className="md:hidden mt-8 pt-6 border-t border-gray-200">
                                {!applied ? (
                                    <form onSubmit={handleApply}>
                                        <div className="flex items-start gap-3 mb-4">
                                            <input
                                                type="checkbox"
                                                id="relocate_mob"
                                                className="mt-1 w-4 h-4 text-primary rounded border-gray-300 focus:ring-primary"
                                                checked={relocatable}
                                                onChange={e => setRelocatable(e.target.checked)}
                                            />
                                            <label htmlFor="relocate_mob" className="text-sm text-gray-700 leading-snug">
                                                I am willing to relocate to <strong>{job.location}</strong> if required.
                                            </label>
                                        </div>
                                        <button type="submit" className="w-full bg-primary text-white font-bold py-3 rounded-lg shadow-md">Apply Now</button>
                                    </form>
                                ) : (
                                    <div className="text-green-600 font-bold text-center">Applied Successfully</div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
