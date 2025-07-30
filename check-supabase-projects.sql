-- Check projects in Supabase
-- Run this in your Supabase SQL Editor

-- Check all projects in the projects table
SELECT 
  id,
  title,
  slug,
  status,
  featured,
  created_at,
  updated_at
FROM public.projects
ORDER BY created_at DESC;

-- Count total projects
SELECT 
  COUNT(*) as total_projects,
  COUNT(CASE WHEN featured = true THEN 1 END) as featured_projects,
  COUNT(CASE WHEN status = 'published' THEN 1 END) as published_projects,
  COUNT(CASE WHEN status = 'draft' THEN 1 END) as draft_projects
FROM public.projects;

-- Check for specific projects
SELECT 
  title,
  slug,
  status,
  featured
FROM public.projects
WHERE title IN (
  'Flow-SIGHT',
  'WOOD-ID',
  'HYPAR PORTABLES',
  'R&E - BioFoam Thermal Performance',
  'Blasters Park: Multi-Functional Stadium Complex',
  'KHC-HOSPITAL',
  'Atelier24: KHC Hospital & Hotel',
  'Bioplastic Lab',
  'Chopra Residence'
)
ORDER BY title; 