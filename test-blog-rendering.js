// Test blog rendering functionality
console.log('🧪 TESTING BLOG RENDERING...');
console.log('=====================================');

// Check if we're on the blog page
if (window.location.pathname.includes('/blog')) {
  console.log('✅ On blog page');
} else {
  console.log('❌ Not on blog page - navigate to /blog first');
  console.log('Current path:', window.location.pathname);
}

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

if (blogCards.length > 0) {
  console.log('✅ Blog posts are rendering!');
  blogCards.forEach((card, index) => {
    const title = card.querySelector('.text-xl');
    const excerpt = card.querySelector('.text-muted-foreground');
    const tags = card.querySelectorAll('.badge');
    
    console.log(`\n📝 Blog Card ${index + 1}:`);
    if (title) console.log(`   Title: ${title.textContent}`);
    if (excerpt) console.log(`   Excerpt: ${excerpt.textContent.substring(0, 50)}...`);
    if (tags.length > 0) {
      console.log(`   Tags: ${Array.from(tags).map(tag => tag.textContent).join(', ')}`);
    }
  });
} else {
  console.log('❌ No blog cards found');
  
  // Check for "No posts found" message
  const noPostsMessage = document.querySelector('h3');
  if (noPostsMessage && noPostsMessage.textContent.includes('No posts found')) {
    console.log('💡 "No posts found" message is showing');
  }
  
  // Check for filter-related messages
  const filterMessage = document.querySelector('h3');
  if (filterMessage && filterMessage.textContent.includes('No posts match your filters')) {
    console.log('💡 "No posts match your filters" message is showing');
  }
}

// Check debug info
const debugInfo = document.querySelector('.text-xs.text-red-500');
if (debugInfo) {
  console.log(`\n📊 Debug Info: ${debugInfo.textContent}`);
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
}

// Check for the specific blog post content
const pageText = document.body.textContent;
const checks = [
  { name: 'Graph ML Tag', value: 'Graph ML', found: pageText.includes('Graph ML') },
  { name: 'Urban Analytics Tag', value: 'Urban Analytics', found: pageText.includes('Urban Analytics') },
  { name: 'AI Architecture Tag', value: 'AI Architecture', found: pageText.includes('AI Architecture') },
  { name: 'Blog Title', value: 'Why I Use Graph ML to Design Smarter Cities', found: pageText.includes('Why I Use Graph ML to Design Smarter Cities') }
];

console.log('\n🔍 CONTENT CHECKS:');
checks.forEach(check => {
  if (check.found) {
    console.log(`✅ Found "${check.name}": ${check.value}`);
  } else {
    console.log(`❌ Missing "${check.name}": ${check.value}`);
  }
});

console.log('\n💡 SUMMARY:');
if (blogCards.length > 0) {
  console.log('✅ Blog system is working! Posts are displaying.');
} else if (loadingElements.length > 0) {
  console.log('⏳ Blog posts are still loading...');
} else {
  console.log('❌ Blog posts are not displaying. Check the console for errors.');
}

console.log('\n🔧 NEXT STEPS:');
console.log('- If posts are not showing, check the browser console for errors');
console.log('- Verify the database has published blog posts');
console.log('- Check if authentication is working properly');
console.log('- Try refreshing the page'); 