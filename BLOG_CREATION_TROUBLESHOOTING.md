# Blog Creation Troubleshooting Guide

## 🔍 **Current Status**
- ✅ Table detection working (blog_posts table found)
- ✅ Field mapping fixed (removed subtitle, image_url)
- ✅ Service updated with correct interface
- ✅ Form components updated

## 📋 **Step-by-Step Testing**

### 1. **Authentication Check**
```bash
# Make sure you're logged in
# Check if user object exists in browser console
console.log('User:', user);
```

### 2. **Database Structure Check**
Run this SQL in your Supabase dashboard:
```sql
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_schema = 'public' AND table_name = 'blog_posts'
ORDER BY ordinal_position;
```

### 3. **RLS Policies Check**
Run this SQL to check RLS policies:
```sql
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual
FROM pg_policies
WHERE tablename = 'blog_posts';
```

### 4. **Manual Test**
1. Go to `/blog/create`
2. Fill in test data:
   - Title: "Test Blog Post"
   - Excerpt: "This is a test blog post"
   - Content: "This is the content of the test blog post."
   - Tags: ["test", "blog"]
   - Status: "draft"
3. Submit the form
4. Check browser console for logs

## 🔧 **Expected Console Output**
```
Supabase: Checking for blog tables...
Supabase: ❌ blogs table not found: [error message]
Supabase: ✅ Found blog_posts table, using it
Supabase: Attempting to create blog with data: [data]
Supabase: Using table: blog_posts
Supabase: Blog created successfully: [data]
```

## ❌ **Common Error Scenarios**

### **Error 1: Authentication Issues**
- **Symptoms**: 401 Unauthorized errors
- **Solution**: Check if user is logged in, verify auth token

### **Error 2: Permission Issues**
- **Symptoms**: 403 Forbidden errors
- **Solution**: Check RLS policies, ensure user has insert permissions

### **Error 3: Field Mapping Issues**
- **Symptoms**: 400 Bad Request with column errors
- **Solution**: Verify database schema matches expected fields

### **Error 4: Network Issues**
- **Symptoms**: Network errors, timeout
- **Solution**: Check internet connection, Supabase service status

## 🔧 **Quick Fixes**

### **If you see "user_id" errors:**
```sql
-- Add user_id column if missing
ALTER TABLE public.blog_posts 
ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id);
```

### **If you see RLS policy errors:**
```sql
-- Create insert policy
CREATE POLICY "Users can insert their own blog posts" ON public.blog_posts
FOR INSERT WITH CHECK (auth.uid() = user_id);
```

### **If you see missing columns:**
```sql
-- Add missing columns
ALTER TABLE public.blog_posts 
ADD COLUMN IF NOT EXISTS excerpt TEXT,
ADD COLUMN IF NOT EXISTS cover_image_url TEXT,
ADD COLUMN IF NOT EXISTS tags TEXT[],
ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'draft';
```

## 📞 **Next Steps**
1. Try creating a blog post
2. Share the exact error message from browser console
3. Run the database structure check SQL
4. Let me know what you find!

## ✅ **Success Indicators**
- Console shows "Blog created successfully"
- Toast notification appears
- Redirect to `/blog` happens
- New blog post appears in blog list 