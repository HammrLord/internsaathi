-- Add missing columns to candidates table
ALTER TABLE candidates 
ADD COLUMN IF NOT EXISTS job_id INT,
ADD COLUMN IF NOT EXISTS match_score INT DEFAULT 0;

-- Update existing candidates to link to job 1 for testing
UPDATE candidates SET job_id = 1, match_score = floor(random() * 40 + 60)::int WHERE job_id IS NULL;
