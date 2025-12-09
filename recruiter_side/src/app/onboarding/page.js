'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';

export default function OnboardingPage() {
    const { data: session, update } = useSession();
    const router = useRouter();
    const [formData, setFormData] = useState({
        companyName: '',
        phone: ''
    });
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const res = await fetch('/api/user/profile', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });

            if (res.ok) {
                // Force session update to reflect onboarding_completed = true
                await update({ onboarding_completed: true });
                router.push('/dashboard');
                // Hard reload to ensure all state is fresh
                window.location.href = '/dashboard';
            } else {
                alert('Failed to update profile');
            }
        } catch (error) {
            console.error(error);
            alert('Error updating profile');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
            <div className="sm:mx-auto sm:w-full sm:max-w-md">
                <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
                    Complete your profile
                </h2>
                <p className="mt-2 text-center text-sm text-gray-600">
                    Please provide your company details to continue
                </p>
            </div>

            <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
                <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
                    <form className="space-y-6" onSubmit={handleSubmit}>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">
                                Full Name
                            </label>
                            <div className="mt-1">
                                <input
                                    type="text"
                                    disabled
                                    value={session?.user?.name || ''}
                                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none bg-gray-100 text-gray-500 sm:text-sm"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700">
                                Email
                            </label>
                            <div className="mt-1">
                                <input
                                    type="email"
                                    disabled
                                    value={session?.user?.email || ''}
                                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none bg-gray-100 text-gray-500 sm:text-sm"
                                />
                            </div>
                        </div>

                        <div>
                            <label htmlFor="companyName" className="block text-sm font-medium text-gray-700">
                                Company Name
                            </label>
                            <div className="mt-1">
                                <input
                                    id="companyName"
                                    name="companyName"
                                    type="text"
                                    required
                                    value={formData.companyName}
                                    onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-orange-500 focus:border-orange-500 sm:text-sm text-gray-900"
                                />
                            </div>
                        </div>

                        <div>
                            <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                                Phone Number
                            </label>
                            <div className="mt-1">
                                <input
                                    id="phone"
                                    name="phone"
                                    type="tel"
                                    required
                                    value={formData.phone}
                                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-orange-500 focus:border-orange-500 sm:text-sm text-gray-900"
                                />
                            </div>
                        </div>

                        <div>
                            <button
                                type="submit"
                                disabled={isLoading}
                                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-orange-600 hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 disabled:opacity-50"
                            >
                                {isLoading ? 'Saving...' : 'Complete Setup'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
