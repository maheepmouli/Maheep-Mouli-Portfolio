-- Update draft posts to published status for testing
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

-- Update draft posts to published
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

-- Optional: Create a test draft post for admin testing
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
  'Test Draft Post',
  'test-draft-post',
  'This is a test draft post that should only be visible to admin users.',
  'This is a test draft post that should only be visible to admin users. It has draft status and should not be visible to visitors.',
  NULL,
  ARRAY['test', 'draft'],
  'draft',
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