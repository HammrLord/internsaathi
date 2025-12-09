'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Loader2 } from 'lucide-react';
import { signIn } from 'next-auth/react';

export default function SignupPage() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    // Password Criteria
    const criteria = [
        { label: 'At least 8 characters', valid: password.length >= 8 },
        { label: 'Contains an uppercase letter', valid: /[A-Z]/.test(password) },
        { label: 'Contains a number', valid: /[0-9]/.test(password) },
        { label: 'Contains a special character', valid: /[^A-Za-z0-9]/.test(password) },
    ];

    const isPasswordValid = criteria.every(c => c.valid);
    const doPasswordsMatch = password === confirmPassword && password !== '';

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (!isPasswordValid) {
            setError('Please meet all password requirements.');
            return;
        }

        if (password !== confirmPassword) {
            setError('Passwords do not match.');
            return;
        }

        setIsLoading(true);

        try {
            // 1. Create User
            const res = await fetch('/api/auth/signup', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password }),
            });

            if (!res.ok) {
                const data = await res.json();
                throw new Error(data.error || 'Signup failed');
            }

            // 2. Auto Login
            await signIn('credentials', {
                email,
                password,
                callbackUrl: '/dashboard',
            });

        } catch (err) {
            setError(err.message);
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
            <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-xl shadow-lg animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="text-center">
                    <div className="mx-auto h-16 w-16 relative mb-4">
                        <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-700 rounded-full flex items-center justify-center text-white font-bold text-2xl shadow-md">
                            New
                        </div>
                    </div>
                    <h2 className="mt-2 text-3xl font-extrabold text-gray-900 tracking-tight">
                        Create an Account
                    </h2>
                    <p className="mt-2 text-sm text-gray-600">
                        Join the PM Internship Platform
                    </p>
                </div>

                <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
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
                                className="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm transition-all"
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
                                className="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm transition-all"
                                placeholder="••••••••"
                            />
                            {/* Password Requirements List */}
                            <div className="mt-2 space-y-1">
                                {criteria.map((item, index) => (
                                    <div key={index} className={`flex items-center text-xs ${item.valid ? 'text-green-600' : 'text-red-500'}`}>
                                        <span className={`mr-2 h-1.5 w-1.5 rounded-full ${item.valid ? 'bg-green-600' : 'bg-red-500'}`}></span>
                                        {item.label}
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Confirm Password Field */}
                        <div>
                            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">Confirm Password</label>
                            <input
                                id="confirmPassword"
                                name="confirmPassword"
                                type="password"
                                required
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                className={`mt-1 appearance-none relative block w-full px-3 py-2 border ${password && confirmPassword && password !== confirmPassword ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500'} placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:z-10 sm:text-sm transition-all`}
                                placeholder="••••••••"
                            />
                            {password && confirmPassword && password !== confirmPassword && (
                                <p className="mt-1 text-xs text-red-500">Passwords do not match</p>
                            )}
                        </div>
                    </div>

                    {error && (
                        <div className="text-red-500 text-sm text-center bg-red-50 p-2 rounded-md border border-red-100 animate-pulse">
                            {error}
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={isLoading || !isPasswordValid || password !== confirmPassword}
                        className="group relative w-full flex justify-center py-2.5 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 shadow-md transition-all hover:shadow-lg disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                        {isLoading && <Loader2 size={18} className="animate-spin mr-2" />}
                        {isLoading ? 'Creating Account...' : 'Sign Up'}
                    </button>
                </form>

                <div className="mt-6 text-center">
                    <p className="text-sm text-gray-600">
                        Already have an account?{' '}
                        <Link href="/login" className="font-medium text-blue-600 hover:text-blue-500 hover:underline transition-all">
                            Sign in here
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
