'use client';

import { useState } from 'react';
import { Save, Mail, Sliders, Users, Plus, Trash2 } from 'lucide-react';

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState('matching');

  // Mock State for Matching Weights
  const [weights, setWeights] = useState({
    skills: 40,
    education: 20,
    interview: 30,
    location: 10
  });

  // Email Templates State
  const [templates, setTemplates] = useState([
    { id: 1, name: 'Interview Invitation', subject: 'Invitation to AI Interview - {{job_title}}', body: 'Dear {{candidate_name}},\n\nWe are pleased to invite you to an AI interview for the {{job_title}} position.' },
    { id: 2, name: 'Shortlist Notification', subject: 'Congratulations! You have been shortlisted', body: 'Dear {{candidate_name}},\n\nWe are happy to inform you that you have been shortlisted for the next round.' },
    { id: 3, name: 'Rejection Email', subject: 'Update on your application for {{job_title}}', body: 'Dear {{candidate_name}},\n\nThank you for your interest. Unfortunately, we will not be proceeding with your application at this time.' }
  ]);
  const [isTemplateModalOpen, setIsTemplateModalOpen] = useState(false);
  const [currentTemplate, setCurrentTemplate] = useState(null); // null for new, object for edit
  const [templateForm, setTemplateForm] = useState({ name: '', subject: '', body: '' });

  // Team State
  const [teamMembers, setTeamMembers] = useState([
    { id: 1, name: 'Recruiter Admin', role: 'Super Admin', email: 'admin@example.com', initials: 'RA', isOwner: true },
    { id: 2, name: 'John Doe', role: 'Recruiter', email: 'john@example.com', initials: 'JD', isOwner: false }
  ]);
  const [isTeamModalOpen, setIsTeamModalOpen] = useState(false);
  const [teamForm, setTeamForm] = useState({ name: '', email: '', role: 'Recruiter' });

  // Handlers for Matching
  const handleWeightChange = (key, value) => {
    setWeights(prev => ({ ...prev, [key]: parseInt(value) }));
  };

  // Handlers for Templates
  const openTemplateModal = (template = null) => {
    if (template) {
      setCurrentTemplate(template);
      setTemplateForm({ name: template.name, subject: template.subject, body: template.body });
    } else {
      setCurrentTemplate(null);
      setTemplateForm({ name: '', subject: '', body: '' });
    }
    setIsTemplateModalOpen(true);
  };

  const handleSaveTemplate = () => {
    if (currentTemplate) {
      // Update existing
      setTemplates(prev => prev.map(t => t.id === currentTemplate.id ? { ...t, ...templateForm } : t));
    } else {
      // Add new
      setTemplates(prev => [...prev, { id: Date.now(), ...templateForm }]);
    }
    setIsTemplateModalOpen(false);
  };

  const handleDeleteTemplate = (id) => {
    if (confirm('Are you sure you want to delete this template?')) {
      setTemplates(prev => prev.filter(t => t.id !== id));
    }
  };

  // Handlers for Team
  const handleInviteMember = () => {
    const initials = teamForm.name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2);
    setTeamMembers(prev => [...prev, { id: Date.now(), ...teamForm, initials, isOwner: false }]);
    setIsTeamModalOpen(false);
    setTeamForm({ name: '', email: '', role: 'Recruiter' });
  };

  const handleRemoveMember = (id) => {
    if (confirm('Are you sure you want to remove this team member?')) {
      setTeamMembers(prev => prev.filter(m => m.id !== id));
    }
  };

  return (
    <div className="space-y-6 relative">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
          <p className="text-gray-500 mt-1">Configure your recruitment platform preferences.</p>
        </div>
      </div>

      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden flex flex-col md:flex-row min-h-[600px] shadow-sm">
        {/* Sidebar */}
        <div className="bg-gray-50 border-r border-gray-200 w-full md:w-64 p-4 md:p-6 space-y-1">
          <button
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${activeTab === 'matching'
              ? 'bg-primary text-white shadow-sm'
              : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
              }`}
            onClick={() => setActiveTab('matching')}
          >
            <Sliders size={18} /> Matching Engine
          </button>
          <button
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${activeTab === 'email'
              ? 'bg-primary text-white shadow-sm'
              : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
              }`}
            onClick={() => setActiveTab('email')}
          >
            <Mail size={18} /> Email Templates
          </button>
          <button
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${activeTab === 'team'
              ? 'bg-primary text-white shadow-sm'
              : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
              }`}
            onClick={() => setActiveTab('team')}
          >
            <Users size={18} /> Team & Roles
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 p-6 md:p-8">
          {activeTab === 'matching' && (
            <div className="max-w-2xl space-y-8">
              <div>
                <h2 className="text-lg font-semibold text-gray-900 mb-1">Matching Algorithm Weights</h2>
                <p className="text-gray-500 text-sm">Adjust how the AI prioritizes different criteria when scoring candidates.</p>
              </div>

              <div className="space-y-6">
                <div className="space-y-3">
                  <div className="flex justify-between items-center text-sm font-medium">
                    <span className="text-gray-700">Skills Match</span>
                    <span className="text-primary font-bold">{weights.skills}%</span>
                  </div>
                  <input
                    type="range" min="0" max="100"
                    value={weights.skills}
                    onChange={(e) => handleWeightChange('skills', e.target.value)}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-primary"
                  />
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between items-center text-sm font-medium">
                    <span className="text-gray-700">Education Fit</span>
                    <span className="text-primary font-bold">{weights.education}%</span>
                  </div>
                  <input
                    type="range" min="0" max="100"
                    value={weights.education}
                    onChange={(e) => handleWeightChange('education', e.target.value)}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-primary"
                  />
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between items-center text-sm font-medium">
                    <span className="text-gray-700">AI Interview Score</span>
                    <span className="text-primary font-bold">{weights.interview}%</span>
                  </div>
                  <input
                    type="range" min="0" max="100"
                    value={weights.interview}
                    onChange={(e) => handleWeightChange('interview', e.target.value)}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-primary"
                  />
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between items-center text-sm font-medium">
                    <span className="text-gray-700">Location Proximity</span>
                    <span className="text-primary font-bold">{weights.location}%</span>
                  </div>
                  <input
                    type="range" min="0" max="100"
                    value={weights.location}
                    onChange={(e) => handleWeightChange('location', e.target.value)}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-primary"
                  />
                </div>
              </div>

              <div className="pt-6 border-t border-gray-200">
                <div className="flex items-center gap-2 text-sm font-semibold mb-6">
                  <span className="text-gray-900">Total Weight:</span>
                  <span className={Object.values(weights).reduce((a, b) => a + b, 0) === 100 ? 'text-green-600' : 'text-red-600'}>
                    {Object.values(weights).reduce((a, b) => a + b, 0)}%
                  </span>
                  {Object.values(weights).reduce((a, b) => a + b, 0) !== 100 && (
                    <span className="text-red-500 font-normal text-xs">(Must equal 100%)</span>
                  )}
                </div>

                <button className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-primary hover:bg-orange-600 text-white rounded-lg font-medium transition-colors">
                  <Save size={18} /> Save Configuration
                </button>
              </div>
            </div>
          )}

          {activeTab === 'email' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-lg font-semibold text-gray-900">Email Templates</h2>
                <button
                  onClick={() => openTemplateModal()}
                  className="inline-flex items-center justify-center gap-2 px-3 py-1.5 border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  <Plus size={16} /> New Template
                </button>
              </div>

              <div className="space-y-4">
                {templates.map(template => (
                  <div key={template.id} className="bg-white border border-gray-200 rounded-lg p-4 flex justify-between items-center hover:border-primary transition-colors">
                    <div>
                      <h3 className="text-sm font-semibold text-gray-900 mb-1">{template.name}</h3>
                      <p className="text-sm text-gray-500">Subject: {template.subject}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => openTemplateModal(template)}
                        className="px-3 py-1.5 border border-gray-200 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteTemplate(template.id)}
                        className="p-2 text-red-500 hover:bg-red-50 rounded-md transition-colors"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'team' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-lg font-semibold text-gray-900">Team Management</h2>
                <button
                  onClick={() => setIsTeamModalOpen(true)}
                  className="inline-flex items-center justify-center gap-2 px-3 py-1.5 bg-primary hover:bg-orange-600 text-white rounded-lg text-sm font-medium transition-colors"
                >
                  <Plus size={16} /> Invite Member
                </button>
              </div>

              <div className="space-y-4">
                {teamMembers.map(member => (
                  <div key={member.id} className="bg-white border border-gray-200 rounded-lg p-4 flex items-center gap-4">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold shrink-0 ${member.isOwner ? 'bg-indigo-100 text-indigo-600' : 'bg-gray-100 text-gray-600'}`}>
                      {member.initials}
                    </div>
                    <div className="flex-1">
                      <h3 className="text-sm font-semibold text-gray-900">{member.name} {member.isOwner && '(You)'}</h3>
                      <p className="text-sm text-gray-500">{member.role} • {member.email}</p>
                    </div>
                    {member.isOwner ? (
                      <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-50 text-indigo-700 border border-indigo-100">Owner</span>
                    ) : (
                      <button
                        onClick={() => handleRemoveMember(member.id)}
                        className="px-3 py-1.5 border border-gray-200 rounded-md text-sm font-medium text-red-600 hover:bg-red-50 transition-colors"
                      >
                        Remove
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Template Modal */}
      {isTemplateModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md space-y-4">
            <h3 className="text-lg font-bold text-gray-900">{currentTemplate ? 'Edit Template' : 'New Template'}</h3>
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Template Name</label>
                <input
                  type="text"
                  value={templateForm.name}
                  onChange={(e) => setTemplateForm({ ...templateForm, name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-900"
                  placeholder="e.g., Interview Invite"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Subject Line</label>
                <input
                  type="text"
                  value={templateForm.subject}
                  onChange={(e) => setTemplateForm({ ...templateForm, subject: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-900"
                  placeholder="Email subject..."
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email Body</label>
                <textarea
                  value={templateForm.body}
                  onChange={(e) => setTemplateForm({ ...templateForm, body: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-900 h-32"
                  placeholder="Email content..."
                />
              </div>
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setIsTemplateModalOpen(false)}
                className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-md"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveTemplate}
                className="px-4 py-2 text-sm font-medium text-white bg-primary hover:bg-orange-600 rounded-md"
              >
                Save Template
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Team Modal */}
      {isTeamModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md space-y-4">
            <h3 className="text-lg font-bold text-gray-900">Invite Team Member</h3>
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                <input
                  type="text"
                  value={teamForm.name}
                  onChange={(e) => {
                    const val = e.target.value;
                    if (/^[a-zA-Z\s'-]*$/.test(val)) {
                      setTeamForm({ ...teamForm, name: val });
                    }
                  }}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-900"
                  placeholder="e.g., Jane Smith"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                <input
                  type="email"
                  value={teamForm.email}
                  onChange={(e) => setTeamForm({ ...teamForm, email: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-900"
                  placeholder="jane@example.com"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
                <select
                  value={teamForm.role}
                  onChange={(e) => setTeamForm({ ...teamForm, role: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-900"
                >
                  <option value="Recruiter">Recruiter</option>
                  <option value="Hiring Manager">Hiring Manager</option>
                  <option value="Admin">Admin</option>
                </select>
              </div>
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setIsTeamModalOpen(false)}
                className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-md"
              >
                Cancel
              </button>
              <button
                onClick={handleInviteMember}
                className="px-4 py-2 text-sm font-medium text-white bg-primary hover:bg-orange-600 rounded-md"
              >
                Send Invitation
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
