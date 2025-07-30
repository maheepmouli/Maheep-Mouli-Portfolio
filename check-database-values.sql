-- Check what status and featured values are in the database
-- Run this in your Supabase SQL editor

-- Check all projects and their status/featured values
SELECT 
  id,
  title,
  featured,
  status,
  created_at
FROM projects
ORDER BY created_at DESC;

-- Check how many projects have status values
SELECT 
  COUNT(*) as total_projects,
  COUNT(CASE WHEN status IS NOT NULL AND status != '' THEN 1 END) as projects_with_status,
  COUNT(CASE WHEN featured = true THEN 1 END) as featured_projects,
  COUNT(CASE WHEN featured IS NULL THEN 1 END) as projects_without_featured
FROM projects;

-- Check what status values exist
SELECT 
  status,
  COUNT(*) as count
FROM projects 
WHERE status IS NOT NULL AND status != ''
GROUP BY status
ORDER BY count DESC;

-- Check featured projects specifically
SELECT 
  id,
  title,
  featured,
  status
FROM projects 
WHERE featured = true
ORDER BY created_at DESC;

-- Check projects without status
SELECT 
  id,
  title,
  featured,
  status
FROM projects 
WHERE status IS NULL OR status = ''
ORDER BY created_at DESC; 