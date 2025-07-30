-- Update blog post status to published
-- Run this in your Supabase SQL Editor

-- 1. Check current blog posts
SELECT 
    'Current blog posts' as check_type,
    id,
    title,
    slug,
    status,
    created_at
FROM public.blog_posts
ORDER BY created_at DESC;

-- 2. Update the blog post to published status
UPDATE public.blog_posts 
SET status = 'published'
WHERE status = 'draft';

-- 3. Verify the update
SELECT 
    'Updated blog posts' as check_type,
    id,
    title,
    slug,
    status,
    created_at
FROM public.blog_posts
ORDER BY created_at DESC;

-- 4. Check total count
SELECT 
    'Final count' as check_type,
    COUNT(*) as total_posts,
    COUNT(CASE WHEN status = 'published' THEN 1 END) as published_posts,
    COUNT(CASE WHEN status = 'draft' THEN 1 END) as draft_posts
FROM public.blog_posts; 