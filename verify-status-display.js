// Quick verification script for status badge display
// Run this in your browser console on the portfolio page

console.log('🔍 VERIFYING STATUS BADGE DISPLAY');

// Check if status badges are visible
function checkStatusBadges() {
  console.log('\n1. Checking for status badges in DOM...');
  
  // Look for all badges
  const allBadges = document.querySelectorAll('[class*="badge"]');
  console.log(`Total badges found: ${allBadges.length}`);
  
  // Check each badge
  allBadges.forEach((badge, index) => {
    const text = badge.textContent?.trim();
    const classes = badge.className;
    
    console.log(`Badge ${index + 1}: "${text}"`);
    console.log(`  Classes: ${classes}`);
    
    // Check if it's a status badge (secondary variant)
    if (classes.includes('secondary')) {
      console.log(`  ✅ This appears to be a status badge`);
    }
    
    // Check if it's a featured badge (default variant)
    if (classes.includes('default') && text === 'Featured') {
      console.log(`  ✅ This appears to be a featured badge`);
    }
  });
  
  // Look specifically for project cards
  const projectCards = document.querySelectorAll('[class*="card"]');
  console.log(`\nProject cards found: ${projectCards.length}`);
  
  projectCards.forEach((card, index) => {
    const badges = card.querySelectorAll('[class*="badge"]');
    console.log(`Card ${index + 1} has ${badges.length} badges`);
    
    badges.forEach(badge => {
      const text = badge.textContent?.trim();
      console.log(`  - Badge: "${text}"`);
    });
  });
}

// Check if projects have status data
async function checkProjectData() {
  console.log('\n2. Checking project data for status values...');
  
  // Try to access the projects from the React component
  const projectElements = document.querySelectorAll('[data-project-id], [class*="project"]');
  console.log(`Project elements found: ${projectElements.length}`);
  
  // Look for any data attributes that might contain project info
  projectElements.forEach((element, index) => {
    const dataAttrs = element.dataset;
    console.log(`Element ${index + 1} data attributes:`, dataAttrs);
  });
}

// Check for any console errors related to status
function checkForErrors() {
  console.log('\n3. Checking for status-related errors...');
  
  // This is a manual check - look for these error patterns in the console:
  console.log('Look for these error patterns:');
  console.log('- "status is not defined"');
  console.log('- "Cannot read property status"');
  console.log('- "project.status is undefined"');
  console.log('- Database errors mentioning "status" column');
}

// Check the current page URL to understand context
function checkPageContext() {
  console.log('\n4. Page context:');
  console.log(`Current URL: ${window.location.href}`);
  console.log(`Page title: ${document.title}`);
  
  // Check if we're on the portfolio page
  if (window.location.pathname.includes('/portfolio')) {
    console.log('✅ On portfolio page');
  } else {
    console.log('❌ Not on portfolio page - badges might not be visible');
  }
}

// Run verification
function runVerification() {
  console.log('🚀 Starting status badge verification...');
  
  checkStatusBadges();
  checkProjectData();
  checkForErrors();
  checkPageContext();
  
  console.log('\n✅ Verification complete!');
  console.log('\n📋 If no status badges are found:');
  console.log('1. Make sure you\'re on the portfolio page');
  console.log('2. Check if projects have status values in the database');
  console.log('3. Verify the Portfolio.tsx component is rendering badges');
  console.log('4. Check for any JavaScript errors in the console');
}

runVerification(); 