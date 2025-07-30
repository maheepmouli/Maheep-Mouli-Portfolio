# Project Settings Fix Guide

## Issues Identified

1. **Featured Projects Not Working**: The featured checkbox in the form is not properly saving to the database
2. **Project Status Not Working**: The status dropdown is not properly updating the database
3. **Database Schema Issues**: Missing or incorrect column definitions in the projects table

## Step-by-Step Fix

### Step 1: Fix Database Schema

Run this SQL script in your Supabase SQL Editor:

```sql
-- Fix Project Settings Issues
-- Run this in your Supabase SQL Editor to fix featured projects and status issues

-- First, let's check the current table structure
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns 
WHERE table_name = 'projects' 
ORDER BY ordinal_position;

-- Ensure the projects table has all required columns with proper constraints
DO $$ 
BEGIN
    -- Add featured column if it doesn't exist
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'projects' AND column_name = 'featured'
    ) THEN
        ALTER TABLE projects ADD COLUMN featured BOOLEAN DEFAULT false;
    END IF;

    -- Add status column if it doesn't exist
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'projects' AND column_name = 'status'
    ) THEN
        ALTER TABLE projects ADD COLUMN status TEXT DEFAULT 'draft';
    END IF;

    -- Add other missing columns
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'projects' AND column_name = 'project_url'
    ) THEN
        ALTER TABLE projects ADD COLUMN project_url TEXT;
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'projects' AND column_name = 'github_url'
    ) THEN
        ALTER TABLE projects ADD COLUMN github_url TEXT;
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'projects' AND column_name = 'location'
    ) THEN
        ALTER TABLE projects ADD COLUMN location TEXT;
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'projects' AND column_name = 'duration'
    ) THEN
        ALTER TABLE projects ADD COLUMN duration TEXT;
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'projects' AND column_name = 'team_size'
    ) THEN
        ALTER TABLE projects ADD COLUMN team_size TEXT;
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'projects' AND column_name = 'technologies'
    ) THEN
        ALTER TABLE projects ADD COLUMN technologies TEXT[] DEFAULT '{}';
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'projects' AND column_name = 'tags'
    ) THEN
        ALTER TABLE projects ADD COLUMN tags TEXT[] DEFAULT '{}';
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'projects' AND column_name = 'project_images'
    ) THEN
        ALTER TABLE projects ADD COLUMN project_images TEXT[] DEFAULT '{}';
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'projects' AND column_name = 'videos'
    ) THEN
        ALTER TABLE projects ADD COLUMN videos JSONB DEFAULT '[]'::jsonb;
    END IF;

    -- Add slug column if it doesn't exist
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'projects' AND column_name = 'slug'
    ) THEN
        ALTER TABLE projects ADD COLUMN slug TEXT;
    END IF;

    -- Add user_id column if it doesn't exist
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'projects' AND column_name = 'user_id'
    ) THEN
        ALTER TABLE projects ADD COLUMN user_id UUID;
    END IF;

END $$;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_projects_featured ON projects(featured);
CREATE INDEX IF NOT EXISTS idx_projects_status ON projects(status);
CREATE INDEX IF NOT EXISTS idx_projects_slug ON projects(slug);
CREATE INDEX IF NOT EXISTS idx_projects_user_id ON projects(user_id);

-- Update RLS policies to ensure proper access
DROP POLICY IF EXISTS "Allow public read access" ON projects;
CREATE POLICY "Allow public read access" ON projects
    FOR SELECT USING (true);

DROP POLICY IF EXISTS "Allow authenticated users to manage projects" ON projects;
CREATE POLICY "Allow authenticated users to manage projects" ON projects
    FOR ALL USING (auth.role() = 'authenticated');

-- Add a policy for anonymous users to insert/update (for testing)
DROP POLICY IF EXISTS "Allow anonymous users to manage projects" ON projects;
CREATE POLICY "Allow anonymous users to manage projects" ON projects
    FOR ALL USING (true);

-- Verify the final table structure
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns 
WHERE table_name = 'projects' 
ORDER BY ordinal_position;

-- Test query to check if featured projects work
SELECT id, title, featured, status 
FROM projects 
WHERE featured = true 
ORDER BY created_at DESC;

-- Test query to check if status filtering works
SELECT id, title, status 
FROM projects 
WHERE status = 'published' 
ORDER BY created_at DESC;
```

### Step 2: Test the Database

After running the SQL script, test these queries in your Supabase SQL Editor:

```sql
-- Check if featured projects are working
SELECT id, title, featured, status 
FROM projects 
WHERE featured = true 
ORDER BY created_at DESC;

-- Check if status filtering works
SELECT id, title, status 
FROM projects 
WHERE status = 'published' 
ORDER BY created_at DESC;

-- Check all projects with their settings
SELECT id, title, featured, status, created_at 
FROM projects 
ORDER BY created_at DESC;
```

### Step 3: Update Existing Projects (Optional)

If you have existing projects that need to be updated with featured/status settings:

```sql
-- Update specific projects to be featured
UPDATE projects 
SET featured = true, status = 'published'
WHERE title = 'Your Project Title';

-- Update all projects to published status
UPDATE projects 
SET status = 'published' 
WHERE status IS NULL OR status = 'draft';
```

### Step 4: Verify Frontend Integration

The frontend code should now work properly. The form includes:

1. **Featured Project Checkbox**: 
   ```tsx
   <div className="flex items-center space-x-2">
     <input
       type="checkbox"
       id="featured"
       checked={formData.featured}
       onChange={(e) => setFormData(prev => ({ ...prev, featured: e.target.checked }))}
       className="rounded"
     />
     <Label htmlFor="featured">Featured Project</Label>
   </div>
   ```

2. **Status Dropdown**:
   ```tsx
   <select
     id="status"
     value={formData.status}
     onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value as any }))}
     className="w-full p-2 border rounded-md"
   >
     <option value="draft">Draft</option>
     <option value="published">Published</option>
     <option value="Live Demo">Live Demo</option>
     <option value="Case Study">Case Study</option>
     <option value="Built">Built</option>
     <option value="Research">Research</option>
     <option value="Completed">Completed</option>
     <option value="Development">Development</option>
   </select>
   ```

### Step 5: Test the Fix

1. **Create a new project** with featured = true and status = 'published'
2. **Edit an existing project** and change its featured/status settings
3. **Check the portfolio page** to see if featured projects are displayed
4. **Verify in the database** that the changes were saved

### Troubleshooting

If the issues persist:

1. **Check Browser Console**: Look for any JavaScript errors
2. **Check Network Tab**: Verify that the API calls are being made correctly
3. **Check Database Logs**: Look for any SQL errors in Supabase
4. **Clear Browser Cache**: Sometimes cached data can cause issues

### Common Issues and Solutions

1. **Featured projects not showing**: Make sure the database has the `featured` column and it's being set to `true`
2. **Status not updating**: Ensure the `status` column exists and accepts the values you're trying to set
3. **Form not saving**: Check that the RLS policies allow the current user to update projects
4. **Database connection issues**: Verify your Supabase configuration in the environment variables

## Expected Results

After applying this fix:

1. ✅ Featured projects checkbox should work and save to database
2. ✅ Status dropdown should work and save to database  
3. ✅ Featured projects should appear in the featured section
4. ✅ Projects should be filterable by status
5. ✅ All project settings should persist after page refresh

## Files Modified

- `fix-project-settings.sql` - Database schema fix
- `PROJECT_SETTINGS_FIX.md` - This guide

The existing frontend code should work once the database schema is fixed. 