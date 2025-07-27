-- Create projects table
CREATE TABLE public.projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  content TEXT,
  image_url TEXT,
  cover_image_url TEXT,
  tags TEXT[],
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'published')),
  featured BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create blogs table
CREATE TABLE public.blogs (
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
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.blogs ENABLE ROW LEVEL SECURITY;

-- Projects policies (public viewing, owner editing)
CREATE POLICY "Published projects are viewable by everyone"
ON public.projects FOR SELECT USING (status = 'published' OR auth.uid() = user_id);

CREATE POLICY "Users can manage their own projects"
ON public.projects FOR ALL USING (auth.uid() = user_id);

-- Blogs policies (public viewing, owner editing)
CREATE POLICY "Published blogs are viewable by everyone"
ON public.blogs FOR SELECT USING (status = 'published' OR auth.uid() = user_id);

CREATE POLICY "Users can manage their own blogs"
ON public.blogs FOR ALL USING (auth.uid() = user_id);

-- Create storage bucket for blog images
INSERT INTO storage.buckets (id, name, public) VALUES
  ('blog-images', 'blog-images', true);

-- Storage policies for blog images
CREATE POLICY "Blog images are publicly accessible"
ON storage.objects FOR SELECT USING (bucket_id = 'blog-images');

CREATE POLICY "Authenticated users can upload blog images"
ON storage.objects FOR INSERT WITH CHECK (
  bucket_id = 'blog-images' AND auth.role() = 'authenticated'
);

CREATE POLICY "Users can manage blog images"
ON storage.objects FOR UPDATE USING (
  bucket_id = 'blog-images' AND auth.role() = 'authenticated'
);

CREATE POLICY "Users can delete blog images"
ON storage.objects FOR DELETE USING (
  bucket_id = 'blog-images' AND auth.role() = 'authenticated'
);

-- Triggers for automatic timestamp updates
CREATE TRIGGER update_projects_updated_at
  BEFORE UPDATE ON public.projects
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_blogs_updated_at
  BEFORE UPDATE ON public.blogs
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column(); 