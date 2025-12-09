-- Add columns to candidates table for tracking progress and stats
ALTER TABLE candidates 
ADD COLUMN IF NOT EXISTS years_of_experience INT DEFAULT 0,
ADD COLUMN IF NOT EXISTS current_round VARCHAR(50) DEFAULT 'R1: Match', -- 'R1: Match', 'R2: Bot', 'R3: Interview'
ADD COLUMN IF NOT EXISTS waitlist_order INT,
ADD COLUMN IF NOT EXISTS last_contacted_at TIMESTAMP;

-- Add columns to jobs table for automation settings
ALTER TABLE jobs
ADD COLUMN IF NOT EXISTS auto_top_count INT,
ADD COLUMN IF NOT EXISTS auto_waitlist_count INT,
ADD COLUMN IF NOT EXISTS auto_buffer_hours INT;
