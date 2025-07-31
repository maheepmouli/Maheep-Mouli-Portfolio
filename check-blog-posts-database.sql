-- Check blog posts in database
-- Run this in your Supabase SQL Editor

-- 1. Check all blog posts
SELECT 
    'All blog posts' as check_type,
    id,
    title,
    slug,
    status,
    excerpt,
    tags,
    created_at,
    user_id
FROM public.blog_posts
ORDER BY created_at DESC;

-- 2. Check published posts only
SELECT 
    'Published posts only' as check_type,
    id,
    title,
    slug,
    status,
    excerpt,
    tags,
    created_at
FROM public.blog_posts
WHERE status = 'published'
ORDER BY created_at DESC;

-- 3. Check if there are any posts with 'blog' tag
SELECT 
    'Posts with blog tag' as check_type,
    id,
    title,
    slug,
    status,
    tags,
    created_at
FROM public.blog_posts
WHERE tags::text LIKE '%blog%'
ORDER BY created_at DESC;

-- 4. Update any draft posts to published
UPDATE public.blog_posts 
SET status = 'published'
WHERE status = 'draft';

-- 5. Add tags to posts that don't have them
UPDATE public.blog_posts 
SET tags = '{"test", "blog"}'
WHERE tags IS NULL OR tags = '{}';

-- 6. Verify final state
SELECT 
    'Final blog posts' as check_type,
    id,
    title,
    slug,
    status,
    excerpt,
    tags,
    created_at
FROM public.blog_posts
ORDER BY created_at DESC; 