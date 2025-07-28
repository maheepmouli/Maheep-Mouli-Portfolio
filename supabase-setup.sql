-- Create the projects table with proper structure
CREATE TABLE IF NOT EXISTS projects (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
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
  technologies TEXT[] DEFAULT '{}',
  tags TEXT[] DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security (RLS)
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;

-- Create policy to allow all operations for authenticated users
CREATE POLICY "Allow all operations for authenticated users" ON projects
  FOR ALL USING (auth.role() = 'authenticated');

-- Create policy to allow read access for anonymous users
CREATE POLICY "Allow read access for anonymous users" ON projects
  FOR SELECT USING (true);

-- Create policy to allow insert for anonymous users (for testing)
CREATE POLICY "Allow insert for anonymous users" ON projects
  FOR INSERT WITH CHECK (true);

-- Create policy to allow update for anonymous users (for testing)
CREATE POLICY "Allow update for anonymous users" ON projects
  FOR UPDATE USING (true);

-- Create policy to allow delete for anonymous users (for testing)
CREATE POLICY "Allow delete for anonymous users" ON projects
  FOR DELETE USING (true);

-- Create an index on created_at for better performance
CREATE INDEX IF NOT EXISTS idx_projects_created_at ON projects(created_at DESC);

-- Create an index on status for filtering
CREATE INDEX IF NOT EXISTS idx_projects_status ON projects(status);

-- Create an index on featured for filtering
CREATE INDEX IF NOT EXISTS idx_projects_featured ON projects(featured); 