-- Diagnostic Script: Check Current Database State
-- Run this before applying the RLS fix to understand your current setup

-- 1. Check what tables exist
SELECT 
    table_schema,
    table_name,
    table_type
FROM information_schema.tables 
WHERE table_schema IN ('public', 'auth')
ORDER BY table_schema, table_name;

-- 2. Check current RLS policies
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

-- 3. Count policies per table
SELECT 
    tablename,
    COUNT(*) as policy_count,
    STRING_AGG(policyname, ', ' ORDER BY policyname) as policy_names
FROM pg_policies 
WHERE schemaname = 'public' 
GROUP BY tablename
ORDER BY tablename;

-- 4. Check foreign key constraints
SELECT 
    tc.table_name, 
    kcu.column_name, 
    ccu.table_schema AS foreign_schema,
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
    AND tc.table_schema = 'public'
    AND tc.table_name IN ('projects', 'blog_posts', 'project_images')
ORDER BY tc.table_name;

-- 5. Check if user_id columns exist
SELECT 
    table_name,
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_schema = 'public' 
  AND table_name IN ('profiles', 'projects', 'project_images', 'blog_posts', 'users')
  AND column_name IN ('id', 'user_id')
ORDER BY table_name, column_name;

-- 6. Check RLS status
SELECT 
    schemaname,
    tablename,
    rowsecurity
FROM pg_tables 
WHERE schemaname = 'public' 
  AND tablename IN ('profiles', 'projects', 'project_images', 'blog_posts', 'users')
ORDER BY tablename;

-- 7. Check for auth function usage in policies (this should be optimized)
SELECT 
    tablename,
    policyname,
    qual,
    with_check
FROM pg_policies 
WHERE schemaname = 'public' 
  AND (qual LIKE '%auth.%' OR with_check LIKE '%auth.%')
ORDER BY tablename, policyname;

-- 8. Check if users table has data
SELECT 
    'users' as table_name,
    COUNT(*) as record_count
FROM public.users
UNION ALL
SELECT 
    'profiles' as table_name,
    COUNT(*) as record_count
FROM public.profiles;

-- 9. Check sample data in key tables
SELECT 
    'projects' as table_name,
    COUNT(*) as total_count,
    COUNT(user_id) as with_user_id,
    COUNT(*) - COUNT(user_id) as without_user_id
FROM public.projects
UNION ALL
SELECT 
    'blog_posts' as table_name,
    COUNT(*) as total_count,
    COUNT(user_id) as with_user_id,
    COUNT(*) - COUNT(user_id) as without_user_id
FROM public.blog_posts;
