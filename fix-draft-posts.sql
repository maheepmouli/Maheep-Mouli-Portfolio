-- Fix draft posts and ensure all posts are published
-- Run this in your Supabase SQL editor

-- First, check current status of all posts
SELECT 
  id,
  title,
  slug,
  status,
  created_at
FROM blog_posts 
ORDER BY created_at DESC;

-- Update ALL posts to published status for testing
UPDATE blog_posts 
SET status = 'published' 
WHERE status = 'draft';

-- Verify the update
SELECT 
  id,
  title,
  slug,
  status,
  created_at
FROM blog_posts 
ORDER BY created_at DESC;

-- Check count by status
SELECT 
  status,
  COUNT(*) as count
FROM blog_posts 
GROUP BY status;

-- Ensure we have at least one published post
SELECT 
  COUNT(*) as total_posts,
  COUNT(CASE WHEN status = 'published' THEN 1 END) as published_posts,
  COUNT(CASE WHEN status = 'draft' THEN 1 END) as draft_posts
FROM blog_posts;

-- If no posts exist, create a test post
INSERT INTO blog_posts (
  id,
  user_id,
  title,
  slug,
  excerpt,
  content,
  cover_image_url,
  tags,
  status,
  created_at,
  updated_at
) VALUES (
  gen_random_uuid(),
  '550e8400-e29b-41d4-a716-446655440000',
  'Test Published Post',
  'test-published-post',
  'This is a test published post that should be visible to everyone.',
  'This is a test published post that should be visible to everyone. It has published status and should be visible to both visitors and admin users.',
  NULL,
  ARRAY['test', 'published'],
  'published',
  NOW(),
  NOW()
) ON CONFLICT (slug) DO NOTHING;

-- Final verification
SELECT 
  id,
  title,
  slug,
  status,
  created_at
FROM blog_posts 
ORDER BY created_at DESC; 