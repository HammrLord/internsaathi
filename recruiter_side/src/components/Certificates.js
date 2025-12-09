'use client';

import { useState } from 'react';
import { Upload, FileText, CheckCircle, Clock, AlertTriangle, Eye, Loader2, ShieldCheck } from 'lucide-react';

export default function Certificates({ certificates, onUpload, onVerify, candidateName }) {
    const [isUploading, setIsUploading] = useState(false);
    const [verifyingId, setVerifyingId] = useState(null);

    const handleFileUpload = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        setIsUploading(true);
        // Simulate upload delay
        setTimeout(() => {
            onUpload({
                id: Date.now(),
                name: file.name,
                issuer: 'Unknown Issuer', // Would be extracted
                date: new Date().toLocaleDateString(),
                status: 'uploaded',
                fileUrl: '#'
            });
            setIsUploading(false);
        }, 1500);
    };

    const handleVerify = async (certId) => {
        setVerifyingId(certId);
        try {
            const response = await fetch('/api/certificates/verify', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name: candidateName })
            });

            const data = await response.json();
            onVerify(certId, data.verified ? 'verified' : 'failed');

            if (data.verified) {
                // Verification successful
            } else {
                // Verification failed
            }
        } catch (error) {
            console.error('Verification error:', error);
            onVerify(certId, 'failed');
        } finally {
            setVerifyingId(null);
        }
    };

    return (
        <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
            <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-bold text-gray-900">Certificates & Documents</h3>
                <div className="flex items-center gap-3">
                    <a
                        href="http://localhost:5173"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 px-4 py-2 bg-green-50 border border-green-200 rounded-lg text-sm font-medium text-green-700 hover:bg-green-100 transition-colors"
                    >
                        <ShieldCheck size={16} />
                        Verify Authenticity
                    </a>
                    <label className="cursor-pointer inline-flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
                        <Upload size={16} />
                        Upload New
                        <input type="file" className="hidden" accept=".pdf,.jpg,.png" onChange={handleFileUpload} />
                    </label>
                </div>
            </div>

            {isUploading && (
                <div className="flex items-center justify-center p-8 border-2 border-dashed border-gray-200 rounded-lg mb-4 bg-gray-50">
                    <Loader2 className="animate-spin text-primary mr-2" />
                    <span className="text-gray-500">Uploading and processing document...</span>
                </div>
            )}

            <div className="space-y-4">
                {certificates.length === 0 && !isUploading && (
                    <div className="text-center py-8 text-gray-500 border-2 border-dashed border-gray-200 rounded-lg">
                        No certificates uploaded yet.
                    </div>
                )}

                {certificates.map((cert) => (
                    <div key={cert.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:border-primary transition-colors bg-white">
                        <div className="flex items-center gap-4">
                            <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
                                <FileText size={24} />
                            </div>
                            <div>
                                <h4 className="font-medium text-gray-900">{cert.name}</h4>
                                <div className="flex items-center gap-2 text-sm text-gray-500">
                                    <span>{cert.issuer}</span>
                                    <span>•</span>
                                    <span>{cert.date}</span>
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center gap-4">
                            {/* Status Badge */}
                            <div className={`flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium border ${cert.status === 'verified' ? 'bg-green-50 text-green-700 border-green-200' :
                                cert.status === 'processing' ? 'bg-yellow-50 text-yellow-700 border-yellow-200' :
                                    cert.status === 'failed' ? 'bg-red-50 text-red-700 border-red-200' :
                                        'bg-gray-50 text-gray-700 border-gray-200'
                                }`}>
                                {cert.status === 'verified' && <CheckCircle size={12} />}
                                {cert.status === 'processing' && <Loader2 size={12} className="animate-spin" />}
                                {cert.status === 'failed' && <AlertTriangle size={12} />}
                                {cert.status === 'uploaded' && <Clock size={12} />}
                                <span className="capitalize">{cert.status}</span>
                            </div>

                            {/* Actions */}
                            <div className="flex items-center gap-2">
                                {cert.status === 'uploaded' && (
                                    <button
                                        onClick={() => handleVerify(cert.id)}
                                        disabled={verifyingId === cert.id}
                                        className="text-sm text-primary hover:text-orange-700 font-medium px-2 py-1 disabled:opacity-50"
                                    >
                                        {verifyingId === cert.id ? 'Verifying...' : 'Verify Authenticity'}
                                    </button>
                                )}
                                <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg">
                                    <Eye size={18} />
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
