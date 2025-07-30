// Debug script to check what project data is actually loaded
// Run this in your browser console on the portfolio page

console.log('🔍 DEBUGGING PROJECT DATA');

// Function to check React component state
function checkReactState() {
  console.log('\n1. Checking React component state...');
  
  // Look for React DevTools or try to access component data
  const reactRoot = document.querySelector('#root');
  if (reactRoot) {
    console.log('✅ React root found');
    console.log('React root children:', reactRoot.children.length);
  } else {
    console.log('❌ React root not found');
  }
  
  // Look for any data attributes that might contain project info
  const elementsWithData = document.querySelectorAll('[data-*]');
  console.log(`Elements with data attributes: ${elementsWithData.length}`);
  
  elementsWithData.forEach((el, index) => {
    if (index < 5) { // Only show first 5 to avoid spam
      console.log(`Element ${index + 1}:`, el.dataset);
    }
  });
}

// Function to check for any hidden data in the DOM
function checkForHiddenData() {
  console.log('\n2. Checking for hidden project data...');
  
  // Look for any script tags that might contain data
  const scripts = document.querySelectorAll('script');
  console.log(`Script tags found: ${scripts.length}`);
  
  // Look for any JSON-LD or structured data
  const jsonLd = document.querySelectorAll('script[type="application/ld+json"]');
  console.log(`JSON-LD scripts found: ${jsonLd.length}`);
  
  // Look for any meta tags that might contain data
  const metaTags = document.querySelectorAll('meta');
  console.log(`Meta tags found: ${metaTags.length}`);
}

// Function to check project card structure
function checkProjectCardStructure() {
  console.log('\n3. Checking project card structure...');
  
  const cards = document.querySelectorAll('[class*="card"]');
  console.log(`Cards found: ${cards.length}`);
  
  cards.forEach((card, index) => {
    console.log(`\nCard ${index + 1}:`);
    console.log('  - Classes:', card.className);
    console.log('  - Children:', card.children.length);
    
    // Check for any text content that might indicate project data
    const textContent = card.textContent?.substring(0, 200);
    console.log('  - Text preview:', textContent);
    
    // Check for images
    const images = card.querySelectorAll('img');
    console.log('  - Images:', images.length);
    
    // Check for any badges or status indicators
    const badges = card.querySelectorAll('[class*="badge"]');
    console.log('  - Badges:', badges.length);
    
    // Check for any buttons or links
    const buttons = card.querySelectorAll('button, a');
    console.log('  - Buttons/links:', buttons.length);
  });
}

// Function to check for any console logs from the app
function checkForAppLogs() {
  console.log('\n4. Checking for application logs...');
  
  console.log('Look for these log patterns in the console:');
  console.log('- "Portfolio: Loading projects"');
  console.log('- "Portfolio: Found projects"');
  console.log('- "ProjectForm: Featured value"');
  console.log('- "ProjectForm: Status value"');
  console.log('- Any errors mentioning "status" or "featured"');
}

// Function to check network requests
function checkNetworkRequests() {
  console.log('\n5. Checking network requests...');
  
  console.log('In the Network tab of DevTools, look for:');
  console.log('- Requests to Supabase');
  console.log('- API calls to /projects or similar');
  console.log('- Any failed requests');
  console.log('- Response data containing project information');
}

// Function to check if we can access the projects through the window object
function checkWindowObject() {
  console.log('\n6. Checking window object for project data...');
  
  // Try to find any global variables that might contain project data
  const globalVars = Object.keys(window);
  const projectRelated = globalVars.filter(key => 
    key.toLowerCase().includes('project') || 
    key.toLowerCase().includes('portfolio') ||
    key.toLowerCase().includes('data')
  );
  
  console.log('Global variables related to projects:', projectRelated);
  
  // Try to access some common patterns
  if (window.__REACT_DEVTOOLS_GLOBAL_HOOK__) {
    console.log('✅ React DevTools hook found');
  }
  
  if (window.__REDUX_DEVTOOLS_EXTENSION__) {
    console.log('✅ Redux DevTools found');
  }
}

// Function to check the current page context
function checkPageContext() {
  console.log('\n7. Page context:');
  console.log(`URL: ${window.location.href}`);
  console.log(`Title: ${document.title}`);
  console.log(`Pathname: ${window.location.pathname}`);
  
  // Check if we're on the right page
  if (window.location.pathname.includes('/portfolio')) {
    console.log('✅ On portfolio page');
  } else {
    console.log('❌ Not on portfolio page');
  }
}

// Run all debug functions
function runDebug() {
  console.log('🚀 Starting project data debug...');
  
  checkReactState();
  checkForHiddenData();
  checkProjectCardStructure();
  checkForAppLogs();
  checkNetworkRequests();
  checkWindowObject();
  checkPageContext();
  
  console.log('\n✅ Debug complete!');
  console.log('\n📋 Next steps:');
  console.log('1. Check the Network tab for any failed requests');
  console.log('2. Look for any error messages in the console');
  console.log('3. Check if projects have status/featured values in the database');
  console.log('4. Verify the Portfolio component is receiving the correct data');
}

runDebug(); 