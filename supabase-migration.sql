-- Migration script to update existing database from pages to progress_percentage
-- Run this ONLY if you already have existing data and need to migrate

-- Step 1: Add the new progress_percentage column
ALTER TABLE topics ADD COLUMN IF NOT EXISTS progress_percentage INT DEFAULT 0;

-- Step 2: Calculate progress percentage from existing pages data (if any)
UPDATE topics 
SET progress_percentage = CASE 
    WHEN pages_target > 0 THEN LEAST(100, ROUND((pages_done::DECIMAL / pages_target::DECIMAL) * 100))
    ELSE 0
END
WHERE pages_target IS NOT NULL AND pages_done IS NOT NULL;

-- Step 3: Drop the old columns
ALTER TABLE topics DROP COLUMN IF EXISTS pages_done;
ALTER TABLE topics DROP COLUMN IF EXISTS pages_target;

-- Step 4: Add constraint to ensure progress is between 0 and 100
ALTER TABLE topics ADD CONSTRAINT progress_percentage_check 
CHECK (progress_percentage >= 0 AND progress_percentage <= 100);
