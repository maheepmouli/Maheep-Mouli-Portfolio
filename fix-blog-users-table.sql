-- Fix blog users table issue
-- Run this in your Supabase SQL Editor

-- 1. Create users table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email TEXT UNIQUE NOT NULL,
    display_name TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Add the user record that matches our auth system
INSERT INTO public.users (id, email, display_name, created_at, updated_at)
VALUES (
    '550e8400-e29b-41d4-a716-446655440000',
    'maheep.mouli.shashi@gmail.com',
    'Maheep Mouli Shashi',
    NOW(),
    NOW()
)
ON CONFLICT (id) DO UPDATE SET
    email = EXCLUDED.email,
    display_name = EXCLUDED.display_name,
    updated_at = NOW();

-- 3. Check if the user was added successfully
SELECT * FROM public.users WHERE id = '550e8400-e29b-41d4-a716-446655440000';

-- 4. Verify the blog_posts table foreign key constraint
SELECT 
    tc.table_name, 
    kcu.column_name, 
    ccu.table_name AS foreign_table_name,
    ccu.column_name AS foreign_column_name 
FROM 
    information_schema.table_constraints AS tc 
    JOIN information_schema.key_column_usage AS kcu
      ON tc.constraint_name = kcu.constraint_name
      AND tc.table_schema = kcu.table_schema
    JOIN information_schema.constraint_column_usage AS ccu
      ON ccu.constraint_name = tc.constraint_name
      AND ccu.table_schema = tc.table_schema
WHERE tc.constraint_type = 'FOREIGN KEY' 
    AND tc.table_name='blog_posts';

-- 5. Test if we can now create blog posts
-- (This will be done by your application after running this script) 