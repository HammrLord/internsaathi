-- Ensure student_profiles table exists
CREATE TABLE IF NOT EXISTS student_profiles (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    skills TEXT[],
    bio TEXT,
    projects TEXT,     -- JSON string
    experience TEXT,   -- JSON string
    education TEXT,    -- JSON string
    social_links TEXT, -- JSON string
    resume_url TEXT,
    preferences TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Add new columns for Comprehensive Profile
ALTER TABLE student_profiles 
ADD COLUMN IF NOT EXISTS full_name VARCHAR(255),
ADD COLUMN IF NOT EXISTS phone VARCHAR(50),
ADD COLUMN IF NOT EXISTS address TEXT,
ADD COLUMN IF NOT EXISTS dob DATE,
ADD COLUMN IF NOT EXISTS gender VARCHAR(50),
ADD COLUMN IF NOT EXISTS transcript_url TEXT,
ADD COLUMN IF NOT EXISTS other_docs_url TEXT,
ADD COLUMN IF NOT EXISTS education_level VARCHAR(100);
