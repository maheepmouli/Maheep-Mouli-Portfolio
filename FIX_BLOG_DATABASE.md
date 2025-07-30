# Fix Blog Database Issue

## Problem
The blog creation is failing with a 404 error because the `blogs` table doesn't exist in your Supabase database.

## Solution

### Step 1: Check Current Database Tables
Run this SQL in your Supabase SQL Editor to see what tables exist:

```sql
-- Check what tables exist in the database
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name LIKE '%blog%' OR table_name LIKE '%project%';
```

### Step 2: Create the Blogs Table
If the `blogs` table doesn't exist, run this SQL in your Supabase SQL Editor:

```sql
-- Create blogs table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.blogs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  subtitle TEXT,
  slug TEXT NOT NULL UNIQUE,
  content TEXT,
  excerpt TEXT,
  image_url TEXT,
  cover_image_url TEXT,
  tags TEXT[],
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'published')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.blogs ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for blogs table
-- Allow all operations for authenticated users
CREATE POLICY IF NOT EXISTS "Allow all operations for authenticated users" ON public.blogs
    FOR ALL USING (auth.role() = 'authenticated');

-- Allow public read access
CREATE POLICY IF NOT EXISTS "Allow public read access" ON public.blogs
    FOR SELECT USING (true);

-- Allow insert/update/delete for authenticated users
CREATE POLICY IF NOT EXISTS "Allow authenticated users to manage blogs" ON public.blogs
    FOR ALL USING (auth.role() = 'authenticated');

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_blogs_slug ON public.blogs(slug);
CREATE INDEX IF NOT EXISTS idx_blogs_user_id ON public.blogs(user_id);
CREATE INDEX IF NOT EXISTS idx_blogs_status ON public.blogs(status);

-- Create trigger for automatic timestamp updates
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER IF NOT EXISTS update_blogs_updated_at
  BEFORE UPDATE ON public.blogs
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
```

### Step 3: Test the Table
Run this SQL to test if the table works:

```sql
-- Insert a test blog post to verify the table works
INSERT INTO public.blogs (
  user_id, 
  title, 
  subtitle, 
  slug, 
  content, 
  excerpt, 
  tags, 
  status
) VALUES (
  '00000000-0000-0000-0000-000000000000', -- Placeholder user ID
  'Test Blog Post',
  'This is a test blog post',
  'test-blog-post',
  'This is the content of the test blog post.',
  'This is a test blog post excerpt',
  ARRAY['test', 'blog'],
  'draft'
) ON CONFLICT (slug) DO NOTHING;
```

### Step 4: Verify the Fix
After creating the table:

1. Go to your blog creation page (`/blog/create`)
2. Fill in the form with test data
3. Submit the form
4. Check the console - should see successful creation logs
5. No more 404 errors!

## Alternative: Use Existing Table
If you have a `blog_posts` table instead of `blogs`, the updated service will automatically detect and use it.

## Troubleshooting

### If you get permission errors:
Make sure you're running the SQL as a database owner or have the necessary permissions.

### If the table already exists but with different columns:
Check the table structure and update the service to match your existing schema.

### If you're still getting errors:
1. Check the Supabase logs in your dashboard
2. Verify the RLS policies are correct
3. Make sure your user has the necessary permissions

## Expected Results
After running these steps:
- ✅ Blog creation should work without 404 errors
- ✅ Blog posts should be saved to the database
- ✅ Blog editing should work properly
- ✅ No more "Table not found" errors 