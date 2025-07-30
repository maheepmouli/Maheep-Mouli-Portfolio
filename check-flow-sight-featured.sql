-- Check Flow-SIGHT project featured status
-- Run this in your Supabase SQL Editor

-- Check the specific Flow-SIGHT project
SELECT 
    id,
    title,
    featured,
    status,
    created_at,
    updated_at,
    CASE 
        WHEN featured = true THEN '⭐ Featured'
        WHEN featured = false THEN '📋 Not Featured'
        WHEN featured IS NULL THEN '❌ NULL - Issue!'
        ELSE '❓ Unknown'
    END as featured_status
FROM projects 
WHERE title LIKE '%Flow-SIGHT%' OR title LIKE '%Flow%' OR title LIKE '%SIGHT%'
ORDER BY created_at DESC;

-- Check all projects with their featured status
SELECT 
    id,
    title,
    featured,
    status,
    CASE 
        WHEN featured = true THEN '⭐ Featured'
        WHEN featured = false THEN '📋 Not Featured'
        WHEN featured IS NULL THEN '❌ NULL'
        ELSE '❓ Unknown'
    END as featured_status
FROM projects 
ORDER BY featured DESC, created_at DESC;

-- Count featured vs non-featured projects
SELECT 
    'Featured Projects' as category,
    COUNT(*) as count
FROM projects 
WHERE featured = true

UNION ALL

SELECT 
    'Non-Featured Projects' as category,
    COUNT(*) as count
FROM projects 
WHERE featured = false

UNION ALL

SELECT 
    'Projects with NULL Featured' as category,
    COUNT(*) as count
FROM projects 
WHERE featured IS NULL;

-- Check if there are any featured projects at all
SELECT 
    'Total Featured Projects' as metric,
    COUNT(*) as value
FROM projects 
WHERE featured = true; 