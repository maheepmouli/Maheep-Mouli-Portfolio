-- Complete fix for blog_posts table
-- This script addresses all issues: missing columns, RLS policies, and UUID format

-- 1. First, let's see the current table structure and existing policies
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns 
WHERE table_schema = 'public' 
AND table_name = 'blog_posts'
ORDER BY ordinal_position;

-- Check existing policies
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual, with_check
FROM pg_policies
WHERE tablename = 'blog_posts';

-- 2. DISABLE RLS FIRST to avoid policy conflicts
ALTER TABLE public.blog_posts DISABLE ROW LEVEL SECURITY;

-- 3. Now drop ALL existing policies (RLS is disabled, so this should work)
-- Drop all possible policy names that might exist
DROP POLICY IF EXISTS "Enable insert for authenticated users" ON public.blog_posts;
DROP POLICY IF EXISTS "Enable select for all users" ON public.blog_posts;
DROP POLICY IF EXISTS "Enable update for authenticated users" ON public.blog_posts;
DROP POLICY IF EXISTS "Enable delete for authenticated users" ON public.blog_posts;
DROP POLICY IF EXISTS "Published blog posts are viewable by everyone" ON public.blog_posts;
DROP POLICY IF EXISTS "Users can insert their own blog posts" ON public.blog_posts;
DROP POLICY IF EXISTS "Users can view all blog posts" ON public.blog_posts;
DROP POLICY IF EXISTS "Users can update their own blog posts" ON public.blog_posts;
DROP POLICY IF EXISTS "Users can delete their own blog posts" ON public.blog_posts;
DROP POLICY IF EXISTS "Users can manage their own blog posts" ON public.blog_posts;
DROP POLICY IF EXISTS "Enable read access for all users" ON public.blog_posts;
DROP POLICY IF EXISTS "Enable write access for authenticated users" ON public.blog_posts;
DROP POLICY IF EXISTS "Blog posts are viewable by everyone" ON public.blog_posts;
DROP POLICY IF EXISTS "Authenticated users can manage blog posts" ON public.blog_posts;

-- Nuclear option: Drop ALL policies on this table (covers any we missed)
DO $$
DECLARE
    policy_record RECORD;
BEGIN
    FOR policy_record IN 
        SELECT policyname 
        FROM pg_policies 
        WHERE tablename = 'blog_posts' AND schemaname = 'public'
    LOOP
        EXECUTE 'DROP POLICY IF EXISTS "' || policy_record.policyname || '" ON public.blog_posts';
    END LOOP;
END $$;

-- 4. Add missing columns if they don't exist
ALTER TABLE public.blog_posts 
ADD COLUMN IF NOT EXISTS id UUID DEFAULT gen_random_uuid() PRIMARY KEY;

ALTER TABLE public.blog_posts 
ADD COLUMN IF NOT EXISTS user_id UUID;

ALTER TABLE public.blog_posts 
ADD COLUMN IF NOT EXISTS title TEXT NOT NULL;

ALTER TABLE public.blog_posts 
ADD COLUMN IF NOT EXISTS slug TEXT UNIQUE;

-- 5. Now we can safely alter the user_id column type (no policies depend on it)
ALTER TABLE public.blog_posts 
ALTER COLUMN user_id TYPE UUID USING user_id::UUID;

-- 6. Create new policies
CREATE POLICY "Enable insert for authenticated users" 
ON public.blog_posts
FOR INSERT WITH CHECK (true);

CREATE POLICY "Enable select for all users" 
ON public.blog_posts
FOR SELECT USING (true);

CREATE POLICY "Enable update for authenticated users" 
ON public.blog_posts
FOR UPDATE USING (true);

CREATE POLICY "Enable delete for authenticated users" 
ON public.blog_posts
FOR DELETE USING (true);

-- 7. Re-enable RLS with the new policies
ALTER TABLE public.blog_posts ENABLE ROW LEVEL SECURITY;

-- 8. Verify the final table structure
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns 
WHERE table_schema = 'public' 
AND table_name = 'blog_posts'
ORDER BY ordinal_position;

-- 9. Check RLS policies
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual, with_check
FROM pg_policies
WHERE tablename = 'blog_posts'; 