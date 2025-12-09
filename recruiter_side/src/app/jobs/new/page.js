'use client';

import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useJobs } from '@/context/JobsContext';
import LocationInput from '@/components/LocationInput';
import DurationInput from '@/components/DurationInput';
import JobTitleInput from '@/components/JobTitleInput';

export default function NewJobPage() {
  const router = useRouter();
  const { addJob } = useJobs();
  const [formData, setFormData] = useState({
    title: '',
    location: '',
    duration: '',
    description: '',
    type: 'Full-time', // Default
    status: 'Active',
    posted: 'Just now',
    postedDate: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
    applicants: 0,
    analytics: {
      applicants: 0,
      shortlisted: 0,
      avgMatchScore: 0
    }
  });
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Custom setter for complex components
  const setValue = (name, value) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = {};

    // Validate Age Range
    const minAge = parseInt(e.target.minAge.value);
    const maxAge = parseInt(e.target.maxAge.value);

    if (minAge <= 0 || maxAge <= 0) {
      newErrors.age = "Age must be positive.";
    } else if (minAge >= maxAge) {
      newErrors.age = "Min age must be less than Max age.";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    addJob(formData);
    router.push('/jobs');
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center gap-4 mb-6">
        <Link href="/jobs" className="p-2 rounded-lg hover:bg-gray-100 text-gray-500 hover:text-gray-900 transition-colors">
          <ArrowLeft size={24} />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Post New Internship</h1>
          <p className="text-gray-500">Create a new opportunity for candidates.</p>
        </div>
      </div>

      <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
        <form className="divide-y divide-gray-200" onSubmit={handleSubmit}>
          <div className="p-8 space-y-8">
            {/* Basic Information */}
            <section>
              <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <span className="w-1 h-6 bg-primary rounded-full"></span>
                Basic Information
              </h2>
              <div className="grid gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Job Title</label>
                  <JobTitleInput
                    value={formData.title}
                    onChange={(val) => setValue('title', val)}
                    placeholder="e.g. React Intern"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                    <LocationInput
                      value={formData.location}
                      onChange={(val) => setValue('location', val)}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Duration</label>
                    <DurationInput
                      value={formData.duration}
                      onChange={(val) => setValue('duration', val)}
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                  <textarea
                    name="description"
                    rows="5"
                    placeholder="Describe the role, responsibilities, and requirements..."
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all resize-none text-gray-900"
                    value={formData.description}
                    onChange={handleChange}
                    required
                  ></textarea>
                </div>
              </div>
            </section>

            {/* Eligibility Criteria */}
            <section>
              <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <span className="w-1 h-6 bg-primary rounded-full"></span>
                Eligibility Criteria (PM Internship Scheme)
              </h2>
              <div className="grid gap-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Age Range</label>
                    <div className="flex items-center gap-3">
                      <input
                        type="number"
                        name="minAge"
                        defaultValue="21"
                        min="1"
                        onKeyDown={(e) => {
                          // Block 'e', '+', '-', '.'
                          if (['e', 'E', '+', '-', '.'].includes(e.key)) {
                            e.preventDefault();
                          }
                        }}
                        className={`w-full px-4 py-2 border ${errors.age ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all text-gray-900`}
                      />
                      <span className="text-gray-500 font-medium">to</span>
                      <input
                        type="number"
                        name="maxAge"
                        defaultValue="24"
                        min="1"
                        onKeyDown={(e) => {
                          if (['e', 'E', '+', '-', '.'].includes(e.key)) {
                            e.preventDefault();
                          }
                        }}
                        className={`w-full px-4 py-2 border ${errors.age ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all text-gray-900`}
                      />
                    </div>
                    {errors.age && <p className="text-red-500 text-xs mt-1">{errors.age}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Nationality</label>
                    <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all bg-white text-gray-900">
                      <option>Indian</option>
                      <option>Other</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Education Level</label>
                  <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all bg-white text-gray-900">
                    <option>Graduate</option>
                    <option>High School</option>
                    <option>ITI Certificate</option>
                    <option>Polytechnic Diploma</option>
                  </select>
                </div>

                <div className="space-y-3 pt-2">
                  <label className="flex items-center gap-3 cursor-pointer group">
                    <input type="checkbox" defaultChecked className="w-5 h-5 text-primary border-gray-300 rounded focus:ring-primary" />
                    <span className="text-gray-700 group-hover:text-gray-900 transition-colors">Exclude candidates with full-time employment</span>
                  </label>
                  <label className="flex items-center gap-3 cursor-pointer group">
                    <input type="checkbox" defaultChecked className="w-5 h-5 text-primary border-gray-300 rounded focus:ring-primary" />
                    <span className="text-gray-700 group-hover:text-gray-900 transition-colors">Exclude candidates from IITs, IIMs, NLUs, etc.</span>
                  </label>
                  <label className="flex items-center gap-3 cursor-pointer group">
                    <input type="checkbox" defaultChecked className="w-5 h-5 text-primary border-gray-300 rounded focus:ring-primary" />
                    <span className="text-gray-700 group-hover:text-gray-900 transition-colors">Exclude candidates with CA/CMA/CS/MBBS/MBA/Masters</span>
                  </label>
                </div>
              </div>
            </section>
          </div>

          <div className="px-8 py-6 bg-gray-50 flex items-center justify-end gap-4">
            <button
              type="button"
              onClick={() => router.push('/jobs')}
              className="px-6 py-2.5 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-white hover:border-gray-400 focus:ring-2 focus:ring-gray-200 transition-all"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 bg-primary text-white rounded-lg font-medium hover:bg-orange-600 focus:ring-2 focus:ring-primary/50 shadow-sm hover:shadow transition-all"
            >
              Post Job
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
