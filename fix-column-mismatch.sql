-- Fix column mismatch between code and database
-- The code is sending 'project_images' but database expects 'images'
-- Run this in your Supabase SQL Editor

-- First, let's check what columns currently exist
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'projects' 
ORDER BY ordinal_position;

-- Add the 'images' column if it doesn't exist (to match what the code expects)
DO $$ 
BEGIN
    -- Add images column if it doesn't exist
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'projects' AND column_name = 'images'
    ) THEN
        ALTER TABLE projects ADD COLUMN images TEXT[];
    END IF;
END $$;

-- Also ensure project_images column exists (for backward compatibility)
DO $$ 
BEGIN
    -- Add project_images column if it doesn't exist
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'projects' AND column_name = 'project_images'
    ) THEN
        ALTER TABLE projects ADD COLUMN project_images TEXT[];
    END IF;
END $$;

-- Update the code to use 'images' instead of 'project_images' for database operations
-- This will be done in the TypeScript code

-- Verify the columns exist
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'projects' AND column_name IN ('images', 'project_images')
ORDER BY column_name; 