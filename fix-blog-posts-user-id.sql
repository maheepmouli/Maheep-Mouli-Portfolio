-- Fix blog_posts table user_id column for UUID format
-- This script ensures the user_id column is properly configured

-- Check current table structure
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns 
WHERE table_schema = 'public' 
AND table_name = 'blog_posts'
AND column_name = 'user_id'
ORDER BY ordinal_position;

-- Update user_id column to UUID type if needed
ALTER TABLE public.blog_posts 
ALTER COLUMN user_id TYPE UUID USING user_id::UUID;

-- Add foreign key constraint if it doesn't exist
-- Note: This assumes you have an auth.users table or similar
-- If you don't have auth.users, you can skip this step
-- ALTER TABLE public.blog_posts 
-- ADD CONSTRAINT fk_blog_posts_user_id 
-- FOREIGN KEY (user_id) REFERENCES auth.users(id);

-- Create RLS policy for blog_posts if it doesn't exist
CREATE POLICY IF NOT EXISTS "Users can insert their own blog posts" 
ON public.blog_posts
FOR INSERT WITH CHECK (true); -- Allow all inserts for now

CREATE POLICY IF NOT EXISTS "Users can view all blog posts" 
ON public.blog_posts
FOR SELECT USING (true); -- Allow all reads for now

CREATE POLICY IF NOT EXISTS "Users can update their own blog posts" 
ON public.blog_posts
FOR UPDATE USING (true); -- Allow all updates for now

CREATE POLICY IF NOT EXISTS "Users can delete their own blog posts" 
ON public.blog_posts
FOR DELETE USING (true); -- Allow all deletes for now

-- Enable RLS on blog_posts table
ALTER TABLE public.blog_posts ENABLE ROW LEVEL SECURITY;

-- Verify the changes
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns 
WHERE table_schema = 'public' 
AND table_name = 'blog_posts'
ORDER BY ordinal_position; 