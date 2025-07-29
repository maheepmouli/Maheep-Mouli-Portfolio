# 🚨 URGENT: Storage Bucket Setup Required

## ❌ Current Issue
The error `new row violates row-level security policy` indicates that either:
1. The `portfolio-assets` bucket doesn't exist
2. The RLS policies are not properly configured

## ✅ Solution: Create Storage Bucket & Configure RLS

### Step 1: Create the Storage Bucket

1. **Go to your Supabase Dashboard**
   - Visit: https://supabase.com/dashboard
   - Select your project

2. **Navigate to Storage**
   - Click on "Storage" in the left sidebar
   - Click "Create a new bucket"

3. **Create the Bucket**
   - **Bucket name:** `portfolio-assets`
   - **Public bucket:** ✅ **CHECK THIS** (Important!)
   - **File size limit:** 50MB (or your preferred limit)
   - **Allowed MIME types:** `image/*` (or leave empty for all types)
   - Click "Create bucket"

### Step 2: Configure RLS Policies

**IMPORTANT:** After creating the bucket, you MUST configure RLS policies.

1. **Go to Storage > Policies**
   - Click on the `portfolio-assets` bucket
   - Click "Policies" tab

2. **Add these 4 policies one by one:**

#### Policy 1: Public Read Access
```sql
CREATE POLICY "Allow public read access" ON storage.objects
FOR SELECT USING (bucket_id = 'portfolio-assets');
```

#### Policy 2: Anonymous Upload
```sql
CREATE POLICY "Allow anonymous users to upload" ON storage.objects
FOR INSERT WITH CHECK (bucket_id = 'portfolio-assets');
```

#### Policy 3: Anonymous Update
```sql
CREATE POLICY "Allow anonymous users to update" ON storage.objects
FOR UPDATE USING (bucket_id = 'portfolio-assets');
```

#### Policy 4: Anonymous Delete
```sql
CREATE POLICY "Allow anonymous users to delete" ON storage.objects
FOR DELETE USING (bucket_id = 'portfolio-assets');
```

### Step 3: Alternative Quick Fix (Temporary)

If you want to test immediately without RLS:

1. **Go to Storage > Settings**
2. **Disable RLS temporarily:**
   - Find "Row Level Security (RLS)"
   - Toggle it OFF
   - Save changes

**⚠️ Note:** This is less secure but allows immediate testing.

### Step 4: Verify Setup

After completing the above steps:

1. **Test the bucket exists:**
   ```sql
   SELECT * FROM storage.buckets WHERE name = 'portfolio-assets';
   ```

2. **Test the policies:**
   ```sql
   SELECT * FROM storage.policies WHERE bucket_id = 'portfolio-assets';
   ```

## 🎯 Expected Result

After completing these steps, your image uploads should work without the RLS error.

## 🔧 If Still Having Issues

1. **Check bucket exists:**
   - Go to Storage in Supabase dashboard
   - Verify `portfolio-assets` bucket is listed

2. **Check policies:**
   - Click on the bucket
   - Go to "Policies" tab
   - Verify all 4 policies are listed

3. **Test with a simple upload:**
   - Try uploading a small image file
   - Check browser console for new errors

## 📞 Need Help?

If you're still getting errors after following these steps, please share:
1. Screenshot of your Storage buckets list
2. Screenshot of your bucket policies
3. Any new error messages

---

**Priority:** This needs to be fixed before image uploads will work! 