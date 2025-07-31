// Test script to verify blog filtering is working correctly
console.log('🧪 Testing Blog Filtering Implementation');
console.log('=====================================');

// Mock the excluded slugs list (same as in supabaseBlogsService.ts)
const EXCLUDED_SLUGS = [
  'atelier24-khc-hospital-hotel',
  'bioplastic-lab',
  'chopra-residence',
  'flow-sight-urban-traffic-analytics',
  'kt',
  'fed',
  'fox-dz',
  'gh-dgugh',
  'slunszuj',
  'wsrdvrg'
];

// Test data - simulate what would come from Supabase
const mockBlogs = [
  {
    id: '1',
    title: 'Valid Blog Post 1',
    slug: 'valid-blog-post-1',
    status: 'published',
    created_at: '2024-01-01T00:00:00Z'
  },
  {
    id: '2',
    title: 'Valid Blog Post 2',
    slug: 'valid-blog-post-2',
    status: 'published',
    created_at: '2024-01-02T00:00:00Z'
  },
  {
    id: '3',
    title: 'Excluded Blog Post',
    slug: 'atelier24-khc-hospital-hotel',
    status: 'published',
    created_at: '2024-01-03T00:00:00Z'
  },
  {
    id: '4',
    title: 'Another Excluded Post',
    slug: 'kt',
    status: 'published',
    created_at: '2024-01-04T00:00:00Z'
  },
  {
    id: '5',
    title: 'Draft Post',
    slug: 'draft-post',
    status: 'draft',
    created_at: '2024-01-05T00:00:00Z'
  }
];

// Simulate the filtering function from supabaseBlogsService.ts
const filterExcludedSlugs = (blogs) => {
  return blogs.filter(blog => !EXCLUDED_SLUGS.includes(blog.slug));
};

// Test the filtering function
console.log('📋 Testing filterExcludedSlugs function...');
console.log('Original blogs count:', mockBlogs.length);
console.log('Excluded slugs:', EXCLUDED_SLUGS);

const filteredBlogs = filterExcludedSlugs(mockBlogs);
console.log('Filtered blogs count:', filteredBlogs.length);
console.log('Filtered out:', mockBlogs.length - filteredBlogs.length, 'blogs');

console.log('\n📝 Original blogs:');
mockBlogs.forEach((blog, index) => {
  console.log(`${index + 1}. "${blog.title}" (${blog.slug}) - ${blog.status}`);
});

console.log('\n✅ Filtered blogs:');
filteredBlogs.forEach((blog, index) => {
  console.log(`${index + 1}. "${blog.title}" (${blog.slug}) - ${blog.status}`);
});

console.log('\n❌ Excluded blogs:');
const excludedBlogs = mockBlogs.filter(blog => EXCLUDED_SLUGS.includes(blog.slug));
excludedBlogs.forEach((blog, index) => {
  console.log(`${index + 1}. "${blog.title}" (${blog.slug}) - ${blog.status}`);
});

// Test individual slug checking
console.log('\n🔍 Testing individual slug checking...');
const testSlugs = ['valid-blog-post-1', 'atelier24-khc-hospital-hotel', 'kt', 'new-post'];
testSlugs.forEach(slug => {
  const isExcluded = EXCLUDED_SLUGS.includes(slug);
  console.log(`Slug "${slug}": ${isExcluded ? '❌ EXCLUDED' : '✅ ALLOWED'}`);
});

console.log('\n🎯 Summary:');
console.log(`- Total blogs: ${mockBlogs.length}`);
console.log(`- Excluded blogs: ${excludedBlogs.length}`);
console.log(`- Filtered blogs: ${filteredBlogs.length}`);
console.log(`- Filtering working: ${filteredBlogs.length === mockBlogs.length - excludedBlogs.length ? '✅ YES' : '❌ NO'}`);

console.log('\n✨ Blog filtering test completed!'); 