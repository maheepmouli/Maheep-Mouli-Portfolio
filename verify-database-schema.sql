-- Verify Database Schema for Project Settings
-- Run this in your Supabase SQL Editor to check if everything is set up correctly

-- 1. Check current table structure
SELECT 
    column_name, 
    data_type, 
    is_nullable, 
    column_default,
    CASE 
        WHEN column_name IN ('featured', 'status') THEN '⭐ CRITICAL'
        ELSE '📋 Normal'
    END as importance
FROM information_schema.columns 
WHERE table_name = 'projects' 
ORDER BY 
    CASE WHEN column_name IN ('featured', 'status') THEN 0 ELSE 1 END,
    ordinal_position;

-- 2. Check if featured column exists and has correct type
SELECT 
    CASE 
        WHEN EXISTS (
            SELECT 1 FROM information_schema.columns 
            WHERE table_name = 'projects' AND column_name = 'featured'
        ) THEN '✅ Featured column exists'
        ELSE '❌ Featured column MISSING'
    END as featured_check;

-- 3. Check if status column exists and has correct type
SELECT 
    CASE 
        WHEN EXISTS (
            SELECT 1 FROM information_schema.columns 
            WHERE table_name = 'projects' AND column_name = 'status'
        ) THEN '✅ Status column exists'
        ELSE '❌ Status column MISSING'
    END as status_check;

-- 4. Check current featured projects
SELECT 
    id, 
    title, 
    featured, 
    status,
    CASE 
        WHEN featured = true THEN '⭐ Featured'
        ELSE '📋 Regular'
    END as featured_status
FROM projects 
ORDER BY featured DESC, created_at DESC;

-- 5. Check projects by status
SELECT 
    status,
    COUNT(*) as count,
    CASE 
        WHEN status = 'published' THEN '✅ Published'
        WHEN status = 'draft' THEN '📝 Draft'
        WHEN status IS NULL THEN '❌ No Status'
        ELSE '📋 Other'
    END as status_type
FROM projects 
GROUP BY status 
ORDER BY count DESC;

-- 6. Test featured projects query
SELECT 
    'Featured Projects Test' as test_name,
    COUNT(*) as featured_count
FROM projects 
WHERE featured = true;

-- 7. Test status filtering
SELECT 
    'Published Projects Test' as test_name,
    COUNT(*) as published_count
FROM projects 
WHERE status = 'published';

-- 8. Check for any NULL values in critical columns
SELECT 
    'NULL Check' as check_type,
    COUNT(*) as null_featured_count
FROM projects 
WHERE featured IS NULL;

SELECT 
    'NULL Check' as check_type,
    COUNT(*) as null_status_count
FROM projects 
WHERE status IS NULL;

-- 9. Show sample of projects with their settings
SELECT 
    id,
    title,
    featured,
    status,
    created_at,
    CASE 
        WHEN featured = true AND status = 'published' THEN '✅ Perfect'
        WHEN featured = true THEN '⭐ Featured but not published'
        WHEN status = 'published' THEN '📝 Published but not featured'
        ELSE '📋 Regular project'
    END as project_type
FROM projects 
ORDER BY created_at DESC 
LIMIT 10;

-- 10. Summary report
SELECT 
    'DATABASE SCHEMA VERIFICATION SUMMARY' as summary_title,
    '' as detail;

SELECT 
    'Total Projects' as metric,
    COUNT(*) as value
FROM projects;

SELECT 
    'Featured Projects' as metric,
    COUNT(*) as value
FROM projects WHERE featured = true;

SELECT 
    'Published Projects' as metric,
    COUNT(*) as value
FROM projects WHERE status = 'published';

SELECT 
    'Draft Projects' as metric,
    COUNT(*) as value
FROM projects WHERE status = 'draft';

SELECT 
    'Projects with NULL Status' as metric,
    COUNT(*) as value
FROM projects WHERE status IS NULL;

SELECT 
    'Projects with NULL Featured' as metric,
    COUNT(*) as value
FROM projects WHERE featured IS NULL; 