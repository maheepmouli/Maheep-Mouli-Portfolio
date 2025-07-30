-- Fix missing project_images column
-- Run this in your Supabase SQL Editor

-- Check if project_images column exists
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns 
WHERE table_name = 'projects' AND column_name = 'project_images';

-- Add project_images column if it doesn't exist
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'projects' AND column_name = 'project_images'
    ) THEN
        ALTER TABLE projects ADD COLUMN project_images TEXT[] DEFAULT '{}';
    END IF;
END $$;

-- Verify the column was added
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns 
WHERE table_name = 'projects' AND column_name = 'project_images';

-- Test the column
SELECT id, title, project_images FROM projects LIMIT 5; 