-- Add new fields to projects table
ALTER TABLE public.projects 
ADD COLUMN project_url TEXT,
ADD COLUMN github_url TEXT,
ADD COLUMN location TEXT,
ADD COLUMN duration TEXT,
ADD COLUMN team_size TEXT; 