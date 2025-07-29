-- Fix project creation issues by ensuring all required columns exist
-- Run this in your Supabase SQL Editor

-- First, let's check what columns currently exist
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'projects' 
ORDER BY ordinal_position;

-- Add missing columns if they don't exist
DO $$ 
BEGIN
    -- Add project_images column if it doesn't exist
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'projects' AND column_name = 'project_images'
    ) THEN
        ALTER TABLE projects ADD COLUMN project_images TEXT[];
    END IF;

    -- Add videos column if it doesn't exist
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'projects' AND column_name = 'videos'
    ) THEN
        ALTER TABLE projects ADD COLUMN videos JSONB;
    END IF;

    -- Add location column if it doesn't exist
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'projects' AND column_name = 'location'
    ) THEN
        ALTER TABLE projects ADD COLUMN location TEXT;
    END IF;

    -- Add duration column if it doesn't exist
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'projects' AND column_name = 'duration'
    ) THEN
        ALTER TABLE projects ADD COLUMN duration TEXT;
    END IF;

    -- Add team_size column if it doesn't exist
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'projects' AND column_name = 'team_size'
    ) THEN
        ALTER TABLE projects ADD COLUMN team_size TEXT;
    END IF;

    -- Add status column if it doesn't exist
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'projects' AND column_name = 'status'
    ) THEN
        ALTER TABLE projects ADD COLUMN status TEXT;
    END IF;

    -- Add tags column if it doesn't exist
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'projects' AND column_name = 'tags'
    ) THEN
        ALTER TABLE projects ADD COLUMN tags TEXT[];
    END IF;

    -- Add project_url column if it doesn't exist
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'projects' AND column_name = 'project_url'
    ) THEN
        ALTER TABLE projects ADD COLUMN project_url TEXT;
    END IF;

    -- Remove the 'images' column if it exists (we use project_images instead)
    IF EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'projects' AND column_name = 'images'
    ) THEN
        ALTER TABLE projects DROP COLUMN images;
    END IF;

END $$;

-- Verify the final schema
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'projects' 
ORDER BY ordinal_position;

-- Update RLS policies to include new columns
DROP POLICY IF EXISTS "Enable read access for all users" ON projects;
CREATE POLICY "Enable read access for all users" ON projects
    FOR SELECT USING (true);

DROP POLICY IF EXISTS "Enable insert for authenticated users only" ON projects;
CREATE POLICY "Enable insert for authenticated users only" ON projects
    FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Enable update for users based on user_id" ON projects;
CREATE POLICY "Enable update for users based on user_id" ON projects
    FOR UPDATE USING (true);

DROP POLICY IF EXISTS "Enable delete for users based on user_id" ON projects;
CREATE POLICY "Enable delete for users based on user_id" ON projects
    FOR DELETE USING (true); 