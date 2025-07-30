-- Step 1: Add status field to projects table
-- This script adds a status field to track project status (draft, published, etc.)

-- Add status column if it doesn't exist
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'projects' AND column_name = 'status'
    ) THEN
        ALTER TABLE projects ADD COLUMN status VARCHAR(50) DEFAULT 'draft';
    END IF;
END $$;

-- Add constraint for valid status values
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint 
        WHERE conname = 'projects_status_check'
    ) THEN
        ALTER TABLE projects ADD CONSTRAINT projects_status_check 
        CHECK (status IN ('draft', 'published', 'in-progress', 'completed', 'archived'));
    END IF;
END $$;

-- Update existing projects to have a default status
UPDATE projects SET status = 'published' WHERE status IS NULL;

-- Verify the changes
SELECT 
    column_name, 
    data_type, 
    is_nullable, 
    column_default
FROM information_schema.columns 
WHERE table_name = 'projects' AND column_name = 'status';

-- Show current status values
SELECT id, title, status FROM projects ORDER BY created_at DESC; 