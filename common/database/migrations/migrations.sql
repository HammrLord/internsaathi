-- Create Users Table
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    role VARCHAR(50) DEFAULT 'recruiter',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create Jobs Table
CREATE TABLE IF NOT EXISTS jobs (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    location VARCHAR(255),
    type VARCHAR(50),
    status VARCHAR(50) DEFAULT 'Active',
    applicants_count INT DEFAULT 0,
    posted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create Candidates Table
CREATE TABLE IF NOT EXISTS candidates (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    role VARCHAR(255),
    email VARCHAR(255) UNIQUE NOT NULL,
    phone VARCHAR(50),
    location VARCHAR(255),
    education VARCHAR(255),
    match_score INT,
    status VARCHAR(50) DEFAULT 'Applied',
    summary TEXT,
    skills TEXT[], -- Array of strings
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create Interviews Table
CREATE TABLE IF NOT EXISTS interviews (
    id SERIAL PRIMARY KEY,
    candidate_id INT REFERENCES candidates(id),
    date DATE,
    time TIME,
    duration VARCHAR(50),
    mode VARCHAR(50),
    status VARCHAR(50) DEFAULT 'Scheduled',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create Email Templates Table
CREATE TABLE IF NOT EXISTS email_templates (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    subject VARCHAR(255),
    body TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Initial Data
INSERT INTO jobs (title, location, type, status, applicants_count) VALUES
('Product Analyst Intern', 'Bangalore', 'Full-time', 'Active', 45),
('UX Research Intern', 'Remote', 'Internship', 'Active', 32);

INSERT INTO candidates (name, role, email, location, match_score, status, skills) VALUES
('Rahul Sharma', 'Product Analyst Intern', 'rahul.sharma@example.com', 'Bangalore, India', 94, 'Shortlisted', ARRAY['Product Strategy', 'SQL', 'Figma']),
('Priya Patel', 'Product Analyst Intern', 'priya.p@example.com', 'Mumbai, India', 88, 'Applied', ARRAY['Data Analysis', 'Excel']),
('Amit Singh', 'Product Analyst Intern', 'amit.singh@example.com', 'Delhi, India', 76, 'Rejected', ARRAY['Communication']);

INSERT INTO email_templates (name, subject, body) VALUES
('Interview Invite', 'Invitation to Interview - PM Internship', 'Dear {{candidate_name}},\n\nWe are pleased to invite you...'),
('Shortlist Notification', 'You have been shortlisted', 'Congratulations {{candidate_name}},...'),
('Rejection', 'Update on your application', 'Dear {{candidate_name}},\n\nThank you for your interest...');
