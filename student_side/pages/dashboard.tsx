import { useState, useEffect } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { Search, MapPin, Briefcase, User, LogOut, ArrowRight, BookOpen, Bell, Edit, CheckCircle } from 'lucide-react';
import Link from 'next/link';
import { io } from "socket.io-client";

export default function Dashboard() {
    const router = useRouter();
    const [jobs, setJobs] = useState<any[]>([]);
    const [profile, setProfile] = useState<any>(null);
    const [appCount, setAppCount] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [email, setEmail] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [filters, setFilters] = useState({
        location: '',
        duration: '',
        role: ''
    });

    const [showNotification, setShowNotification] = useState(false);
    const [newMsg, setNewMsg] = useState("");

    useEffect(() => {
        const storedEmail = localStorage.getItem('student_email');
        if (!storedEmail) {
            router.push('/signup');
            return;
        }
        setEmail(storedEmail);
        fetchData(storedEmail);

        // Feature 8: Real-time Listener
        const socket = io('http://localhost:4000/student');

        socket.on('connect', () => {
            console.log('Connected to real-time updates');
        });

        socket.on('job:created', (data: any) => {
            console.log('New job posted!', data);
            setNewMsg(`New internship posted: ${data.title}`);
            setShowNotification(true);
            // Refresh data
            fetchData(storedEmail);

            // Hide notification after 5s
            setTimeout(() => setShowNotification(false), 5000);
        });

        return () => {
            socket.disconnect();
        };
    }, []);

    const fetchData = async (userEmail: string) => {
        setLoading(true);
        try {
            const [recRes, profRes] = await Promise.all([
                fetch(`/api/student/recommendations?email=${userEmail}`),
                fetch(`/api/student/profile?email=${userEmail}`)
            ]);

            const recData = await recRes.json();
            const profData = await profRes.json();

            if (recData.error) throw new Error(recData.error);

            setJobs(recData.recommendations || []);
            setProfile(profData.profile);
            setAppCount(profData.applicationCount || 0);

        } catch (err: any) {
            console.error(err);
            setError(err.message || "Failed to load dashboard data");
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('student_email');
        router.push('/login');
    };

    // Filter Logic
    const filteredJobs = jobs.filter(job => {
        const matchesSearch = job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (job.company && job.company.toLowerCase().includes(searchTerm.toLowerCase())) ||
            job.location.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesLocation = filters.location ? job.location.toLowerCase().includes(filters.location.toLowerCase()) : true;
        const matchesDuration = filters.duration ? (job.duration && job.duration.toLowerCase().includes(filters.duration.toLowerCase())) : true;

        // Simple role check (if title contains role keyword)
        const matchesRole = filters.role ? job.title.toLowerCase().includes(filters.role.toLowerCase()) : true;

        return matchesSearch && matchesLocation && matchesDuration && matchesRole;
    });

    return (
        <div className="flex h-screen overflow-hidden bg-gray-50 font-sans text-gray-900">
            <Head>
                <title>Student Dashboard</title>
            </Head>

            {/* Background & Watermark - Watermark ONLY */}
            <div className="fixed inset-0 z-0 pointer-events-none">
                <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-[url('/assets/gov-india-emblem.svg')] bg-no-repeat bg-top-right opacity-5" />
            </div>

            {/* Sidebar */}
            <aside className="w-80 bg-white/80 backdrop-blur-2xl border-r border-white/50 flex flex-col z-20 shadow-2xl relative">

                {/* Brand */}
                <div className="p-8 border-b border-gray-100/50">
                    <div className="flex items-center gap-3">
                        <div className="h-10 w-10 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-orange-200">
                            S
                        </div>
                        <div>
                            <h1 className="text-xl font-bold text-gray-900 leading-tight">Student Portal</h1>
                            <p className="text-xs text-primary font-medium tracking-wide">PM INTERNSHIP SCHEME</p>
                        </div>
                    </div>
                </div>

                {/* Profile Section */}
                <div className="p-6">
                    <div className="bg-gradient-to-br from-white to-orange-50/50 p-4 rounded-2xl border border-white/60 shadow-sm relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <Link href="/profile" className="p-1.5 bg-white rounded-full text-gray-400 hover:text-primary shadow-sm block">
                                <Edit size={14} />
                            </Link>
                        </div>
                        <div className="flex items-center gap-4 mb-3">
                            <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-lg border-2 border-white shadow-sm">
                                {email ? email.charAt(0).toUpperCase() : 'S'}
                            </div>
                            <div className="overflow-hidden">
                                <p className="font-bold text-gray-900 truncate">Student</p>
                                <p className="text-xs text-gray-500 truncate">{email}</p>
                            </div>
                        </div>
                        <Link href="/profile" className="block w-full py-2 text-center text-xs font-bold bg-white border border-gray-200 rounded-lg text-gray-600 hover:text-primary hover:border-primary/30 transition-colors">
                            View & Edit Profile
                        </Link>
                    </div>
                </div>

                {/* Navigation */}
                <nav className="px-4 space-y-2 flex-1 overflow-y-auto">
                    <div className="px-4 py-2 text-xs font-bold text-gray-400 uppercase tracking-wider">Menu</div>

                    <a href="#" className="flex items-center gap-3 px-4 py-3 bg-primary/10 text-primary font-bold rounded-xl transition-all">
                        <Briefcase size={20} />
                        Intern Recommendations
                    </a>

                    <Link href="/learn" className="flex items-center gap-3 px-4 py-3 text-gray-600 hover:bg-gray-50 hover:text-gray-900 font-medium rounded-xl transition-all group">
                        <BookOpen size={20} className="group-hover:text-blue-500 transition-colors" />
                        See Courses
                    </Link>

                    {/* Notifications Section */}
                    <div className="mt-8">
                        <div className="flex items-center justify-between px-2 mb-2">
                            <div className="px-2 py-2 text-xs font-bold text-gray-400 uppercase tracking-wider flex items-center gap-2">
                                <Bell size={14} /> Notifications
                            </div>
                            <span className="bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">3</span>
                        </div>
                        <div className="space-y-2">
                            <div className="p-3 bg-white/60 border border-white/50 rounded-xl shadow-sm hover:shadow-md transition-shadow cursor-pointer">
                                <p className="text-sm font-medium text-gray-800 leading-snug">New internships added in Delhi!</p>
                                <p className="text-[10px] text-gray-400 mt-1">2h ago</p>
                            </div>
                            <div className="p-3 bg-white/60 border border-white/50 rounded-xl shadow-sm hover:shadow-md transition-shadow cursor-pointer">
                                <p className="text-sm font-medium text-gray-800 leading-snug">Profile verification complete.</p>
                                <p className="text-[10px] text-gray-400 mt-1">1d ago</p>
                            </div>
                        </div>
                    </div>
                </nav>

                {/* Footer */}
                <div className="p-4 bg-gray-50/50 border-t border-gray-200/50 backdrop-blur-md">
                    <button onClick={handleLogout} className="flex items-center gap-3 w-full px-4 py-3 text-red-600 hover:bg-red-50 font-bold rounded-xl transition-colors">
                        <LogOut size={20} />
                        Logout
                    </button>
                </div>
            </aside>

            {/* Main Content Area */}
            <main className="flex-1 relative z-10 overflow-y-auto scrollbar-hide">

                {/* Top Banner Image */}
                <div className="w-full h-48 bg-gray-100 relative">
                    <img src="/pm_modi_banner.png" alt="PM Internship Banner" className="w-full h-full object-cover object-top" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                    <div className="absolute bottom-4 left-8 text-white">
                        <h2 className="text-3xl font-bold drop-shadow-md">Intern Recommendations</h2>
                        <p className="text-sm font-medium text-white/90 drop-shadow-sm">Handpicked opportunities based on your profile.</p>
                    </div>
                </div>

                {/* Header (Now just Search Bar) */}
                <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b border-gray-200 px-8 py-4">

                    {/* Real-time Notification Toast */}
                    {showNotification && (
                        <div className="absolute top-20 right-8 z-50 bg-black text-white px-4 py-3 rounded-lg shadow-lg flex items-center gap-3 animate-in slide-in-from-right duration-300">
                            <div className="bg-primary rounded-full p-1">
                                <Bell size={14} className="text-white" />
                            </div>
                            <div>
                                <p className="text-sm font-bold">Update</p>
                                <p className="text-xs text-gray-300">{newMsg}</p>
                            </div>
                        </div>
                    )}

                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">

                        {/* Filters */}
                        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar">
                            <select
                                className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm font-medium text-gray-700 focus:outline-none focus:ring-2 focus:ring-primary/50"
                                value={filters.location}
                                onChange={(e) => setFilters({ ...filters, location: e.target.value })}
                            >
                                <option value="">All Locations</option>
                                <option value="Bangalore">Bangalore</option>
                                <option value="Delhi">Delhi</option>
                                <option value="Mumbai">Mumbai</option>
                                <option value="Hyderabad">Hyderabad</option>
                                <option value="Pune">Pune</option>
                                <option value="Remote">Remote</option>
                            </select>

                            <select
                                className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm font-medium text-gray-700 focus:outline-none focus:ring-2 focus:ring-primary/50"
                                value={filters.duration}
                                onChange={(e) => setFilters({ ...filters, duration: e.target.value })}
                            >
                                <option value="">Any Duration</option>
                                <option value="3 Months">3 Months</option>
                                <option value="6 Months">6 Months</option>
                            </select>

                            <select
                                className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm font-medium text-gray-700 focus:outline-none focus:ring-2 focus:ring-primary/50"
                                value={filters.role}
                                onChange={(e) => setFilters({ ...filters, role: e.target.value })}
                            >
                                <option value="">All Roles</option>
                                <option value="React">React</option>
                                <option value="Python">Python</option>
                                <option value="Design">Design</option>
                                <option value="Marketing">Marketing</option>
                            </select>
                        </div>

                        {/* Search Bar */}
                        <div className="relative">
                            <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Search internships..."
                                className="pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 w-64 transition-all focus:w-80"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                    </div>
                </header>

                <div className="p-8 pb-32 max-w-7xl mx-auto">
                    {/* Stats / Promo Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                        <div className="bg-gradient-to-r from-primary to-orange-500 rounded-2xl p-6 text-white shadow-lg relative overflow-hidden">
                            <div className="relative z-10">
                                <h3 className="text-lg font-bold mb-1">Boost your Profile</h3>
                                <p className="text-white/90 text-sm mb-4">Complete your courses to rank higher.</p>
                                <Link href="/learn" className="bg-white text-primary px-4 py-2 rounded-lg text-xs font-bold inline-block hover:bg-orange-50 transition-colors">Go to Courses</Link>
                            </div>
                            <BookOpen className="absolute -bottom-4 -right-4 text-white/20 w-32 h-32" />
                        </div>
                        <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm flex items-center gap-4">
                            <div className="h-12 w-12 bg-green-100 text-green-600 rounded-full flex items-center justify-center">
                                <Briefcase size={24} />
                            </div>
                            <div>
                                <h3 className="text-2xl font-bold text-gray-900">{jobs.length}</h3>
                                <p className="text-sm text-gray-500 font-medium">Active Jobs</p>
                            </div>
                        </div>
                        <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm flex items-center gap-4">
                            <div className="h-12 w-12 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center">
                                <User size={24} />
                            </div>
                            <div>
                                <h3 className="text-2xl font-bold text-gray-900">85%</h3>
                                <p className="text-sm text-gray-500 font-medium">Profile Score</p>
                            </div>
                        </div>
                    </div>

                    {/* Jobs Grid */}
                    {loading ? (
                        <div className="flex justify-center py-20">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                        </div>
                    ) : error ? (
                        <div className="text-center py-20 bg-red-50 rounded-xl border border-red-200">
                            <h3 className="text-lg font-bold text-error">Error Loading Jobs</h3>
                            <p className="text-red-600">{error}</p>
                            <button onClick={() => window.location.reload()} className="mt-4 px-4 py-2 bg-white border border-red-200 text-red-700 rounded-lg hover:bg-red-50">Retry</button>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {filteredJobs.length > 0 ? (
                                filteredJobs.map((job) => (
                                    <div key={job.id} className="group bg-white rounded-2xl border border-gray-200 p-6 hover:shadow-xl hover:border-primary/50 transition-all duration-300 transform hover:-translate-y-1 relative">
                                        <div className="flex justify-between items-start mb-4">
                                            <div className="h-12 w-12 bg-gray-50 rounded-xl flex items-center justify-center border border-gray-100">
                                                <Briefcase className="text-gray-400 group-hover:text-primary transition-colors" size={24} />
                                            </div>
                                            <span className="bg-green-50 text-green-700 text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-wide border border-green-100">
                                                {job.match_score || 92}% Match
                                            </span>
                                        </div>

                                        <h3 className="text-lg font-bold text-gray-900 mb-1 leading-tight group-hover:text-primary transition-colors">{job.title}</h3>
                                        <p className="text-sm text-gray-500 font-medium mb-4 flex items-center gap-1">
                                            <Briefcase size={12} /> {job.company || 'Government of India'}
                                        </p>

                                        <div className="flex flex-wrap gap-2 mb-6">
                                            <span className="px-2.5 py-1 bg-gray-50 text-gray-600 text-xs font-medium rounded-lg border border-gray-100 flex items-center gap-1">
                                                <MapPin size={10} /> {job.location}
                                            </span>
                                            <span className="px-2.5 py-1 bg-gray-50 text-gray-600 text-xs font-medium rounded-lg border border-gray-100">
                                                {job.type}
                                            </span>
                                        </div>

                                        <div className="flex items-center justify-between pt-4 border-t border-gray-100/50">
                                            <span className="text-xs text-gray-400 font-medium">Posted recently</span>
                                            <Link href={`/jobs/${job.id}`} className="text-sm font-bold text-primary hover:text-orange-700 flex items-center gap-1">
                                                View Details <ArrowRight size={14} />
                                            </Link>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="col-span-full text-center py-20 text-gray-500 bg-white/50 rounded-3xl border border-dashed border-gray-300">
                                    No internships found matching your search.
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}
