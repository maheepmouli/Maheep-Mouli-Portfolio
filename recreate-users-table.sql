-- Completely recreate users table and fix blog issue
-- Run this in your Supabase SQL Editor

-- 1. Drop the existing users table (if it exists)
DROP TABLE IF EXISTS public.users CASCADE;

-- 2. Create a fresh users table
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

-- 4. Verify the user was added
SELECT 
    'User verification' as check_type,
    id,
    email,
    display_name,
    '✅ User created successfully' as status
FROM public.users 
WHERE id = '550e8400-e29b-41d4-a716-446655440000';

-- 5. Check if blog_posts table has the correct foreign key
SELECT 
    'Foreign key check' as check_type,
    tc.constraint_name,
    kcu.column_name,
    ccu.table_name AS foreign_table_name,
    ccu.column_name AS foreign_column_name
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

-- 6. Test blog post creation manually
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
    'MANUAL TEST BLOG',
    'This is a manual test blog post',
    'Manual test excerpt',
    '{}',
    'draft',
    'manual-test-blog',
    '550e8400-e29b-41d4-a716-446655440000',
    NOW(),
    NOW()
) ON CONFLICT (slug) DO NOTHING;

-- 7. Verify the blog post was created
SELECT 
    'Blog post verification' as check_type,
    title,
    slug,
    user_id,
    status,
    '✅ Blog post created successfully' as result
FROM public.blog_posts 
WHERE slug = 'manual-test-blog'; 