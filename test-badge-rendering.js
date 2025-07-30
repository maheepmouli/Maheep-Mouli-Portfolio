// Simple test to verify badge rendering logic
// Run this in your browser console on the portfolio page

console.log('🧪 TESTING BADGE RENDERING');

// Test 1: Check if the badge elements exist but are hidden
function testBadgeVisibility() {
  console.log('\n1. Testing badge visibility...');
  
  // Look for any badge elements
  const allBadges = document.querySelectorAll('[class*="badge"]');
  console.log(`Total badge elements found: ${allBadges.length}`);
  
  allBadges.forEach((badge, index) => {
    const text = badge.textContent?.trim();
    const classes = badge.className;
    const styles = window.getComputedStyle(badge);
    
    console.log(`Badge ${index + 1}: "${text}"`);
    console.log(`  - Classes: ${classes}`);
    console.log(`  - Display: ${styles.display}`);
    console.log(`  - Visibility: ${styles.visibility}`);
    console.log(`  - Opacity: ${styles.opacity}`);
    console.log(`  - Position: ${styles.position}`);
    console.log(`  - Z-index: ${styles.zIndex}`);
  });
}

// Test 2: Check if there are any CSS rules hiding badges
function testCSSRules() {
  console.log('\n2. Testing CSS rules...');
  
  // Check if there are any CSS rules that might hide badges
  const styleSheets = document.styleSheets;
  console.log(`Style sheets found: ${styleSheets.length}`);
  
  // Look for any rules that might affect badges
  for (let i = 0; i < styleSheets.length; i++) {
    try {
      const rules = styleSheets[i].cssRules || styleSheets[i].rules;
      if (rules) {
        for (let j = 0; j < rules.length; j++) {
          const rule = rules[j];
          if (rule.selectorText && rule.selectorText.includes('badge')) {
            console.log(`Found badge CSS rule: ${rule.selectorText}`);
            console.log(`  - Styles: ${rule.style.cssText}`);
          }
        }
      }
    } catch (e) {
      // Cross-origin stylesheets will throw an error
      console.log(`Style sheet ${i} is cross-origin`);
    }
  }
}

// Test 3: Check if the project data is being passed correctly
function testProjectData() {
  console.log('\n3. Testing project data structure...');
  
  // Look for any text that indicates project data
  const projectTitles = ['Flow-SIGHT', 'KHC-HOSPITAL', 'WOOD-ID'];
  
  projectTitles.forEach(title => {
    const elements = document.querySelectorAll('*');
    let found = false;
    
    elements.forEach(el => {
      if (el.textContent && el.textContent.includes(title)) {
        console.log(`✅ Found project: ${title}`);
        
        // Look for the parent card element
        let card = el.closest('[class*="card"]');
        if (card) {
          console.log(`  - Card found for ${title}`);
          
          // Check if the card has any badge containers
          const badgeContainers = card.querySelectorAll('[class*="flex"][class*="gap"]');
          console.log(`  - Badge containers found: ${badgeContainers.length}`);
          
          badgeContainers.forEach((container, index) => {
            console.log(`  - Container ${index + 1} classes: ${container.className}`);
            console.log(`  - Container text: "${container.textContent?.trim()}"`);
          });
        }
        
        found = true;
      }
    });
    
    if (!found) {
      console.log(`❌ Project not found: ${title}`);
    }
  });
}

// Test 4: Check for any JavaScript errors
function testJavaScriptErrors() {
  console.log('\n4. Testing for JavaScript errors...');
  
  console.log('Check the console for these error patterns:');
  console.log('- "Cannot read property"');
  console.log('- "status is not defined"');
  console.log('- "featured is not defined"');
  console.log('- "project.status" errors');
  console.log('- "project.featured" errors');
  console.log('- "Badge" component errors');
}

// Test 5: Check if the Portfolio component is actually rendering
function testPortfolioComponent() {
  console.log('\n5. Testing Portfolio component...');
  
  // Look for the portfolio section
  const portfolioSection = document.querySelector('#portfolio');
  if (portfolioSection) {
    console.log('✅ Portfolio section found');
    console.log(`  - Children: ${portfolioSection.children.length}`);
    
    // Check if it has project cards
    const cards = portfolioSection.querySelectorAll('[class*="card"]');
    console.log(`  - Project cards: ${cards.length}`);
  } else {
    console.log('❌ Portfolio section not found');
  }
}

// Run all tests
function runTests() {
  console.log('🚀 Starting badge rendering tests...');
  
  testBadgeVisibility();
  testCSSRules();
  testProjectData();
  testJavaScriptErrors();
  testPortfolioComponent();
  
  console.log('\n✅ Tests complete!');
  console.log('\n📋 If no badges are found:');
  console.log('1. Check if there are JavaScript errors in the console');
  console.log('2. Verify the Portfolio.tsx component is rendering correctly');
  console.log('3. Check if the project data is being passed to the component');
  console.log('4. Look for any CSS that might be hiding the badges');
}

runTests(); 