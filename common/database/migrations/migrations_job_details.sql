-- Add description and responsibilities to jobs table
ALTER TABLE jobs 
ADD COLUMN IF NOT EXISTS description TEXT,
ADD COLUMN IF NOT EXISTS responsibilities TEXT[];

-- Update existing job with sample data if null
UPDATE jobs 
SET description = 'We are looking for a UX Research Intern to join our dynamic team. This is an exciting opportunity to work on real-world projects and gain hands-on experience in the industry.',
    responsibilities = ARRAY['Plan and conduct user research studies', 'Analyze research findings and generate insights', 'Create personas and user journey maps', 'Present findings to stakeholders']
WHERE id = 1 AND description IS NULL;
