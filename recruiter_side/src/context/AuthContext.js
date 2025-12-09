'use client';

import { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession, signOut } from 'next-auth/react';

const AuthContext = createContext();

export function AuthProvider({ children }) {
    const { data: session, status } = useSession();
    const [user, setUser] = useState(null);
    const router = useRouter();

    useEffect(() => {
        if (status === 'authenticated' && session?.user) {
            setUser({
                ...session.user,
                role: 'admin' // Default role for now
            });
        } else if (status === 'unauthenticated') {
            setUser(null);
        }
    }, [session, status]);

    const login = () => {
        // Redirect to login page which handles Google Sign-In
        router.push('/login');
    };

    const logout = async () => {
        await signOut({ callbackUrl: '/login' });
    };

    return (
        <AuthContext.Provider value={{ user, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    return useContext(AuthContext);
}
