-- Add missing columns to projects table
-- Run this in your Supabase SQL Editor

-- Add project_images column if it doesn't exist
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'projects' 
        AND column_name = 'project_images'
    ) THEN
        ALTER TABLE projects ADD COLUMN project_images TEXT[];
    END IF;
END $$;

-- Add other missing columns that might be needed
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'projects' 
        AND column_name = 'videos'
    ) THEN
        ALTER TABLE projects ADD COLUMN videos JSONB DEFAULT '[]'::jsonb;
    END IF;
END $$;

DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'projects' 
        AND column_name = 'location'
    ) THEN
        ALTER TABLE projects ADD COLUMN location VARCHAR(255);
    END IF;
END $$;

DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'projects' 
        AND column_name = 'duration'
    ) THEN
        ALTER TABLE projects ADD COLUMN duration VARCHAR(100);
    END IF;
END $$;

DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'projects' 
        AND column_name = 'team_size'
    ) THEN
        ALTER TABLE projects ADD COLUMN team_size VARCHAR(50);
    END IF;
END $$;

DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'projects' 
        AND column_name = 'status'
    ) THEN
        ALTER TABLE projects ADD COLUMN status VARCHAR(50) DEFAULT 'draft';
    END IF;
END $$;

DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'projects' 
        AND column_name = 'tags'
    ) THEN
        ALTER TABLE projects ADD COLUMN tags TEXT[];
    END IF;
END $$;

-- Verify the changes
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'projects' 
ORDER BY ordinal_position; 