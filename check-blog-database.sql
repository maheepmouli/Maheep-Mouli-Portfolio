-- Check blog database structure and verify the specific blog post exists
-- Run this in your Supabase SQL editor

-- 1. Check if blog tables exist
SELECT 
  table_name,
  column_name,
  data_type,
  is_nullable
FROM information_schema.columns 
WHERE table_name IN ('blogs', 'blog_posts')
ORDER BY table_name, ordinal_position;

-- 2. Check blog_posts table structure
SELECT 
  column_name,
  data_type,
  is_nullable,
  column_default
FROM information_schema.columns 
WHERE table_name = 'blog_posts'
ORDER BY ordinal_position;

-- 3. Check if the specific blog post exists
SELECT 
  id,
  title,
  slug,
  status,
  created_at,
  updated_at,
  array_length(tags, 1) as tag_count
FROM blog_posts 
WHERE id = 'c9b3dba2-fef4-446c-a66a-471a3adac4f9'
   OR title = 'Why I Use Graph ML to Design Smarter Cities'
   OR slug = 'why-i-use-graph-ml-to-design-smarter-cities';

-- 4. Check all published blog posts
SELECT 
  id,
  title,
  slug,
  status,
  created_at,
  array_length(tags, 1) as tag_count
FROM blog_posts 
WHERE status = 'published'
ORDER BY created_at DESC;

-- 5. Check for any blog posts with similar titles
SELECT 
  id,
  title,
  slug,
  status,
  created_at
FROM blog_posts 
WHERE title ILIKE '%Graph ML%'
   OR title ILIKE '%smarter cities%'
   OR title ILIKE '%urban%'
ORDER BY created_at DESC;

-- 6. Check the tags array structure
SELECT 
  id,
  title,
  tags,
  array_length(tags, 1) as tag_count
FROM blog_posts 
WHERE tags IS NOT NULL
LIMIT 5;

-- 7. Check for any blog posts with the specific user_id
SELECT 
  id,
  title,
  slug,
  status,
  created_at
FROM blog_posts 
WHERE user_id = '550e8400-e29b-41d4-a716-446655440000'
ORDER BY created_at DESC;

-- 8. Check total count of blog posts
SELECT 
  status,
  COUNT(*) as count
FROM blog_posts 
GROUP BY status;

-- 9. Check for any NULL values in important fields
SELECT 
  id,
  title,
  slug,
  status,
  created_at
FROM blog_posts 
WHERE title IS NULL 
   OR slug IS NULL 
   OR status IS NULL
   OR created_at IS NULL;

-- 10. Check the excerpt field
SELECT 
  id,
  title,
  excerpt,
  LENGTH(excerpt) as excerpt_length
FROM blog_posts 
WHERE excerpt IS NOT NULL
ORDER BY created_at DESC
LIMIT 5; 