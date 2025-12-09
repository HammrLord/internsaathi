'use client';

import { createContext, useContext, useState, useEffect } from 'react';

const InterviewsContext = createContext();

export function InterviewsProvider({ children }) {
    const [interviews, setInterviews] = useState([
        {
            id: 1,
            candidate: 'Rahul Sharma',
            role: 'Product Analyst',
            date: 'Today, 2:00 PM',
            status: 'Completed',
            score: 92,
            duration: '45m'
        },
        {
            id: 2,
            candidate: 'Priya Patel',
            role: 'UX Researcher',
            date: 'Today, 4:30 PM',
            status: 'Scheduled',
            score: null,
            duration: '30m'
        },
        {
            id: 3,
            candidate: 'Amit Kumar',
            role: 'Data Analyst',
            date: 'Tomorrow, 11:00 AM',
            status: 'Scheduled',
            score: null,
            duration: '45m'
        }
    ]);

    // Load from localStorage on mount
    useEffect(() => {
        const savedInterviews = localStorage.getItem('interviews');
        if (savedInterviews) {
            setInterviews(JSON.parse(savedInterviews));
        }
    }, []);

    // Save to localStorage whenever interviews change
    useEffect(() => {
        localStorage.setItem('interviews', JSON.stringify(interviews));
    }, [interviews]);

    const addInterview = (newInterview) => {
        const interviewWithId = {
            ...newInterview,
            id: interviews.length > 0 ? Math.max(...interviews.map(i => i.id)) + 1 : 1,
            status: 'Scheduled',
            score: null
        };
        setInterviews(prev => [interviewWithId, ...prev]);
    };

    const deleteInterview = (id) => {
        setInterviews(prev => prev.filter(interview => interview.id !== id));
    };

    return (
        <InterviewsContext.Provider value={{ interviews, addInterview, deleteInterview }}>
            {children}
        </InterviewsContext.Provider>
    );
}

export function useInterviews() {
    const context = useContext(InterviewsContext);
    if (!context) {
        throw new Error('useInterviews must be used within an InterviewsProvider');
    }
    return context;
}
