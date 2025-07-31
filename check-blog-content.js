// Check what blog content is being displayed
console.log('🔍 CHECKING BLOG CONTENT...');
console.log('=====================================');

// Check for blog cards
const blogCards = document.querySelectorAll('.project-card');
console.log('📋 Total blog cards found:', blogCards.length);

// Check each blog card
blogCards.forEach((card, index) => {
  console.log(`\n📝 Blog Card ${index + 1}:`);
  
  // Get title
  const title = card.querySelector('.text-xl');
  if (title) {
    console.log(`   Title: ${title.textContent}`);
  }
  
  // Get excerpt
  const excerpt = card.querySelector('.text-muted-foreground');
  if (excerpt) {
    console.log(`   Excerpt: ${excerpt.textContent.substring(0, 100)}...`);
  }
  
  // Get tags
  const tags = card.querySelectorAll('.badge');
  if (tags.length > 0) {
    console.log(`   Tags: ${Array.from(tags).map(tag => tag.textContent).join(', ')}`);
  }
  
  // Get date
  const date = card.querySelector('.text-sm.text-muted-foreground');
  if (date) {
    console.log(`   Date: ${date.textContent}`);
  }
  
  // Get "Read More" button
  const readMoreBtn = card.querySelector('button');
  if (readMoreBtn) {
    console.log(`   Read More: ${readMoreBtn.textContent}`);
  }
});

// Check for any images
const images = document.querySelectorAll('img');
console.log(`\n📷 Images found: ${images.length}`);
images.forEach((img, index) => {
  console.log(`   Image ${index + 1}: ${img.src}`);
});

// Check for any "No posts found" message
const noPostsMessage = document.querySelector('h3');
if (noPostsMessage && noPostsMessage.textContent.includes('No posts found')) {
  console.log('\n❌ "No posts found" message is showing');
} else {
  console.log('\n✅ No "No posts found" message - posts are displaying');
}

// Check the debug info if it exists
const debugInfo = document.querySelector('.text-xs.text-red-500');
if (debugInfo) {
  console.log(`\n📊 Debug Info: ${debugInfo.textContent}`);
}

// Check for specific blog post content
console.log('\n🔍 CHECKING FOR SPECIFIC BLOG POST:');
console.log('Looking for: "Why I Use Graph ML to Design Smarter Cities"');

const allText = document.body.textContent;
if (allText.includes('Why I Use Graph ML to Design Smarter Cities')) {
  console.log('✅ Found the specific blog post title in the page');
} else {
  console.log('❌ The specific blog post title was NOT found in the page');
}

// Check for Graph ML tags
if (allText.includes('Graph ML')) {
  console.log('✅ Found "Graph ML" tag in the page');
} else {
  console.log('❌ "Graph ML" tag was NOT found in the page');
}

// Check for Urban Analytics tags
if (allText.includes('Urban Analytics')) {
  console.log('✅ Found "Urban Analytics" tag in the page');
} else {
  console.log('❌ "Urban Analytics" tag was NOT found in the page');
}

// Check for the excerpt content
if (allText.includes('A deep dive into how Graph Machine Learning')) {
  console.log('✅ Found the blog post excerpt in the page');
} else {
  console.log('❌ The blog post excerpt was NOT found in the page');
}

// Check console for any errors
console.log('\n🔍 CHECKING FOR CONSOLE ERRORS:');
console.log('Look for any red error messages in the console above');

// Check network requests
console.log('\n🌐 NETWORK REQUESTS:');
console.log('Check the Network tab in DevTools for any failed requests to Supabase');

console.log('\n💡 SUMMARY:');
console.log(`- ${blogCards.length} blog cards are displaying`);
console.log('- If you see blog cards above, the blog system is working');
console.log('- If you don\'t see the content you expect, check the database');
console.log('- Run the database check script to verify blog posts exist');
console.log('- Check the browser console for any JavaScript errors');
console.log('- Verify the blog post data in Supabase dashboard'); 