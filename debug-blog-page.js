// Debug script to check blog page functionality
console.log('🔍 DEBUGGING BLOG PAGE...');
console.log('=====================================');

// Check if we're on the blog page
console.log('📍 Current URL:', window.location.href);
console.log('📍 Current pathname:', window.location.pathname);

// Check if the blog page component is loaded
console.log('📋 Checking for blog page elements...');

// Look for blog page specific elements
const blogTitle = document.querySelector('h1');
const searchInput = document.querySelector('input[placeholder*="Search"]');
const noPostsMessage = document.querySelector('h3');

console.log('📋 Blog title found:', blogTitle?.textContent);
console.log('📋 Search input found:', !!searchInput);
console.log('📋 No posts message found:', noPostsMessage?.textContent);

// Check if there are any blog posts in the DOM
const blogCards = document.querySelectorAll('[class*="card"]');
console.log('📋 Blog cards found:', blogCards.length);

// Check localStorage for any blog data
console.log('📋 Checking localStorage...');
const localStorageKeys = Object.keys(localStorage);
const blogRelatedKeys = localStorageKeys.filter(key => key.includes('blog'));
console.log('📋 Blog-related localStorage keys:', blogRelatedKeys);

// Try to manually trigger the blog fetch
console.log('📋 Attempting to manually fetch blogs...');

// Check if the supabaseBlogsService is available
if (typeof window !== 'undefined') {
  console.log('📋 Window object available');
  
  // Try to access the service through the global scope
  if (window.supabaseBlogsService) {
    console.log('✅ supabaseBlogsService found in global scope');
  } else {
    console.log('❌ supabaseBlogsService not found in global scope');
  }
  
  // Try to access supabase directly
  if (window.supabase) {
    console.log('✅ Supabase client found in global scope');
  } else {
    console.log('❌ Supabase client not found in global scope');
  }
}

// Check for any React components or state
console.log('📋 Checking for React components...');
const reactRoot = document.querySelector('#root');
console.log('📋 React root found:', !!reactRoot);

// Check for any console errors that might indicate issues
console.log('📋 Checking for any error messages...');

// Provide manual test instructions
console.log('');
console.log('💡 MANUAL TEST INSTRUCTIONS:');
console.log('1. Go to Admin → Blog → Create');
console.log('2. Create a new blog post with status "Published"');
console.log('3. Add some tags like "test", "blog"');
console.log('4. Save the blog post');
console.log('5. Go back to the Blog page');
console.log('6. Check if the blog post appears');
console.log('');
console.log('💡 If the blog post still doesn\'t appear, the issue is in the React component logic'); 