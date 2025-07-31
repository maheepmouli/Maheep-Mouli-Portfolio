// Quick test to verify blog fix
console.log('🧪 TESTING BLOG FIX...');
console.log('=====================================');

// Check current state
const debugInfo = document.querySelector('.text-xs.text-red-500');
if (debugInfo) {
  console.log('📊 Current Debug Info:', debugInfo.textContent);
}

// Check for blog cards
const blogCards = document.querySelectorAll('.project-card');
console.log(`📋 Blog cards found: ${blogCards.length}`);

if (blogCards.length > 0) {
  console.log('✅ SUCCESS! Blog posts are now displaying!');
  blogCards.forEach((card, index) => {
    const title = card.querySelector('.text-xl');
    if (title) {
      console.log(`📝 Blog ${index + 1}: ${title.textContent}`);
    }
  });
} else {
  console.log('❌ Still no blog cards found');
  
  // Check for loading
  const loadingElements = document.querySelectorAll('[class*="loading"], [class*="spinner"]');
  if (loadingElements.length > 0) {
    console.log('⏳ Still loading...');
  } else {
    console.log('💡 Check the debug info above for post counts');
  }
}

// Check for specific content
const pageText = document.body.textContent;
if (pageText.includes('Why I Use Graph ML to Design Smarter Cities')) {
  console.log('✅ Found the specific blog post!');
} else {
  console.log('❌ Specific blog post not found');
}

console.log('\n💡 If posts are still not showing:');
console.log('1. Check the debug info for post counts');
console.log('2. Try refreshing the page');
console.log('3. Check browser console for any errors'); 