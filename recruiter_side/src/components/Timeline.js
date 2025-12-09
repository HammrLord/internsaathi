'use client';

import { CheckCircle, Mail, Calendar, FileText, User, AlertCircle } from 'lucide-react';

export default function Timeline({ events }) {
  const getIcon = (type) => {
    switch (type) {
      case 'application': return <FileText size={16} />;
      case 'email': return <Mail size={16} />;
      case 'interview': return <Calendar size={16} />;
      case 'ai_interview': return <User size={16} />;
      case 'status_change': return <CheckCircle size={16} />;
      case 'alert': return <AlertCircle size={16} />;
      default: return <CheckCircle size={16} />;
    }
  };

  const getColorClass = (type) => {
    switch (type) {
      case 'application': return 'bg-primary border-primary';
      case 'email': return 'bg-blue-500 border-blue-500';
      case 'interview': return 'bg-purple-500 border-purple-500';
      case 'ai_interview': return 'bg-indigo-500 border-indigo-500';
      case 'status_change': return 'bg-green-500 border-green-500';
      case 'alert': return 'bg-red-500 border-red-500';
      default: return 'bg-gray-500 border-gray-500';
    }
  };

  return (
    <div className="relative pl-4 space-y-6 before:content-[''] before:absolute before:left-[23px] before:top-0 before:bottom-0 before:w-0.5 before:bg-gray-200">
      {events.map((event, index) => (
        <div key={index} className="relative flex gap-4 z-10">
          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white shrink-0 border-4 border-white shadow-sm ${getColorClass(event.type)}`}>
            {getIcon(event.type)}
          </div>
          <div className="flex-1 bg-gray-50 p-4 rounded-lg border border-gray-200">
            <div className="flex justify-between items-start mb-1">
              <span className="font-semibold text-sm text-gray-900">{event.title}</span>
              <span className="text-xs text-gray-500">{event.date}</span>
            </div>
            <p className="text-sm text-gray-600">{event.description}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
