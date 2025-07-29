# 🔧 **Fix Storage Policies for Image Uploads**

## 🚨 **Current Issue:**
```
Error: new row violates row-level security policy
```

This error occurs because the storage bucket policies are not configured correctly for anonymous users to upload images.

## 📋 **Solution: Set Up Storage Policies**

### **Step 1: Go to Supabase Storage**
1. **Open your Supabase dashboard**
2. **Click on "Storage"** in the left sidebar
3. **Click on your `portfolio-assets` bucket**

### **Step 2: Add Storage Policies**

Go to the **"Policies"** tab and add these 4 policies:

#### **Policy 1: Allow public read access**
```sql
CREATE POLICY "Allow public read access" ON storage.objects
FOR SELECT USING (bucket_id = 'portfolio-assets');
```

#### **Policy 2: Allow anonymous users to upload**
```sql
CREATE POLICY "Allow anonymous users to upload" ON storage.objects
FOR INSERT WITH CHECK (bucket_id = 'portfolio-assets');
```

#### **Policy 3: Allow anonymous users to update**
```sql
CREATE POLICY "Allow anonymous users to update" ON storage.objects
FOR UPDATE USING (bucket_id = 'portfolio-assets');
```

#### **Policy 4: Allow anonymous users to delete**
```sql
CREATE POLICY "Allow anonymous users to delete" ON storage.objects
FOR DELETE USING (bucket_id = 'portfolio-assets');
```

## 🔍 **Alternative: Quick Fix**

If you want to temporarily disable RLS for testing:

1. **Go to Storage** in Supabase
2. **Click on `portfolio-assets` bucket**
3. **Go to "Settings" tab**
4. **Toggle off "Row Level Security (RLS)"**
5. **Click "Save"**

**Note:** This is less secure but will work immediately for testing.

## ✅ **Expected Result:**

After setting up the policies, you should see:
- ✅ **Image uploads work** - No more RLS policy errors
- ✅ **Images display correctly** - Public read access
- ✅ **Cover images save** - Projects with images work

## 🧪 **Test the Fix:**

1. **Go to** http://localhost:5179
2. **Create a new project**
3. **Upload a cover image** - Should work without errors
4. **Save the project** - Should save successfully

## 🎯 **Why This Happened:**

The storage bucket was created but the RLS policies were not configured to allow anonymous users to upload files. The policies above will fix this by allowing:
- **Public read access** - Anyone can view images
- **Anonymous uploads** - Anyone can upload images
- **Anonymous updates** - Anyone can update images
- **Anonymous deletes** - Anyone can delete images

**After applying these policies, your image uploads will work perfectly!** 🚀 