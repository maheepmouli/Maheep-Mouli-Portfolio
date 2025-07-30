-- Comprehensive fix for all project columns
-- Run this in your Supabase SQL Editor

-- First, let's check the current table structure
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns 
WHERE table_name = 'projects' 
ORDER BY ordinal_position;

-- Add all missing columns
DO $$ 
BEGIN
    -- Add project_images column if it doesn't exist
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'projects' AND column_name = 'project_images'
    ) THEN
        ALTER TABLE projects ADD COLUMN project_images TEXT[] DEFAULT '{}';
        RAISE NOTICE 'Added project_images column';
    END IF;

    -- Add status column if it doesn't exist
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'projects' AND column_name = 'status'
    ) THEN
        ALTER TABLE projects ADD COLUMN status TEXT DEFAULT 'draft';
        RAISE NOTICE 'Added status column';
    END IF;

    -- Add featured column if it doesn't exist
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'projects' AND column_name = 'featured'
    ) THEN
        ALTER TABLE projects ADD COLUMN featured BOOLEAN DEFAULT false;
        RAISE NOTICE 'Added featured column';
    END IF;

    -- Add other missing columns
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'projects' AND column_name = 'project_url'
    ) THEN
        ALTER TABLE projects ADD COLUMN project_url TEXT;
        RAISE NOTICE 'Added project_url column';
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'projects' AND column_name = 'github_url'
    ) THEN
        ALTER TABLE projects ADD COLUMN github_url TEXT;
        RAISE NOTICE 'Added github_url column';
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'projects' AND column_name = 'location'
    ) THEN
        ALTER TABLE projects ADD COLUMN location TEXT;
        RAISE NOTICE 'Added location column';
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'projects' AND column_name = 'duration'
    ) THEN
        ALTER TABLE projects ADD COLUMN duration TEXT;
        RAISE NOTICE 'Added duration column';
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'projects' AND column_name = 'team_size'
    ) THEN
        ALTER TABLE projects ADD COLUMN team_size TEXT;
        RAISE NOTICE 'Added team_size column';
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'projects' AND column_name = 'technologies'
    ) THEN
        ALTER TABLE projects ADD COLUMN technologies TEXT[] DEFAULT '{}';
        RAISE NOTICE 'Added technologies column';
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'projects' AND column_name = 'tags'
    ) THEN
        ALTER TABLE projects ADD COLUMN tags TEXT[] DEFAULT '{}';
        RAISE NOTICE 'Added tags column';
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'projects' AND column_name = 'videos'
    ) THEN
        ALTER TABLE projects ADD COLUMN videos JSONB DEFAULT '[]'::jsonb;
        RAISE NOTICE 'Added videos column';
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'projects' AND column_name = 'slug'
    ) THEN
        ALTER TABLE projects ADD COLUMN slug TEXT;
        RAISE NOTICE 'Added slug column';
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'projects' AND column_name = 'user_id'
    ) THEN
        ALTER TABLE projects ADD COLUMN user_id UUID;
        RAISE NOTICE 'Added user_id column';
    END IF;

END $$;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_projects_featured ON projects(featured);
CREATE INDEX IF NOT EXISTS idx_projects_status ON projects(status);
CREATE INDEX IF NOT EXISTS idx_projects_slug ON projects(slug);
CREATE INDEX IF NOT EXISTS idx_projects_user_id ON projects(user_id);

-- Update RLS policies to ensure proper access
DROP POLICY IF EXISTS "Allow public read access" ON projects;
CREATE POLICY "Allow public read access" ON projects
    FOR SELECT USING (true);

DROP POLICY IF EXISTS "Allow authenticated users to manage projects" ON projects;
CREATE POLICY "Allow authenticated users to manage projects" ON projects
    FOR ALL USING (auth.role() = 'authenticated');

-- Add a policy for anonymous users to insert/update (for testing)
DROP POLICY IF EXISTS "Allow anonymous users to manage projects" ON projects;
CREATE POLICY "Allow anonymous users to manage projects" ON projects
    FOR ALL USING (true);

-- Verify the final table structure
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns 
WHERE table_name = 'projects' 
ORDER BY ordinal_position;

-- Test queries
SELECT id, title, featured, status, project_images 
FROM projects 
WHERE featured = true 
ORDER BY created_at DESC;

SELECT id, title, status 
FROM projects 
WHERE status = 'published' 
ORDER BY created_at DESC; 