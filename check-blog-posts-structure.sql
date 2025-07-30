-- Check the structure of the blog_posts table
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns 
WHERE table_schema = 'public' 
AND table_name = 'blog_posts'
ORDER BY ordinal_position;

-- Check if there are any existing blog posts
SELECT COUNT(*) as total_blog_posts FROM public.blog_posts;

-- Show a sample blog post if any exist
SELECT * FROM public.blog_posts LIMIT 1; 