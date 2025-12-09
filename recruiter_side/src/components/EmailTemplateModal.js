'use client';

import { X, Save, Loader2 } from 'lucide-react';
import { useState, useEffect } from 'react';

export default function EmailTemplateModal({ isOpen, onClose, template, onSave }) {
    const [subject, setSubject] = useState('');
    const [body, setBody] = useState('');
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        if (template) {
            setSubject(template.subject);
            setBody(template.body);
        }
    }, [template]);

    if (!isOpen) return null;

    const handleSave = async () => {
        setIsSaving(true);
        await onSave({ ...template, subject, body });
        setIsSaving(false);
        onClose();
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm">
            <div className="bg-white w-full max-w-2xl rounded-xl shadow-2xl flex flex-col max-h-[90vh]">
                <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center">
                    <h2 className="text-xl font-bold text-gray-900">Edit Template: {template?.name}</h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
                        <X size={24} />
                    </button>
                </div>

                <div className="p-6 space-y-4 overflow-y-auto">
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">Subject</label>
                        <input
                            type="text"
                            value={subject}
                            onChange={(e) => setSubject(e.target.value)}
                            className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">Email Body (HTML)</label>
                        <textarea
                            value={body}
                            onChange={(e) => setBody(e.target.value)}
                            className="w-full h-64 px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary font-mono text-sm"
                        />
                        <p className="text-xs text-gray-500">
                            Available variables: <code>{`{{candidate_name}}`}</code>, <code>{`{{job_title}}`}</code>, <code>{`{{interview_link}}`}</code>
                        </p>
                    </div>
                </div>

                <div className="px-6 py-4 border-t border-gray-100 flex justify-end gap-3 bg-gray-50 rounded-b-xl">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-100 transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleSave}
                        disabled={isSaving}
                        className="px-4 py-2 bg-primary text-white rounded-lg font-medium hover:bg-orange-600 transition-colors flex items-center gap-2 disabled:opacity-50"
                    >
                        {isSaving && <Loader2 size={16} className="animate-spin" />}
                        Save Template
                    </button>
                </div>
            </div>
        </div>
    );
}
