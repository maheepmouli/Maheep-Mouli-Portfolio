-- Step 2: Add featured field to projects table
-- This script adds a featured field to mark projects as featured

-- Add featured column if it doesn't exist
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'projects' AND column_name = 'featured'
    ) THEN
        ALTER TABLE projects ADD COLUMN featured BOOLEAN DEFAULT false;
    END IF;
END $$;

-- Update existing projects to have a default featured value
UPDATE projects SET featured = false WHERE featured IS NULL;

-- Verify the changes
SELECT 
    column_name, 
    data_type, 
    is_nullable, 
    column_default
FROM information_schema.columns 
WHERE table_name = 'projects' AND column_name = 'featured';

-- Show current featured values
SELECT id, title, featured FROM projects ORDER BY created_at DESC; 