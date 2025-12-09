'use client';

import { ArrowLeft, Calendar, Clock, Mail, Check } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';

export default function SchedulePage({ params }) {
    const [selectedDate, setSelectedDate] = useState('2023-11-20');
    const [selectedTime, setSelectedTime] = useState('10:00 AM');
    const [template, setTemplate] = useState('interview-invite');

    return (
        <div className="schedule-page">
            <div className="page-header">
                <Link href="/candidates/1" className="back-link">
                    <ArrowLeft size={20} />
                    Back to Candidate
                </Link>
                <h1 className="page-title">Schedule Interview: Rahul Sharma</h1>
            </div>

            <div className="schedule-grid">
                <div className="column left-column">
                    <div className="card calendar-card">
                        <h2 className="section-title">Select Date & Time</h2>
                        <div className="calendar-mock">
                            <div className="calendar-header">
                                <span>November 2023</span>
                                <div className="calendar-nav">
                                    <button>&lt;</button>
                                    <button>&gt;</button>
                                </div>
                            </div>
                            <div className="calendar-grid">
                                <div className="day-header">Mon</div>
                                <div className="day-header">Tue</div>
                                <div className="day-header">Wed</div>
                                <div className="day-header">Thu</div>
                                <div className="day-header">Fri</div>
                                <div className="day-header">Sat</div>
                                <div className="day-header">Sun</div>

                                {/* Mock days */}
                                <div className="day disabled">29</div>
                                <div className="day disabled">30</div>
                                <div className="day">1</div>
                                <div className="day">2</div>
                                <div className="day">3</div>
                                <div className="day weekend">4</div>
                                <div className="day weekend">5</div>

                                <div className="day">6</div>
                                <div className="day">7</div>
                                <div className="day">8</div>
                                <div className="day">9</div>
                                <div className="day">10</div>
                                <div className="day weekend">11</div>
                                <div className="day weekend">12</div>

                                <div className="day">13</div>
                                <div className="day">14</div>
                                <div className="day">15</div>
                                <div className="day">16</div>
                                <div className="day">17</div>
                                <div className="day weekend">18</div>
                                <div className="day weekend">19</div>

                                <div className="day selected">20</div>
                                <div className="day">21</div>
                                <div className="day">22</div>
                                <div className="day">23</div>
                                <div className="day">24</div>
                                <div className="day weekend">25</div>
                                <div className="day weekend">26</div>
                            </div>
                        </div>

                        <div className="time-slots">
                            <h3 className="subsection-title">Available Slots</h3>
                            <div className="slots-grid">
                                {['09:00 AM', '10:00 AM', '11:30 AM', '02:00 PM', '04:30 PM'].map(time => (
                                    <button
                                        key={time}
                                        className={`slot-btn ${selectedTime === time ? 'selected' : ''}`}
                                        onClick={() => setSelectedTime(time)}
                                    >
                                        {time}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                <div className="column right-column">
                    <div className="card email-card">
                        <h2 className="section-title">Email Invitation</h2>

                        <div className="form-group">
                            <label>Template</label>
                            <select
                                value={template}
                                onChange={(e) => setTemplate(e.target.value)}
                            >
                                <option value="interview-invite">Interview Invitation</option>
                                <option value="follow-up">Follow Up</option>
                                <option value="rejection">Rejection</option>
                            </select>
                        </div>

                        <div className="email-preview">
                            <div className="email-header">
                                <div className="field"><strong>To:</strong> rahul.sharma@example.com</div>
                                <div className="field"><strong>Subject:</strong> Interview Invitation - Product Analyst Intern</div>
                            </div>
                            <div className="email-body">
                                <p>Dear Rahul,</p>
                                <p>We are pleased to invite you for a 1-on-1 interview for the Product Analyst Intern position.</p>
                                <p><strong>Date:</strong> {selectedDate}</p>
                                <p><strong>Time:</strong> {selectedTime}</p>
                                <p>Please confirm your availability by clicking the link below.</p>
                                <p>Best regards,<br />Recruiting Team</p>
                            </div>
                        </div>

                        <div className="action-buttons">
                            <button className="btn btn-outline">Preview</button>
                            <button className="btn btn-primary">
                                <Mail size={18} />
                                Send Invitation
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <style jsx>{`
        .schedule-page {
          display: flex;
          flex-direction: column;
          gap: 2rem;
        }

        .back-link {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          color: var(--text-secondary);
          margin-bottom: 1rem;
        }

        .page-title {
          font-size: 1.875rem;
          font-weight: 700;
          color: var(--text-primary);
        }

        .schedule-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 2rem;
        }

        .card {
          background-color: var(--surface);
          border: 1px solid var(--border);
          border-radius: var(--radius);
          padding: 2rem;
          height: 100%;
        }

        .section-title {
          font-size: 1.25rem;
          font-weight: 600;
          margin-bottom: 1.5rem;
          color: var(--text-primary);
        }

        .calendar-mock {
          margin-bottom: 2rem;
        }

        .calendar-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1rem;
          font-weight: 600;
        }

        .calendar-nav button {
          background: none;
          border: 1px solid var(--border);
          color: var(--text-primary);
          width: 28px;
          height: 28px;
          border-radius: 4px;
          cursor: pointer;
          margin-left: 0.5rem;
        }

        .calendar-grid {
          display: grid;
          grid-template-columns: repeat(7, 1fr);
          gap: 0.5rem;
          text-align: center;
        }

        .day-header {
          font-size: 0.8rem;
          color: var(--text-secondary);
          margin-bottom: 0.5rem;
        }

        .day {
          height: 36px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 50%;
          cursor: pointer;
          font-size: 0.9rem;
        }

        .day:hover:not(.disabled) {
          background-color: var(--surface-hover);
        }

        .day.selected {
          background-color: var(--primary);
          color: white;
        }

        .day.disabled {
          color: var(--text-secondary);
          opacity: 0.5;
          cursor: default;
        }

        .day.weekend {
          color: var(--error);
        }

        .subsection-title {
          font-size: 1rem;
          font-weight: 600;
          margin-bottom: 1rem;
          color: var(--text-primary);
        }

        .slots-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 0.75rem;
        }

        .slot-btn {
          padding: 0.75rem;
          background-color: var(--background);
          border: 1px solid var(--border);
          border-radius: var(--radius);
          color: var(--text-primary);
          cursor: pointer;
          transition: all 0.2s;
        }

        .slot-btn:hover {
          border-color: var(--primary);
        }

        .slot-btn.selected {
          background-color: var(--primary);
          color: white;
          border-color: var(--primary);
        }

        .form-group {
          margin-bottom: 1.5rem;
        }

        .form-group label {
          display: block;
          font-size: 0.9rem;
          color: var(--text-secondary);
          margin-bottom: 0.5rem;
        }

        select {
          width: 100%;
          padding: 0.75rem;
          background-color: var(--background);
          border: 1px solid var(--border);
          border-radius: var(--radius);
          color: var(--text-primary);
          outline: none;
        }

        .email-preview {
          background-color: var(--background);
          border: 1px solid var(--border);
          border-radius: var(--radius);
          padding: 1.5rem;
          margin-bottom: 2rem;
        }

        .email-header {
          border-bottom: 1px solid var(--border);
          padding-bottom: 1rem;
          margin-bottom: 1rem;
        }

        .field {
          margin-bottom: 0.5rem;
          font-size: 0.9rem;
        }

        .email-body {
          font-size: 0.95rem;
          line-height: 1.6;
        }

        .email-body p {
          margin-bottom: 1rem;
        }

        .action-buttons {
          display: flex;
          justify-content: flex-end;
          gap: 1rem;
        }
      `}</style>
        </div>
    );
}
