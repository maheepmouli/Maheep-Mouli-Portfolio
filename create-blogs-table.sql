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