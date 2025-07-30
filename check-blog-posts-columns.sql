-- Check the exact column structure of blog_posts table
SELECT 
  column_name, 
  data_type, 
  is_nullable, 
  column_default,
  ordinal_position
FROM information_schema.columns 
WHERE table_schema = 'public' 
AND table_name = 'blog_posts'
ORDER BY ordinal_position;

-- Show sample data to understand the structure
SELECT * FROM public.blog_posts LIMIT 1; 