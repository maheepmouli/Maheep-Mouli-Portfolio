-- Diagnostic script to check blog display issues
-- Run this in your Supabase SQL Editor

-- 1. Check all blog posts in the database
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

-- 2. Check if there are any published posts
SELECT 
    'Published posts only' as check_type,
    id,
    title,
    slug,
    status,
    excerpt,
    created_at
FROM public.blog_posts
WHERE status = 'published'
ORDER BY created_at DESC;

-- 3. Fix the slug for the existing blog post (it's too long)
UPDATE public.blog_posts 
SET slug = 'my-first-blog-post'
WHERE title = 'My First Blog Post';

-- 4. Update status to published
UPDATE public.blog_posts 
SET status = 'published'
WHERE status = 'draft';

-- 5. Add some tags to make it more interesting
UPDATE public.blog_posts 
SET tags = '{"computational design", "urban technology", "AI"}'
WHERE title = 'My First Blog Post';

-- 6. Verify the final state
SELECT 
    'Final blog post state' as check_type,
    id,
    title,
    slug,
    status,
    excerpt,
    tags,
    created_at
FROM public.blog_posts
ORDER BY created_at DESC;

-- 7. Check user association
SELECT 
    'User verification' as check_type,
    u.id as user_id,
    u.email,
    u.display_name,
    COUNT(b.id) as blog_count
FROM public.users u
LEFT JOIN public.blog_posts b ON u.id = b.user_id
GROUP BY u.id, u.email, u.display_name; 