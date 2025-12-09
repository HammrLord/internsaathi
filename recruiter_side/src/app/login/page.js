'use client';

import { signIn } from 'next-auth/react';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Loader2 } from 'lucide-react';

import AuthSwitchModal from '@/components/AuthSwitchModal';

import ReCAPTCHA from 'react-google-recaptcha';

export default function LoginPage() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [showAuthModal, setShowAuthModal] = useState(false);
    const [recaptchaToken, setRecaptchaToken] = useState(null);
    const [showRecaptcha, setShowRecaptcha] = useState(false);

    const checkEmail = async () => {
        if (!email || !email.includes('@')) return;

        try {
            const res = await fetch('/api/auth/check-email', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email }),
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

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        const res = await signIn('credentials', {
            email,
            password,
            recaptchaToken, // Send token if available
            redirect: false,
        });

        if (res?.error) {
            if (res.error.includes('RECAPTCHA_REQUIRED')) {
                setShowRecaptcha(true);
                setError('Too many failed attempts. Please verify you are human.');
            } else if (res.error.includes('RECAPTCHA_INVALID')) {
                setError('Recaptcha validation failed. Please try again.');
            } else {
                setError('Invalid email or password');
            }
            setIsLoading(false);
            if (recaptchaToken) setRecaptchaToken(null); // Reset token on error
        } else {
            router.push('/dashboard');
        }
    };

    return (
        <div className="min-h-screen flex bg-white font-sans">
            <AuthSwitchModal
                isOpen={showAuthModal}
                type="login"
                email={email}
                onClose={() => setShowAuthModal(false)}
            />
            {/* Left Column - Official Banner */}
            <div className="hidden lg:flex w-1/2 bg-gray-50 items-center justify-center p-12 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-orange-100 to-orange-50 opacity-50" />
                <div className="relative max-w-lg w-full">
                    {/* Using the PM Banner as the main visual */}
                    <img
                        src="/pm_modi_banner.png"
                        alt="PM Internship Scheme"
                        className="w-full h-auto object-contain drop-shadow-2xl rounded-xl"
                    />
                </div>
            </div>

            {/* Right Column - Form */}
            <div className="flex-1 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-20 xl:px-24 bg-white">
                <div className="mx-auto w-full max-w-sm lg:w-96">
                    <div className="flex flex-col items-center lg:items-start">
                        <div className="mx-auto h-16 w-16 relative mb-4 lg:mx-0">
                            <div className="w-16 h-16 bg-gradient-to-br from-orange-400 to-orange-600 rounded-full flex items-center justify-center text-white font-bold text-2xl shadow-md">
                                PM
                            </div>
                        </div>
                        <h2 className="mt-2 text-3xl font-extrabold text-gray-900 tracking-tight text-center lg:text-left">
                            Welcome Back
                        </h2>
                        <p className="mt-2 text-sm text-gray-600 text-center lg:text-left">
                            Sign in to the Recruiter Portal
                        </p>
                    </div>

                    <div className="mt-8">
                        {/* Azure AD Sign Up Button */}
                        <div className="mt-6 mb-6">
                            <button
                                type="button"
                                className="w-full flex items-center justify-center px-4 py-2.5 border border-gray-300 rounded-lg shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 transition-all"
                            >
                                <img
                                    src="/auth-banner.png"
                                    alt="Azure AD"
                                    className="h-5 w-5 mr-3 object-contain"
                                />
                                Sign up with Azure AD
                            </button>
                        </div>

                        <div className="relative mb-6">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-gray-300" />
                            </div>
                            <div className="relative flex justify-center text-sm">
                                <span className="px-2 bg-white text-gray-500">Or continue with email</span>
                            </div>
                        </div>

                        <form className="space-y-6" onSubmit={handleSubmit}>
                            <div className="space-y-4">
                                <div>
                                    <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email address</label>
                                    <input
                                        id="email"
                                        name="email"
                                        type="email"
                                        required
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        onBlur={checkEmail}
                                        className="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-orange-500 focus:border-orange-500 focus:z-10 sm:text-sm transition-all"
                                        placeholder="you@example.com"
                                    />
                                </div>
                                <div>
                                    <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
                                    <input
                                        id="password"
                                        name="password"
                                        type="password"
                                        required
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-orange-500 focus:border-orange-500 focus:z-10 sm:text-sm transition-all"
                                        placeholder="••••••••"
                                    />
                                </div>

                                {showRecaptcha && (
                                    <div className="flex justify-center">
                                        <ReCAPTCHA
                                            sitekey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY || "6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI"} // Placeholder
                                            onChange={(token) => setRecaptchaToken(token)}
                                        />
                                    </div>
                                )}
                            </div>

                            {error && (
                                <div className="text-red-500 text-sm text-center bg-red-50 p-2 rounded-md border border-red-100 animate-pulse">
                                    {error}
                                </div>
                            )}

                            <button
                                type="submit"
                                disabled={isLoading || (showRecaptcha && !recaptchaToken)}
                                className="group relative w-full flex justify-center py-2.5 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-orange-600 hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 shadow-md transition-all hover:shadow-lg disabled:opacity-70 disabled:cursor-not-allowed transform hover:-translate-y-0.5"
                            >
                                {isLoading && <Loader2 size={18} className="animate-spin mr-2" />}
                                {isLoading ? 'Signing in...' : 'Sign in'}
                            </button>
                        </form>

                        <div className="mt-6 text-center lg:text-left border-t border-gray-100 pt-6">
                            <p className="text-sm text-gray-600">
                                Don't have an account?{' '}
                                <Link href="/signup" className="font-medium text-orange-600 hover:text-orange-500 hover:underline transition-all">
                                    Create one here
                                </Link>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
