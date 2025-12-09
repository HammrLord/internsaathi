'use client';

import { useState, useEffect } from 'react';
import { Mail, Edit2, ChevronRight, Loader2 } from 'lucide-react';
import EmailTemplateModal from '@/components/EmailTemplateModal';

export default function EmailTemplatesPage() {
    const [templates, setTemplates] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [editingTemplate, setEditingTemplate] = useState(null);

    useEffect(() => {
        fetchTemplates();
    }, []);

    const fetchTemplates = async () => {
        try {
            const res = await fetch('/api/templates');
            const data = await res.json();
            setTemplates(data.templates);
        } catch (error) {
            console.error('Failed to fetch templates:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleSaveTemplate = async (updatedTemplate) => {
        try {
            await fetch('/api/templates', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(updatedTemplate),
            });
            fetchTemplates(); // Refresh list
        } catch (error) {
            console.error('Failed to save template:', error);
        }
    };

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-gray-900">Email Templates</h1>
                <p className="text-gray-500 mt-1">Manage automated email templates for recruitment.</p>
            </div>

            {isLoading ? (
                <div className="flex justify-center py-12">
                    <Loader2 size={32} className="animate-spin text-primary" />
                </div>
            ) : (
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {templates.map((template) => (
                        <div key={template.id} className="bg-white border border-gray-200 rounded-xl p-6 hover:border-primary transition-colors shadow-sm flex flex-col">
                            <div className="flex items-start justify-between mb-4">
                                <div className="p-3 bg-orange-50 rounded-lg text-primary">
                                    <Mail size={24} />
                                </div>
                                <button
                                    onClick={() => setEditingTemplate(template)}
                                    className="p-2 text-gray-400 hover:text-primary hover:bg-gray-50 rounded-lg transition-colors"
                                >
                                    <Edit2 size={18} />
                                </button>
                            </div>

                            <h3 className="font-bold text-gray-900 mb-2">{template.name}</h3>
                            <p className="text-sm text-gray-500 mb-4 line-clamp-2">{template.subject}</p>

                            <div className="mt-auto pt-4 border-t border-gray-100 flex items-center justify-between text-sm">
                                <span className="text-gray-400">Last updated: Just now</span>
                                <button
                                    onClick={() => setEditingTemplate(template)}
                                    className="text-primary font-medium flex items-center gap-1 hover:gap-2 transition-all"
                                >
                                    Edit <ChevronRight size={14} />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            <EmailTemplateModal
                isOpen={!!editingTemplate}
                onClose={() => setEditingTemplate(null)}
                template={editingTemplate}
                onSave={handleSaveTemplate}
            />
        </div>
    );
}
