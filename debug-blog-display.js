// Comprehensive blog display debug script
console.log('🔍 DEBUGGING BLOG DISPLAY ISSUE...');
console.log('=====================================');

// Check if we're on the blog page
if (!window.location.pathname.includes('/blog')) {
  console.log('❌ Not on blog page - navigate to /blog first');
  console.log('Current path:', window.location.pathname);
  return;
}

console.log('✅ On blog page');

// Check for loading state
const loadingElements = document.querySelectorAll('[class*="loading"], [class*="spinner"]');
if (loadingElements.length > 0) {
  console.log('⏳ Loading elements found:', loadingElements.length);
  loadingElements.forEach((el, index) => {
    console.log(`   Loading element ${index + 1}:`, el.className);
  });
} else {
  console.log('✅ No loading elements found');
}

// Check for blog cards
const blogCards = document.querySelectorAll('.project-card');
console.log(`📋 Blog cards found: ${blogCards.length}`);

if (blogCards.length === 0) {
  console.log('❌ No blog cards found - this is the main issue!');
  
  // Check for "No posts found" message
  const noPostsMessage = document.querySelector('h3');
  if (noPostsMessage) {
    console.log('💡 Found message:', noPostsMessage.textContent);
  }
  
  // Check for filter-related messages
  const filterMessage = document.querySelector('h3');
  if (filterMessage && filterMessage.textContent.includes('No posts match your filters')) {
    console.log('💡 Filter message found:', filterMessage.textContent);
  }
} else {
  console.log('✅ Blog cards are present');
  blogCards.forEach((card, index) => {
    const title = card.querySelector('.text-xl');
    if (title) {
      console.log(`📝 Blog ${index + 1}: ${title.textContent}`);
    }
  });
}

// Check debug info
const debugInfo = document.querySelector('.text-xs.text-red-500');
if (debugInfo) {
  console.log(`\n📊 Debug Info: ${debugInfo.textContent}`);
  
  // Parse debug info
  const debugText = debugInfo.textContent;
  const postsLoadedMatch = debugText.match(/Posts loaded: (\d+)/);
  const filteredMatch = debugText.match(/Filtered: (\d+)/);
  
  if (postsLoadedMatch) {
    const postsLoaded = parseInt(postsLoadedMatch[1]);
    console.log(`📊 Posts loaded: ${postsLoaded}`);
    
    if (postsLoaded > 0 && blogCards.length === 0) {
      console.log('❌ ISSUE: Posts are loaded but not rendering!');
      console.log('💡 This suggests a rendering problem in the component');
    } else if (postsLoaded === 0) {
      console.log('❌ ISSUE: No posts are being loaded from database');
      console.log('💡 This suggests a database or service layer problem');
    }
  }
  
  if (filteredMatch) {
    const filtered = parseInt(filteredMatch[1]);
    console.log(`📊 Filtered posts: ${filtered}`);
    
    if (filtered === 0 && postsLoadedMatch && parseInt(postsLoadedMatch[1]) > 0) {
      console.log('❌ ISSUE: Posts are loaded but filtered to zero!');
      console.log('💡 This suggests a filtering problem');
    }
  }
}

// Check for any error messages
const errorMessages = document.querySelectorAll('.text-red-500, .text-red-600, .error');
if (errorMessages.length > 0) {
  console.log('\n❌ Error messages found:');
  errorMessages.forEach((error, index) => {
    if (error.textContent && !error.textContent.includes('DEBUG:')) {
      console.log(`   Error ${index + 1}: ${error.textContent}`);
    }
  });
} else {
  console.log('\n✅ No error messages found');
}

// Check for any console errors
console.log('\n🔍 CHECKING CONSOLE ERRORS:');
console.log('Look for any red error messages in the console above');

// Check network requests
console.log('\n🌐 NETWORK REQUESTS:');
console.log('Check the Network tab in DevTools for any failed requests to Supabase');

// Check if user is logged in
const isLoggedIn = document.querySelector('[data-testid="user-menu"], .user-menu, .admin-controls, button[href*="admin"]');
console.log('\n👤 User logged in:', !!isLoggedIn);

// Check for admin controls
const adminControls = document.querySelectorAll('button, a');
let foundAdminControls = false;
adminControls.forEach(el => {
  if (el.textContent.includes('Create New Post') || el.textContent.includes('Admin')) {
    console.log('🔧 Admin controls found:', el.textContent);
    foundAdminControls = true;
  }
});

if (!foundAdminControls) {
  console.log('🔧 No admin controls found (user might not be logged in)');
}

console.log('\n💡 DIAGNOSIS:');
if (blogCards.length === 0) {
  console.log('❌ MAIN ISSUE: Blog posts are not rendering');
  console.log('🔧 POSSIBLE CAUSES:');
  console.log('1. Posts not being fetched from database');
  console.log('2. Posts being filtered out');
  console.log('3. Component rendering issue');
  console.log('4. Authentication/authorization problem');
  console.log('5. Database connection issue');
} else {
  console.log('✅ Blog posts are rendering correctly');
}

console.log('\n🔧 IMMEDIATE FIXES TO TRY:');
console.log('1. Refresh the page');
console.log('2. Check browser console for JavaScript errors');
console.log('3. Check Network tab for failed Supabase requests');
console.log('4. Verify database has published posts');
console.log('5. Check if authentication is working');

console.log('\n📋 NEXT STEPS:');
console.log('- Run this script again after trying the fixes above');
console.log('- Check the debug info for post counts');
console.log('- Verify the database has the correct posts');
console.log('- Test in incognito mode to check visitor access'); 