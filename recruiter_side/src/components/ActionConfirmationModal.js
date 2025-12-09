'use client';

import { X, CheckCircle, Bold, Italic, List, Link as LinkIcon, Loader2, AlertTriangle, Send, UserCheck, UserX, ArrowRightCircle } from 'lucide-react';
import { useState, useEffect } from 'react';

export default function ActionConfirmationModal({ isOpen, onClose, candidate, actionType, onConfirm }) {
    const [isSending, setIsSending] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [subject, setSubject] = useState('');
    const [message, setMessage] = useState('');
    const [withEmail, setWithEmail] = useState(true);

    // Configuration based on action type
    const config = {
        'next-round': {
            title: 'Proceed to Next Round',
            icon: <ArrowRightCircle className="text-blue-600" size={24} />,
            status: 'In Progress', // or whatever next round status is
            description: `This will move ${candidate?.name} to the next interview round.`,
            defaultSubject: 'Invitation to Next Round - PM Internship',
            defaultMessage: `Dear ${candidate?.name},\n\nWe are pleased to inform you that you have been selected for the next round of interviews for the PM Internship position. We were impressed with your profile and performance so far.\n\nPlease let us know your availability for the coming week.\n\nBest regards,\nRecruitment Team`
        },
        'shortlist': {
            title: 'Shortlist Candidate',
            icon: <UserCheck className="text-green-600" size={24} />,
            status: 'Shortlisted',
            description: `This will mark ${candidate?.name} as Shortlisted.`,
            defaultSubject: 'Update on your Application - PM Internship',
            defaultMessage: `Dear ${candidate?.name},\n\nCongratulations! We are happy to let you know that your application for the PM Internship has been shortlisted. We will be in touch shortly with next steps.\n\nBest regards,\nRecruitment Team`
        },
        'reject': {
            title: 'Reject Candidate',
            icon: <UserX className="text-red-600" size={24} />,
            status: 'Rejected',
            description: `This will mark ${candidate?.name} as Rejected. This action cannot be easily undone.`,
            defaultSubject: 'Update on your Application - PM Internship',
            defaultMessage: `Dear ${candidate?.name},\n\nThank you for your interest in the PM Internship position. After careful consideration, we regret to inform you that we will not be proceeding with your application at this time.\n\nWe wish you the best in your future endeavors.\n\nBest regards,\nRecruitment Team`
        }
    };

    const activeConfig = config[actionType] || config['next-round'];

    useEffect(() => {
        if (isOpen && candidate) {
            setSubject(activeConfig.defaultSubject);
            setMessage(activeConfig.defaultMessage.replace('{{candidate_name}}', candidate.name));
            setIsSuccess(false);
            setIsSending(false);
            setWithEmail(true);
        }
    }, [isOpen, candidate, actionType]);

    if (!isOpen || !candidate) return null;

    const handleConfirm = async () => {
        setIsSending(true);

        // Simulate API call delay
        setTimeout(() => {
            setIsSending(false);
            setIsSuccess(true);
            setTimeout(() => {
                onConfirm(actionType, withEmail ? { subject, message } : null);
                onClose();
            }, 1500);
        }, 1500);
    };

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in zoom-in duration-200">

                {/* Header */}
                <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
                    <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-lg bg-white shadow-sm border border-gray-100`}>
                            {activeConfig.icon}
                        </div>
                        <div>
                            <h2 className="text-lg font-bold text-gray-900">{activeConfig.title}</h2>
                            <p className="text-sm text-gray-500">for {candidate.name}</p>
                        </div>
                    </div>
                    <button onClick={onClose} className="p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100 transition-colors">
                        <X size={20} />
                    </button>
                </div>

                {/* Body */}
                <div className="p-6 overflow-y-auto">
                    {!isSuccess ? (
                        <div className="space-y-6">
                            {/* Confirmation Alert */}
                            <div className={`p-4 rounded-lg flex gap-3 ${actionType === 'reject' ? 'bg-red-50 text-red-700' : 'bg-blue-50 text-blue-700'}`}>
                                <AlertTriangle size={20} className="shrink-0 mt-0.5" />
                                <div className="text-sm">
                                    <p className="font-medium">{activeConfig.description}</p>
                                    <p className="opacity-90 mt-1">Are you sure you want to proceed?</p>
                                </div>
                            </div>

                            {/* Email Toggle */}
                            <div className="flex items-center gap-3 py-2">
                                <input
                                    type="checkbox"
                                    id="sendEmail"
                                    checked={withEmail}
                                    onChange={(e) => setWithEmail(e.target.checked)}
                                    className="w-4 h-4 text-primary rounded border-gray-300 focus:ring-primary"
                                />
                                <label htmlFor="sendEmail" className="text-gray-700 font-medium cursor-pointer select-none">
                                    Send email notification to candidate
                                </label>
                            </div>

                            {/* Email Editor */}
                            {withEmail && (
                                <div className="space-y-4 border rounded-lg p-4 bg-gray-50/50 animate-in slide-in-from-top-2">
                                    <div>
                                        <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Subject</label>
                                        <input
                                            type="text"
                                            value={subject}
                                            onChange={(e) => setSubject(e.target.value)}
                                            className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm text-gray-900 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Message</label>
                                        <div className="border border-gray-200 rounded-lg bg-white overflow-hidden focus-within:ring-2 focus-within:ring-primary/20 focus-within:border-primary transition-all">
                                            {/* Mini Toolbar */}
                                            <div className="flex items-center gap-1 p-1.5 border-b border-gray-100 bg-gray-50/30">
                                                <button className="p-1.5 text-gray-400 hover:text-gray-700 rounded hover:bg-gray-100"><Bold size={14} /></button>
                                                <button className="p-1.5 text-gray-400 hover:text-gray-700 rounded hover:bg-gray-100"><Italic size={14} /></button>
                                                <div className="w-px h-4 bg-gray-200 mx-1"></div>
                                                <button className="p-1.5 text-gray-400 hover:text-gray-700 rounded hover:bg-gray-100"><List size={14} /></button>
                                            </div>
                                            <textarea
                                                rows={6}
                                                value={message}
                                                onChange={(e) => setMessage(e.target.value)}
                                                className="w-full px-3 py-2 text-sm text-gray-900 outline-none resize-none"
                                            />
                                        </div>
                                        <div className="flex gap-2 mt-2">
                                            <button onClick={() => setMessage(prev => prev + ` ${candidate.name}`)} className="text-xs px-2 py-1 bg-gray-100 hover:bg-gray-200 text-gray-600 rounded border border-gray-200 transition-colors">
                                                + Name
                                            </button>
                                            <button onClick={() => setMessage(prev => prev + ` ${activeConfig.title}`)} className="text-xs px-2 py-1 bg-gray-100 hover:bg-gray-200 text-gray-600 rounded border border-gray-200 transition-colors">
                                                + Action
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className="py-12 flex flex-col items-center text-center animate-in zoom-in duration-300">
                            <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-4">
                                <CheckCircle size={32} />
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-2">Action Completed!</h3>
                            <p className="text-gray-500">
                                {withEmail ? `Email sent to ${candidate.email}` : 'Status updated successfully.'}
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
                            className={`px-6 py-2 text-white font-medium rounded-lg shadow-sm transition-all disabled:opacity-70 flex items-center gap-2
                        ${actionType === 'reject'
                                    ? 'bg-red-600 hover:bg-red-700 active:bg-red-800'
                                    : 'bg-primary hover:bg-orange-600 active:bg-orange-700'
                                }
                    `}
                        >
                            {isSending ? (
                                <>
                                    <Loader2 size={18} className="animate-spin" />
                                    Processing...
                                </>
                            ) : (
                                <>
                                    {withEmail ? <Send size={18} /> : <CheckCircle size={18} />}
                                    {withEmail ? 'Confirm & Send Email' : 'Confirm Action'}
                                </>
                            )}
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
