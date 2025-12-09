-- Database Schema for PM Recruit Platform

-- Users Table (Recruiters, Admins)
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(100),
    role VARCHAR(50) DEFAULT 'recruiter', -- 'admin', 'recruiter', 'reviewer'
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Jobs Table
CREATE TABLE jobs (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    location VARCHAR(100),
    status VARCHAR(50) DEFAULT 'active', -- 'active', 'closed', 'draft'
    min_education VARCHAR(100),
    required_skills TEXT[], -- Array of strings
    created_by INTEGER REFERENCES users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Candidates Table
CREATE TABLE candidates (
    id SERIAL PRIMARY KEY,
    full_name VARCHAR(100) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    phone VARCHAR(20),
    location VARCHAR(100),
    education_level VARCHAR(100),
    education_institute VARCHAR(255),
    resume_url TEXT,
    skills TEXT[],
    match_score INTEGER,
    status VARCHAR(50) DEFAULT 'applied', -- 'applied', 'shortlisted', 'interviewed', 'rejected', 'hired'
    job_id INTEGER REFERENCES jobs(id),
    is_eligible BOOLEAN DEFAULT TRUE,
    eligibility_notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Interviews Table (AI Interviews)
CREATE TABLE interviews (
    id SERIAL PRIMARY KEY,
    candidate_id INTEGER REFERENCES candidates(id),
    status VARCHAR(50) DEFAULT 'scheduled', -- 'scheduled', 'completed', 'reviewed'
    score INTEGER,
    summary TEXT,
    transcript_url TEXT,
    video_url TEXT,
    strengths TEXT[],
    weaknesses TEXT[],
    completed_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Timeline Events Table
CREATE TABLE timeline_events (
    id SERIAL PRIMARY KEY,
    candidate_id INTEGER REFERENCES candidates(id),
    type VARCHAR(50) NOT NULL, -- 'application', 'email', 'interview', 'status_change', 'alert'
    title VARCHAR(255) NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Email Templates Table
CREATE TABLE email_templates (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    subject VARCHAR(255) NOT NULL,
    body TEXT NOT NULL,
    created_by INTEGER REFERENCES users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
