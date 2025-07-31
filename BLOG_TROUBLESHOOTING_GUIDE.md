# Blog System Troubleshooting Guide

## Issue: Blog Post Not Displaying

You have a blog post with the following data that should be displayed:

```json
{
    "id": "c9b3dba2-fef4-446c-a66a-471a3adac4f9",
    "user_id": "550e8400-e29b-41d4-a716-446655440000",
    "title": "Why I Use Graph ML to Design Smarter Cities",
    "slug": "why-i-use-graph-ml-to-design-smarter-cities",
    "excerpt": "A deep dive into how Graph Machine Learning (Graph ML) is revolutionizing traffic systems and city planning through predictive analytics...",
    "status": "published",
    "tags": ["Graph ML", "Urban Analytics", "AI Architecture", "Traffic Prediction", "Smart Cities", "Machine Learning in Urbanism"]
}
```

## Step-by-Step Troubleshooting

### 1. Check Database Structure

Run this SQL in your Supabase SQL editor:

```sql
-- Check if blog_posts table exists and has correct structure
SELECT 
  column_name,
  data_type,
  is_nullable
FROM information_schema.columns 
WHERE table_name = 'blog_posts'
ORDER BY ordinal_position;
```

**Expected columns:**
- `id` (uuid)
- `user_id` (uuid)
- `title` (text)
- `slug` (text)
- `excerpt` (text)
- `content` (text)
- `cover_image_url` (text, nullable)
- `tags` (text[])
- `status` (text)
- `created_at` (timestamp)
- `updated_at` (timestamp)

### 2. Verify Blog Post Exists

Run this SQL to check if your blog post exists:

```sql
SELECT 
  id,
  title,
  slug,
  status,
  created_at,
  array_length(tags, 1) as tag_count
FROM blog_posts 
WHERE id = 'c9b3dba2-fef4-446c-a66a-471a3adac4f9'
   OR slug = 'why-i-use-graph-ml-to-design-smarter-cities';
```

**If no results:**
- The blog post doesn't exist in the database
- Run the `insert-blog-post.sql` script to add it

### 3. Check Published Posts

```sql
SELECT 
  id,
  title,
  slug,
  status,
  created_at
FROM blog_posts 
WHERE status = 'published'
ORDER BY created_at DESC;
```

**Expected:**
- Your blog post should appear with `status = 'published'`

### 4. Browser Console Debugging

1. Open your blog page (`/blog`)
2. Open browser DevTools (F12)
3. Go to Console tab
4. Run the `check-blog-content.js` script
5. Run the `verify-blog-post-data.js` script

**Look for:**
- JavaScript errors (red text)
- Network request failures
- Debug messages from the blog service

### 5. Check Network Requests

1. In DevTools, go to Network tab
2. Refresh the blog page
3. Look for requests to Supabase
4. Check if any requests failed (red status codes)

**Common issues:**
- 401 Unauthorized: Authentication problem
- 403 Forbidden: RLS (Row Level Security) blocking access
- 404 Not Found: Table doesn't exist

### 6. Verify Authentication

Check if you're logged in:
1. Go to `/admin` page
2. Check if you can see admin controls
3. Verify your user ID matches the blog post's `user_id`

### 7. Check RLS Policies

Run this SQL to check RLS policies:

```sql
SELECT 
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd,
  qual,
  with_check
FROM pg_policies 
WHERE tablename = 'blog_posts';
```

**If no policies exist, create them:**

```sql
-- Enable RLS
ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;

-- Policy to allow reading published posts
CREATE POLICY "Allow reading published blog posts" ON blog_posts
FOR SELECT USING (status = 'published');

-- Policy to allow authenticated users to manage their own posts
CREATE POLICY "Allow users to manage their own blog posts" ON blog_posts
FOR ALL USING (auth.uid() = user_id);
```

### 8. Test Blog Service

Run this in browser console to test the blog service:

```javascript
// Test blog service
import { supabaseBlogsService } from './src/services/supabaseBlogsService.js';

// Get published blogs
const blogs = await supabaseBlogsService.getPublishedBlogs();
console.log('Published blogs:', blogs);

// Get specific blog
const blog = await supabaseBlogsService.getBlogBySlug('why-i-use-graph-ml-to-design-smarter-cities');
console.log('Specific blog:', blog);
```

### 9. Check Component Rendering

The blog page should:
1. Show loading state initially
2. Fetch published blogs from Supabase
3. Display blog cards with titles, excerpts, tags
4. Show "No posts found" if no published posts exist

**Debug the component:**
- Check if `fetchPosts()` is called
- Verify `publishedBlogs` array has data
- Check if `filteredPosts` is populated
- Ensure blog cards are rendered

### 10. Common Fixes

#### Fix 1: Insert Missing Blog Post
Run `insert-blog-post.sql` in Supabase SQL editor

#### Fix 2: Update Blog Post Status
```sql
UPDATE blog_posts 
SET status = 'published' 
WHERE id = 'c9b3dba2-fef4-446c-a66a-471a3adac4f9';
```

#### Fix 3: Fix User ID
```sql
UPDATE blog_posts 
SET user_id = 'your-actual-user-id' 
WHERE id = 'c9b3dba2-fef4-446c-a66a-471a3adac4f9';
```

#### Fix 4: Create Missing Table
```sql
CREATE TABLE IF NOT EXISTS blog_posts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id),
    title TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    excerpt TEXT,
    content TEXT NOT NULL,
    cover_image_url TEXT,
    tags TEXT[] DEFAULT '{}',
    status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'published')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

## Quick Diagnostic Scripts

1. **Database Check:** `check-blog-database.sql`
2. **Content Check:** `check-blog-content.js`
3. **Data Verification:** `verify-blog-post-data.js`
4. **Insert Missing Data:** `insert-blog-post.sql`

## Expected Behavior

When working correctly, you should see:
- ✅ Blog page loads without errors
- ✅ "Why I Use Graph ML to Design Smarter Cities" appears as a card
- ✅ Tags like "Graph ML", "Urban Analytics" are displayed
- ✅ Excerpt text is visible
- ✅ "Read More" button links to the full post
- ✅ No "No posts found" message

## Still Having Issues?

1. Check browser console for specific error messages
2. Verify Supabase connection in `src/lib/supabaseClient.ts`
3. Test with a simple blog post first
4. Check if other parts of your app (like projects) are working
5. Verify your Supabase project settings and API keys 