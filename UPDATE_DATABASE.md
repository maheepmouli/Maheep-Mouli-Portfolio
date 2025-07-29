# Update Database Schema

Follow these steps to update your Supabase database:

## 1. Run the Updated SQL Script

1. Go to your Supabase dashboard
2. Navigate to the SQL Editor
3. Copy and paste the contents of `supabase-setup.sql` into the editor
4. Click "Run" to execute the script

This will:
- Update the `projects` table schema to make `user_id` nullable
- Create proper indexes for better performance
- Set up Row Level Security (RLS) policies
- Create the `portfolio-assets` storage bucket
- Set up storage policies for file uploads

## 2. Verify the Setup

After running the script, you should see:
- No errors (or only "already exists" messages which are normal)
- The `projects` table with the updated schema
- The `portfolio-assets` storage bucket created
- RLS policies in place

## 3. Test the Application

Once the database is updated:
1. Restart your development server
2. Try creating a new project
3. Test image uploads
4. Verify that projects are visible to visitors

The application should now work properly with both Supabase and localStorage synchronization. 