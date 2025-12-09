'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Briefcase, Users, Video, Settings, LogOut } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

const menuItems = [
  { name: 'Dashboard', icon: LayoutDashboard, path: '/dashboard' },
  { name: 'Jobs', icon: Briefcase, path: '/jobs' },
  { name: 'Candidates', icon: Users, path: '/candidates' },
  { name: 'Interviews', icon: Video, path: '/interviews' },
  { name: 'Settings', icon: Settings, path: '/settings' },
];



export default function Sidebar({ isOpen, onClose }) {
  const pathname = usePathname();
  const { logout } = useAuth();

  return (
    <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-gray-200 transform transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : '-translate-x-full'
      } md:translate-x-0 md:flex md:flex-col`}>
      <div className="flex items-center gap-3 px-6 py-6 mb-6">
        <div className="flex items-center justify-center w-8 h-8">
          {/* Placeholder for Gov Emblem */}
          <img src="/assets/gov-india-emblem.svg" alt="Government of India Emblem" width={28} height={28} />
        </div>
        <div className="flex flex-col">
          <div className="text-base font-bold text-gray-900 leading-tight">PM Internship</div>
          <div className="text-xs font-medium text-gray-500">Recruiter Portal</div>
        </div>
        {/* Close button for mobile */}
        <button onClick={onClose} className="ml-auto md:hidden text-gray-500">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <nav className="flex-1 flex flex-col gap-2 px-4">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.path;

          return (
            <Link
              key={item.path}
              href={item.path}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${isActive
                ? 'bg-orange-50 text-primary border-l-4 border-primary'
                : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }`}
            >
              <Icon size={20} />
              <span>{item.name}</span>
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-gray-200 mt-auto">
        <button
          onClick={logout}
          className="flex items-center gap-3 px-4 py-3 w-full rounded-lg text-sm font-medium text-red-600 hover:bg-red-50 transition-colors"
        >
          <LogOut size={20} />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
}
