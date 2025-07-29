-- Create projects table with proper schema
CREATE TABLE IF NOT EXISTS projects (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    slug VARCHAR(255) NOT NULL UNIQUE,
    subtitle VARCHAR(500),
    description TEXT,
    content TEXT,
    image_url TEXT,
    project_images TEXT[],
    technologies TEXT[],
    github_url VARCHAR(500),
    live_url VARCHAR(500),
    featured BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Make user_id nullable (in case it was created as NOT NULL)
ALTER TABLE projects ALTER COLUMN user_id DROP NOT NULL;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_projects_slug ON projects(slug);
CREATE INDEX IF NOT EXISTS idx_projects_user_id ON projects(user_id);
CREATE INDEX IF NOT EXISTS idx_projects_featured ON projects(featured);

-- Enable Row Level Security
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist (to avoid conflicts)
DROP POLICY IF EXISTS "Allow all operations for authenticated users" ON projects;
DROP POLICY IF EXISTS "Allow public read access" ON projects;
DROP POLICY IF EXISTS "Allow authenticated users to manage projects" ON projects;
DROP POLICY IF EXISTS "Allow anonymous users to insert projects" ON projects;

-- Create RLS policies for projects table
-- Allow all operations for authenticated users
CREATE POLICY "Allow all operations for authenticated users" ON projects
    FOR ALL USING (auth.role() = 'authenticated');

-- Allow public read access
CREATE POLICY "Allow public read access" ON projects
    FOR SELECT USING (true);

-- Allow insert/update/delete for authenticated users
CREATE POLICY "Allow authenticated users to manage projects" ON projects
    FOR ALL USING (auth.role() = 'authenticated');

-- Allow anonymous users to insert projects (for testing)
CREATE POLICY "Allow anonymous users to insert projects" ON projects
    FOR INSERT WITH CHECK (true);

-- Test the setup by inserting a sample project
INSERT INTO projects (title, slug, subtitle, description, content, image_url, featured, user_id)
VALUES (
    'Test Project',
    'test-project',
    'Test Subtitle',
    'This is a test project to verify the database setup is working correctly.',
    'Test project content for verification.',
    '',
    false,
    NULL
) ON CONFLICT (slug) DO NOTHING; 