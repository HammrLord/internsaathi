'use client';

import { useState, useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import Sidebar from './Sidebar';
import TopBar from './TopBar';
import Header from './Header';

export default function AppLayout({ children }) {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const { data: session, status } = useSession();
    const pathname = usePathname();
    const router = useRouter();

    const isAuthPage = pathname === '/login' || pathname === '/onboarding' || pathname === '/';

    // Onboarding redirect removed as per request
    useEffect(() => {
        // No-op
    }, []);

    if (isAuthPage) {
        return <main className="min-h-screen bg-gray-50">{children}</main>;
    }

    return (
        <div className="flex min-h-screen bg-gray-50">
            <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

            {/* Mobile overlay */}
            {sidebarOpen && (
                <div
                    className="fixed inset-0 z-40 bg-black bg-opacity-50 md:hidden"
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            <div className="flex-1 flex flex-col md:ml-64 transition-all duration-300">
                <div className="sticky top-0 z-50">
                    <TopBar />
                    <Header onMenuClick={() => setSidebarOpen(true)} />
                </div>
                <main className="flex-1 overflow-y-auto">
                    {children}
                </main>
            </div>
        </div>
    );
}
