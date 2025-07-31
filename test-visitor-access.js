// Test visitor access and admin functionality
console.log('🧪 TESTING VISITOR ACCESS...');
console.log('=====================================');

// Check if user is logged in
const isLoggedIn = document.querySelector('[data-testid="user-menu"], .user-menu, .admin-controls');
console.log('👤 User logged in:', !!isLoggedIn);

// Check for admin controls
const adminControls = document.querySelectorAll('button, a').forEach(el => {
  if (el.textContent.includes('Create New Post') || el.textContent.includes('Admin')) {
    console.log('🔧 Admin controls found:', el.textContent);
  }
});

// Check for blog cards
const blogCards = document.querySelectorAll('.project-card');
console.log(`📋 Blog cards found: ${blogCards.length}`);

// Check for draft indicators
const draftBadges = document.querySelectorAll('.badge');
let draftCount = 0;
draftBadges.forEach(badge => {
  if (badge.textContent === 'DRAFT') {
    draftCount++;
    console.log('📝 Draft post found:', badge.closest('.project-card')?.querySelector('.text-xl')?.textContent);
  }
});

console.log(`📝 Draft posts visible: ${draftCount}`);

// Check for specific content
const pageText = document.body.textContent;
const checks = [
  { name: 'Graph ML Post', value: 'Why I Use Graph ML to Design Smarter Cities', found: pageText.includes('Why I Use Graph ML to Design Smarter Cities') },
  { name: 'Test Blog Post', value: 'My First Blog Post', found: pageText.includes('My First Blog Post') },
  { name: 'Complete Test Blog', value: 'COMPLETE TEST BLOG', found: pageText.includes('COMPLETE TEST BLOG') }
];

console.log('\n🔍 CONTENT CHECKS:');
checks.forEach(check => {
  if (check.found) {
    console.log(`✅ Found "${check.name}": ${check.value}`);
  } else {
    console.log(`❌ Missing "${check.name}": ${check.value}`);
  }
});

// Check debug info
const debugInfo = document.querySelector('.text-xs.text-red-500');
if (debugInfo) {
  console.log(`\n📊 Debug Info: ${debugInfo.textContent}`);
}

console.log('\n💡 EXPECTED BEHAVIOR:');
if (isLoggedIn) {
  console.log('👤 ADMIN USER: Should see all posts (published + drafts)');
  console.log('📝 Should see DRAFT badges on draft posts');
  console.log('🔧 Should see admin controls (Create New Post, etc.)');
} else {
  console.log('👤 VISITOR: Should see only published posts');
  console.log('📝 Should NOT see any DRAFT badges');
  console.log('🔧 Should NOT see admin controls');
}

console.log('\n✅ SUCCESS CRITERIA:');
if (isLoggedIn && draftCount > 0) {
  console.log('✅ Admin can see draft posts');
} else if (!isLoggedIn && draftCount === 0) {
  console.log('✅ Visitors only see published posts');
} else {
  console.log('❌ Access control may need adjustment');
}

console.log('\n🔧 NEXT STEPS:');
console.log('1. Test as visitor (incognito mode)');
console.log('2. Test as admin (logged in)');
console.log('3. Verify draft posts only show for admin');
console.log('4. Check that published posts show for everyone'); 