-- Add columns for recruiter profile
ALTER TABLE users 
ADD COLUMN IF NOT EXISTS onboarding_completed BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS company_name VARCHAR(255),
ADD COLUMN IF NOT EXISTS phone VARCHAR(50);
