'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  Users, BarChart3, Mail, Calendar, CheckCircle,
  ArrowRight, Shield, Award, Globe, Zap, Play
} from 'lucide-react';
import TopBar from '@/components/TopBar';

export default function LandingPage() {
  const [activeFeature, setActiveFeature] = useState(0);

  const features = [
    {
      title: "AI-Powered Matching",
      description: "Our advanced allocation engine matches candidates to opportunities with 95% accuracy using skill ontology and semantic search.",
      icon: Zap,
      color: "bg-blue-100 text-blue-600"
    },
    {
      title: "Automated Workflows",
      description: "Set up intelligent pipelines that automatically screen, email, and schedule interviews for thousands of applicants.",
      icon: Mail,
      color: "bg-orange-100 text-orange-600"
    },
    {
      title: "Real-time Analytics",
      description: "Visualize recruitment health with actionable insights, conversion funnels, and demographic breakdowns.",
      icon: BarChart3,
      color: "bg-green-100 text-green-600"
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* 1. Government Top Bar */}
      <TopBar />

      {/* 2. Main Header with Logos */}
      <header className="bg-white border-b border-gray-100 sticky top-0 z-40 bg-opacity-90 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <img src="/assets/gov-india-emblem.svg" alt="Gov Emblem" className="h-12 w-auto" />
            <div className="hidden md:block h-10 w-px bg-gray-300 mx-2"></div>
            <img src="/assets/mca-logo.png" alt="MCA Logo" className="h-10 w-auto hidden md:block" />
            <div className="flex flex-col ml-2">
              <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Ministry of Corporate Affairs</span>
              <span className="text-xl font-bold text-gray-900 leading-none">PM Internship Scheme</span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <Link href="/login" className="text-sm font-medium text-gray-600 hover:text-orange-600 transition-colors">
              Help Center
            </Link>
            <Link
              href="/login"
              className="px-6 py-2 bg-orange-600 text-white text-sm font-bold rounded-full hover:bg-orange-700 transition-all shadow-lg hover:shadow-orange-500/30"
            >
              Login
            </Link>
          </div>
        </div>
      </header>

      {/* 2.5 New Top Banner */}
      <div className="w-full bg-white border-b border-gray-100">
        <img src="/assets/top-banner.png" alt="Intern Saathi Banner" className="w-full h-auto block" />
      </div>

      {/* 3. Hero Section */}
      <section className="relative overflow-hidden pt-16 pb-24 lg:pt-32">
        <div className="absolute inset-0 bg-gradient-to-br from-orange-50 via-white to-blue-50 -z-10"></div>
        <div className="absolute top-0 right-0 w-1/2 h-full opacity-10"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-50 border border-blue-100 text-blue-700 text-sm font-bold mb-8"
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
            </span>
            New: AI-Driven Candidate Matching & Analytics
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-5xl md:text-7xl font-extrabold text-gray-900 tracking-tight mb-6"
          >
            Transforming <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-600 to-amber-500">Recruitment</span> for <br className="hidden md:block" />
            <span className="text-blue-700">Young India</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-xl text-gray-600 max-w-3xl mx-auto mb-10 leading-relaxed"
          >
            The centralized platform bridging top talent with India's leading enterprises. Experience seamless hiring with automated pipelines, rigorous verification, and data-driven insights.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-col sm:flex-row justify-center gap-4"
          >
            {/* Student Entry */}
            <a href="http://localhost:3001" className="group relative flex items-center justify-center gap-3 px-8 py-4 bg-white border-2 border-gray-200 rounded-xl hover:border-blue-600 hover:shadow-xl transition-all duration-300">
              <div className="p-2 bg-blue-50 rounded-lg group-hover:bg-blue-600 transition-colors">
                <Users className="w-6 h-6 text-blue-600 group-hover:text-white transition-colors" />
              </div>
              <div className="text-left">
                <span className="block text-xs font-semibold text-gray-500 uppercase tracking-wider">I am a</span>
                <span className="block text-lg font-bold text-gray-900">Student</span>
              </div>
            </a>

            {/* Recruiter Entry */}
            <Link href="/login" className="group relative flex items-center justify-center gap-3 px-8 py-4 bg-gradient-to-r from-orange-600 to-amber-600 rounded-xl shadow-xl shadow-orange-500/20 hover:shadow-2xl hover:shadow-orange-500/40 hover:-translate-y-1 transition-all duration-300">
              <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <div className="text-left">
                <span className="block text-xs font-semibold text-orange-100 uppercase tracking-wider">I am a</span>
                <span className="block text-lg font-bold text-white">Recruiter</span>
              </div>
              <ArrowRight className="ml-2 w-5 h-5 text-white opacity-0 group-hover:opacity-100 transform translate-x-[-10px] group-hover:translate-x-0 transition-all" />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* 4. Analytics & Snapshot Showcase */}
      <section className="py-24 bg-gray-50 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Powerful Dashboard for Modern Hiring</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">Get a bird's-eye view of your recruitment drive. Track applications, monitor diversity, and accelerate decision-making.</p>
          </div>

          <div className="relative rounded-2xl shadow-2xl bg-white border border-gray-200 overflow-hidden">
            {/* Browser Header Mockup */}
            <div className="bg-gray-100 px-4 py-3 flex items-center gap-2 border-b border-gray-200">
              <div className="flex gap-1.5">
                <div className="w-3 h-3 rounded-full bg-red-400"></div>
                <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
                <div className="w-3 h-3 rounded-full bg-green-400"></div>
              </div>
              <div className="flex-1 text-center">
                <div className="bg-white px-3 py-1 rounded-md text-xs text-gray-500 inline-block w-64 shadow-sm">pminternship.mca.gov.in/dashboard</div>
              </div>
            </div>

            {/* Actual Dashboard Screenshot */}
            <div className="bg-gray-100 border-b border-gray-200">
              <img src="/assets/dashboard-final.png" alt="Dashboard Preview" className="w-full h-auto" />
            </div>
          </div>
        </div>
      </section>

      {/* 5. Comprehensive Technology & Features Suite */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <span className="bg-orange-100 text-orange-700 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">State of the Art Technology</span>
            <h2 className="text-4xl font-extrabold text-gray-900 mt-4 mb-6">Powered by Advanced Agentic AI</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              A robust ecosystem designed for scale, fairness, and automated efficiency.
            </p>
          </div>

          <div className="space-y-32">
            {/* Feature 1: Allocation Engine */}
            <div className="flex flex-col lg:flex-row items-center gap-16">
              <div className="flex-1 space-y-6">
                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center text-blue-600 mb-2">
                  <Zap size={24} />
                </div>
                <h3 className="text-3xl font-bold text-gray-900">
                  Intelligent Agentic <span className="text-blue-600">Allocation Engine</span>
                </h3>
                <p className="text-lg text-gray-600 leading-relaxed">
                  Our multi-agentic system processes candidate features to derive structured embeddings, which are then passed to our proprietary <span className="font-bold text-gray-900">GNN-GESA Algorithm</span> (Graph Neural Networks).
                </p>
                <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100">
                  <h4 className="font-bold text-gray-900 mb-3 flex items-center gap-2"><CheckCircle size={16} className="text-green-500" /> Fairness & Diversity First</h4>
                  <p className="text-sm text-gray-600">
                    Ensures equal representation across rural/aspirational districts, gender, PwD, EWS, and minority communities.
                  </p>
                </div>
                <div className="flex gap-4">
                  <div className="px-4 py-2 bg-blue-50 text-blue-700 rounded-lg text-sm font-bold">Explainable AI Core</div>
                  <div className="px-4 py-2 bg-purple-50 text-purple-700 rounded-lg text-sm font-bold">Scalable Architecture</div>
                </div>
              </div>
              <div className="flex-1 relative group">
                <div className="absolute inset-0 bg-blue-600 rounded-2xl blur-2xl opacity-10 group-hover:opacity-20 transition-opacity"></div>
                <img src="/assets/feature-allocation.png" alt="Allocation Engine" className="relative rounded-2xl shadow-2xl border border-gray-200 transform group-hover:-translate-y-2 transition-transform duration-500" />
              </div>
            </div>

            {/* Feature 2: Meeting Assistant Bot */}
            <div className="flex flex-col lg:flex-row-reverse items-center gap-16">
              <div className="flex-1 space-y-6">
                <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center text-orange-600 mb-2">
                  <Users size={24} />
                </div>
                <h3 className="text-3xl font-bold text-gray-900">
                  AI <span className="text-orange-600">Meeting Assistant</span> Bot
                </h3>
                <p className="text-lg text-gray-600 leading-relaxed">
                  An intelligent agent that joins interviews alongside recruiters. It records multilingual transcripts, scores candidate responses in real-time, and provides detailed AI-generated summaries.
                </p>
                <ul className="space-y-4">
                  <li className="flex items-start gap-3">
                    <CheckCircle className="text-green-500 shrink-0 mt-1" />
                    <span className="text-gray-700"><strong>Multilingual Transcription:</strong> Captures every word for review.</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="text-green-500 shrink-0 mt-1" />
                    <span className="text-gray-700"><strong>Automated Scoring:</strong> Objective evaluation based on response quality.</span>
                  </li>
                </ul>
              </div>
              <div className="flex-1 relative group">
                <div className="absolute inset-0 bg-orange-600 rounded-2xl blur-2xl opacity-10 group-hover:opacity-20 transition-opacity"></div>
                <img src="/assets/feature-interview.png" alt="Meeting Bot" className="relative rounded-2xl shadow-2xl border border-gray-200 transform group-hover:-translate-y-2 transition-transform duration-500" />
              </div>
            </div>

            {/* Feature 3: Telephonic Bot */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center bg-gray-50 rounded-3xl p-8 border border-gray-100">
              <div>
                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center text-green-600 mb-4">
                  <span className="material-icons">contact_phone</span>
                  {/* Lucide fallback */}
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3">Telephonic Pre-Interview Bot</h3>
                <p className="text-gray-600">
                  Automated agents call candidates to screen for basics (language preference, behavior). Recruiters get a "Perception Summary" to skim before the actual interview.
                </p>
              </div>
              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                <div className="flex items-center gap-3 mb-3 border-b border-gray-100 pb-2">
                  <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                  <span className="text-xs font-bold text-gray-500 uppercase">Live Call Analysis</span>
                </div>
                <div className="space-y-2">
                  <div className="bg-gray-50 p-2 rounded text-xs text-gray-600"><strong>Bot:</strong> "Are you comfortable relocating to Hyderabad?"</div>
                  <div className="bg-blue-50 p-2 rounded text-xs text-blue-800"><strong>Candidate:</strong> "Yes, I have family there."</div>
                  <div className="flex gap-2 mt-2">
                    <span className="text-[10px] bg-green-100 text-green-700 px-2 py-0.5 rounded">Positive Tone</span>
                    <span className="text-[10px] bg-gray-100 text-gray-700 px-2 py-0.5 rounded">Verified</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Feature 4: ACCESSIBILITY SECTION */}
            <div className="space-y-16">
              {/* 4.1 Accessibility Main Block */}
              <div className="bg-white p-10 rounded-3xl border border-gray-200 shadow-xl overflow-hidden group">
                <div className="flex items-center gap-3 mb-8">
                  <span className="bg-black text-white px-4 py-1.5 rounded-full text-sm font-bold tracking-widest uppercase">Accessibility</span>
                  <div className="h-px bg-gray-200 flex-1"></div>
                </div>

                <div className="flex flex-col lg:flex-row gap-12 items-center">
                  <div className="flex-1 space-y-8">
                    <div>
                      <h3 className="text-4xl font-extrabold text-gray-900 mb-4">Multilingual & Inclusive Design</h3>
                      <p className="text-xl text-gray-600 leading-relaxed">
                        Breaking language barriers with a platform that speaks your language. Features a built-in <span className="text-blue-600 font-bold">Dynamic Screen Reader</span> providing equal opportunity for visually impaired recruiters and candidates.
                      </p>
                    </div>

                    <div className="w-full bg-gray-50 p-6 rounded-2xl border border-gray-100">
                      <span className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3 block">Supported Languages</span>
                      <div className="flex flex-wrap gap-3">
                        {/* Requested Black Tags */}
                        <span className="px-5 py-2 bg-white border border-gray-200 text-gray-900 rounded-lg text-sm font-bold shadow-sm">English</span>
                        <span className="px-5 py-2 bg-white border border-gray-200 text-gray-900 rounded-lg text-sm font-bold shadow-sm">Hindi</span>
                        <span className="px-5 py-2 bg-white border border-gray-200 text-gray-900 rounded-lg text-sm font-bold shadow-sm">Tamil</span>
                        <span className="px-5 py-2 bg-white border border-gray-200 text-gray-900 rounded-lg text-sm font-bold shadow-sm">Telugu</span>
                        <span className="px-5 py-2 bg-white border border-gray-200 text-gray-900 rounded-lg text-sm font-bold shadow-sm">Kannada</span>
                        <span className="px-5 py-2 bg-gray-900 text-white rounded-lg text-sm font-bold shadow-sm">+12 More</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex-1 w-full">
                    <img src="/assets/feature-multilingual.png" alt="Multilingual Accessibility Interface" className="w-full rounded-2xl shadow-2xl border border-gray-200 transform group-hover:scale-[1.02] transition-transform duration-500" />
                  </div>
                </div>
              </div>

              {/* feature 5: Automated Mailing System (Full Width) */}
              <div className="bg-gradient-to-r from-slate-900 to-slate-800 text-white p-10 rounded-3xl shadow-xl relative overflow-hidden">
                <div className="absolute top-0 right-0 p-8 opacity-10">
                  <Mail size={200} />
                </div>
                <div className="relative z-10 flex flex-col md:flex-row items-center gap-10">
                  <div className="flex-1 space-y-4">
                    <div className="w-14 h-14 bg-white/10 backdrop-blur-md rounded-2xl flex items-center justify-center mb-2">
                      <Mail size={32} className="text-blue-300" />
                    </div>
                    <h3 className="text-3xl font-bold text-white">Automated Mailing System</h3>
                    <p className="text-blue-100 text-lg max-w-2xl leading-relaxed">
                      Zero-touch communication pipelines. The system automatically triggers personalized emails for shortlisting, interview rounds, and offer rollouts, ensuring no candidate is left in the dark.
                    </p>
                    <ul className="flex flex-wrap gap-6 pt-4">
                      <li className="flex items-center gap-2 text-sm font-medium text-blue-200">
                        <CheckCircle size={16} className="text-green-400" /> Instant Notifications
                      </li>
                      <li className="flex items-center gap-2 text-sm font-medium text-blue-200">
                        <CheckCircle size={16} className="text-green-400" /> Bulk Action Support
                      </li>
                      <li className="flex items-center gap-2 text-sm font-medium text-blue-200">
                        <CheckCircle size={16} className="text-green-400" /> Audit Trail
                      </li>
                    </ul>
                  </div>
                  <div className="hidden md:block">
                    <button className="px-8 py-3 bg-white text-slate-900 font-bold rounded-xl hover:bg-blue-50 transition-colors shadow-lg">
                      View Templates
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Feature 6: Authenticity Checker */}
            <div className="flex flex-col lg:flex-row items-center gap-16">
              <div className="flex-1 relative">
                {/* Abstract Visual for Security */}
                <div className="bg-slate-900 rounded-2xl p-8 text-white relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-64 h-64 bg-green-500 rounded-full mix-blend-overlay filter blur-3xl opacity-20"></div>
                  <div className="relative z-10">
                    <div className="flex items-center gap-4 mb-6">
                      <Shield size={48} className="text-green-400" />
                      <div>
                        <div className="text-sm text-green-400 font-bold tracking-wider">SECURE VERIFICATION</div>
                        <div className="text-2xl font-bold">API Setu Integration</div>
                      </div>
                    </div>
                    <div className="space-y-3 font-mono text-sm opacity-80">
                      <div className="flex justify-between border-b border-gray-700 pb-2">
                        <span>Aadhar Verification</span>
                        <span className="text-green-400">PASSED</span>
                      </div>
                      <div className="flex justify-between border-b border-gray-700 pb-2">
                        <span>Income Certificate</span>
                        <span className="text-green-400">PASSED</span>
                      </div>
                      <div className="flex justify-between border-b border-gray-700 pb-2">
                        <span>Criminal Record Check</span>
                        <span className="text-green-400">CLEAR</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex-1 space-y-6">
                <h3 className="text-3xl font-bold text-gray-900">
                  Government-Grade <span className="text-green-600">Authenticity Checker</span>
                </h3>
                <p className="text-lg text-gray-600 leading-relaxed">
                  We employ advanced <strong>Fake Document Detection Algorithms</strong> linked directly to <strong>API Setu</strong>.
                </p>
                <p className="text-gray-600">
                  Every candidate is cross-verified against National and Regional registries (Aadhar, Passport, Digilocker) for income, education, and background checks.
                </p>
              </div>
            </div>

            {/* Features 7 & 8: Support & Reallocation */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="p-8 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-3xl text-white shadow-xl">
                <div className="w-12 h-12 bg-white/20 backdrop-blur-md rounded-xl flex items-center justify-center mb-6">
                  <span className="material-icons">smart_toy</span>
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2a2 2 0 0 1 2 2v2a2 2 0 0 1-2 2 2 2 0 0 1-2-2V4a2 2 0 0 1 2-2z"></path><path d="M4 11v2a8 8 0 0 0 16 0v-2"></path><rect x="9" y="8" width="6" height="13" rx="3"></rect><path d="M9 16h6"></path><path d="M15 16v3a2 2 0 0 1-2 2h-2a2 2 0 0 1-2-2v-3"></path></svg>
                </div>
                <h3 className="text-2xl font-bold mb-4">24/7 Recruiter Support Agents</h3>
                <p className="text-blue-100 leading-relaxed">
                  Integrated Voice Agent and WhatsApp Bot to assist recruiters instantly. Resolve queries, navigate the portal, or get policy clarifications in seconds.
                </p>
              </div>
              <div className="p-8 bg-white border-2 border-orange-100 rounded-3xl shadow-sm hover:border-orange-200 transition-colors">
                <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center text-orange-600 mb-6">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="23 4 23 10 17 10"></polyline><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"></path></svg>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Smart Seat Reallocation</h3>
                <p className="text-gray-600 leading-relaxed">
                  No opportunity wasted. If a candidate withdraws, our engine instantly reallocates the seat to the next waitlisted candidate and triggers automated notification workflows.
                </p>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 6. Video Demo / Walkthrough Section */}
      <section className="py-24 bg-slate-900 text-white text-center">
        <div className="max-w-4xl mx-auto px-4">
          <span className="text-orange-400 font-bold tracking-wider text-sm uppercase mb-2 block">Quick Walkthrough</span>
          <h2 className="text-3xl font-bold mb-8">See the Platform in Action</h2>

          <div className="relative aspect-video bg-slate-800 rounded-2xl overflow-hidden shadow-2xl border border-slate-700 group cursor-pointer group hover:border-orange-500 transition-colors">
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-20 h-20 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center group-hover:bg-orange-600 transition-all duration-300">
                <Play size={32} className="text-white fill-current ml-1" />
              </div>
            </div>
            <img src="/pm_modi_banner.png" alt="Video Preview" className="w-full h-full object-cover opacity-50 group-hover:opacity-75 transition-opacity" />
            <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-slate-900 to-transparent">
              <p className="text-sm font-medium">Recruiter Onboarding & Job Management Demo • 2:14</p>
            </div>
          </div>
        </div>
      </section>

      {/* 7. Simple Steps to Success */}
      <section className="py-24 bg-blue-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Simple Steps to Success</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">Whether you're a student, recruiter, or partner, getting started is easy.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-24">
            {/* For Candidates */}
            <div className="bg-white p-8 rounded-3xl shadow-xl border border-blue-50 hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
                <Users size={120} className="text-blue-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-8 flex items-center gap-3">
                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center text-blue-600">
                  <Users size={24} />
                </div>
                For Candidates
              </h3>
              <div className="space-y-8 relative pl-4">
                {/* Vertical line backing */}
                <div className="absolute left-[27px] top-4 bottom-4 w-0.5 bg-blue-100 -z-10"></div>

                {[
                  { title: "Create Your Profile", desc: "Sign up and verify your details via Digilocker." },
                  { title: "Apply for Internships", desc: "Browse AI-matched opportunities and apply with one click." },
                  { title: "Get Interviewed", desc: "Attend automated or scheduled interviews seamlessly." },
                  { title: "Start Internship", desc: "Receive offer letter and begin your professional journey." }
                ].map((step, idx) => (
                  <div key={idx} className="flex gap-6 items-start">
                    <div className="w-6 h-6 rounded-full bg-blue-600 text-white font-bold flex items-center justify-center shrink-0 z-10 text-xs shadow-lg ring-4 ring-white">
                      {idx + 1}
                    </div>
                    <div className="-mt-1">
                      <h4 className="font-bold text-gray-900 text-lg">{step.title}</h4>
                      <p className="text-sm text-gray-500 mt-1 leading-relaxed">{step.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* For Recruiters */}
            <div className="bg-gradient-to-br from-orange-600 to-amber-600 p-8 rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 relative overflow-hidden group text-white">
              <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity">
                <Shield size={120} className="text-white" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-8 flex items-center gap-3">
                <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center text-white">
                  <Shield size={24} />
                </div>
                For Recruiters
              </h3>
              <div className="space-y-8 relative pl-4">
                <div className="absolute left-[27px] top-4 bottom-4 w-0.5 bg-white/20 -z-10"></div>

                {[
                  { title: "Post Opportunities", desc: "Define roles, stipends, and requirements easily." },
                  { title: "AI Screening", desc: "Let our engine shortlist the best talent for you." },
                  { title: "Conduct Interviews", desc: "Schedule and manage interviews directly on the platform." },
                  { title: "Hire & Onboard", desc: "Select candidates and issue offers digitally." }
                ].map((step, idx) => (
                  <div key={idx} className="flex gap-6 items-start">
                    <div className="w-6 h-6 rounded-full bg-white text-orange-600 font-bold flex items-center justify-center shrink-0 z-10 text-xs shadow-lg ring-4 ring-orange-500/50">
                      {idx + 1}
                    </div>
                    <div className="-mt-1">
                      <h4 className="font-bold text-white text-lg">{step.title}</h4>
                      <p className="text-sm text-orange-100 mt-1 leading-relaxed">{step.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 8. Footer */}
      <footer className="bg-gray-50 border-t border-gray-200 pt-16 pb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <img src="/assets/gov-india-emblem.svg" alt="Gov" className="h-8" />
                <span className="font-bold text-gray-800">PM Internship Scheme</span>
              </div>
              <p className="text-sm text-gray-500">
                An initiative by Government of India to bridge the gap between academic learning and professional experience.
              </p>
            </div>
            <div>
              <h4 className="font-bold text-gray-900 mb-4">Quick Links</h4>
              <ul className="space-y-2 text-sm text-gray-600">
                <li><a href="#" className="hover:text-orange-600">About the Scheme</a></li>
                <li><a href="#" className="hover:text-orange-600">Partner Companies</a></li>
                <li><a href="#" className="hover:text-orange-600">Success Stories</a></li>
                <li><a href="#" className="hover:text-orange-600">FAQs</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-gray-900 mb-4">For Recruiters</h4>
              <ul className="space-y-2 text-sm text-gray-600">
                <li><a href="#" className="hover:text-orange-600">Register Company</a></li>
                <li><a href="#" className="hover:text-orange-600">Post Internship</a></li>
                <li><a href="#" className="hover:text-orange-600">API Documentation</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-gray-900 mb-4">Contact</h4>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-center gap-2"><Mail size={16} /> support@pminternship.gov.in</li>
                <li className="flex items-center gap-2"><Globe size={16} /> www.pminternship.mca.gov.in</li>
                <li className="mt-4 text-xs text-gray-400">Toll Free: 1800-11-2233</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-200 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="text-xs text-gray-500">
              © 2025 Ministry of Corporate Affairs. All Rights Reserved.
            </div>
            <div className="flex gap-4">
              <img src="/assets/digital-india.png" alt="Digital India" className="h-8 grayscale opacity-50 hover:grayscale-0 hover:opacity-100 transition-all" />
              <img src="/assets/mygov.png" alt="MyGov" className="h-8 grayscale opacity-50 hover:grayscale-0 hover:opacity-100 transition-all" />
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
