'use client';

import { ArrowLeft, Download, Mail, Calendar, Video, CheckCircle, XCircle, FileText, AlertTriangle, ThumbsUp, ThumbsDown, ShieldCheck, ChevronDown, UserCheck, UserX, ArrowRightCircle } from 'lucide-react';
import Link from 'next/link';
import Timeline from '@/components/Timeline';
import { useState, useEffect, use, useRef } from 'react';
import SendEmailModal from '@/components/SendEmailModal';
import ActionConfirmationModal from '@/components/ActionConfirmationModal';
import ScheduleModal from '@/components/ScheduleModal';
import MatchScoreBreakdown from '@/components/MatchScoreBreakdown';
import Certificates from '@/components/Certificates';
import Projects from '@/components/Projects';

import { candidates } from '@/data/candidates';

export default function CandidateProfile({ params }) {
  const { id } = use(params);
  const [isEmailModalOpen, setIsEmailModalOpen] = useState(false);
  const [isScheduleModalOpen, setIsScheduleModalOpen] = useState(false);

  // New State for Action Modal
  const [isActionModalOpen, setIsActionModalOpen] = useState(false);
  const [selectedAction, setSelectedAction] = useState(null); // 'next-round', 'shortlist', 'reject'
  const [isActionDropdownOpen, setIsActionDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const [status, setStatus] = useState(null); // 'shortlisted', 'rejected', or null

  const candidate = candidates.find(c => c.id === parseInt(id));

  // Close dropdown on click outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsActionDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  if (!candidate) {
    return <div className="p-8 text-center text-gray-500">Candidate not found</div>;
  }

  // Initialize state with candidate-specific data
  const [matchBreakdown, setMatchBreakdown] = useState(candidate.matchBreakdown);
  const [certificates, setCertificates] = useState(candidate.certificates);
  const [projects, setProjects] = useState(candidate.projects);

  // Update state when candidate changes (e.g. navigation)
  useEffect(() => {
    setMatchBreakdown(candidate.matchBreakdown);
    setCertificates(candidate.certificates);
    setProjects(candidate.projects);
  }, [candidate]);

  const handleRecomputeMatch = () => {
    // Simulate recompute
    const newScore = Math.floor(Math.random() * 10 + 85);
    setMatchBreakdown(prev => ({
      ...prev,
      overall: newScore,
      categories: prev.categories.map(c => ({ ...c, score: Math.min(100, c.score + Math.floor(Math.random() * 5 - 2)) }))
    }));
  };

  const handleVerifyCertificate = (id) => {
    setCertificates(prev => prev.map(c => c.id === id ? { ...c, status: 'processing' } : c));
    setTimeout(() => {
      setCertificates(prev => prev.map(c => c.id === id ? { ...c, status: 'verified' } : c));
    }, 2000);
  };

  const handleUploadCertificate = (newCert) => {
    setCertificates(prev => [newCert, ...prev]);
  };

  const openActionModal = (action) => {
    setSelectedAction(action);
    setIsActionDropdownOpen(false);
    setIsActionModalOpen(true);
  };

  const handleActionConfirm = (action, emailData) => {
    // Here you would call API to update status and send email
    console.log(`Confirmed ${action}`, emailData);

    // Update local UI status
    if (action === 'shortlist') setStatus('shortlisted');
    if (action === 'reject') setStatus('rejected');
    if (action === 'next-round') setStatus('next-round');

    // In a real app, update timelines etc.
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Link href="/candidates" className="p-2 text-gray-500 hover:bg-gray-100 rounded-full transition-colors">
            <ArrowLeft size={20} />
          </Link>
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-chakra text-white rounded-full flex items-center justify-center text-2xl font-bold">
              {candidate.name.charAt(0)}
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{candidate.name}</h1>
              <p className="text-gray-500">{candidate.role}</p>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-3">

          {/* Action Dropdown */}
          <div className="relative">
            <button
              onClick={() => setIsActionDropdownOpen(!isActionDropdownOpen)}
              className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg font-medium hover:bg-orange-600 transition-colors shadow-sm"
            >
              <Mail size={18} />
              Email Actions
              <ChevronDown size={16} className={`transition-transform ${isActionDropdownOpen ? 'rotate-180' : ''}`} />
            </button>

            {isActionDropdownOpen && (
              <div ref={dropdownRef} className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-xl border border-gray-100 py-1 z-20 animate-in fade-in slide-in-from-top-2">
                <button
                  onClick={() => openActionModal('next-round')}
                  className="w-full px-4 py-2.5 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2 group"
                >
                  <ArrowRightCircle size={16} className="text-blue-500 group-hover:text-blue-600" />
                  Proceed to Next Round
                </button>
                <button
                  onClick={() => openActionModal('shortlist')}
                  className="w-full px-4 py-2.5 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2 group"
                >
                  <UserCheck size={16} className="text-green-500 group-hover:text-green-600" />
                  Shortlist Candidate
                </button>
                <div className="h-px bg-gray-100 my-1"></div>
                <button
                  onClick={() => openActionModal('reject')}
                  className="w-full px-4 py-2.5 text-left text-sm text-red-600 hover:bg-red-50 flex items-center gap-2 group font-medium"
                >
                  <UserX size={16} className="text-red-500 group-hover:text-red-600" />
                  Reject Candidate
                </button>
              </div>
            )}
          </div>

          <Link
            href={`http://localhost:5173?full_name=${encodeURIComponent(candidate.name)}&email=${encodeURIComponent(candidate.email)}&phone=${encodeURIComponent(candidate.phone)}&date_of_birth=${encodeURIComponent(candidate.date_of_birth || '')}&institution=${encodeURIComponent(candidate.education)}&qualification_level=${encodeURIComponent(candidate.education)}&income=${encodeURIComponent(300000)}&is_premier_graduate=${candidate.isPremierGraduate || false}&has_higher_degree=${candidate.hasHigherDegree || false}&is_govt_family=${candidate.isGovtFamily || false}&undergoing_training_program=${candidate.undergoingTraining || false}&doc_aadhar=${candidate.document_ids?.aadhar || ''}&doc_passport=${candidate.document_ids?.passport || ''}&doc_education_certificate=${candidate.document_ids?.education_certificate || ''}&doc_income_certificate=${candidate.document_ids?.income_certificate || ''}&doc_family_income_proof=${candidate.documents?.family_income_proof || ''}&doc_govt_declaration=${candidate.documents?.govt_declaration || ''}&doc_higher_education_proof=${candidate.documents?.higher_education_proof || ''}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors shadow-sm"
          >
            <ShieldCheck className="w-4 h-4" />
            Verify Authenticity
          </Link>
          <button
            className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors"
            onClick={() => setIsScheduleModalOpen(true)}
          >
            <Calendar size={18} />
            Schedule Interview
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Column */}
        <div className="lg:col-span-2 space-y-6">

          {/* Eligibility */}
          <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm border-l-4 border-l-green-600">
            <h2 className="text-lg font-bold text-gray-900 mb-4">Eligibility Check</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {candidate.eligibility.checks.map((check, idx) => (
                <div key={idx} className={`flex items-center gap-2 p-2 rounded-lg ${check.status === 'pass' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
                  }`}>
                  {check.status === 'pass' ? <CheckCircle size={16} /> : <XCircle size={16} />}
                  <span className="text-sm font-medium">{check.label}</span>
                </div>
              ))}
            </div>
            {!candidate.eligibility.isEligible && (
              <div className="eligibility-alert mt-4 flex items-center gap-2 p-4 bg-red-50 text-red-700 rounded-lg">
                <AlertTriangle size={18} />
                <span>Candidate is ineligible based on scheme rules.</span>
              </div>
            )}
          </div>

          {/* About */}
          <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
            <h2 className="text-lg font-bold text-gray-900 mb-4">About</h2>
            <p className="text-gray-600 mb-6 leading-relaxed">{candidate.summary}</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm text-gray-500 mb-1">Email</label>
                <div className="flex items-center gap-2 font-medium text-gray-900">
                  {candidate.email} <Mail size={14} className="text-gray-400" />
                </div>
              </div>
              <div>
                <label className="block text-sm text-gray-500 mb-1">Phone</label>
                <div className="font-medium text-gray-900">{candidate.phone}</div>
              </div>
              <div>
                <label className="block text-sm text-gray-500 mb-1">Location</label>
                <div className="font-medium text-gray-900">{candidate.location}</div>
              </div>
              <div>
                <label className="block text-sm text-gray-500 mb-1">Education</label>
                <div className="font-medium text-gray-900">{candidate.education}</div>
              </div>
            </div>
          </div>

          {/* Projects */}
          <Projects projects={projects} />

          {/* Certificates */}
          <Certificates
            certificates={certificates}
            onUpload={handleUploadCertificate}
            onVerify={(id, status) => {
              setCertificates(certificates.map(c =>
                c.id === id ? { ...c, status } : c
              ));
            }}
            candidateName={candidate.name}
          />

          {/* Resume */}
          <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-gray-900">Resume</h2>
              <button className="text-primary hover:text-orange-700 text-sm font-medium flex items-center gap-1">
                <Download size={16} /> Download PDF
              </button>
            </div>
            <div className="flex flex-col items-center justify-center p-8 border-2 border-dashed border-gray-200 rounded-lg bg-gray-50">
              <FileText size={48} className="text-gray-400 mb-3" />
              <p className="font-medium text-gray-900">{candidate.name.replace(' ', '_')}_Resume.pdf</p>
              <button className="mt-3 px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50">
                View Document
              </button>
            </div>
          </div>

          {/* Timeline */}
          <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
            <h2 className="text-lg font-bold text-gray-900 mb-4">Timeline</h2>
            <Timeline events={candidate.timeline} />
          </div>
        </div>

        {/* Side Column */}
        <div className="space-y-6">
          {/* Match Score */}
          <MatchScoreBreakdown breakdown={matchBreakdown} onRecompute={handleRecomputeMatch} />

          {/* AI Interview */}
          <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-gray-900">AI Interview</h3>
              <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${candidate.aiInterview.status === 'Completed' ? 'bg-green-100 text-green-800' :
                candidate.aiInterview.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-gray-100 text-gray-800'
                }`}>
                {candidate.aiInterview.status}
              </span>
            </div>

            <div className="flex items-center gap-2 text-chakra font-bold text-lg mb-4">
              <Video size={24} />
              <span>Score: {candidate.aiInterview.score}/100</span>
            </div>

            <p className="text-sm text-gray-600 italic mb-6 border-l-2 border-gray-200 pl-3">
              "{candidate.aiInterview.summary}"
            </p>

            <div className="space-y-4 mb-6">
              <div>
                <h4 className="text-sm font-bold text-gray-900 flex items-center gap-2 mb-2">
                  <CheckCircle size={14} className="text-green-600" /> Strengths
                </h4>
                <ul className="text-sm text-gray-600 space-y-1 pl-6 list-disc">
                  {candidate.aiInterview.strengths.map(s => <li key={s}>{s}</li>)}
                </ul>
              </div>
              <div>
                <h4 className="text-sm font-bold text-gray-900 flex items-center gap-2 mb-2">
                  <XCircle size={14} className="text-red-600" /> Areas to Improve
                </h4>
                <ul className="text-sm text-gray-600 space-y-1 pl-6 list-disc">
                  {candidate.aiInterview.weaknesses.map(w => <li key={w}>{w}</li>)}
                </ul>
              </div>
            </div>

            <Link href="/interviews/1" className="block w-full py-2 text-center border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
              Watch Recording
            </Link>
          </div>

          {/* Skills */}
          <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
            <h2 className="text-lg font-bold text-gray-900 mb-4">Skills</h2>
            <div className="flex flex-wrap gap-2">
              {candidate.skills.map(skill => (
                <span key={skill} className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm border border-gray-200">
                  {skill}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      <SendEmailModal
        isOpen={isEmailModalOpen}
        onClose={() => setIsEmailModalOpen(false)}
        candidateName={candidate.name}
        candidateEmail={candidate.email}
      />

      <ScheduleModal
        isOpen={isScheduleModalOpen}
        onClose={() => setIsScheduleModalOpen(false)}
        candidateName={candidate.name}
      />

      <ActionConfirmationModal
        isOpen={isActionModalOpen}
        onClose={() => setIsActionModalOpen(false)}
        candidate={candidate}
        actionType={selectedAction}
        onConfirm={handleActionConfirm}
      />
    </div>
  );
}
