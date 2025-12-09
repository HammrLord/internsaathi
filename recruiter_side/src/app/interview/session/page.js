'use client';

import { useState, useEffect, useRef } from 'react';
import { Mic, Video, VideoOff, MicOff, PhoneOff, MessageSquare, Send } from 'lucide-react';
import Link from 'next/link';

export default function InterviewSessionPage() {
    const [isRecording, setIsRecording] = useState(false);
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [transcript, setTranscript] = useState([]);
    const [isVideoOn, setIsVideoOn] = useState(true);
    const [isMicOn, setIsMicOn] = useState(true);

    const questions = [
        "Tell me about a time you had to prioritize multiple conflicting deadlines.",
        "How do you approach breaking down a complex problem?",
        "Describe a project where you had to use SQL to analyze data.",
        "What is your favorite product and how would you improve it?"
    ];

    const handleStartAnswer = () => {
        setIsRecording(true);
        // Simulate recording duration
        setTimeout(() => {
            setIsRecording(false);
            addTranscript("Candidate", "I once had to manage three different projects during my final year. I used a prioritization matrix to rank tasks based on urgency and impact...");

            // AI Follow-up simulation
            setTimeout(() => {
                addTranscript("AI Interviewer", "That's interesting. How did you handle the communication with your team members during that time?");
            }, 1500);

        }, 3000);
    };

    const addTranscript = (speaker, text) => {
        setTranscript(prev => [...prev, { speaker, text, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }]);
    };

    const nextQuestion = () => {
        if (currentQuestion < questions.length - 1) {
            setCurrentQuestion(prev => prev + 1);
        }
    };

    return (
        <div className="interview-session">
            <div className="main-stage">
                <div className="video-feed main-feed">
                    {isVideoOn ? (
                        <div className="camera-placeholder">
                            <div className="user-label">You (Candidate)</div>
                        </div>
                    ) : (
                        <div className="camera-off">
                            <VideoOff size={48} />
                            <span>Camera Off</span>
                        </div>
                    )}
                </div>

                <div className="ai-feed">
                    <div className="ai-avatar">
                        <div className="pulse-ring"></div>
                        <span>AI</span>
                    </div>
                    <div className="ai-status">AI is listening...</div>
                </div>

                <div className="controls-bar">
                    <button className={`control-btn ${!isMicOn ? 'off' : ''}`} onClick={() => setIsMicOn(!isMicOn)}>
                        {isMicOn ? <Mic size={24} /> : <MicOff size={24} />}
                    </button>
                    <button className={`control-btn ${!isVideoOn ? 'off' : ''}`} onClick={() => setIsVideoOn(!isVideoOn)}>
                        {isVideoOn ? <Video size={24} /> : <VideoOff size={24} />}
                    </button>
                    <button className="control-btn end-call">
                        <PhoneOff size={24} />
                    </button>
                </div>
            </div>

            <div className="sidebar-panel">
                <div className="panel-header">
                    <h2>Interview Session</h2>
                    <span className="timer">12:45</span>
                </div>

                <div className="question-card">
                    <h3>Question {currentQuestion + 1} of {questions.length}</h3>
                    <p className="question-text">{questions[currentQuestion]}</p>
                    <button className="btn btn-primary w-full" onClick={handleStartAnswer} disabled={isRecording}>
                        {isRecording ? 'Recording Answer...' : 'Start Answering'}
                    </button>
                    <button className="btn btn-outline w-full mt-2" onClick={nextQuestion}>
                        Next Question
                    </button>
                </div>

                <div className="transcript-box">
                    <h3><MessageSquare size={16} /> Live Transcript</h3>
                    <div className="messages-list">
                        {transcript.map((msg, idx) => (
                            <div key={idx} className={`message ${msg.speaker === 'AI Interviewer' ? 'ai' : 'user'}`}>
                                <div className="msg-header">
                                    <span className="speaker">{msg.speaker}</span>
                                    <span className="time">{msg.time}</span>
                                </div>
                                <p>{msg.text}</p>
                            </div>
                        ))}
                        {transcript.length === 0 && (
                            <p className="empty-state">Transcript will appear here...</p>
                        )}
                    </div>
                </div>
            </div>

            <style jsx>{`
        .interview-session {
          display: flex;
          height: 100vh;
          background-color: #0f172a;
          color: white;
          overflow: hidden;
        }

        .main-stage {
          flex: 1;
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 2rem;
        }

        .video-feed {
          width: 100%;
          height: 100%;
          background-color: #1e293b;
          border-radius: 24px;
          overflow: hidden;
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .camera-placeholder {
          width: 100%;
          height: 100%;
          background: linear-gradient(135deg, #334155, #1e293b);
          display: flex;
          align-items: flex-end;
          justify-content: center;
          padding-bottom: 2rem;
        }

        .user-label {
          background-color: rgba(0, 0, 0, 0.6);
          padding: 0.5rem 1rem;
          border-radius: 20px;
          font-size: 0.9rem;
        }

        .camera-off {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 1rem;
          color: #64748b;
        }

        .ai-feed {
          position: absolute;
          top: 3rem;
          right: 3rem;
          width: 180px;
          height: 240px;
          background-color: #0f172a;
          border-radius: 16px;
          border: 1px solid #334155;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.5);
          z-index: 10;
        }

        .ai-avatar {
          width: 80px;
          height: 80px;
          background: linear-gradient(135deg, #6366f1, #8b5cf6);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 700;
          font-size: 1.5rem;
          position: relative;
          margin-bottom: 1rem;
        }

        .pulse-ring {
          position: absolute;
          width: 100%;
          height: 100%;
          border-radius: 50%;
          border: 2px solid #6366f1;
          animation: pulse 2s infinite;
        }

        @keyframes pulse {
          0% { transform: scale(1); opacity: 0.8; }
          100% { transform: scale(1.5); opacity: 0; }
        }

        .ai-status {
          font-size: 0.8rem;
          color: #94a3b8;
        }

        .controls-bar {
          position: absolute;
          bottom: 3rem;
          display: flex;
          gap: 1.5rem;
          background-color: rgba(30, 41, 59, 0.8);
          padding: 1rem 2rem;
          border-radius: 40px;
          backdrop-filter: blur(10px);
        }

        .control-btn {
          width: 50px;
          height: 50px;
          border-radius: 50%;
          border: none;
          background-color: #334155;
          color: white;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.2s;
        }

        .control-btn:hover {
          background-color: #475569;
        }

        .control-btn.off {
          background-color: #ef4444;
          color: white;
        }

        .control-btn.end-call {
          background-color: #ef4444;
          width: 60px;
          height: 60px;
        }

        .sidebar-panel {
          width: 400px;
          background-color: #1e293b;
          border-left: 1px solid #334155;
          display: flex;
          flex-direction: column;
          padding: 1.5rem;
        }

        .panel-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 2rem;
        }

        .panel-header h2 {
          font-size: 1.25rem;
          font-weight: 600;
        }

        .timer {
          font-family: monospace;
          background-color: #0f172a;
          padding: 0.25rem 0.75rem;
          border-radius: 4px;
          color: #ef4444;
        }

        .question-card {
          background-color: #0f172a;
          padding: 1.5rem;
          border-radius: 12px;
          margin-bottom: 2rem;
          border: 1px solid #334155;
        }

        .question-card h3 {
          font-size: 0.9rem;
          color: #94a3b8;
          margin-bottom: 0.5rem;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        .question-text {
          font-size: 1.1rem;
          line-height: 1.5;
          margin-bottom: 1.5rem;
        }

        .transcript-box {
          flex: 1;
          display: flex;
          flex-direction: column;
          overflow: hidden;
        }

        .transcript-box h3 {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-size: 1rem;
          margin-bottom: 1rem;
          color: #94a3b8;
        }

        .messages-list {
          flex: 1;
          overflow-y: auto;
          display: flex;
          flex-direction: column;
          gap: 1rem;
          padding-right: 0.5rem;
        }

        .message {
          padding: 1rem;
          border-radius: 12px;
          background-color: #0f172a;
          font-size: 0.9rem;
        }

        .message.ai {
          border-left: 3px solid #6366f1;
        }

        .message.user {
          border-left: 3px solid #10b981;
        }

        .msg-header {
          display: flex;
          justify-content: space-between;
          margin-bottom: 0.5rem;
          font-size: 0.8rem;
          color: #94a3b8;
        }

        .speaker {
          font-weight: 600;
          color: white;
        }

        .empty-state {
          text-align: center;
          color: #64748b;
          font-style: italic;
          margin-top: 2rem;
        }

        .mt-2 { margin-top: 0.5rem; }
      `}</style>
        </div>
    );
}
