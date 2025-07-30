-- Add status values to existing projects that don't have them
-- Run this in your Supabase SQL editor

-- First, let's see what we have
SELECT 
  id,
  title,
  featured,
  status
FROM projects
ORDER BY created_at DESC;

-- Update projects without status to have a default status
UPDATE projects 
SET status = 'published'
WHERE status IS NULL OR status = '';

-- Update featured projects to have a more prominent status
UPDATE projects 
SET status = 'Live Demo'
WHERE featured = true AND (status IS NULL OR status = '' OR status = 'published');

-- Set some projects to different statuses based on their titles
UPDATE projects 
SET status = 'Case Study'
WHERE title ILIKE '%hospital%' OR title ILIKE '%health%';

UPDATE projects 
SET status = 'Built'
WHERE title ILIKE '%wood%' OR title ILIKE '%construction%';

UPDATE projects 
SET status = 'Research'
WHERE title ILIKE '%flow%' OR title ILIKE '%ai%' OR title ILIKE '%ml%';

-- Verify the changes
SELECT 
  id,
  title,
  featured,
  status
FROM projects
ORDER BY created_at DESC; 