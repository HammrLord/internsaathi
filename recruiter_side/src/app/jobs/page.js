'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { Plus, MapPin, Clock, Users, MoreVertical, Search, Filter, Trash2 } from 'lucide-react';
import JobDetailsPanel from '@/components/JobDetailsPanel';
import JobEditModal from '@/components/JobEditModal';

import { useJobs } from '@/context/JobsContext';

export default function JobsPage() {
  const { jobs, deleteJob } = useJobs();
  const [jobsList, setJobsList] = useState(jobs);
  const [searchQuery, setSearchQuery] = useState('');

  // Sync local state with context if needed, or just use context directly.
  // Since the original code uses local state for filtering/updates (maybe), let's keep it but initialize from context.
  // However, if we want global updates to reflect here, we should probably rely on context or sync it.
  // For simplicity, let's just use the jobs from context directly for rendering, or update the local state when context changes.

  useEffect(() => {
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      const filtered = jobs.filter(job =>
        job.title.toLowerCase().includes(query) ||
        job.location.toLowerCase().includes(query) ||
        job.description.toLowerCase().includes(query)
      );
      setJobsList(filtered);
    } else {
      setJobsList(jobs);
    }
  }, [jobs, searchQuery]);

  const [selectedJob, setSelectedJob] = useState(null);
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [jobToEdit, setJobToEdit] = useState(null);

  const handleDeleteJob = (id) => {
    if (confirm('Are you sure you want to delete this job?')) {
      deleteJob(id);
    }
  };

  const handleViewDetails = (job) => {
    setSelectedJob(job);
    setIsPanelOpen(true);
  };

  const handleEditJob = (job) => {
    setJobToEdit(job);
    setIsEditModalOpen(true);
    // If panel is open, we can keep it open or close it. Let's keep it open but maybe modal on top?
    // Or close panel when editing.
    // Let's close panel for better UX on mobile.
    setIsPanelOpen(false);
  };

  const handleSaveJob = (updatedJob) => {
    setJobsList(prev => prev.map(j => j.id === updatedJob.id ? updatedJob : j));
    if (selectedJob && selectedJob.id === updatedJob.id) {
      setSelectedJob(updatedJob);
    }
    setIsEditModalOpen(false);
    // Re-open panel if it was the selected job? Maybe just show success toast.
    // For now, let's just update the list.
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Job Postings</h1>
          <p className="text-gray-500 mt-1">Manage your internship openings and applications.</p>
        </div>
        <Link
          href="/jobs/new"
          className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-primary hover:bg-orange-600 text-white rounded-lg font-medium transition-colors"
        >
          <Plus size={20} />
          Post New Job
        </Link>
      </div>

      {/* Filters & Search (Optional enhancement) */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input
            type="text"
            placeholder="Search jobs..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-gray-900"
          />
        </div>

      </div>

      {/* Jobs List */}
      <div className="grid gap-4">
        {jobsList.map((job) => (
          <div key={job.id} className="bg-white border border-gray-200 rounded-lg p-6 hover:border-primary transition-colors shadow-sm">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
              {/* Job Info */}
              <div className="flex-2">
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="text-lg font-semibold text-gray-900">{job.title}</h3>
                  <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${job.status === 'Active'
                    ? 'bg-green-100 text-green-800'
                    : 'bg-gray-100 text-gray-800'
                    }`}>
                    {job.status}
                  </span>
                  <span className="text-xs text-gray-500 font-medium">
                    ID: {job.id}
                  </span>
                </div>
                <div className="flex items-center gap-4 text-sm text-gray-500">
                  <span className="flex items-center gap-1.5">
                    <MapPin size={16} /> {job.location}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Clock size={16} /> {job.posted}
                  </span>
                </div>
              </div>

              {/* Stats */}
              <div className="flex items-center gap-8 border-t md:border-t-0 md:border-l border-gray-100 pt-4 md:pt-0 md:pl-8">
                <div className="flex flex-col items-start w-32">
                  <Link href={`/jobs/${job.id}`} className="group flex items-center gap-2 hover:opacity-80 transition-opacity">
                    <Users size={18} className="text-primary group-hover:text-orange-700" />
                    <span className="text-xl font-bold text-gray-900 group-hover:text-primary">{job.applicants_count || job.applicants || 0}</span>
                    <span className="text-sm text-gray-500 uppercase tracking-wide group-hover:text-gray-700">Applicants</span>
                  </Link>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-3 justify-end md:w-auto">
                <Link
                  href={`/jobs/${job.id}`}
                  className="px-4 py-2 border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 hover:border-gray-300 transition-colors"
                >
                  View Details
                </Link>
                <button
                  onClick={() => handleEditJob(job)}
                  className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded-lg"
                  title="Edit Job"
                >
                  <MoreVertical size={20} />
                </button>
                <button
                  onClick={() => handleDeleteJob(job.id)}
                  className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg"
                  title="Delete Job"
                >
                  <Trash2 size={20} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Job Details Slide-over */}
      <JobDetailsPanel
        job={selectedJob}
        isOpen={isPanelOpen}
        onClose={() => setIsPanelOpen(false)}
        onEdit={handleEditJob}
      />

      {/* Job Edit Modal */}
      <JobEditModal
        job={jobToEdit}
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onSave={handleSaveJob}
      />
    </div>
  );
}
