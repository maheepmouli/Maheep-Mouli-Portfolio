-- Fix RLS Performance Issues and Consolidate Policies
-- This script addresses:
-- 1. Auth RLS Initialization Plan warnings (auth.<function>() calls)
-- 2. Multiple Permissive Policies warnings
-- 3. Consolidates overlapping policies for better performance

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

-- Add user_id column to projects table if it doesn't exist
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'projects' AND column_name = 'user_id') THEN
        ALTER TABLE projects ADD COLUMN user_id UUID REFERENCES profiles(id);
    END IF;
END $$;

-- Add user_id column to blog_posts table if it doesn't exist
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'blog_posts' AND column_name = 'user_id') THEN
        ALTER TABLE blog_posts ADD COLUMN user_id UUID REFERENCES profiles(id);
    END IF;
END $$;

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
        (user_id IS NULL OR (select auth.uid()) = user_id)
    );

CREATE POLICY "projects_delete_policy" ON projects
    FOR DELETE USING (
        (select auth.role()) = 'authenticated' AND 
        (user_id IS NULL OR (select auth.uid()) = user_id)
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
            AND (user_id IS NULL OR (select auth.uid()) = user_id)
        )
    );

CREATE POLICY "project_images_update_policy" ON project_images
    FOR UPDATE USING (
        (select auth.role()) = 'authenticated' AND
        EXISTS (
            SELECT 1 FROM projects 
            WHERE id = project_images.project_id 
            AND (user_id IS NULL OR (select auth.uid()) = user_id)
        )
    );

CREATE POLICY "project_images_delete_policy" ON project_images
    FOR DELETE USING (
        (select auth.role()) = 'authenticated' AND
        EXISTS (
            SELECT 1 FROM projects 
            WHERE id = project_images.project_id 
            AND (user_id IS NULL OR (select auth.uid()) = user_id)
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
        (user_id IS NULL OR (select auth.uid()) = user_id)
    );

CREATE POLICY "blog_posts_delete_policy" ON blog_posts
    FOR DELETE USING (
        (select auth.role()) = 'authenticated' AND 
        (user_id IS NULL OR (select auth.uid()) = user_id)
    );

-- Update existing projects to have user_id if they don't have one
-- This ensures the policies work correctly
UPDATE projects 
SET user_id = '00000000-0000-0000-0000-000000000001' 
WHERE user_id IS NULL;

-- Update existing blog posts to have user_id if they don't have one
UPDATE blog_posts 
SET user_id = '00000000-0000-0000-0000-000000000001' 
WHERE user_id IS NULL;

-- Make user_id NOT NULL after setting default values
ALTER TABLE projects ALTER COLUMN user_id SET NOT NULL;
ALTER TABLE blog_posts ALTER COLUMN user_id SET NOT NULL;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_projects_user_id ON projects(user_id);
CREATE INDEX IF NOT EXISTS idx_blog_posts_user_id ON blog_posts(user_id);
CREATE INDEX IF NOT EXISTS idx_project_images_project_id ON project_images(project_id);

-- Verify the policies are working
SELECT 
    schemaname,
    tablename,
    policyname,
    permissive,
    roles,
    cmd,
    qual,
    with_check
FROM pg_policies 
WHERE schemaname = 'public' 
ORDER BY tablename, policyname;
