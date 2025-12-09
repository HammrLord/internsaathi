import { useState, useEffect } from 'react';
import Head from 'next/head';
import { BookOpen, Search, ExternalLink, Filter, ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/router';

export default function Learn() {
    const router = useRouter();
    const [courses, setCourses] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [filteredCourses, setFilteredCourses] = useState<any[]>([]);

    useEffect(() => {
        fetch('/api/courses/nptel')
            .then(res => res.json())
            .then(data => {
                setCourses(data.courses || []);
                setFilteredCourses(data.courses || []);
                setLoading(false);
            })
            .catch(err => {
                console.error("Failed to load courses", err);
                setLoading(false);
            });
    }, []);

    useEffect(() => {
        if (!searchTerm) {
            setFilteredCourses(courses);
        } else {
            const lower = searchTerm.toLowerCase();
            const filtered = courses.filter(c =>
                c.title.toLowerCase().includes(lower) ||
                (c.discipline && c.discipline.toLowerCase().includes(lower))
            );
            setFilteredCourses(filtered);
        }
    }, [searchTerm, courses]);

    const handleSearch = (e: any) => {
        e.preventDefault();
        // If no results locally, offer to search on NPTEL directly
        if (filteredCourses.length === 0 && searchTerm) {
            window.open(`https://nptel.ac.in/courses?search=${encodeURIComponent(searchTerm)}`, '_blank');
        }
    };

    return (
        <div className="dashboard-container relative min-h-screen bg-gray-50 pb-20">
            <Head>
                <title>Learn More | NPTEL Courses</title>
            </Head>

            {/* Background & Watermark */}
            <div className="fixed inset-0 z-0">
                <div className="absolute top-0 left-0 w-full h-[350px] bg-[url('/pm_modi_banner.png')] bg-cover bg-center" />
                <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-[url('/assets/gov-india-emblem.svg')] bg-no-repeat bg-top-right opacity-5 pointer-events-none" />
            </div>

            {/* Content Container */}
            <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-[280px]">

                {/* Header Actions */}
                <div className="flex flex-col md:flex-row justify-between items-end mb-8 gap-4">
                    <div className="flex items-center gap-4">
                        <button onClick={() => router.back()} className="bg-white/30 hover:bg-white/50 text-white p-2 rounded-full backdrop-blur-md transition-colors border border-white/40">
                            <ArrowLeft size={24} />
                        </button>
                        <div>
                            <h1 className="text-4xl font-bold text-white mb-2 drop-shadow-md">Recommended Courses</h1>
                            <p className="text-white/90 font-medium drop-shadow-sm">Upskill with NPTEL's extensive library.</p>
                        </div>
                    </div>
                </div>

                {/* Search Bar */}
                <div className="mb-10 text-center">
                    <form onSubmit={handleSearch} className="relative max-w-2xl mx-auto">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                            <Search size={20} className="text-gray-400" />
                        </div>
                        <input
                            type="text"
                            className="block w-full pl-12 pr-4 py-4 border border-white/40 rounded-2xl leading-5 bg-white/90 backdrop-blur-md placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition duration-150 ease-in-out shadow-lg text-lg"
                            placeholder="Search courses (e.g. Machine Learning, Python)..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                        <button type="submit" className="absolute right-2 top-2 bottom-2 bg-primary text-white px-6 rounded-xl font-bold hover:bg-orange-600 transition-colors shadow-sm">
                            Search
                        </button>
                    </form>
                    <p className="text-white/80 text-sm mt-3 drop-shadow-sm font-medium">
                        Powered by <a href="https://nptel.ac.in" target="_blank" className="text-white underline hover:text-orange-200">NPTEL</a>
                    </p>
                </div>

                {loading ? (
                    <div className="flex justify-center py-20">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                    </div>
                ) : (
                    <>
                        {filteredCourses.length === 0 ? (
                            <div className="text-center py-20 bg-white/80 backdrop-blur-md rounded-xl border border-gray-200 shadow-lg">
                                <p className="text-gray-500 text-lg mb-4">No courses found matching "{searchTerm}"</p>
                                <a
                                    href={`https://nptel.ac.in/courses?search=${encodeURIComponent(searchTerm)}`}
                                    target="_blank"
                                    className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-white font-bold rounded-lg hover:bg-orange-600 transition-colors shadow-md"
                                >
                                    Search on NPTEL Website <ExternalLink size={16} />
                                </a>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                                {filteredCourses.map((course) => (
                                    <a
                                        key={course.id}
                                        href={course.link}
                                        target="_blank"
                                        className="group bg-white/90 backdrop-blur-md rounded-2xl border border-gray-200 overflow-hidden hover:shadow-2xl hover:border-primary/50 transition-all duration-300 transform hover:-translate-y-2 block h-full flex flex-col"
                                    >
                                        <div className={`h-40 bg-gradient-to-br ${course.source === 'Swayam' ? 'from-orange-500 to-red-600' : 'from-chakra to-blue-700'} flex items-center justify-center relative overflow-hidden`}>
                                            <div className="absolute inset-0 bg-black opacity-10 group-hover:opacity-0 transition-opacity"></div>
                                            <div className="absolute -bottom-6 -right-6 w-24 h-24 bg-white/10 rounded-full blur-xl"></div>
                                            <div className="absolute -top-6 -left-6 w-24 h-24 bg-white/10 rounded-full blur-xl"></div>

                                            <span className="text-white/20 text-5xl font-bold select-none absolute uppercase">{course.source || 'NPTEL'}</span>
                                            <BookOpen size={48} className="text-white relative z-10 drop-shadow-lg" />

                                            {course.discipline && (
                                                <span className="absolute bottom-3 right-3 text-[10px] font-bold uppercase tracking-wider text-white bg-black/40 backdrop-blur-sm px-2 py-1 rounded border border-white/20">
                                                    {course.discipline}
                                                </span>
                                            )}
                                        </div>
                                        <div className="p-6 flex-1 flex flex-col">
                                            <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-primary transition-colors line-clamp-2 leading-tight">
                                                {course.title}
                                            </h3>
                                            <div className="mt-auto pt-6 flex items-center justify-between text-sm text-gray-500 border-t border-gray-100">
                                                <span className="flex items-center gap-1.5 font-medium">
                                                    <BookOpen size={16} className="text-gray-400" /> Online Course
                                                </span>
                                                <span className="flex items-center gap-1 text-primary font-bold group-hover:underline">
                                                    View details <ExternalLink size={12} />
                                                </span>
                                            </div>
                                        </div>
                                    </a>
                                ))}
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
}
