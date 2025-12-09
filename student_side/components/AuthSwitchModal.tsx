
import React from 'react';
import { useRouter } from 'next/router';

interface AuthSwitchModalProps {
    isOpen: boolean;
    type: 'login' | 'signup';
    email: string;
    onClose: () => void;
}

export default function AuthSwitchModal({ isOpen, type, email, onClose }: AuthSwitchModalProps) {
    const router = useRouter();

    if (!isOpen) return null;

    const isLogin = type === 'login'; // Current page is Login, prompting to Signup
    const targetPath = isLogin ? '/signup' : '/login';
    const actionText = isLogin ? 'Create an Account' : 'Sign In';
    const message = isLogin
        ? `We couldn't find an account with ${email}. Would you like to create one?`
        : `An account with ${email} already exists. Would you like to sign in instead?`;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-200">
            <div className="bg-white rounded-xl shadow-2xl max-w-sm w-full p-6 transform transition-all scale-100">
                <div className="text-center">
                    <div className={`mx-auto flex items-center justify-center h-12 w-12 rounded-full mb-4 ${isLogin ? 'bg-blue-100' : 'bg-orange-100'}`}>
                        {isLogin ? (
                            <svg className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                            </svg>
                        ) : (
                            <svg className="h-6 w-6 text-orange-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                            </svg>
                        )}
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                        {isLogin ? 'No Account Found' : 'Account Exists'}
                    </h3>
                    <p className="text-sm text-gray-500 mb-6">
                        {message}
                    </p>
                    <div className="flex gap-3">
                        <button
                            onClick={onClose}
                            className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={() => router.push(targetPath)}
                            className={`flex-1 px-4 py-2 text-white text-sm font-medium rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 transition-colors ${isLogin
                                    ? 'bg-blue-600 hover:bg-blue-700 focus:ring-blue-500'
                                    : 'bg-orange-600 hover:bg-orange-700 focus:ring-orange-500'
                                }`}
                        >
                            {actionText}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
