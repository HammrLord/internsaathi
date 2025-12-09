'use client';

import { useState, useEffect } from 'react';
import { X, Save, Plus, Trash2 } from 'lucide-react';

export default function JobEditModal({ job, isOpen, onClose, onSave }) {
    const [formData, setFormData] = useState(job || {});

    useEffect(() => {
        if (job) {
            setFormData(job);
        }
    }, [job]);

    if (!isOpen || !job) return null;

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleArrayChange = (index, field, value) => {
        const newArray = [...formData[field]];
        newArray[index] = value;
        setFormData(prev => ({ ...prev, [field]: newArray }));
    };

    const addArrayItem = (field) => {
        setFormData(prev => ({ ...prev, [field]: [...(prev[field] || []), ''] }));
    };

    const removeArrayItem = (index, field) => {
        const newArray = [...formData[field]];
        newArray.splice(index, 1);
        setFormData(prev => ({ ...prev, [field]: newArray }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave(formData);
        onClose();
    };

    return (
        <div className="fixed inset-0 z-50 overflow-y-auto">
            <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
                <div className="fixed inset-0 transition-opacity bg-black bg-opacity-50" onClick={onClose} />

                <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

                <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-2xl w-full">
                    <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                        <div className="flex justify-between items-center mb-5">
                            <h3 className="text-lg leading-6 font-medium text-gray-900">Edit Job: {job.title}</h3>
                            <button onClick={onClose} className="text-gray-400 hover:text-gray-500">
                                <X size={24} />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Job Title</label>
                                    <input
                                        type="text"
                                        name="title"
                                        value={formData.title || ''}
                                        onChange={handleChange}
                                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm text-gray-900"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Location</label>
                                    <input
                                        type="text"
                                        name="location"
                                        value={formData.location || ''}
                                        onChange={handleChange}
                                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm text-gray-900"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Type</label>
                                    <select
                                        name="type"
                                        value={formData.type || 'Full-time'}
                                        onChange={handleChange}
                                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm text-gray-900"
                                    >
                                        <option>Full-time</option>
                                        <option>Part-time</option>
                                        <option>Internship</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Status</label>
                                    <select
                                        name="status"
                                        value={formData.status || 'Active'}
                                        onChange={handleChange}
                                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm text-gray-900"
                                    >
                                        <option>Active</option>
                                        <option>Closed</option>
                                        <option>Draft</option>
                                    </select>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700">Description</label>
                                <textarea
                                    name="description"
                                    rows={4}
                                    value={formData.description || ''}
                                    onChange={handleChange}
                                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm text-gray-900"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Responsibilities</label>
                                {formData.responsibilities?.map((item, index) => (
                                    <div key={index} className="flex gap-2 mb-2">
                                        <input
                                            type="text"
                                            value={item}
                                            onChange={(e) => handleArrayChange(index, 'responsibilities', e.target.value)}
                                            className="flex-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm text-gray-900"
                                        />
                                        <button type="button" onClick={() => removeArrayItem(index, 'responsibilities')} className="text-red-500 hover:text-red-700">
                                            <Trash2 size={18} />
                                        </button>
                                    </div>
                                ))}
                                <button type="button" onClick={() => addArrayItem('responsibilities')} className="text-sm text-primary hover:text-orange-700 flex items-center gap-1">
                                    <Plus size={16} /> Add Responsibility
                                </button>
                            </div>

                            <div className="pt-4 border-t border-gray-200 flex justify-end gap-3">
                                <button
                                    type="button"
                                    onClick={onClose}
                                    className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                                >
                                    <Save size={18} className="mr-2" />
                                    Save Changes
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}
