-- Fix RLS Performance Issues and Consolidate Policies (CORRECTED VERSION)
-- This migration addresses:
-- 1. Auth RLS Initialization Plan warnings (auth.<function>() calls)
-- 2. Multiple Permissive Policies warnings
-- 3. Consolidates overlapping policies for better performance
-- 4. Handles existing users table and foreign key constraints

-- First, let's check what tables and constraints we have
DO $$ 
BEGIN
    RAISE NOTICE 'Checking current database structure...';
END $$;

-- Check existing foreign key constraints
SELECT 
    tc.table_name, 
    kcu.column_name, 
    ccu.table_name AS foreign_table_name,
    ccu.column_name AS foreign_column_name 
FROM 
    information_schema.table_constraints AS tc 
    JOIN information_schema.key_column_usage AS kcu
      ON tc.constraint_name = kcu.constraint_name
      AND tc.table_schema = kcu.table_schema
    JOIN information_schema.constraint_column_usage AS ccu
      ON ccu.constraint_name = tc.constraint_name
      AND ccu.table_schema = tc.table_schema
WHERE tc.constraint_type = 'FOREIGN KEY' 
    AND tc.table_name IN ('projects', 'blog_posts', 'project_images')
ORDER BY tc.table_name;

-- First, drop all existing policies to start fresh
DROP POLICY IF EXISTS "Public profiles are viewable by everyone" ON profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
DROP POLICY IF EXISTS "Users can insert own profile" ON profiles;
DROP POLICY IF EXISTS "Profiles are viewable by everyone" ON profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON profiles;
DROP POLICY IF EXISTS "Users can insert their own profile" ON profiles;

DROP POLICY IF EXISTS "Projects are viewable by everyone" ON projects;
DROP POLICY IF EXISTS "Authenticated users can insert projects" ON projects;
DROP POLICY IF EXISTS "Authenticated users can update projects" ON projects;
DROP POLICY IF EXISTS "Authenticated users can delete projects" ON projects;
DROP POLICY IF EXISTS "Published projects are viewable by everyone" ON projects;
DROP POLICY IF EXISTS "Users can manage their own projects" ON projects;
DROP POLICY IF EXISTS "Allow all operations for authenticated users" ON projects;
DROP POLICY IF EXISTS "Allow public read access" ON projects;
DROP POLICY IF EXISTS "Allow authenticated users to manage projects" ON projects;
DROP POLICY IF EXISTS "Allow anonymous users to manage projects" ON projects;
DROP POLICY IF EXISTS "Allow anonymous users to insert projects" ON projects;
DROP POLICY IF EXISTS "Enable read access for all users" ON projects;
DROP POLICY IF EXISTS "Enable insert for authenticated users only" ON projects;
DROP POLICY IF EXISTS "Enable update for users based on user_id" ON projects;
DROP POLICY IF EXISTS "Enable delete for users based on user_id" ON projects;
DROP POLICY IF EXISTS "Allow anonymous users to manage projects" ON projects;
DROP POLICY IF EXISTS "Allow update for anonymous users" ON projects;
DROP POLICY IF EXISTS "Allow delete for anonymous users" ON projects;
DROP POLICY IF EXISTS "Allow insert for anonymous users" ON projects;
DROP POLICY IF EXISTS "Authenticated users can insert projects" ON projects;
DROP POLICY IF EXISTS "Authenticated users can update projects" ON projects;
DROP POLICY IF EXISTS "Authenticated users can delete projects" ON projects;

DROP POLICY IF EXISTS "Project images are viewable by everyone" ON project_images;
DROP POLICY IF EXISTS "Authenticated users can insert project images" ON project_images;
DROP POLICY IF EXISTS "Authenticated users can update project images" ON project_images;
DROP POLICY IF EXISTS "Authenticated users can delete project images" ON project_images;
DROP POLICY IF EXISTS "Project images are viewable with their projects" ON project_images;
DROP POLICY IF EXISTS "Users can manage images for their own projects" ON project_images;
DROP POLICY IF EXISTS "Project images are publicly accessible" ON project_images;
DROP POLICY IF EXISTS "Authenticated users can upload project images" ON project_images;
DROP POLICY IF EXISTS "Users can manage project images" ON project_images;
DROP POLICY IF EXISTS "Users can delete project images" ON project_images;

DROP POLICY IF EXISTS "Blog posts are viewable by everyone" ON blog_posts;
DROP POLICY IF EXISTS "Authenticated users can insert blog posts" ON blog_posts;
DROP POLICY IF EXISTS "Authenticated users can update blog posts" ON blog_posts;
DROP POLICY IF EXISTS "Authenticated users can delete blog posts" ON blog_posts;
DROP POLICY IF EXISTS "Published blogs are viewable by everyone" ON blog_posts;
DROP POLICY IF EXISTS "Users can manage their own blogs" ON blog_posts;
DROP POLICY IF EXISTS "Published blog posts are viewable by everyone" ON blog_posts;
DROP POLICY IF EXISTS "Users can manage their own blog posts" ON blog_posts;
DROP POLICY IF EXISTS "Allow all operations for authenticated users" ON blog_posts;
DROP POLICY IF EXISTS "Allow public read access" ON blog_posts;
DROP POLICY IF EXISTS "Allow authenticated users to manage blogs" ON blog_posts;
DROP POLICY IF EXISTS "Users can insert their own blog posts" ON blog_posts;
DROP POLICY IF EXISTS "Users can view all blog posts" ON blog_posts;
DROP POLICY IF EXISTS "Users can update their own blog posts" ON blog_posts;
DROP POLICY IF EXISTS "Users can delete their own blog posts" ON blog_posts;
DROP POLICY IF EXISTS "Enable insert for authenticated users" ON blog_posts;
DROP POLICY IF EXISTS "Enable select for all users" ON blog_posts;
DROP POLICY IF EXISTS "Enable update for authenticated users" ON blog_posts;
DROP POLICY IF EXISTS "Enable delete for authenticated users" ON blog_posts;

-- Check if we need to create or update the users table
DO $$ 
BEGIN
    -- Create users table if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'users') THEN
        CREATE TABLE public.users (
            id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
            email TEXT UNIQUE NOT NULL,
            display_name TEXT,
            created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
            updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );
        RAISE NOTICE 'Created public.users table';
    END IF;
    
    -- Ensure we have the main user record
    IF NOT EXISTS (SELECT 1 FROM public.users WHERE id = '00000000-0000-0000-0000-000000000001') THEN
        INSERT INTO public.users (id, email, display_name, created_at, updated_at)
        VALUES (
            '00000000-0000-0000-0000-000000000001',
            'maheep.mouli.shashi@gmail.com',
            'Maheep Mouli Shashi',
            NOW(),
            NOW()
        );
        RAISE NOTICE 'Added main user record to users table';
    END IF;
END $$;

-- Add user_id column to projects table if it doesn't exist
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'projects' AND column_name = 'user_id') THEN
        ALTER TABLE projects ADD COLUMN user_id UUID;
        RAISE NOTICE 'Added user_id column to projects table';
    END IF;
END $$;

-- Add user_id column to blog_posts table if it doesn't exist
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'blog_posts' AND column_name = 'user_id') THEN
        ALTER TABLE blog_posts ADD COLUMN user_id UUID;
        RAISE NOTICE 'Added user_id column to blog_posts table';
    END IF;
END $$;

-- Update existing projects to have user_id if they don't have one
UPDATE projects 
SET user_id = '00000000-0000-0000-0000-000000000001' 
WHERE user_id IS NULL;

-- Update existing blog posts to have user_id if they don't have one
UPDATE blog_posts 
SET user_id = '00000000-0000-0000-0000-000000000001' 
WHERE user_id IS NULL;

-- Now add foreign key constraints to point to the users table
DO $$ 
BEGIN
    -- Add foreign key constraint for projects table
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.table_constraints 
        WHERE constraint_name = 'projects_user_id_fkey' 
        AND table_name = 'projects'
    ) THEN
        ALTER TABLE projects ADD CONSTRAINT projects_user_id_fkey 
        FOREIGN KEY (user_id) REFERENCES public.users(id);
        RAISE NOTICE 'Added foreign key constraint for projects.user_id';
    END IF;
    
    -- Add foreign key constraint for blog_posts table
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.table_constraints 
        WHERE constraint_name = 'blog_posts_user_id_fkey' 
        AND table_name = 'blog_posts'
    ) THEN
        ALTER TABLE blog_posts ADD CONSTRAINT blog_posts_user_id_fkey 
        FOREIGN KEY (user_id) REFERENCES public.users(id);
        RAISE NOTICE 'Added foreign key constraint for blog_posts.user_id';
    END IF;
END $$;

-- Make user_id NOT NULL after setting default values and constraints
ALTER TABLE projects ALTER COLUMN user_id SET NOT NULL;
ALTER TABLE blog_posts ALTER COLUMN user_id SET NOT NULL;

-- Create optimized RLS policies for profiles
-- Using (select auth.uid()) to fix auth_rls_initplan warnings
CREATE POLICY "profiles_select_policy" ON profiles
    FOR SELECT USING (true);

CREATE POLICY "profiles_insert_policy" ON profiles
    FOR INSERT WITH CHECK ((select auth.uid()) = id);

CREATE POLICY "profiles_update_policy" ON profiles
    FOR UPDATE USING ((select auth.uid()) = id);

-- Create optimized RLS policies for projects
-- Single consolidated policy per operation type
CREATE POLICY "projects_select_policy" ON projects
    FOR SELECT USING (true);

CREATE POLICY "projects_insert_policy" ON projects
    FOR INSERT WITH CHECK ((select auth.role()) = 'authenticated');

CREATE POLICY "projects_update_policy" ON projects
    FOR UPDATE USING (
        (select auth.role()) = 'authenticated' AND 
        (select auth.uid()) = user_id
    );

CREATE POLICY "projects_delete_policy" ON projects
    FOR DELETE USING (
        (select auth.role()) = 'authenticated' AND 
        (select auth.uid()) = user_id
    );

-- Create optimized RLS policies for project_images
-- Single consolidated policy per operation type
CREATE POLICY "project_images_select_policy" ON project_images
    FOR SELECT USING (true);

CREATE POLICY "project_images_insert_policy" ON project_images
    FOR INSERT WITH CHECK (
        (select auth.role()) = 'authenticated' AND
        EXISTS (
            SELECT 1 FROM projects 
            WHERE id = project_images.project_id 
            AND (select auth.uid()) = user_id
        )
    );

CREATE POLICY "project_images_update_policy" ON project_images
    FOR UPDATE USING (
        (select auth.role()) = 'authenticated' AND
        EXISTS (
            SELECT 1 FROM projects 
            WHERE id = project_images.project_id 
            AND (select auth.uid()) = user_id
        )
    );

CREATE POLICY "project_images_delete_policy" ON project_images
    FOR DELETE USING (
        (select auth.role()) = 'authenticated' AND
        EXISTS (
            SELECT 1 FROM projects 
            WHERE id = project_images.project_id 
            AND (select auth.uid()) = user_id
        )
    );

-- Create optimized RLS policies for blog_posts
-- Single consolidated policy per operation type
CREATE POLICY "blog_posts_select_policy" ON blog_posts
    FOR SELECT USING (true);

CREATE POLICY "blog_posts_insert_policy" ON blog_posts
    FOR INSERT WITH CHECK ((select auth.role()) = 'authenticated');

CREATE POLICY "blog_posts_update_policy" ON blog_posts
    FOR UPDATE USING (
        (select auth.role()) = 'authenticated' AND 
        (select auth.uid()) = user_id
    );

CREATE POLICY "blog_posts_delete_policy" ON blog_posts
    FOR DELETE USING (
        (select auth.role()) = 'authenticated' AND 
        (select auth.uid()) = user_id
    );

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_projects_user_id ON projects(user_id);
CREATE INDEX IF NOT EXISTS idx_blog_posts_user_id ON blog_posts(user_id);
CREATE INDEX IF NOT EXISTS idx_project_images_project_id ON project_images(project_id);
