-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create profiles table
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT UNIQUE NOT NULL,
  display_name TEXT,
  avatar_url TEXT,
  bio TEXT,
  location TEXT,
  website TEXT,
  linkedin_url TEXT,
  github_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create projects table
CREATE TABLE IF NOT EXISTS projects (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  subtitle TEXT,
  description TEXT,
  content TEXT,
  image_url TEXT,
  status TEXT DEFAULT 'draft',
  featured BOOLEAN DEFAULT false,
  project_url TEXT,
  github_url TEXT,
  location TEXT,
  duration TEXT,
  team_size TEXT,
  technologies TEXT[],
  tags TEXT[],
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create project_images table
CREATE TABLE IF NOT EXISTS project_images (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
  image_url TEXT NOT NULL,
  caption TEXT,
  alt_text TEXT,
  width TEXT,
  height TEXT,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create blog_posts table
CREATE TABLE IF NOT EXISTS blog_posts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  content TEXT,
  excerpt TEXT,
  image_url TEXT,
  status TEXT DEFAULT 'draft',
  featured BOOLEAN DEFAULT false,
  author_id UUID REFERENCES profiles(id),
  published_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_projects_updated_at BEFORE UPDATE ON projects FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_blog_posts_updated_at BEFORE UPDATE ON blog_posts FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security (RLS)
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE project_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for profiles
CREATE POLICY "Public profiles are viewable by everyone" ON profiles FOR SELECT USING (true);
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can insert own profile" ON profiles FOR INSERT WITH CHECK (auth.uid() = id);

-- Create RLS policies for projects
CREATE POLICY "Projects are viewable by everyone" ON projects FOR SELECT USING (true);
CREATE POLICY "Authenticated users can insert projects" ON projects FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Authenticated users can update projects" ON projects FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Authenticated users can delete projects" ON projects FOR DELETE USING (auth.role() = 'authenticated');

-- Create RLS policies for project_images
CREATE POLICY "Project images are viewable by everyone" ON project_images FOR SELECT USING (true);
CREATE POLICY "Authenticated users can insert project images" ON project_images FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Authenticated users can update project images" ON project_images FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Authenticated users can delete project images" ON project_images FOR DELETE USING (auth.role() = 'authenticated');

-- Create RLS policies for blog_posts
CREATE POLICY "Blog posts are viewable by everyone" ON blog_posts FOR SELECT USING (true);
CREATE POLICY "Authenticated users can insert blog posts" ON blog_posts FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Authenticated users can update blog posts" ON blog_posts FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Authenticated users can delete blog posts" ON blog_posts FOR DELETE USING (auth.role() = 'authenticated');

-- Insert sample data
INSERT INTO profiles (id, email, display_name, bio, location, linkedin_url, github_url) VALUES 
(
  '00000000-0000-0000-0000-000000000001',
  'maheep.mouli.shashi@gmail.com',
  'Maheep Mouli Shashi',
  'Architect × Urban Technologist × AI Thinker. Designing intelligent feedback systems at the intersection of code, geometry & context.',
  'Barcelona, Spain',
  'https://linkedin.com/in/maheep-mouli-shashi-280832180',
  'https://github.com/maheepmouli'
) ON CONFLICT (id) DO NOTHING;

-- Insert sample projects
INSERT INTO projects (title, subtitle, description, status, featured, technologies, tags) VALUES 
(
  'Flow-SIGHT',
  'Real-time Congestion Prediction Dashboard',
  'AI-powered urban mobility analysis system using Graph ML to predict traffic patterns and optimize city flow in real-time.',
  'published',
  true,
  ARRAY['Python', 'TensorFlow', 'Graph ML', 'React', 'Urban Data'],
  ARRAY['AI Tools', 'Urban Analytics']
),
(
  'WOOD-ID',
  'ML-driven Wood Optimization & Fabrication Pipeline',
  'Computer vision system for automated wood classification and CNC optimization, reducing material waste by 35%.',
  'published',
  true,
  ARRAY['Computer Vision', 'CNC', 'Rhino', 'Python', 'ML'],
  ARRAY['AI Tools', 'Fabrication']
),
(
  'Atelier24: KHC Hospital & Hotel',
  '14,000 m² Mixed-Use Development',
  'Complete BIM coordination and technical documentation for large-scale healthcare and hospitality project using advanced Revit workflows.',
  'published',
  true,
  ARRAY['Revit', 'AutoCAD', 'BIM', 'Construction Docs'],
  ARRAY['BIM', 'Architecture']
) ON CONFLICT DO NOTHING; 