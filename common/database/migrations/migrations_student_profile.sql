-- Create student_profiles table
CREATE TABLE IF NOT EXISTS student_profiles (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    email VARCHAR(255) UNIQUE NOT NULL,
    title VARCHAR(255), -- e.g. "Computer Science Student"
    bio TEXT,
    skills TEXT[],
    projects JSONB, -- Array of objects: { title, description, link }
    experience JSONB, -- Array of objects: { role, company, duration, description }
    education JSONB, -- Array of objects: { degree, institute, year, grade }
    social_links JSONB, -- { linkedin, github, portfolio }
    resume_url TEXT,
    preferences TEXT, -- What they are looking for
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
