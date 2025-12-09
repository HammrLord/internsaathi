/**
 * @file ScheduleModal.js
 * @description Modal for scheduling candidate interviews
 * @keywords schedule, interview, calendar, meeting, booking, slots, panel
 * 
 * Search tags:
 * - schedule: schedule interview, book time slot
 * - interview: interview setup, panel selection
 * - calendar: Google Calendar, Outlook sync
 * - meeting: Google Meet, Zoom, in-person
 * - email: send interview notification
 * - reminder: candidate reminder, interviewer reminder
 */
'use client';

import { X, Calendar, Clock, Video, MapPin, CheckCircle, Loader2, Users, Bell, CalendarCheck, RefreshCw, Check } from 'lucide-react';
import { useState } from 'react';
import { useInterviews } from '@/context/InterviewsContext';
import { candidates } from '@/data/candidates';

const MOCK_INTERVIEWERS = [
  'Sarah Wilson (Product Lead)',
  'James Chen (Engineering Manager)',
  'Anita Roy (HR Business Partner)',
  'Michael Chang (Design Lead)',
  'Dr. Robert Ford (AI Ethics)'
];

export default function ScheduleModal({ isOpen, onClose, candidateName }) {
  const { addInterview } = useInterviews();
  const [isScheduled, setIsScheduled] = useState(false);
  const [isScheduling, setIsScheduling] = useState(false);

  const [selectedCandidate, setSelectedCandidate] = useState(candidateName || '');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [duration, setDuration] = useState('30 Minutes');
  const [mode, setMode] = useState('Google Meet');

  // New Features State
  const [connectedCalendar, setConnectedCalendar] = useState(null); // 'google' | 'outlook' | null
  const [interviewers, setInterviewers] = useState([]);
  const [isInterviewerDropdownOpen, setIsInterviewerDropdownOpen] = useState(false);
  const [availableSlots, setAvailableSlots] = useState([]);
  const [isLoadingSlots, setIsLoadingSlots] = useState(false);
  const [reminders, setReminders] = useState({
    candidate: true,
    interviewers: true
  });

  if (!isOpen) return null;

  const handleConnectCalendar = (type) => {
    // Simulate auth flow
    setConnectedCalendar(type);
  };

  const generateSlots = () => {
    if (!date) {
      alert('Please select a date first');
      return;
    }
    setIsLoadingSlots(true);
    // Simulate API call
    setTimeout(() => {
      const slots = ['09:00', '10:30', '13:00', '14:30', '16:00'];
      setAvailableSlots(slots);
      setIsLoadingSlots(false);
    }, 800);
  };

  const toggleInterviewer = (interviewer) => {
    if (interviewers.includes(interviewer)) {
      setInterviewers(interviewers.filter(i => i !== interviewer));
    } else {
      setInterviewers([...interviewers, interviewer]);
    }
  };

  const handleSchedule = async () => {
    if (!selectedCandidate || !date || !time) {
      alert('Please fill in all required fields');
      return;
    }

    setIsScheduling(true);

    // Find candidate details
    const candidateObj = candidates.find(c => c.name === selectedCandidate);
    const role = candidateObj ? candidateObj.role : 'Applicant';
    const email = candidateObj ? candidateObj.email : null;

    // Format date for display
    const dateObj = new Date(date);
    const formattedDate = dateObj.toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' });

    // Convert 24h time to 12h
    const [hours, minutes] = time.split(':');
    const timeObj = new Date();
    timeObj.setHours(hours);
    timeObj.setMinutes(minutes);
    const formattedTime = timeObj.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });

    const displayDate = `${formattedDate}, ${formattedTime}`;

    // Add interview to context
    addInterview({
      candidate: selectedCandidate,
      role: role,
      date: displayDate,
      duration: duration.replace(' Minutes', 'm').replace(' Hour', 'h'),
      mode: mode,
      interviewers: interviewers, // Save panel info
      calendar: connectedCalendar
    });

    // Send Email Notification
    if (email) {
      try {
        await fetch('/api/send-email', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            to: email,
            subject: `Interview Scheduled - PM Internship Scheme`,
            html: `
              <div style="font-family: Arial, sans-serif; padding: 20px; color: #333;">
                <h2 style="color: #e65100;">Interview Scheduled</h2>
                <p>Dear <strong>${selectedCandidate}</strong>,</p>
                <p>Your interview for the <strong>${role}</strong> position has been scheduled.</p>
                <div style="background-color: #f5f5f5; padding: 15px; border-radius: 5px; margin: 20px 0;">
                  <p><strong>Date:</strong> ${formattedDate}</p>
                  <p><strong>Time:</strong> ${formattedTime}</p>
                  <p><strong>Duration:</strong> ${duration}</p>
                  <p><strong>Mode:</strong> ${mode}</p>
                  ${interviewers.length > 0 ? `<p><strong>Panel:</strong> ${interviewers.join(', ')}</p>` : ''}
                </div>
                <p>Please be ready 10 minutes before the scheduled time.</p>
                <p>Best regards,<br/>Recruitment Team</p>
              </div>
            `
          })
        });
        console.log(`Email notification sent to ${email}`);
      } catch (error) {
        console.error('Failed to send email notification:', error);
      }
    }

    setIsScheduled(true);
    setTimeout(() => {
      setIsScheduled(false);
      setIsScheduling(false);
      onClose();
    }, 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm">
      <div className="bg-white w-full max-w-lg rounded-xl shadow-2xl flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center">
          <h2 className="text-xl font-bold text-gray-900">Schedule Interview</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
            <X size={24} />
          </button>
        </div>

        {!isScheduled ? (
          <div className="p-6 space-y-6 overflow-y-auto">

            {/* Calendar Integration */}
            <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
              <div className="flex items-center gap-2 mb-3">
                <CalendarCheck size={18} className="text-blue-600" />
                <span className="text-sm font-semibold text-blue-900">Sync Availability</span>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => handleConnectCalendar('google')}
                  className={`flex-1 py-2 px-3 rounded-md text-sm font-medium border transition-all flex items-center justify-center gap-2 ${connectedCalendar === 'google'
                    ? 'bg-white border-green-500 text-green-700 shadow-sm'
                    : 'bg-white border-gray-200 text-gray-600 hover:border-blue-300'
                    }`}
                >
                  {connectedCalendar === 'google' && <Check size={14} />}
                  Google Calendar
                </button>
                <button
                  onClick={() => handleConnectCalendar('outlook')}
                  className={`flex-1 py-2 px-3 rounded-md text-sm font-medium border transition-all flex items-center justify-center gap-2 ${connectedCalendar === 'outlook'
                    ? 'bg-white border-green-500 text-green-700 shadow-sm'
                    : 'bg-white border-gray-200 text-gray-600 hover:border-blue-300'
                    }`}
                >
                  {connectedCalendar === 'outlook' && <Check size={14} />}
                  Outlook Calendar
                </button>
              </div>
            </div>

            {/* Candidate Selection */}
            <div className="space-y-2 relative">
              <label className="text-sm font-medium text-gray-700">Candidate</label>
              {candidateName ? (
                <div className="w-full px-4 py-2 border border-gray-200 rounded-lg bg-gray-50 text-gray-900 font-medium">
                  {candidateName}
                </div>
              ) : (
                <div className="relative">
                  <div
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg bg-white text-gray-900 cursor-pointer flex justify-between items-center"
                  >
                    <span>{selectedCandidate || "Select a candidate..."}</span>
                    <span className="text-gray-400">▼</span>
                  </div>

                  {isDropdownOpen && (
                    <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                      <div className="p-2 sticky top-0 bg-white border-b border-gray-100">
                        <input
                          type="text"
                          placeholder="Search candidate..."
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          className="w-full px-3 py-1.5 border border-gray-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                          onClick={(e) => e.stopPropagation()}
                        />
                      </div>
                      <div className="py-1">
                        {candidates
                          .filter(c => c.name.toLowerCase().includes(searchQuery.toLowerCase()))
                          .map(c => (
                            <div
                              key={c.id}
                              onClick={() => {
                                setSelectedCandidate(c.name);
                                setIsDropdownOpen(false);
                                setSearchQuery('');
                              }}
                              className="px-4 py-2 hover:bg-gray-50 cursor-pointer text-sm text-gray-700 hover:text-primary"
                            >
                              <div className="font-medium">{c.name}</div>
                              <div className="text-xs text-gray-500">{c.role}</div>
                            </div>
                          ))}
                        {candidates.filter(c => c.name.toLowerCase().includes(searchQuery.toLowerCase())).length === 0 && (
                          <div className="px-4 py-2 text-sm text-gray-500 text-center">No candidates found</div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Interview Panel */}
            <div className="space-y-2 relative">
              <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                <Users size={16} className="text-gray-400" />
                Interview Panel
              </label>
              <div className="relative">
                <div
                  onClick={() => setIsInterviewerDropdownOpen(!isInterviewerDropdownOpen)}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg bg-white text-gray-900 cursor-pointer flex justify-between items-center min-h-[42px]"
                >
                  <div className="flex flex-wrap gap-1">
                    {interviewers.length > 0 ? (
                      interviewers.map(i => (
                        <span key={i} className="bg-gray-100 text-gray-700 px-2 py-0.5 rounded text-xs font-medium">
                          {i.split(' ')[0]}
                        </span>
                      ))
                    ) : (
                      <span className="text-gray-400">Select interviewers...</span>
                    )}
                  </div>
                  <span className="text-gray-400">▼</span>
                </div>

                {isInterviewerDropdownOpen && (
                  <div className="absolute z-20 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                    {MOCK_INTERVIEWERS.map((interviewer) => (
                      <div
                        key={interviewer}
                        onClick={() => toggleInterviewer(interviewer)}
                        className="px-4 py-2 hover:bg-gray-50 cursor-pointer text-sm text-gray-700 flex items-center gap-2"
                      >
                        <div className={`w-4 h-4 border rounded flex items-center justify-center ${interviewers.includes(interviewer) ? 'bg-primary border-primary text-white' : 'border-gray-300'}`}>
                          {interviewers.includes(interviewer) && <Check size={12} />}
                        </div>
                        {interviewer}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Date</label>
                <div className="relative">
                  <Calendar size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-gray-900"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Time</label>
                <div className="relative">
                  <Clock size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="time"
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-gray-900"
                  />
                </div>
              </div>
            </div>

            {/* Auto-suggest Slots */}
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">Suggested Slots</label>
                <button
                  onClick={generateSlots}
                  className="text-xs text-primary hover:text-orange-700 flex items-center gap-1 font-medium"
                >
                  <RefreshCw size={12} className={isLoadingSlots ? 'animate-spin' : ''} />
                  Find Available
                </button>
              </div>
              {availableSlots.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {availableSlots.map(slot => (
                    <button
                      key={slot}
                      onClick={() => setTime(slot)}
                      className={`px-3 py-1 rounded-full text-xs font-medium border transition-colors ${time === slot
                        ? 'bg-primary text-white border-primary'
                        : 'bg-gray-50 text-gray-600 border-gray-200 hover:border-primary hover:text-primary'
                        }`}
                    >
                      {slot}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Duration</label>
              <select
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-gray-900 bg-white"
              >
                <option>30 Minutes</option>
                <option>45 Minutes</option>
                <option>1 Hour</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Mode</label>
              <div className="flex gap-3">
                {['Google Meet', 'Zoom', 'In-Person'].map((option) => (
                  <label key={option} className="flex-1 cursor-pointer">
                    <input
                      type="radio"
                      name="mode"
                      value={option}
                      checked={mode === option}
                      onChange={(e) => setMode(e.target.value)}
                      className="hidden"
                    />
                    <div className={`flex flex-col items-center gap-2 p-3 border rounded-lg transition-all ${mode === option
                      ? 'border-primary bg-orange-50 text-primary'
                      : 'border-gray-200 text-gray-500 hover:border-gray-300 hover:bg-gray-50'
                      }`}>
                      {option === 'In-Person' ? <MapPin size={20} /> : <Video size={20} />}
                      <span className="text-xs font-medium">{option}</span>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            {/* Reminders */}
            <div className="space-y-3 pt-2 border-t border-gray-100">
              <div className="flex items-center gap-2 text-sm font-medium text-gray-900">
                <Bell size={16} className="text-gray-500" />
                Reminders
              </div>
              <div className="flex flex-col gap-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={reminders.candidate}
                    onChange={(e) => setReminders({ ...reminders, candidate: e.target.checked })}
                    className="w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary"
                  />
                  <span className="text-sm text-gray-600">Send reminder to Candidate (1 day before)</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={reminders.interviewers}
                    onChange={(e) => setReminders({ ...reminders, interviewers: e.target.checked })}
                    className="w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary"
                  />
                  <span className="text-sm text-gray-600">Send reminder to Interviewers (15 mins before)</span>
                </label>
              </div>
            </div>

            <p className="text-xs text-gray-500">Timezone: Asia/Kolkata (IST)</p>
          </div>
        ) : (
          <div className="p-12 flex flex-col items-center text-center gap-4">
            <CheckCircle size={48} className="text-green-500" />
            <h3 className="text-xl font-bold text-gray-900">Interview Scheduled</h3>
            <p className="text-gray-500">Calendar invite sent to {selectedCandidate}</p>
            {interviewers.length > 0 && (
              <p className="text-sm text-gray-400">Panel: {interviewers.join(', ')}</p>
            )}
          </div>
        )}

        {!isScheduled && (
          <div className="px-6 py-4 border-t border-gray-100 flex justify-end gap-3 bg-gray-50 rounded-b-xl">
            <button
              onClick={onClose}
              disabled={isScheduling}
              className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-100 transition-colors disabled:opacity-50"
            >
              Save Draft
            </button>
            <button
              onClick={handleSchedule}
              disabled={isScheduling}
              className="px-4 py-2 bg-primary text-white rounded-lg font-medium hover:bg-orange-600 transition-colors flex items-center gap-2 disabled:opacity-50"
            >
              {isScheduling && <Loader2 size={16} className="animate-spin" />}
              {isScheduling ? 'Scheduling...' : 'Schedule & Send'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
