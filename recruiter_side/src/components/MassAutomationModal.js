'use client';

import { X, CheckCircle, Bold, Italic, List, Link as LinkIcon, Loader2, Zap, Users, Clock, Mail } from 'lucide-react';
import { useState, useEffect } from 'react';

export default function MassAutomationModal({ isOpen, onClose, topCount, waitlistCount, onConfirm }) {
    const [activeTab, setActiveTab] = useState('invite'); // 'invite' or 'waitlist'

    const [inviteSubject, setInviteSubject] = useState('Invitation to Interview - PM Internship');
    const [inviteBody, setInviteBody] = useState(`Dear {{candidate_name}},\n\nWe are pleased to inform you that you have been selected for the next round of interviews. We were impressed with your profile.\n\nPlease let us know your availability for the coming week.\n\nBest regards,\nRecruitment Team`);

    const [waitlistSubject, setWaitlistSubject] = useState('Update on your Application - PM Internship');
    const [waitlistBody, setWaitlistBody] = useState(`Dear {{candidate_name}},\n\nThank you for your interest in the PM Internship position. Your profile is strong, and we have placed you on our waitlist.\n\nWe will contact you if a position opens up.\n\nBest regards,\nRecruitment Team`);

    const [isSending, setIsSending] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);

    useEffect(() => {
        if (isOpen) {
            setIsSuccess(false);
            setIsSending(false);
        }
    }, [isOpen]);

    if (!isOpen) return null;

    const handleConfirm = async () => {
        setIsSending(true);
        // Simulate delay or real call happens in parent
        // Construct the payload to pass back
        const automationData = {
            emailInclude: {
                invite: { subject: inviteSubject, body: inviteBody },
                waitlist: { subject: waitlistSubject, body: waitlistBody }
            }
        };

        // We expect onConfirm to return a promise
        try {
            await onConfirm(automationData);
            setIsSuccess(true);
            setTimeout(() => {
                onClose();
            }, 2000);
        } catch (e) {
            setIsSending(false);
            alert("Automation Failed");
        }
    };

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-3xl max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in zoom-in duration-200">

                {/* Header */}
                <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
                    <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-orange-100 text-orange-600">
                            <Zap size={24} />
                        </div>
                        <div>
                            <h2 className="text-lg font-bold text-gray-900">Start Mass Automation</h2>
                            <p className="text-sm text-gray-500">Configure email notifications for your pipeline.</p>
                        </div>
                    </div>
                    <button onClick={onClose} className="p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100 transition-colors">
                        <X size={20} />
                    </button>
                </div>

                {/* Body */}
                <div className="flex-1 overflow-y-auto">
                    {!isSuccess ? (
                        <div className="p-6">
                            {/* Summary Cards */}
                            <div className="grid grid-cols-2 gap-4 mb-6">
                                <div className="p-4 bg-blue-50 rounded-lg border border-blue-100">
                                    <div className="flex items-center gap-2 mb-1 text-blue-800 font-semibold">
                                        <Users size={16} /> Top {topCount} Candidates
                                    </div>
                                    <div className="text-sm text-blue-600">
                                        Will be moved to <strong>R1: Contacted</strong>.
                                    </div>
                                </div>
                                <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-100">
                                    <div className="flex items-center gap-2 mb-1 text-yellow-800 font-semibold">
                                        <Clock size={16} /> Next {waitlistCount} Candidates
                                    </div>
                                    <div className="text-sm text-yellow-600">
                                        Will be moved to <strong>Waitlisted</strong>.
                                    </div>
                                </div>
                            </div>

                            <h3 className="text-sm font-bold text-gray-900 mb-3 flex items-center gap-2">
                                <Mail size={16} /> Customize Notifications
                            </h3>

                            {/* Tabs */}
                            <div className="border-b border-gray-200 mb-4">
                                <div className="flex gap-6">
                                    <button
                                        onClick={() => setActiveTab('invite')}
                                        className={`pb-2 text-sm font-medium border-b-2 transition-colors ${activeTab === 'invite' ? 'border-primary text-primary' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
                                    >
                                        Interview Invites ({topCount})
                                    </button>
                                    <button
                                        onClick={() => setActiveTab('waitlist')}
                                        className={`pb-2 text-sm font-medium border-b-2 transition-colors ${activeTab === 'waitlist' ? 'border-primary text-primary' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
                                    >
                                        Waitlist Emails ({waitlistCount})
                                    </button>
                                </div>
                            </div>

                            {/* Email Editor Area */}
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Subject</label>
                                    <input
                                        type="text"
                                        value={activeTab === 'invite' ? inviteSubject : waitlistSubject}
                                        onChange={(e) => activeTab === 'invite' ? setInviteSubject(e.target.value) : setWaitlistSubject(e.target.value)}
                                        className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm text-gray-900 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                                    />
                                </div>

                                <div>
                                    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Message</label>
                                    <div className="border border-gray-200 rounded-lg bg-white overflow-hidden focus-within:ring-2 focus-within:ring-primary/20 focus-within:border-primary transition-all">
                                        <textarea
                                            rows={8}
                                            value={activeTab === 'invite' ? inviteBody : waitlistBody}
                                            onChange={(e) => activeTab === 'invite' ? setInviteBody(e.target.value) : setWaitlistBody(e.target.value)}
                                            className="w-full px-3 py-2 text-sm text-gray-900 outline-none resize-none"
                                        />
                                    </div>
                                    <div className="flex gap-2 mt-2">
                                        <button onClick={() => {
                                            const setter = activeTab === 'invite' ? setInviteBody : setWaitlistBody;
                                            setter(prev => prev + ' {{candidate_name}}');
                                        }} className="text-xs px-2 py-1 bg-gray-100 hover:bg-gray-200 text-gray-600 rounded border border-gray-200 transition-colors">
                                            + Name
                                        </button>
                                    </div>
                                </div>
                            </div>

                        </div>
                    ) : (
                        <div className="h-full flex flex-col items-center justify-center p-12 text-center animate-in zoom-in duration-300">
                            <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-6">
                                <CheckCircle size={40} />
                            </div>
                            <h3 className="text-2xl font-bold text-gray-900 mb-2">Automation Started!</h3>
                            <p className="text-gray-500 max-w-sm">
                                Sending emails to {topCount + waitlistCount} candidates and updating pipeline statuses.
                            </p>
                        </div>
                    )}
                </div>

                {/* Footer */}
                {!isSuccess && (
                    <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex justify-end gap-3">
                        <button
                            onClick={onClose}
                            disabled={isSending}
                            className="px-4 py-2 text-gray-600 font-medium hover:bg-gray-200 rounded-lg transition-colors disabled:opacity-50"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleConfirm}
                            disabled={isSending}
                            className="px-6 py-2 bg-orange-600 text-white font-medium rounded-lg shadow-sm hover:bg-orange-700 active:bg-orange-800 transition-all disabled:opacity-70 flex items-center gap-2"
                        >
                            {isSending ? (
                                <>
                                    <Loader2 size={18} className="animate-spin" />
                                    Processing...
                                </>
                            ) : (
                                <>
                                    <Zap size={18} />
                                    Run Automation
                                </>
                            )}
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
