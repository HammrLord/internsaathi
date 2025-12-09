'use client';

import Link from 'next/link';
import { Calendar, Clock, Video, CheckCircle, MoreVertical, Plus, Trash2 } from 'lucide-react';
import { useInterviews } from '@/context/InterviewsContext';
import { useState } from 'react';
import ScheduleModal from '@/components/ScheduleModal';

export default function InterviewsPage() {
  const { interviews, deleteInterview } = useInterviews();
  const [isScheduleModalOpen, setIsScheduleModalOpen] = useState(false);

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Interviews</h1>
          <p className="text-gray-500 mt-1">Schedule and manage candidate interviews.</p>
        </div>
        <button
          onClick={() => setIsScheduleModalOpen(true)}
          className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-primary hover:bg-orange-600 text-white rounded-lg font-medium transition-colors"
        >
          <Plus size={20} />
          Schedule Interview
        </button>
      </div>

      <div className="grid gap-4">
        {interviews.map((interview) => (
          <div key={interview.id} className="bg-white border border-gray-200 rounded-lg p-6 hover:border-primary transition-colors shadow-sm">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="flex-1">
                <div className="flex items-center gap-4 mb-4 md:mb-0">
                  <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center text-lg font-bold text-primary shrink-0">
                    {interview.candidate.charAt(0)}
                  </div>
                  <div>
                    <Link href={`/candidates/${interview.id}`} className="text-lg font-semibold text-gray-900 hover:text-primary transition-colors">
                      {interview.candidate}
                    </Link>
                    <p className="text-gray-500 text-sm">{interview.role}</p>
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-6 md:gap-12 text-sm text-gray-500">
                <div className="flex items-center gap-2">
                  <Calendar size={18} className="text-gray-400" />
                  <span>{interview.date}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock size={18} className="text-gray-400" />
                  <span>{interview.duration}</span>
                </div>
              </div>

              <div className="flex items-center gap-4 justify-end min-w-[200px]">
                {interview.status === 'Completed' ? (
                  <div className="flex items-center gap-4">
                    <div className="flex flex-col items-end">
                      <span className="text-xl font-bold text-green-600 leading-none">{interview.score}</span>
                      <span className="text-[10px] uppercase tracking-wider text-gray-400">AI Score</span>
                    </div>
                    <Link href={`/interviews/${interview.id}`} className="px-3 py-1.5 border border-gray-200 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
                      View Report
                    </Link>
                  </div>
                ) : (
                  <div className="flex items-center gap-3">
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-50 text-indigo-700 border border-indigo-100">
                      Scheduled
                    </span>
                    <button className="px-3 py-1.5 border border-gray-200 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
                      Reschedule
                    </button>
                  </div>
                )}
                <button
                  onClick={() => deleteInterview(interview.id)}
                  className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  title="Delete Interview"
                >
                  <Trash2 size={20} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <ScheduleModal
        isOpen={isScheduleModalOpen}
        onClose={() => setIsScheduleModalOpen(false)}
      />
    </div>
  );
}
