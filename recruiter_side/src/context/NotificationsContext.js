'use client';

import { createContext, useContext, useState, useEffect } from 'react';

const NotificationsContext = createContext();

export function NotificationsProvider({ children }) {
    const [notifications, setNotifications] = useState([
        {
            id: 1,
            title: 'New Candidate Application',
            message: 'Rahul Sharma applied for Product Analyst.',
            time: '10 mins ago',
            read: false,
            type: 'info'
        },
        {
            id: 2,
            title: 'Interview Scheduled',
            message: 'Interview with Priya Patel confirmed for 4:30 PM.',
            time: '1 hour ago',
            read: false,
            type: 'success'
        },
        {
            id: 3,
            title: 'System Update',
            message: 'Platform maintenance scheduled for tonight.',
            time: '5 hours ago',
            read: true,
            type: 'warning'
        }
    ]);

    const unreadCount = notifications.filter(n => !n.read).length;

    const markAsRead = (id) => {
        setNotifications(prev => prev.map(n =>
            n.id === id ? { ...n, read: true } : n
        ));
    };

    const markAllAsRead = () => {
        setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    };

    const addNotification = (notification) => {
        const newNotification = {
            id: Date.now(),
            read: false,
            time: 'Just now',
            ...notification
        };
        setNotifications(prev => [newNotification, ...prev]);
    };

    const clearNotification = (id) => {
        setNotifications(prev => prev.filter(n => n.id !== id));
    };

    return (
        <NotificationsContext.Provider value={{
            notifications,
            unreadCount,
            markAsRead,
            markAllAsRead,
            addNotification,
            clearNotification
        }}>
            {children}
        </NotificationsContext.Provider>
    );
}

export function useNotifications() {
    const context = useContext(NotificationsContext);
    if (!context) {
        throw new Error('useNotifications must be used within a NotificationsProvider');
    }
    return context;
}
