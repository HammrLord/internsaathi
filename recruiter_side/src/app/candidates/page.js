'use client';

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Filter, Search, MapPin, GraduationCap, Star, ChevronRight } from 'lucide-react';
import { Suspense, useState } from 'react';

import { candidates } from '@/data/candidates';

function CandidatesContent() {
  const searchParams = useSearchParams();
  const statusFilter = searchParams.get('status');
  const jobIdFilter = searchParams.get('jobId');
  const [searchQuery, setSearchQuery] = useState('');

  const [filters, setFilters] = useState({
    matchScore: { high: false, medium: false, low: false },
    education: { graduate: false, diploma: false, iti: false },
    location: { bangalore: false, mumbai: false, delhi: false }
  });

  const handleFilterChange = (category, key) => {
    setFilters(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        [key]: !prev[category][key]
      }
    }));
  };

  let filteredCandidates = candidates;

  if (statusFilter) {
    filteredCandidates = filteredCandidates.filter(c => c.status === statusFilter);
  }

  if (jobIdFilter) {
    filteredCandidates = filteredCandidates.filter(c => c.jobId === parseInt(jobIdFilter));
  }

  if (searchQuery) {
    const query = searchQuery.toLowerCase();
    filteredCandidates = filteredCandidates.filter(c =>
      c.name.toLowerCase().includes(query) ||
      c.role.toLowerCase().includes(query) ||
      c.skills.some(skill => skill.toLowerCase().includes(query))
    );
  }

  // Apply Sidebar Filters
  filteredCandidates = filteredCandidates.filter(c => {
    // Match Score Filter
    const score = c.matchScore;
    const anyScoreSelected = Object.values(filters.matchScore).some(v => v);
    const matchScoreFilter = !anyScoreSelected ||
      (filters.matchScore.high && score > 90) ||
      (filters.matchScore.medium && score >= 70 && score <= 90) ||
      (filters.matchScore.low && score < 70);

    // Education Filter
    const edu = c.education.toLowerCase();
    const isDiploma = edu.includes('diploma');
    const isITI = edu.includes('iti');
    const isGraduate = !isDiploma && !isITI; // Assuming everything else is a graduate degree for now

    const anyEduSelected = Object.values(filters.education).some(v => v);
    const educationFilter = !anyEduSelected ||
      (filters.education.graduate && isGraduate) ||
      (filters.education.diploma && isDiploma) ||
      (filters.education.iti && isITI);

    // Location Filter
    // If no location is selected, show all. Otherwise, check if candidate location matches any selected.
    const loc = c.location.toLowerCase();
    const anyLocationSelected = Object.values(filters.location).some(v => v);
    const locationFilter = !anyLocationSelected ||
      (filters.location.bangalore && loc.includes('bangalore')) ||
      (filters.location.mumbai && loc.includes('mumbai')) ||
      (filters.location.delhi && loc.includes('delhi'));

    return matchScoreFilter && educationFilter && locationFilter;
  });

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Candidates
            {statusFilter && <span className="text-gray-500 font-normal"> - {statusFilter}</span>}
            {jobIdFilter && <span className="text-gray-500 font-normal"> - Job #{jobIdFilter}</span>}
          </h1>
          <p className="text-gray-500 mt-1">Manage and review candidate applications.</p>
        </div>
        <div className="flex gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Search candidates..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary w-64 text-gray-900"
            />
          </div>

        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-start">
        {/* Filters Sidebar */}
        <aside className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm lg:col-span-1 sticky top-24">
          <div className="space-y-6">
            <div>
              <h3 className="text-sm font-semibold text-gray-900 mb-3">Match Score</h3>
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer hover:text-gray-900">
                  <input
                    type="checkbox"
                    checked={filters.matchScore.high}
                    onChange={() => handleFilterChange('matchScore', 'high')}
                    className="rounded border-gray-300 text-primary focus:ring-primary"
                  />
                  High (&gt;90%)
                </label>
                <label className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer hover:text-gray-900">
                  <input
                    type="checkbox"
                    checked={filters.matchScore.medium}
                    onChange={() => handleFilterChange('matchScore', 'medium')}
                    className="rounded border-gray-300 text-primary focus:ring-primary"
                  />
                  Medium (70-90%)
                </label>
                <label className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer hover:text-gray-900">
                  <input
                    type="checkbox"
                    checked={filters.matchScore.low}
                    onChange={() => handleFilterChange('matchScore', 'low')}
                    className="rounded border-gray-300 text-primary focus:ring-primary"
                  />
                  Low (&lt;70%)
                </label>
              </div>
            </div>

            <div>
              <h3 className="text-sm font-semibold text-gray-900 mb-3">Education</h3>
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer hover:text-gray-900">
                  <input
                    type="checkbox"
                    checked={filters.education.graduate}
                    onChange={() => handleFilterChange('education', 'graduate')}
                    className="rounded border-gray-300 text-primary focus:ring-primary"
                  />
                  Graduate
                </label>
                <label className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer hover:text-gray-900">
                  <input
                    type="checkbox"
                    checked={filters.education.diploma}
                    onChange={() => handleFilterChange('education', 'diploma')}
                    className="rounded border-gray-300 text-primary focus:ring-primary"
                  />
                  Diploma
                </label>
                <label className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer hover:text-gray-900">
                  <input
                    type="checkbox"
                    checked={filters.education.iti}
                    onChange={() => handleFilterChange('education', 'iti')}
                    className="rounded border-gray-300 text-primary focus:ring-primary"
                  />
                  ITI
                </label>
              </div>
            </div>

            <div>
              <h3 className="text-sm font-semibold text-gray-900 mb-3">Location</h3>
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer hover:text-gray-900">
                  <input
                    type="checkbox"
                    checked={filters.location.bangalore}
                    onChange={() => handleFilterChange('location', 'bangalore')}
                    className="rounded border-gray-300 text-primary focus:ring-primary"
                  />
                  Bangalore
                </label>
                <label className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer hover:text-gray-900">
                  <input
                    type="checkbox"
                    checked={filters.location.mumbai}
                    onChange={() => handleFilterChange('location', 'mumbai')}
                    className="rounded border-gray-300 text-primary focus:ring-primary"
                  />
                  Mumbai
                </label>
                <label className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer hover:text-gray-900">
                  <input
                    type="checkbox"
                    checked={filters.location.delhi}
                    onChange={() => handleFilterChange('location', 'delhi')}
                    className="rounded border-gray-300 text-primary focus:ring-primary"
                  />
                  Delhi
                </label>
              </div>
            </div>
          </div>
        </aside>

        {/* Candidates List */}
        <div className="lg:col-span-3 space-y-4">
          {filteredCandidates.length > 0 ? (
            filteredCandidates.map((candidate) => (
              <Link
                href={`/candidates/${candidate.id}`}
                key={candidate.id}
                className="block bg-white border border-gray-200 rounded-lg p-6 hover:border-primary transition-all shadow-sm hover:shadow-md group"
              >
                <div className="flex items-start gap-6">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center text-xl font-bold text-primary shrink-0">
                    {candidate.name.charAt(0)}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start mb-1">
                      <h3 className="text-lg font-semibold text-gray-900 group-hover:text-primary transition-colors">{candidate.name}</h3>
                      {candidate.status === 'Ineligible' ? (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                          Ineligible: {candidate.ineligibleReason}
                        </span>
                      ) : candidate.status === 'Shortlisted' ? (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          Shortlisted
                        </span>
                      ) : candidate.status === 'Rejected' ? (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                          Rejected
                        </span>
                      ) : (
                        <span className="flex items-center gap-1 text-sm font-semibold text-green-600 bg-green-50 px-2 py-1 rounded-md">
                          <Star size={14} fill="currentColor" />
                          {candidate.matchScore}% Match
                        </span>
                      )}
                    </div>

                    <p className="text-gray-500 text-sm mb-3">{candidate.role}</p>

                    <div className="flex items-center gap-6 text-sm text-gray-500 mb-4">
                      <span className="flex items-center gap-1.5">
                        <MapPin size={16} /> {candidate.location}
                      </span>
                      <span className="flex items-center gap-1.5">
                        <GraduationCap size={16} /> {candidate.education}
                      </span>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      {candidate.skills.map(skill => (
                        <span key={skill} className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-xs font-medium">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="text-gray-400 group-hover:text-primary transition-colors self-center">
                    <ChevronRight size={24} />
                  </div>
                </div>
              </Link>
            ))
          ) : (
            <div className="text-center py-12 bg-white border border-gray-200 rounded-lg">
              <p className="text-gray-500 mb-4">
                {jobIdFilter && filteredCandidates.length === 0
                  ? "No applicants currently"
                  : `No candidates found${statusFilter ? ` with status: ${statusFilter}` : ''}`
                }
              </p>
              <Link href="/candidates" className="text-primary hover:underline font-medium">Clear Filters</Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function CandidatesPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <CandidatesContent />
    </Suspense>
  );
}
