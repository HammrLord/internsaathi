'use client';

import { Search, Bell, Menu, X, Check, Mail } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useNotifications } from '@/context/NotificationsContext';
import { useState, useRef, useEffect } from 'react';

export default function Header({ onMenuClick }) {
  const { user } = useAuth();
  const { notifications, unreadCount, markAsRead, markAllAsRead, clearNotification } = useNotifications();
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const notificationRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (notificationRef.current && !notificationRef.current.contains(event.target)) {
        setIsNotificationsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-4 md:px-8 sticky top-0 z-40">
      <div className="flex items-center flex-1">
        <button
          onClick={onMenuClick}
          className="mr-4 p-2 text-gray-600 hover:bg-gray-100 rounded-lg md:hidden"
        >
          <Menu size={24} />
        </button>

        {/* Mobile Logo (visible only on mobile) */}
        <div className="flex items-center gap-2 md:hidden">
          <img src="/assets/gov-india-emblem.png" alt="Government of India" height={24} width={24} className="object-contain" />
          <span className="font-semibold text-sm text-gray-900">PM Internship</span>
        </div>

        {/* Desktop Logos (moved to left) */}
        <div className="hidden md:flex items-center gap-6 ml-4">
          <img src="/assets/mca-logo.png" alt="Ministry of Corporate Affairs" className="h-12 w-auto object-contain" />
          <div className="w-px h-8 bg-gray-300"></div>
          <img src="/assets/pm-internship-logo.png" alt="PM Internship Scheme" className="h-12 w-auto object-contain" />
          <div className="w-px h-8 bg-gray-300"></div>
          <img src="/assets/gov-india-emblem.png" alt="Government of India" className="h-12 w-auto object-contain" />
          <div className="w-px h-8 bg-gray-300"></div>
          <div className="flex flex-col">
            <span className="font-bold text-gray-900 text-lg leading-tight">PM Internship Scheme</span>
            <span className="text-xs text-gray-500 font-medium">Recruiter Portal</span>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-end flex-1 gap-4 md:gap-6">

        <a
          href="/email-templates"
          className="hidden md:flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-gray-600 hover:text-primary hover:bg-orange-50 rounded-lg transition-colors"
        >
          <Mail size={18} />
          <span>Templates</span>
        </a>


        <div className="relative" ref={notificationRef}>
          <button
            onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
            className="relative p-2 text-gray-500 hover:bg-gray-100 hover:text-primary rounded-full transition-colors"
          >
            <Bell size={20} />
            {unreadCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
            )}
          </button>

          {isNotificationsOpen && (
            <div className="absolute right-0 mt-2 w-80 bg-white border border-gray-200 rounded-lg shadow-xl z-50 overflow-hidden">
              <div className="p-3 border-b border-gray-100 flex justify-between items-center bg-gray-50">
                <h3 className="font-semibold text-gray-900">Notifications</h3>
                {unreadCount > 0 && (
                  <button
                    onClick={markAllAsRead}
                    className="text-xs text-primary hover:text-orange-700 font-medium"
                  >
                    Mark all read
                  </button>
                )}
              </div>
              <div className="max-h-96 overflow-y-auto">
                {notifications.length > 0 ? (
                  notifications.map(notification => (
                    <div
                      key={notification.id}
                      className={`p-4 border-b border-gray-50 hover:bg-gray-50 transition-colors relative group ${!notification.read ? 'bg-orange-50/30' : ''}`}
                    >
                      <div className="flex justify-between items-start gap-3">
                        <div onClick={() => markAsRead(notification.id)} className="cursor-pointer flex-1">
                          <h4 className={`text-sm font-medium mb-1 ${!notification.read ? 'text-gray-900' : 'text-gray-600'}`}>
                            {notification.title}
                          </h4>
                          <p className="text-xs text-gray-500 mb-1">{notification.message}</p>
                          <span className="text-[10px] text-gray-400">{notification.time}</span>
                        </div>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            clearNotification(notification.id);
                          }}
                          className="text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <X size={14} />
                        </button>
                      </div>
                      {!notification.read && (
                        <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary"></div>
                      )}
                    </div>
                  ))
                ) : (
                  <div className="p-8 text-center text-gray-500">
                    <p className="text-sm">No notifications</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        <div className="flex items-center gap-3 pl-4 border-l border-gray-200">
          <div className="w-9 h-9 bg-chakra text-white rounded-full flex items-center justify-center font-semibold text-sm">
            {user ? user.name.charAt(0) : 'R'}
          </div>
          <div className="hidden md:flex flex-col">
            <span className="text-sm font-semibold text-gray-900">{user ? user.name : 'Recruiter Admin'}</span>
            <span className="text-xs text-gray-500 capitalize">{user ? user.role : 'Admin'}</span>
          </div>
        </div>
      </div>
    </header>
  );
}
