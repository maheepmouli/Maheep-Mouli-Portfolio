# Manual Storage Setup Guide

## 🚨 **Issue: Permission Error**

The SQL script failed because you don't have owner permissions on the `storage.objects` table. This is normal in Supabase - storage policies need to be set up manually through the dashboard.

## ✅ **Solution: Manual Setup**

### Step 1: Run the Simplified SQL Script

1. **Go to Supabase SQL Editor**
2. **Copy and paste** the content from `supabase-setup.sql`
3. **Click "Run"** - This will create the projects table and policies

### Step 2: Create Storage Bucket Manually

1. **Go to Storage** in your Supabase dashboard
2. **Click "Create a new bucket"**
3. **Enter bucket name:** `portfolio-assets`
4. **Set as public:** ✅ Check "Public bucket"
5. **Click "Create bucket"**

### Step 3: Set Up Storage Policies

1. **Click on the `portfolio-assets` bucket**
2. **Go to "Policies" tab**
3. **Click "New Policy"**

#### Policy 1: Public Read Access
- **Policy name:** `Allow public read access`
- **Allowed operation:** `SELECT`
- **Target roles:** `anon, authenticated`
- **Policy definition:** `bucket_id = 'portfolio-assets'`

#### Policy 2: Anonymous Upload
- **Policy name:** `Allow anonymous upload`
- **Allowed operation:** `INSERT`
- **Target roles:** `anon, authenticated`
- **Policy definition:** `bucket_id = 'portfolio-assets'`

#### Policy 3: Authenticated Update
- **Policy name:** `Allow authenticated update`
- **Allowed operation:** `UPDATE`
- **Target roles:** `authenticated`
- **Policy definition:** `bucket_id = 'portfolio-assets' AND auth.role() = 'authenticated'`

#### Policy 4: Authenticated Delete
- **Policy name:** `Allow authenticated delete`
- **Allowed operation:** `DELETE`
- **Target roles:** `authenticated`
- **Policy definition:** `bucket_id = 'portfolio-assets' AND auth.role() = 'authenticated'`

## ✅ **Expected Results**

After completing both steps:
- ✅ **Projects table created** with proper RLS policies
- ✅ **Storage bucket created** for image uploads
- ✅ **Storage policies set** for anonymous uploads
- ✅ **Test project inserted** to verify database works

## 🚀 **Test the Application**

1. **Go to your portfolio** (http://localhost:5174)
2. **Try creating a new project** with image upload
3. **Check if the project appears** in the portfolio
4. **Verify image uploads work** from your computer

## 📊 **Console Logs to Expect**

```
UnifiedService: Supabase query successful
UnifiedService: Found projects in Supabase: 1
imageUploadService: Upload successful, public URL: [url]
```

**Follow these steps and your portfolio will work perfectly!** 🎉 