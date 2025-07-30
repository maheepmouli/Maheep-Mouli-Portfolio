-- Fix Status Constraint Issue
-- Run this in your Supabase SQL Editor

-- First, let's check what the current constraint allows
SELECT conname, pg_get_constraintdef(oid) 
FROM pg_constraint 
WHERE conrelid = 'projects'::regclass AND contype = 'c';

-- Drop the existing status constraint if it exists
DO $$ 
BEGIN
    -- Drop the constraint if it exists
    IF EXISTS (
        SELECT 1 FROM pg_constraint 
        WHERE conrelid = 'projects'::regclass 
        AND conname = 'projects_status_check'
    ) THEN
        ALTER TABLE projects DROP CONSTRAINT projects_status_check;
        RAISE NOTICE 'Dropped existing status constraint';
    END IF;
END $$;

-- Create a new, more flexible status constraint
ALTER TABLE projects ADD CONSTRAINT projects_status_check 
CHECK (status IN (
    'draft', 
    'published', 
    'Live Demo', 
    'Case Study', 
    'Built', 
    'Research', 
    'Completed', 
    'Development'
));

-- Verify the constraint was created
SELECT conname, pg_get_constraintdef(oid) 
FROM pg_constraint 
WHERE conrelid = 'projects'::regclass AND contype = 'c';

-- Test the constraint with valid values
INSERT INTO projects (title, description, status, featured, slug) 
VALUES ('Test Project', 'Test Description', 'Research', false, 'test-project')
ON CONFLICT DO NOTHING;

-- Clean up test data
DELETE FROM projects WHERE title = 'Test Project';

-- Show current projects and their status
SELECT id, title, status, featured 
FROM projects 
ORDER BY created_at DESC; 