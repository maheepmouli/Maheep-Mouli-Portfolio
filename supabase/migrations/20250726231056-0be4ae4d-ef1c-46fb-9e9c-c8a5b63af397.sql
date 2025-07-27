-- Create user profiles table
CREATE TABLE public.profiles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  display_name TEXT,
  bio TEXT,
  avatar_url TEXT,
  phone TEXT,
  linkedin_url TEXT,
  resume_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create projects table
CREATE TABLE public.projects (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  content TEXT,
  cover_image_url TEXT,
  tags TEXT[],
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'published')),
  featured BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create blog posts table
CREATE TABLE public.blog_posts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  excerpt TEXT,
  content TEXT,
  cover_image_url TEXT,
  tags TEXT[],
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'published')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create project images table for additional project media
CREATE TABLE public.project_images (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  image_url TEXT NOT NULL,
  caption TEXT,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.blog_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.project_images ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Profiles are viewable by everyone" 
ON public.profiles FOR SELECT USING (true);

CREATE POLICY "Users can update their own profile" 
ON public.profiles FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own profile" 
ON public.profiles FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Projects policies (public viewing, owner editing)
CREATE POLICY "Published projects are viewable by everyone" 
ON public.projects FOR SELECT USING (status = 'published' OR auth.uid() = user_id);

CREATE POLICY "Users can manage their own projects" 
ON public.projects FOR ALL USING (auth.uid() = user_id);

-- Blog posts policies (public viewing, owner editing)
CREATE POLICY "Published blog posts are viewable by everyone" 
ON public.blog_posts FOR SELECT USING (status = 'published' OR auth.uid() = user_id);

CREATE POLICY "Users can manage their own blog posts" 
ON public.blog_posts FOR ALL USING (auth.uid() = user_id);

-- Project images policies
CREATE POLICY "Project images are viewable with their projects" 
ON public.project_images FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM public.projects 
    WHERE projects.id = project_images.project_id 
    AND (projects.status = 'published' OR projects.user_id = auth.uid())
  )
);

CREATE POLICY "Users can manage images for their own projects" 
ON public.project_images FOR ALL USING (
  EXISTS (
    SELECT 1 FROM public.projects 
    WHERE projects.id = project_images.project_id 
    AND projects.user_id = auth.uid()
  )
);

-- Create storage buckets
INSERT INTO storage.buckets (id, name, public) VALUES 
  ('avatars', 'avatars', true),
  ('project-images', 'project-images', true),
  ('blog-images', 'blog-images', true);

-- Storage policies for avatars
CREATE POLICY "Avatar images are publicly accessible" 
ON storage.objects FOR SELECT USING (bucket_id = 'avatars');

CREATE POLICY "Users can upload their own avatar" 
ON storage.objects FOR INSERT WITH CHECK (
  bucket_id = 'avatars' AND auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Users can update their own avatar" 
ON storage.objects FOR UPDATE USING (
  bucket_id = 'avatars' AND auth.uid()::text = (storage.foldername(name))[1]
);

-- Storage policies for project images
CREATE POLICY "Project images are publicly accessible" 
ON storage.objects FOR SELECT USING (bucket_id = 'project-images');

CREATE POLICY "Authenticated users can upload project images" 
ON storage.objects FOR INSERT WITH CHECK (
  bucket_id = 'project-images' AND auth.role() = 'authenticated'
);

CREATE POLICY "Users can manage project images" 
ON storage.objects FOR UPDATE USING (
  bucket_id = 'project-images' AND auth.role() = 'authenticated'
);

CREATE POLICY "Users can delete project images" 
ON storage.objects FOR DELETE USING (
  bucket_id = 'project-images' AND auth.role() = 'authenticated'
);

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

-- Function to automatically create profile when user signs up
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = ''
AS $$
BEGIN
  INSERT INTO public.profiles (user_id, display_name)
  VALUES (NEW.id, NEW.raw_user_meta_data->>'display_name');
  RETURN NEW;
END;
$$;

-- Trigger to create profile on user signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- Function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers for automatic timestamp updates
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_projects_updated_at
  BEFORE UPDATE ON public.projects
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_blog_posts_updated_at
  BEFORE UPDATE ON public.blog_posts
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column(); 