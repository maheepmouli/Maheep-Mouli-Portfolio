// Test script to check blog display issue
console.log('🔍 TESTING BLOG DISPLAY...');
console.log('=====================================');

// Check if we're on the blog page
console.log('📍 Current URL:', window.location.href);

// Check for debug info on the page
const debugInfo = document.querySelector('.text-xs.text-red-500');
if (debugInfo) {
  console.log('📋 Debug info found:', debugInfo.textContent);
} else {
  console.log('❌ Debug info not found');
}

// Check for blog cards
const blogCards = document.querySelectorAll('.project-card');
console.log('📋 Blog cards found:', blogCards.length);

// Check for "No posts found" message
const noPostsMessage = document.querySelector('h3');
if (noPostsMessage && noPostsMessage.textContent.includes('No posts found')) {
  console.log('❌ "No posts found" message is showing');
} else {
  console.log('✅ No "No posts found" message');
}

// Check for tag filters
const tagBadges = document.querySelectorAll('[class*="badge"]');
console.log('📋 Tag badges found:', tagBadges.length);

// Check if any tags are selected
const selectedTags = document.querySelectorAll('.bg-primary');
console.log('📋 Selected tags found:', selectedTags.length);

// Manual test: Clear all filters
console.log('');
console.log('💡 MANUAL TEST:');
console.log('1. Click on any selected tags to deselect them');
console.log('2. Clear the search box if there\'s any text');
console.log('3. Click "🔄 Refresh Posts" button');
console.log('4. Check if blog posts appear');

// Check localStorage for any cached data
console.log('');
console.log('📋 Checking localStorage...');
const localStorageKeys = Object.keys(localStorage);
const blogRelatedKeys = localStorageKeys.filter(key => key.includes('blog'));
console.log('📋 Blog-related localStorage keys:', blogRelatedKeys);

// Check for any console errors
console.log('');
console.log('📋 Check the browser console for any error messages');
console.log('📋 Look for logs starting with "BlogPage:"');

console.log('');
console.log('💡 If posts still don\'t appear after clearing filters:');
console.log('1. The posts might not be "published" status');
console.log('2. The posts might not have the correct tags');
console.log('3. There might be a JavaScript error preventing display'); 