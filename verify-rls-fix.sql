-- RLS Policy Verification Script
-- Run this before and after applying the fix to see the difference

-- Check current RLS policies
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

-- Count policies per table
SELECT 
    tablename,
    COUNT(*) as policy_count,
    STRING_AGG(policyname, ', ' ORDER BY policyname) as policy_names
FROM pg_policies 
WHERE schemaname = 'public' 
GROUP BY tablename
ORDER BY tablename;

-- Check for auth function usage in policies (this should be optimized)
SELECT 
    tablename,
    policyname,
    qual,
    with_check
FROM pg_policies 
WHERE schemaname = 'public' 
  AND (qual LIKE '%auth.%' OR with_check LIKE '%auth.%')
ORDER BY tablename, policyname;

-- Check table structure for user_id columns
SELECT 
    table_name,
    column_name,
    data_type,
    is_nullable
FROM information_schema.columns 
WHERE table_schema = 'public' 
  AND table_name IN ('profiles', 'projects', 'project_images', 'blog_posts')
  AND column_name = 'user_id'
ORDER BY table_name;

-- Check RLS status
SELECT 
    schemaname,
    tablename,
    rowsecurity
FROM pg_tables 
WHERE schemaname = 'public' 
  AND tablename IN ('profiles', 'projects', 'project_images', 'blog_posts')
ORDER BY tablename;

-- Check indexes for performance
SELECT 
    schemaname,
    tablename,
    indexname,
    indexdef
FROM pg_indexes 
WHERE schemaname = 'public' 
  AND tablename IN ('profiles', 'projects', 'project_images', 'blog_posts')
ORDER BY tablename, indexname;
