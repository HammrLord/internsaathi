import { useState, useEffect } from 'react';
import Head from 'next/head';
import { User, Briefcase, GraduationCap, MapPin, Save, Plus, Trash2, ArrowLeft, Globe, Github, Linkedin, FileText, Phone, Calendar, Upload, File } from 'lucide-react';
import { useRouter } from 'next/router';

export default function Profile() {
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    // Profile State
    const [formData, setFormData] = useState({
        email: '',
        full_name: '',
        phone: '',
        address: '',
        dob: '',
        gender: '',
        bio: '',
        skills: [] as string[],
        projects: [] as any[],
        experience: [] as any[],
        education: [] as any[],
        education_level: '',
        social_links: { linkedin: '', github: '', portfolio: '' },
        resume_url: '',
        transcript_url: '',
        other_docs_url: '',
        preferences: ''
    });

    const [newSkill, setNewSkill] = useState('');

    useEffect(() => {
        const email = localStorage.getItem('student_email');
        if (!email) {
            router.push('/login');
            return;
        }

        fetch(`/api/student/profile?email=${email}`)
            .then(res => res.json())
            .then(data => {
                if (data.profile) {
                    const p = data.profile;
                    setFormData({
                        email: email,
                        full_name: p.full_name || '',
                        phone: p.phone || '',
                        address: p.address || '',
                        dob: p.dob ? new Date(p.dob).toISOString().split('T')[0] : '', // Format YYYY-MM-DD
                        gender: p.gender || '',
                        bio: p.bio || '',
                        skills: Array.isArray(p.skills) ? p.skills : [],
                        projects: parseJSON(p.projects),
                        experience: parseJSON(p.experience),
                        education: parseJSON(p.education),
                        education_level: p.education_level || '',
                        social_links: parseJSON(p.social_links) || { linkedin: '', github: '', portfolio: '' },
                        resume_url: p.resume_url || '',
                        transcript_url: p.transcript_url || '',
                        other_docs_url: p.other_docs_url || '',
                        preferences: p.preferences || ''
                    });
                } else {
                    setFormData(prev => ({ ...prev, email }));
                }
                setLoading(false);
            })
            .catch(err => {
                console.error(err);
                setLoading(false);
            });
    }, []);

    const parseJSON = (data: any) => {
        if (!data) return [];
        if (typeof data === 'object') return data;
        try { return JSON.parse(data); } catch { return []; }
    };

    const handleSave = async () => {
        setSaving(true);
        try {
            const res = await fetch('/api/student/profile/update', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });

            if (res.ok) {
                alert('Profile updated successfully!');
            } else {
                alert('Failed to update profile');
            }
        } catch (e) {
            alert('Error saving profile');
        } finally {
            setSaving(false);
        }
    };

    // --- Handlers ---
    const addSkill = () => {
        if (newSkill && !formData.skills.includes(newSkill)) {
            setFormData({ ...formData, skills: [...formData.skills, newSkill] });
            setNewSkill('');
        }
    };
    const removeSkill = (skill: string) => setFormData({ ...formData, skills: formData.skills.filter(s => s !== skill) });

    const addProject = () => setFormData({ ...formData, projects: [...formData.projects, { title: '', description: '', link: '' }] });
    const updateProject = (i: number, f: string, v: string) => { const n = [...formData.projects]; n[i][f] = v; setFormData({ ...formData, projects: n }); };
    const removeProject = (i: number) => setFormData({ ...formData, projects: formData.projects.filter((_, idx) => idx !== i) });

    const addExp = () => setFormData({ ...formData, experience: [...formData.experience, { role: '', company: '', duration: '', desc: '' }] });
    const updateExp = (i: number, f: string, v: string) => { const n = [...formData.experience]; n[i][f] = v; setFormData({ ...formData, experience: n }); };
    const removeExp = (i: number) => setFormData({ ...formData, experience: formData.experience.filter((_, idx) => idx !== i) });

    const addEdu = () => setFormData({ ...formData, education: [...formData.education, { degree: '', institute: '', year: '', score: '' }] });
    const updateEdu = (i: number, f: string, v: string) => { const n = [...formData.education]; n[i][f] = v; setFormData({ ...formData, education: n }); };
    const removeEdu = (i: number) => setFormData({ ...formData, education: formData.education.filter((_, idx) => idx !== i) });

    return (
        <div className="min-h-screen bg-gray-50 font-sans text-gray-900 pb-20">
            <Head>
                <title>Edit Profile</title>
            </Head>

            {/* Simple Header (No Huge Banner) */}
            <div className="bg-white border-b border-gray-200 sticky top-0 z-30 shadow-sm">
                <div className="max-w-5xl mx-auto px-4 py-4 flex justify-between items-center">
                    <div className="flex items-center gap-4">
                        <button onClick={() => router.back()} className="p-2 rounded-full hover:bg-gray-100 text-gray-600 transition-colors">
                            <ArrowLeft size={22} />
                        </button>
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900">Student Profile</h1>
                            <p className="text-sm text-gray-500">Manage your professional identity</p>
                        </div>
                    </div>
                    <button
                        onClick={handleSave}
                        disabled={saving}
                        className="btn bg-primary hover:bg-orange-600 text-white px-6 py-2 rounded-xl font-bold shadow-md flex items-center gap-2 transition-all disabled:opacity-50"
                    >
                        <Save size={18} />
                        {saving ? 'Saving...' : 'Save Changes'}
                    </button>
                </div>
            </div>

            {loading ? (
                <div className="flex justify-center py-20">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                </div>
            ) : (
                <div className="max-w-5xl mx-auto px-4 py-8 space-y-8">

                    {/* 1. Personal Details */}
                    <section className="bg-white p-8 rounded-2xl border border-gray-200 shadow-sm">
                        <h2 className="text-xl font-bold mb-6 flex items-center gap-2 text-gray-800 border-b border-gray-100 pb-3">
                            <User size={22} className="text-primary" /> Personal Information
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="form-group">
                                <label className="block text-sm font-bold text-gray-700 mb-1">Full Name</label>
                                <input type="text" className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/50 outline-none"
                                    value={formData.full_name} onChange={(e) => setFormData({ ...formData, full_name: e.target.value })} placeholder="e.g. Rahul Sharma" />
                            </div>
                            <div className="form-group">
                                <label className="block text-sm font-bold text-gray-700 mb-1">Email (Read Only)</label>
                                <input type="email" className="w-full p-3 bg-gray-100 border border-gray-200 rounded-lg text-gray-500 cursor-not-allowed"
                                    value={formData.email} disabled />
                            </div>
                            <div className="form-group">
                                <label className="block text-sm font-bold text-gray-700 mb-1">Phone Number</label>
                                <div className="relative">
                                    <Phone size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                    <input type="tel" className="w-full pl-10 p-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/50 outline-none"
                                        value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} placeholder="+91 98765 43210" />
                                </div>
                            </div>
                            <div className="form-group">
                                <label className="block text-sm font-bold text-gray-700 mb-1">Location / Address</label>
                                <div className="relative">
                                    <MapPin size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                    <input type="text" className="w-full pl-10 p-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/50 outline-none"
                                        value={formData.address} onChange={(e) => setFormData({ ...formData, address: e.target.value })} placeholder="City, State" />
                                </div>
                            </div>
                            <div className="form-group">
                                <label className="block text-sm font-bold text-gray-700 mb-1">Date of Birth</label>
                                <input type="date" className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/50 outline-none"
                                    value={formData.dob} onChange={(e) => setFormData({ ...formData, dob: e.target.value })} />
                            </div>
                            <div className="form-group">
                                <label className="block text-sm font-bold text-gray-700 mb-1">Gender</label>
                                <select className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/50 outline-none"
                                    value={formData.gender} onChange={(e) => setFormData({ ...formData, gender: e.target.value })}>
                                    <option value="">Select Gender</option>
                                    <option value="Male">Male</option>
                                    <option value="Female">Female</option>
                                    <option value="Other">Other</option>
                                </select>
                            </div>
                            <div className="col-span-full">
                                <label className="block text-sm font-bold text-gray-700 mb-1">Professional Bio</label>
                                <textarea className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/50 outline-none" rows={3}
                                    value={formData.bio} onChange={(e) => setFormData({ ...formData, bio: e.target.value })} placeholder="Brief summary of your career goals..." />
                            </div>
                        </div>
                    </section>

                    {/* 2. Documents Section (NEW) */}
                    <section className="bg-white p-8 rounded-2xl border border-gray-200 shadow-sm">
                        <h2 className="text-xl font-bold mb-6 flex items-center gap-2 text-gray-800 border-b border-gray-100 pb-3">
                            <File size={22} className="text-blue-500" /> Documents & verification
                        </h2>
                        <div className="space-y-4">
                            <div className="p-4 bg-blue-50/50 border border-blue-100 rounded-xl flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="h-10 w-10 bg-white rounded-lg flex items-center justify-center text-red-500 shadow-sm"><FileText size={20} /></div>
                                    <div>
                                        <p className="font-bold text-gray-800 text-sm">Resume / CV</p>
                                        <p className="text-xs text-gray-500">PDF, DOCX formats</p>
                                    </div>
                                </div>
                                <input type="text" className="w-1/2 p-2 text-sm border border-gray-200 rounded bg-white"
                                    placeholder="Paste Resume Link (Drive/Dropbox)..." value={formData.resume_url} onChange={(e) => setFormData({ ...formData, resume_url: e.target.value })} />
                            </div>

                            <div className="p-4 bg-orange-50/50 border border-orange-100 rounded-xl flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="h-10 w-10 bg-white rounded-lg flex items-center justify-center text-orange-500 shadow-sm"><GraduationCap size={20} /></div>
                                    <div>
                                        <p className="font-bold text-gray-800 text-sm">Academic Transcripts</p>
                                        <p className="text-xs text-gray-500">Latest marksheets</p>
                                    </div>
                                </div>
                                <input type="text" className="w-1/2 p-2 text-sm border border-gray-200 rounded bg-white"
                                    placeholder="Paste Transcript Link..." value={formData.transcript_url} onChange={(e) => setFormData({ ...formData, transcript_url: e.target.value })} />
                            </div>

                            <div className="p-4 bg-gray-50 border border-gray-200 rounded-xl flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="h-10 w-10 bg-white rounded-lg flex items-center justify-center text-gray-500 shadow-sm"><File size={20} /></div>
                                    <div>
                                        <p className="font-bold text-gray-800 text-sm">Other Certificates</p>
                                        <p className="text-xs text-gray-500">Optional</p>
                                    </div>
                                </div>
                                <input type="text" className="w-1/2 p-2 text-sm border border-gray-200 rounded bg-white"
                                    placeholder="Link to other docs..." value={formData.other_docs_url} onChange={(e) => setFormData({ ...formData, other_docs_url: e.target.value })} />
                            </div>
                        </div>
                    </section>

                    {/* 3. Education Qualification */}
                    <section className="bg-white p-8 rounded-2xl border border-gray-200 shadow-sm">
                        <div className="flex justify-between items-center mb-6 border-b border-gray-100 pb-3">
                            <h2 className="text-xl font-bold flex items-center gap-2 text-gray-800">
                                <GraduationCap size={22} className="text-green-600" /> Education Qualification
                            </h2>
                            <button onClick={addEdu} className="text-sm bg-green-50 text-green-700 px-3 py-1.5 rounded-lg font-bold hover:bg-green-100 transition-colors flex items-center gap-1">
                                <Plus size={16} /> Add
                            </button>
                        </div>
                        <div className="grid grid-cols-1 gap-4">
                            {formData.education.map((edu, i) => (
                                <div key={i} className="p-4 bg-gray-50 rounded-xl border border-gray-200 relative group">
                                    <button onClick={() => removeEdu(i)} className="absolute top-3 right-3 text-gray-400 hover:text-red-500 p-1"><Trash2 size={16} /></button>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <input className="bg-white p-2.5 rounded border border-gray-200 text-sm font-bold" placeholder="Degree (e.g. B.Tech)" value={edu.degree} onChange={(e) => updateEdu(i, 'degree', e.target.value)} />
                                        <input className="bg-white p-2.5 rounded border border-gray-200 text-sm" placeholder="Institution / College" value={edu.institute} onChange={(e) => updateEdu(i, 'institute', e.target.value)} />
                                        <input className="bg-white p-2.5 rounded border border-gray-200 text-sm" placeholder="Year of Passing" value={edu.year} onChange={(e) => updateEdu(i, 'year', e.target.value)} />
                                        <input className="bg-white p-2.5 rounded border border-gray-200 text-sm" placeholder="Score / CGPA" value={edu.score} onChange={(e) => updateEdu(i, 'score', e.target.value)} />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>

                    {/* 4. Experience / Internships */}
                    <section className="bg-white p-8 rounded-2xl border border-gray-200 shadow-sm">
                        <div className="flex justify-between items-center mb-6 border-b border-gray-100 pb-3">
                            <h2 className="text-xl font-bold flex items-center gap-2 text-gray-800">
                                <Briefcase size={22} className="text-purple-600" /> Experience
                            </h2>
                            <button onClick={addExp} className="text-sm bg-purple-50 text-purple-700 px-3 py-1.5 rounded-lg font-bold hover:bg-purple-100 transition-colors flex items-center gap-1">
                                <Plus size={16} /> Add
                            </button>
                        </div>
                        <div className="space-y-4">
                            {formData.experience.map((exp, i) => (
                                <div key={i} className="p-4 bg-gray-50 rounded-xl border border-gray-200 relative group">
                                    <button onClick={() => removeExp(i)} className="absolute top-3 right-3 text-gray-400 hover:text-red-500 p-1"><Trash2 size={16} /></button>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-2">
                                        <input className="bg-white p-2.5 rounded border border-gray-200 text-sm font-bold" placeholder="Role / Job Title" value={exp.role} onChange={(e) => updateExp(i, 'role', e.target.value)} />
                                        <input className="bg-white p-2.5 rounded border border-gray-200 text-sm" placeholder="Company Name" value={exp.company} onChange={(e) => updateExp(i, 'company', e.target.value)} />
                                    </div>
                                    <div className="mb-2">
                                        <input className="w-full bg-white p-2.5 rounded border border-gray-200 text-sm" placeholder="Duration (e.g. June 2023 - Aug 2023)" value={exp.duration} onChange={(e) => updateExp(i, 'duration', e.target.value)} />
                                    </div>
                                    <textarea className="w-full bg-white p-2.5 rounded border border-gray-200 text-sm" rows={2} placeholder="Description of responsibilities..." value={exp.desc} onChange={(e) => updateExp(i, 'desc', e.target.value)} />
                                </div>
                            ))}
                        </div>
                    </section>

                    {/* 5. Skills */}
                    <section className="bg-white p-8 rounded-2xl border border-gray-200 shadow-sm">
                        <h2 className="text-xl font-bold mb-6 flex items-center gap-2 text-gray-800 border-b border-gray-100 pb-3"><Briefcase size={22} className="text-orange-500" /> Skills</h2>
                        <div className="flex gap-2 mb-4">
                            <input
                                type="text"
                                className="flex-1 p-3 border border-gray-200 rounded-lg bg-gray-50 focus:bg-white transition-colors"
                                placeholder="Add a skill (e.g. React, Python)"
                                value={newSkill}
                                onChange={(e) => setNewSkill(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && addSkill()}
                            />
                            <button onClick={addSkill} className="bg-gray-800 hover:bg-black text-white px-6 py-2 rounded-lg font-bold transition-colors">Add</button>
                        </div>
                        <div className="flex flex-wrap gap-2">
                            {formData.skills.map((skill, i) => (
                                <span key={i} className="bg-white text-gray-800 px-4 py-1.5 rounded-full text-sm font-medium border border-gray-300 shadow-sm flex items-center gap-2">
                                    {skill}
                                    <button onClick={() => removeSkill(skill)} className="hover:text-red-500"><Trash2 size={14} /></button>
                                </span>
                            ))}
                        </div>
                    </section>

                    {/* 6. Projects */}
                    <section className="bg-white p-8 rounded-2xl border border-gray-200 shadow-sm">
                        <div className="flex justify-between items-center mb-6 border-b border-gray-100 pb-3">
                            <h2 className="text-xl font-bold flex items-center gap-2 text-gray-800">
                                <Briefcase size={22} className="text-indigo-600" /> Key Projects
                            </h2>
                            <button onClick={addProject} className="text-sm bg-indigo-50 text-indigo-700 px-3 py-1.5 rounded-lg font-bold hover:bg-indigo-100 transition-colors flex items-center gap-1">
                                <Plus size={16} /> Add
                            </button>
                        </div>
                        <div className="space-y-4">
                            {formData.projects.map((proj, i) => (
                                <div key={i} className="p-4 bg-gray-50 rounded-xl border border-gray-200 relative group">
                                    <button onClick={() => removeProject(i)} className="absolute top-3 right-3 text-gray-400 hover:text-red-500 p-1"><Trash2 size={16} /></button>
                                    <input className="w-full bg-transparent font-bold text-gray-900 border-none p-0 focus:ring-0 mb-2 placeholder-gray-400 focus:outline-none text-lg" placeholder="Project Title" value={proj.title} onChange={(e) => updateProject(i, 'title', e.target.value)} />
                                    <textarea className="w-full bg-white p-2.5 border border-gray-200 rounded text-sm mb-3 focus:ring-1 focus:ring-indigo-500" placeholder="Description..." rows={2} value={proj.description} onChange={(e) => updateProject(i, 'description', e.target.value)} />
                                    <div className="flex items-center gap-2">
                                        <Github size={16} className="text-gray-400" />
                                        <input className="flex-1 bg-white p-2 border border-gray-200 rounded text-xs" placeholder="Project / Code Link" value={proj.link} onChange={(e) => updateProject(i, 'link', e.target.value)} />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>

                </div>
            )}
        </div>
    );
}
