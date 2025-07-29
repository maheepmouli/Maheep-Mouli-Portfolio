# Fix Storage Policy Issue

## 🚨 Current Error
```
Error: new row violates row-level security policy
```

This error occurs because the storage bucket exists, but the RLS (Row Level Security) policy is too restrictive for anonymous users.

## ✅ Solution

### Step 1: Update Database Policies
1. Go to your Supabase dashboard
2. Click **SQL Editor** in the left sidebar
3. Copy the entire content from `supabase-setup.sql`
4. Paste it into the SQL Editor and click **"Run"**

This will add these new policies:
- `Allow anonymous users to insert projects` - Allows creating projects without authentication
- `Allow anonymous users to upload to portfolio-assets` - Allows image uploads without authentication

### Step 2: Test Image Upload
1. Go to your portfolio application
2. Try creating a new project
3. Upload an image from your computer
4. The upload should now work without the RLS error

## 🔧 What Changed

The updated SQL script now includes:
```sql
-- Allow anonymous users to upload to portfolio-assets bucket (for testing)
CREATE POLICY IF NOT EXISTS "Allow anonymous users to upload to portfolio-assets" ON storage.objects
    FOR INSERT WITH CHECK (bucket_id = 'portfolio-assets');
```

This policy allows anyone (including anonymous users) to upload files to the `portfolio-assets` bucket.

## ✅ Expected Result

After running the updated SQL:
- ✅ Image uploads will work for anonymous users
- ✅ No more "row-level security policy" errors
- ✅ Projects can be created and images uploaded successfully

The application should now work perfectly! 🚀 