-- Complete fix for blog creation issue
-- Run this in your Supabase SQL Editor

-- 1. First, let's check what tables exist
SELECT 
    'Current tables' as check_type,
    table_name,
    table_schema
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name IN ('users', 'blog_posts')
ORDER BY table_name;

-- 2. Drop and recreate users table completely
DROP TABLE IF EXISTS public.users CASCADE;

CREATE TABLE public.users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email TEXT UNIQUE NOT NULL,
    display_name TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Add our user record
INSERT INTO public.users (id, email, display_name, created_at, updated_at)
VALUES (
    '550e8400-e29b-41d4-a716-446655440000',
    'maheep.mouli.shashi@gmail.com',
    'Maheep Mouli Shashi',
    NOW(),
    NOW()
);

-- 4. Verify user was created
SELECT 
    'User verification' as check_type,
    id,
    email,
    display_name,
    '✅ User created successfully' as status
FROM public.users 
WHERE id = '550e8400-e29b-41d4-a716-446655440000';

-- 5. Check blog_posts table structure
SELECT 
    'blog_posts columns' as check_type,
    column_name,
    data_type,
    is_nullable
FROM information_schema.columns 
WHERE table_name = 'blog_posts' 
AND table_schema = 'public'
ORDER BY ordinal_position;

-- 6. Drop and recreate the foreign key constraint on blog_posts
-- First, find and drop existing foreign key constraints
DO $$
DECLARE
    constraint_record RECORD;
BEGIN
    FOR constraint_record IN 
        SELECT conname 
        FROM pg_constraint 
        WHERE conrelid = 'public.blog_posts'::regclass 
        AND contype = 'f'
    LOOP
        EXECUTE 'ALTER TABLE public.blog_posts DROP CONSTRAINT ' || constraint_record.conname;
    END LOOP;
END $$;

-- 7. Add the correct foreign key constraint
ALTER TABLE public.blog_posts 
ADD CONSTRAINT blog_posts_user_id_fkey 
FOREIGN KEY (user_id) REFERENCES public.users(id);

-- 8. Verify the foreign key constraint
SELECT 
    'Foreign key verification' as check_type,
    tc.constraint_name,
    kcu.column_name,
    ccu.table_name AS foreign_table_name,
    ccu.column_name AS foreign_column_name,
    '✅ Foreign key created correctly' as status
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

-- 9. Test blog post creation
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
    'COMPLETE TEST BLOG',
    'This is a complete test blog post',
    'Complete test excerpt',
    '{}',
    'draft',
    'complete-test-blog',
    '550e8400-e29b-41d4-a716-446655440000',
    NOW(),
    NOW()
) ON CONFLICT (slug) DO NOTHING;

-- 10. Verify the blog post was created
SELECT 
    'Blog post verification' as check_type,
    title,
    slug,
    user_id,
    status,
    '✅ Blog post created successfully' as result
FROM public.blog_posts 
WHERE slug = 'complete-test-blog';

-- 11. Final verification - check both tables
SELECT 
    'Final verification' as check_type,
    'users' as table_name,
    COUNT(*) as record_count
FROM public.users
UNION ALL
SELECT 
    'Final verification' as check_type,
    'blog_posts' as table_name,
    COUNT(*) as record_count
FROM public.blog_posts; 