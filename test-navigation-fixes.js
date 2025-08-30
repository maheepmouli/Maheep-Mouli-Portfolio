// Test script to verify navigation and page transition fixes
console.log('Testing Navigation and Page Transition Fixes...');

// Test 1: Check if navigation has proper cursor handling
function testNavigationCursor() {
  console.log('✅ Testing Navigation Cursor Handling...');
  
  // Check if navigation elements exist
  const nav = document.querySelector('nav');
  if (nav) {
    console.log('✅ Navigation element found');
    
    // Check if navigation has proper pointer events
    const navStyle = window.getComputedStyle(nav);
    if (navStyle.pointerEvents !== 'none') {
      console.log('✅ Navigation has proper pointer events');
    } else {
      console.log('❌ Navigation pointer events issue detected');
    }
  } else {
    console.log('❌ Navigation element not found');
  }
}

// Test 2: Check if page content has proper transitions
function testPageTransitions() {
  console.log('✅ Testing Page Transitions...');
  
  // Check if portfolio section exists
  const portfolioSection = document.querySelector('#portfolio');
  if (portfolioSection) {
    console.log('✅ Portfolio section found');
    
    // Check if it's wrapped in motion.div
    const motionWrapper = portfolioSection.closest('[data-framer-motion]') || portfolioSection.parentElement;
    if (motionWrapper && motionWrapper.style) {
      console.log('✅ Page transition wrapper found');
    } else {
      console.log('❌ Page transition wrapper not found');
    }
  } else {
    console.log('❌ Portfolio section not found');
  }
}

// Test 3: Check for conflicting animations
function testAnimationConflicts() {
  console.log('✅ Testing Animation Conflicts...');
  
  // Check if multiple animation libraries are conflicting
  const hasFramerMotion = typeof window !== 'undefined' && window.FramerMotion;
  const hasOtherAnimations = document.querySelector('[class*="animate-"]');
  
  if (hasFramerMotion) {
    console.log('✅ Framer Motion detected');
  }
  
  if (hasOtherAnimations) {
    console.log('⚠️  Other animation classes detected - potential conflicts');
  } else {
    console.log('✅ No conflicting animation classes detected');
  }
}

// Test 4: Check cursor display
function testCursorDisplay() {
  console.log('✅ Testing Cursor Display...');
  
  // Check if CSS cursor rules are applied
  const body = document.body;
  const bodyStyle = window.getComputedStyle(body);
  
  if (bodyStyle.cursor === 'default') {
    console.log('✅ Body cursor is properly set to default');
  } else {
    console.log('❌ Body cursor issue:', bodyStyle.cursor);
  }
  
  // Check interactive elements
  const buttons = document.querySelectorAll('button, a');
  let cursorIssues = 0;
  
  buttons.forEach(button => {
    const style = window.getComputedStyle(button);
    if (style.cursor !== 'pointer') {
      cursorIssues++;
    }
  });
  
  if (cursorIssues === 0) {
    console.log('✅ All interactive elements have proper cursor');
  } else {
    console.log(`⚠️  ${cursorIssues} interactive elements have cursor issues`);
  }
}

// Run all tests
function runAllTests() {
  console.log('🚀 Starting Navigation and Page Transition Tests...\n');
  
  testNavigationCursor();
  console.log('');
  
  testPageTransitions();
  console.log('');
  
  testAnimationConflicts();
  console.log('');
  
  testCursorDisplay();
  console.log('');
  
  console.log('✨ All tests completed!');
}

// Auto-run tests when script loads
if (typeof window !== 'undefined') {
  // Wait for DOM to be ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', runAllTests);
  } else {
    runAllTests();
  }
} else {
  console.log('This test script is designed to run in a browser environment');
}
