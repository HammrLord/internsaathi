import { useState } from 'react';
import { useRouter } from 'next/router';
import { Loader2, Mail, Lock, AlertTriangle } from 'lucide-react';
import Head from 'next/head';
import Link from 'next/link';
import AuthSwitchModal from '../components/AuthSwitchModal';
import ReCAPTCHA from 'react-google-recaptcha';

export default function Login() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });
    const [error, setError] = useState('');
    const [showAuthModal, setShowAuthModal] = useState(false);
    const [recaptchaToken, setRecaptchaToken] = useState<string | null>(null);
    const [showRecaptcha, setShowRecaptcha] = useState(false);

    const checkEmail = async () => {
        if (!formData.email || !formData.email.includes('@')) return;

        try {
            // Use the proxy route to hit recruiter_side API
            const res = await fetch('/api/auth/check-email', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: formData.email }),
            });
            const data = await res.json();

            // If on Login page and user DOES NOT exist -> Prompt to Signup
            if (!data.exists) {
                setShowAuthModal(true);
            }
        } catch (error) {
            console.error('Email check failed:', error);
        }
    };

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        try {
            const res = await fetch('/api/student/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    email: formData.email,
                    password: formData.password,
                    recaptchaToken // Send token if available
                })
            });

            const data = await res.json();

            if (!res.ok) {
                if (data.error === 'RECAPTCHA_REQUIRED') {
                    setShowRecaptcha(true);
                    setError('Too many failed attempts. Please verify you are human.');
                    return;
                } else if (data.error === 'RECAPTCHA_INVALID') {
                    setError('Recaptcha validation failed. Please try again.');
                    return;
                }
                setError(data.error || 'Login failed');
                return;
            }

            // Enhanced Debug logging
            console.log('Login successful:', data);

            // Store user info and token if present
            localStorage.setItem('student_email', formData.email);
            if (data.token) {
                localStorage.setItem('token', data.token);
            }
            if (data.user) {
                localStorage.setItem('user', JSON.stringify(data.user));
            }

            // Redirect
            router.push('/dashboard');

        } catch (err: any) {
            console.error('Login error:', err);
            setError(err.message);
            if (recaptchaToken) setRecaptchaToken(null); // Reset token on error
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center relative bg-gray-50 overflow-hidden font-sans">
            <AuthSwitchModal
                isOpen={showAuthModal}
                type="login"
                email={formData.email}
                onClose={() => setShowAuthModal(false)}
            />
            <Head>
                <title>Student Login | PM Internship Scheme</title>
            </Head>

            {/* Background & Watermark */}
            <div className="fixed inset-0 z-0">
                <div className="absolute top-0 left-0 w-full h-full bg-[url('/pm_modi_banner.png')] bg-cover bg-center opacity-20" />
                <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-[url('/assets/gov-india-emblem.svg')] bg-no-repeat bg-top-right opacity-5 pointer-events-none" />
            </div>

            {/* Centered Card */}
            <div className="relative z-10 w-full max-w-sm p-4">
                <div className="bg-white/80 backdrop-blur-2xl border border-white/50 shadow-2xl rounded-2xl p-8 relative overflow-hidden">

                    {/* Decorative Header Gradient */}
                    <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-primary via-orange-500 to-green-500" />

                    <div className="flex flex-col items-center mb-8">
                        <div className="h-14 w-14 bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl flex items-center justify-center text-white font-bold text-2xl mb-4 shadow-lg shadow-orange-200 ring-4 ring-white/50">
                            S
                        </div>
                        <h2 className="text-3xl font-extrabold text-gray-900 text-center">
                            Welcome Back
                        </h2>
                        <p className="mt-2 text-sm text-gray-500 text-center">
                            Sign in to access your dashboard
                        </p>
                    </div>

                    <form className="space-y-6" onSubmit={handleLogin}>
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
                                    onBlur={checkEmail}
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
                        </div>

                        {showRecaptcha && (
                            <div className="flex justify-center my-4 scale-90 origin-center">
                                <ReCAPTCHA
                                    sitekey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY || "6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI"} // Placeholder
                                    onChange={(token: string | null) => setRecaptchaToken(token)}
                                />
                            </div>
                        )}

                        {error && (
                            <div className="rounded-xl bg-red-50 p-4 border border-red-100 flex items-start gap-3 animate-pulse">
                                <AlertTriangle className="h-5 w-5 text-red-500 flex-shrink-0 mt-0.5" />
                                <div>
                                    <h3 className="text-sm font-bold text-red-800">Login Failed</h3>
                                    <div className="text-xs text-red-600 mt-0.5">{error}</div>
                                </div>
                            </div>
                        )}

                        <div>
                            <button
                                type="submit"
                                disabled={isLoading || (showRecaptcha && !recaptchaToken)}
                                className="w-full flex justify-center py-3.5 px-4 border border-transparent rounded-xl shadow-lg shadow-orange-500/30 text-sm font-bold text-white bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 disabled:opacity-50 transition-all transform hover:-translate-y-0.5 active:scale-95"
                            >
                                {isLoading && <Loader2 className="animate-spin -ml-1 mr-2 h-4 w-4" />}
                                Sign In
                            </button>
                        </div>
                    </form>

                    <div className="mt-8 pt-6 border-t border-gray-100/50 text-center">
                        <p className="text-sm text-gray-500">
                            Don't have an account?{' '}
                            <Link href="/signup" className="font-bold text-primary hover:text-orange-700 hover:underline transition-colors">
                                Create one here
                            </Link>
                        </p>
                    </div>
                </div>
                <p className="text-center text-xs text-gray-400 mt-8 font-medium">© 2024 PM Internship Scheme. All rights reserved.</p>
            </div>
        </div>
    );
}
