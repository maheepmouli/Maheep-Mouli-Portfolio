-- Diagnostic script to check blog creation issue
-- Run this in your Supabase SQL Editor

-- 1. Check if users table exists and has our user
SELECT 
    'users table check' as check_type,
    COUNT(*) as user_count,
    CASE 
        WHEN COUNT(*) > 0 THEN '✅ Users table exists with data'
        ELSE '❌ Users table empty or missing'
    END as status
FROM public.users;

-- 2. Check our specific user record
SELECT 
    'specific user check' as check_type,
    id,
    email,
    display_name,
    created_at,
    CASE 
        WHEN id = '550e8400-e29b-41d4-a716-446655440000' THEN '✅ Our user found'
        ELSE '❌ Our user not found'
    END as status
FROM public.users 
WHERE id = '550e8400-e29b-41d4-a716-446655440000';

-- 3. Check blog_posts table structure
SELECT 
    'blog_posts structure' as check_type,
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_name = 'blog_posts' 
AND table_schema = 'public'
ORDER BY ordinal_position;

-- 4. Check foreign key constraints on blog_posts
SELECT 
    'foreign key check' as check_type,
    tc.constraint_name,
    kcu.column_name,
    ccu.table_name AS foreign_table_name,
    ccu.column_name AS foreign_column_name,
    CASE 
        WHEN ccu.table_name = 'users' THEN '✅ Points to users table'
        ELSE '❌ Does not point to users table'
    END as status
FROM information_schema.table_constraints AS tc 
JOIN information_schema.key_column_usage AS kcu
    ON tc.constraint_name = kcu.constraint_name
    AND tc.table_schema = kcu.table_schema
JOIN information_schema.constraint_column_usage AS ccu
    ON ccu.constraint_name = tc.constraint_name
    AND ccu.table_schema = tc.table_schema
WHERE tc.constraint_type = 'FOREIGN KEY' 
    AND tc.table_name = 'blog_posts'
    AND tc.table_schema = 'public';

-- 5. Try to manually insert a test blog post to see the exact error
-- (This will help us understand what's happening)
INSERT INTO public.blog_posts (
    title, 
    content, 
    excerpt, 
    tags, 
    status, 
    slug, 
    user_id, 
    created_at, 
    updated_at
) VALUES (
    'TEST BLOG',
    'This is a test blog post',
    'Test excerpt',
    '{}',
    'draft',
    'test-blog',
    '550e8400-e29b-41d4-a716-446655440000',
    NOW(),
    NOW()
) ON CONFLICT (slug) DO NOTHING; 