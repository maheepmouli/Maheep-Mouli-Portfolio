// Test script to check blog fetching
console.log('🔍 TESTING BLOG FETCH...');
console.log('=====================================');

// Test Supabase connection and blog fetching
async function testBlogFetch() {
  try {
    console.log('📡 Testing Supabase connection...');
    
    // Check if supabase is available
    if (typeof supabase === 'undefined') {
      console.log('❌ Supabase client not available');
      return;
    }
    
    console.log('✅ Supabase client available');
    
    // Test fetching all blogs
    console.log('📋 Fetching all blogs...');
    const { data: allBlogs, error: allError } = await supabase
      .from('blog_posts')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (allError) {
      console.error('❌ Error fetching all blogs:', allError);
      return;
    }
    
    console.log('✅ All blogs fetched:', allBlogs);
    console.log('📊 Total blogs found:', allBlogs.length);
    
    // Test fetching published blogs only
    console.log('📋 Fetching published blogs...');
    const { data: publishedBlogs, error: publishedError } = await supabase
      .from('blog_posts')
      .select('*')
      .eq('status', 'published')
      .order('created_at', { ascending: false });
    
    if (publishedError) {
      console.error('❌ Error fetching published blogs:', publishedError);
      return;
    }
    
    console.log('✅ Published blogs fetched:', publishedBlogs);
    console.log('📊 Published blogs found:', publishedBlogs.length);
    
    // Show details of each blog
    publishedBlogs.forEach((blog, index) => {
      console.log(`\n📝 Blog ${index + 1}:`);
      console.log(`   Title: ${blog.title}`);
      console.log(`   Slug: ${blog.slug}`);
      console.log(`   Status: ${blog.status}`);
      console.log(`   Excerpt: ${blog.excerpt || 'No excerpt'}`);
      console.log(`   Tags: ${JSON.stringify(blog.tags || [])}`);
      console.log(`   Created: ${blog.created_at}`);
    });
    
  } catch (error) {
    console.error('❌ Error in test:', error);
  }
}

// Run the test
testBlogFetch();

console.log('');
console.log('💡 If you see blogs above, the issue is in the React component');
console.log('💡 If you see errors, the issue is with Supabase connection'); 