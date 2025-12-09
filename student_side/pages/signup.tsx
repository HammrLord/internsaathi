import { useState } from 'react';
import { useRouter } from 'next/router';
import { Loader2, User, Mail, Lock, Briefcase, Code } from 'lucide-react';
import Head from 'next/head';
import Link from 'next/link';

export default function Signup() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: ''
    });
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');

    // Password Criteria
    const criteria = [
        { label: 'At least 8 characters', valid: formData.password.length >= 8 },
        { label: 'Contains an uppercase letter', valid: /[A-Z]/.test(formData.password) },
        { label: 'Contains a number', valid: /[0-9]/.test(formData.password) },
        { label: 'Contains a special character', valid: /[^A-Za-z0-9]/.test(formData.password) },
    ];

    const isPasswordValid = criteria.every(c => c.valid);
    const doPasswordsMatch = formData.password === confirmPassword && formData.password !== '';

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (!isPasswordValid) {
            setError('Please meet all password requirements.');
            return;
        }

        if (formData.password !== confirmPassword) {
            setError('Passwords do not match.');
            return;
        }

        setIsLoading(true);

        try {
            const res = await fetch('/api/student/signup', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ...formData,
                    skills: [],
                    projects: ''
                })
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.error || 'Signup failed');
            }

            localStorage.setItem('student_email', formData.email);
            router.push('/dashboard');

        } catch (err: any) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center relative bg-gray-50 overflow-hidden font-sans">
            <Head>
                <title>Student Signup | PM Internship Scheme</title>
            </Head>

            {/* Background & Watermark */}
            <div className="fixed inset-0 z-0">
                <div className="absolute top-0 left-0 w-full h-full bg-[url('/pm_modi_banner.png')] bg-cover bg-center opacity-20" />
                <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-[url('/assets/gov-india-emblem.svg')] bg-no-repeat bg-top-right opacity-5 pointer-events-none" />
            </div>

            {/* Centered Card */}
            <div className="relative z-10 w-full max-w-md p-4">
                <div className="bg-white/80 backdrop-blur-2xl border border-white/50 shadow-2xl rounded-2xl p-8 relative overflow-hidden">

                    {/* Decorative Header Gradient */}
                    <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-primary via-orange-500 to-green-500" />

                    <div className="flex flex-col items-center mb-8">
                        <div className="h-14 w-14 bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl flex items-center justify-center text-white font-bold text-2xl mb-4 shadow-lg shadow-orange-200 ring-4 ring-white/50">
                            S
                        </div>
                        <h2 className="text-3xl font-extrabold text-gray-900 text-center">
                            Create Account
                        </h2>
                        <p className="mt-2 text-sm text-gray-500 text-center">
                            Join the PM Internship Scheme today
                        </p>
                    </div>

                    <form className="space-y-5" onSubmit={handleSubmit}>
                        {/* Name */}
                        <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Full Name</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <User className="h-5 w-5 text-gray-400" />
                                </div>
                                <input
                                    type="text"
                                    required
                                    className="block w-full pl-10 px-4 py-3 bg-white/50 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-transparent transition-all"
                                    placeholder="Rahul Kumar"
                                    value={formData.name}
                                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                                />
                            </div>
                        </div>

                        {/* Email */}
                        <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Email Address</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Mail className="h-5 w-5 text-gray-400" />
                                </div>
                                <input
                                    type="email"
                                    required
                                    className="block w-full pl-10 px-4 py-3 bg-white/50 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-transparent transition-all"
                                    placeholder="rahul@example.com"
                                    value={formData.email}
                                    onChange={e => setFormData({ ...formData, email: e.target.value })}
                                />
                            </div>
                        </div>

                        {/* Password */}
                        <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Password</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Lock className="h-5 w-5 text-gray-400" />
                                </div>
                                <input
                                    type="password"
                                    required
                                    className="block w-full pl-10 px-4 py-3 bg-white/50 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-transparent transition-all"
                                    placeholder="••••••••"
                                    value={formData.password}
                                    onChange={e => setFormData({ ...formData, password: e.target.value })}
                                />
                            </div>
                            {/* Password Requirements List */}
                            <div className="mt-3 grid grid-cols-2 gap-2">
                                {criteria.map((item, index) => (
                                    <div key={index} className={`flex items-center text-[10px] font-medium ${item.valid ? 'text-green-600' : 'text-gray-400'}`}>
                                        <div className={`mr-1.5 h-1.5 w-1.5 rounded-full ${item.valid ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                                        {item.label}
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Confirm Password Field */}
                        <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Confirm Password</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Lock className="h-5 w-5 text-gray-400" />
                                </div>
                                <input
                                    type="password"
                                    required
                                    className={`block w-full pl-10 px-4 py-3 bg-white/50 border rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 transition-all ${formData.password && confirmPassword && formData.password !== confirmPassword ? 'border-red-300 focus:ring-red-200' : 'border-gray-200 focus:ring-primary/50 focus:border-transparent'}`}
                                    placeholder="••••••••"
                                    value={confirmPassword}
                                    onChange={e => setConfirmPassword(e.target.value)}
                                />
                            </div>
                            {formData.password && confirmPassword && formData.password !== confirmPassword && (
                                <p className="mt-1 text-xs text-red-500 font-medium">Passwords do not match</p>
                            )}
                        </div>

                        {error && (
                            <div className="rounded-xl bg-red-50 p-4 border border-red-100 flex items-start gap-3">
                                <div className="flex-shrink-0 w-1 h-full bg-red-400 rounded-full" />
                                <div>
                                    <h3 className="text-sm font-bold text-red-800">Signup Failed</h3>
                                    <div className="text-xs text-red-600 mt-0.5">{error}</div>
                                </div>
                            </div>
                        )}

                        <div>
                            <button
                                type="submit"
                                disabled={isLoading}
                                className="w-full flex justify-center py-3.5 px-4 border border-transparent rounded-xl shadow-lg shadow-orange-500/30 text-sm font-bold text-white bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 disabled:opacity-50 transition-all transform hover:-translate-y-0.5 active:scale-95"
                            >
                                {isLoading && <Loader2 className="animate-spin -ml-1 mr-2 h-4 w-4" />}
                                Register & Find Jobs
                            </button>
                        </div>
                    </form>

                    <div className="mt-8 pt-6 border-t border-gray-100/50 text-center">
                        <p className="text-sm text-gray-500">
                            Already have an account?{' '}
                            <Link href="/login" className="font-bold text-primary hover:text-orange-700 hover:underline transition-colors">
                                Sign in here
                            </Link>
                        </p>
                    </div>
                </div>
                <p className="text-center text-xs text-gray-400 mt-8 font-medium">© 2024 PM Internship Scheme. All rights reserved.</p>
            </div>
        </div>
    );
}
