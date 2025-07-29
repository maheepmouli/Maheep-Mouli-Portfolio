# Database Setup Guide

## 🚨 **Current Issue:**
Your application is getting 400 errors because the database table doesn't exist yet. Here's how to fix it:

## 📋 **Step 1: Create the Database Table**

### Go to Supabase SQL Editor:
1. **Open your Supabase dashboard**
2. **Click on "SQL Editor"** in the left sidebar
3. **Click "New query"**

### Run the SQL Script:
1. **Copy the entire content** from `supabase-setup.sql`
2. **Paste it into the SQL Editor**
3. **Click "Run"**

**Expected Result:** You should see "Success. No rows returned" or similar success message.

## 📋 **Step 2: Set Up Storage**

### Create Storage Bucket:
1. **Go to "Storage"** in your Supabase dashboard
2. **Click "Create a new bucket"**
3. **Bucket name:** `portfolio-assets`
4. **Public bucket:** ✅ Check this box
5. **Click "Create bucket"**

### Set Up Storage Policies:
1. **Click on your `portfolio-assets` bucket**
2. **Go to "Policies" tab**
3. **Click "New Policy"** and add these 4 policies:

#### Policy 1: Allow public read access
```sql
CREATE POLICY "Allow public read access" ON storage.objects
FOR SELECT USING (bucket_id = 'portfolio-assets');
```

#### Policy 2: Allow authenticated users to upload
```sql
CREATE POLICY "Allow authenticated users to upload" ON storage.objects
FOR INSERT WITH CHECK (bucket_id = 'portfolio-assets' AND auth.role() = 'authenticated');
```

#### Policy 3: Allow authenticated users to update
```sql
CREATE POLICY "Allow authenticated users to update" ON storage.objects
FOR UPDATE USING (bucket_id = 'portfolio-assets' AND auth.role() = 'authenticated');
```

#### Policy 4: Allow authenticated users to delete
```sql
CREATE POLICY "Allow authenticated users to delete" ON storage.objects
FOR DELETE USING (bucket_id = 'portfolio-assets' AND auth.role() = 'authenticated');
```

## 📋 **Step 3: Test the Setup**

### Check Database:
1. **Go to "Table Editor"** in Supabase
2. **Click on "projects" table**
3. **You should see the test project** we inserted

### Test Your Application:
1. **Go to** http://localhost:5175
2. **Try creating a new project**
3. **Upload an image** - it should work now!

## ✅ **Expected Results:**

After completing these steps, you should see:
- ✅ **No more 400 errors** in the console
- ✅ **Projects save to Supabase** successfully
- ✅ **Image uploads work** perfectly
- ✅ **Real-time sync** between localStorage and Supabase

## 🔍 **Console Logs to Expect:**

```
UnifiedService: Supabase query successful
UnifiedService: Data received: Array(1)
UnifiedService: Found projects in Supabase: 1
imageUploadService: Upload successful, public URL: [url]
```

## 🚀 **Ready to Go!**

Once you complete these steps, your portfolio will work perfectly with:
- **Direct image uploads** from your computer
- **Real-time project updates**
- **Professional appearance** for visitors
- **Seamless data persistence**

**Start with Step 1 - running the SQL script!** 🎯 