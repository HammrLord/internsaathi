'use client';

import { X, CheckCircle, ChevronDown, Bold, Italic, List, Link as LinkIcon, Loader2 } from 'lucide-react';
import { useState, useEffect } from 'react';

export default function SendEmailModal({ isOpen, onClose, candidateName, candidateEmail }) {
  const [template, setTemplate] = useState('Interview Invite');
  const [templates, setTemplates] = useState([]);
  const [isSent, setIsSent] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [subject, setSubject] = useState('Invitation to Interview - PM Internship');
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (isOpen) {
      // Fetch templates
      fetch('/api/templates')
        .then(res => res.json())
        .then(data => {
          if (data.templates) {
            setTemplates(data.templates);
            // Set initial message based on default template
            const defaultTemplate = data.templates.find(t => t.name === 'Interview Invite');
            if (defaultTemplate) setMessage(defaultTemplate.body.replace('{{candidate_name}}', candidateName));
          }
        })
        .catch(err => console.error('Failed to fetch templates', err));
    }
  }, [isOpen, candidateName]);

  if (!isOpen) return null;

  const handleSend = async () => {
    setIsSending(true);
    try {
      const res = await fetch('/api/email/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          to: candidateEmail,
          subject,
          message,
          template
        })
      });

      if (res.ok) {
        setIsSent(true);
        setTimeout(() => {
          setIsSent(false);
          setIsSending(false);
          onClose();
        }, 2000);
      } else {
        alert('Failed to send email');
        setIsSending(false);
      }
    } catch (error) {
      console.error('Error sending email:', error);
      alert('Error sending email');
      setIsSending(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-container">
        <div className="modal-header">
          <h2>Send Email</h2>
          <button onClick={onClose} className="close-btn"><X size={20} /></button>
        </div>

        {!isSent ? (
          <div className="modal-body">
            <div className="form-group">
              <label>Template</label>
              <div className="select-wrapper">
                <select value={template} onChange={(e) => {
                  setTemplate(e.target.value);
                  const selected = templates.find(t => t.name === e.target.value);
                  if (selected) {
                    setSubject(selected.subject);
                    setMessage(selected.body.replace('{{candidate_name}}', candidateName));
                  }
                }}>
                  {templates.length > 0 ? templates.map(t => (
                    <option key={t.id} value={t.name}>{t.name}</option>
                  )) : (
                    <>
                      <option>Interview Invite</option>
                      <option>Shortlist Notification</option>
                      <option>Rejection</option>
                    </>
                  )}
                </select>
                <ChevronDown size={16} className="select-icon" />
              </div>
            </div>

            <div className="form-group">
              <label>To</label>
              <input type="text" value={`${candidateName} <${candidateEmail}>`} readOnly className="readonly-input" />
            </div>

            <div className="form-group">
              <label>Subject</label>
              <input type="text" value={subject} onChange={(e) => setSubject(e.target.value)} />
            </div>

            <div className="form-group">
              <label>Message</label>
              <div className="rich-editor">
                <div className="editor-toolbar">
                  <button><Bold size={16} /></button>
                  <button><Italic size={16} /></button>
                  <button><List size={16} /></button>
                  <button><LinkIcon size={16} /></button>
                </div>
                <textarea
                  rows={8}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                />
              </div>
              <div className="variable-helpers">
                <span>Insert: </span>
                <button className="pill" onClick={() => setMessage(prev => prev + ' {{candidate_name}}')}>{{ candidate_name }}</button>
                <button className="pill" onClick={() => setMessage(prev => prev + ' {{job_title}}')}>{{ job_title }}</button>
                <button className="pill" onClick={() => setMessage(prev => prev + ' {{interview_link}}')}>{{ interview_link }}</button>
              </div>
            </div>
          </div>
        ) : (
          <div className="success-state">
            <CheckCircle size={48} color="var(--success)" />
            <h3>Email Sent Successfully</h3>
            <p>Delivered to {candidateEmail}</p>
          </div>
        )}

        {!isSent && (
          <div className="modal-footer">
            <button className="btn btn-outline" onClick={onClose} disabled={isSending}>Cancel</button>
            <button className="btn btn-primary flex items-center gap-2" onClick={handleSend} disabled={isSending}>
              {isSending && <Loader2 size={16} className="animate-spin" />}
              {isSending ? 'Sending...' : 'Send Email'}
            </button>
          </div>
        )}
      </div>

      <style jsx>{`
        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-color: rgba(0, 0, 0, 0.5);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 100;
          backdrop-filter: blur(2px);
        }

        .modal-container {
          background-color: var(--surface);
          width: 600px;
          border-radius: var(--radius);
          box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
          display: flex;
          flex-direction: column;
          max-height: 90vh;
        }

        .modal-header {
          padding: 1.5rem;
          border-bottom: 1px solid var(--border);
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .modal-header h2 {
          font-size: 1.25rem;
          font-weight: 600;
          color: var(--text-primary);
        }

        .close-btn {
          background: none;
          border: none;
          cursor: pointer;
          color: var(--text-secondary);
        }

        .modal-body {
          padding: 1.5rem;
          overflow-y: auto;
          display: flex;
          flex-direction: column;
          gap: 1.25rem;
        }

        .form-group {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .form-group label {
          font-size: 0.875rem;
          font-weight: 500;
          color: var(--text-secondary);
        }

        input, select, textarea {
          padding: 0.75rem;
          border: 1px solid var(--border);
          border-radius: var(--radius);
          font-family: inherit;
          font-size: 0.95rem;
          outline: none;
          background-color: var(--bg);
          color: var(--text-primary);
        }

        input:focus, select:focus, textarea:focus {
          border-color: var(--primary);
          box-shadow: 0 0 0 2px rgba(255, 153, 51, 0.1);
        }

        .select-wrapper {
          position: relative;
        }

        .select-wrapper select {
          width: 100%;
          appearance: none;
        }

        .select-icon {
          position: absolute;
          right: 1rem;
          top: 50%;
          transform: translateY(-50%);
          pointer-events: none;
          color: var(--text-secondary);
        }

        .readonly-input {
          background-color: var(--card);
          color: var(--text-secondary);
        }

        .rich-editor {
          border: 1px solid var(--border);
          border-radius: var(--radius);
          overflow: hidden;
        }

        .editor-toolbar {
          background-color: var(--card);
          padding: 0.5rem;
          border-bottom: 1px solid var(--border);
          display: flex;
          gap: 0.5rem;
        }

        .editor-toolbar button {
          background: none;
          border: none;
          padding: 0.25rem;
          border-radius: 4px;
          cursor: pointer;
          color: var(--text-secondary);
        }

        .editor-toolbar button:hover {
          background-color: rgba(0, 0, 0, 0.05);
          color: var(--text-primary);
        }

        .rich-editor textarea {
          border: none;
          width: 100%;
          resize: vertical;
          border-radius: 0;
        }

        .variable-helpers {
          display: flex;
          gap: 0.5rem;
          align-items: center;
          font-size: 0.85rem;
          color: var(--text-secondary);
          flex-wrap: wrap;
        }

        .pill {
          background-color: var(--card);
          border: 1px solid var(--border);
          padding: 0.25rem 0.5rem;
          border-radius: 12px;
          font-size: 0.8rem;
          cursor: pointer;
          color: var(--chakra);
          font-family: monospace;
        }

        .pill:hover {
          border-color: var(--chakra);
          background-color: rgba(5, 74, 145, 0.05);
        }

        .modal-footer {
          padding: 1.5rem;
          border-top: 1px solid var(--border);
          display: flex;
          justify-content: flex-end;
          gap: 1rem;
          background-color: var(--card);
        }

        .success-state {
          padding: 4rem 2rem;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 1rem;
          text-align: center;
        }

        .success-state h3 {
          font-size: 1.25rem;
          font-weight: 600;
          color: var(--text-primary);
        }

        .success-state p {
          color: var(--text-secondary);
        }
      `}</style>
    </div>
  );
}
