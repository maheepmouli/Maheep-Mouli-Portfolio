// Quick blog check script
console.log('🔍 QUICK BLOG CHECK...');
console.log('======================');

// Check if we're on the blog page
if (!window.location.pathname.includes('/blog')) {
  console.log('❌ Not on blog page');
  console.log('Current path:', window.location.pathname);
} else {
  console.log('✅ On blog page');
  
  // Check for blog cards
  const blogCards = document.querySelectorAll('.project-card');
  console.log(`📋 Blog cards found: ${blogCards.length}`);
  
  if (blogCards.length === 0) {
    console.log('❌ No blog cards found!');
    
    // Check for messages
    const messages = document.querySelectorAll('h3, h2, p');
    messages.forEach(msg => {
      if (msg.textContent.includes('No posts') || msg.textContent.includes('Loading')) {
        console.log('💡 Found message:', msg.textContent);
      }
    });
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
  }
  
  // Check for errors
  const errors = document.querySelectorAll('.text-red-500, .text-red-600');
  if (errors.length > 0) {
    console.log('\n❌ Error messages found:');
    errors.forEach((error, index) => {
      if (error.textContent && !error.textContent.includes('DEBUG:')) {
        console.log(`   Error ${index + 1}: ${error.textContent}`);
      }
    });
  }
  
  // Check if user is logged in
  const adminButtons = document.querySelectorAll('button, a');
  let foundAdmin = false;
  adminButtons.forEach(el => {
    if (el.textContent.includes('Create New Post') || el.textContent.includes('Admin')) {
      console.log('🔧 Admin controls found:', el.textContent);
      foundAdmin = true;
    }
  });
  
  console.log('\n👤 User logged in:', foundAdmin);
  
  console.log('\n💡 SUMMARY:');
  if (blogCards.length > 0) {
    console.log('✅ Blog posts are displaying correctly');
  } else {
    console.log('❌ Blog posts are NOT displaying');
    console.log('🔧 Check the debug info above for post counts');
  }
  
  console.log('\n🔧 NEXT STEPS:');
  console.log('1. Check the debug info for post counts');
  console.log('2. Verify database has published posts');
  console.log('3. Check browser console for errors');
  console.log('4. Test in incognito mode');
} 