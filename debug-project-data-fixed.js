// Fixed debug script to check what project data is actually loaded
// Run this in your browser console on the portfolio page

console.log('🔍 DEBUGGING PROJECT DATA (FIXED)');

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
  const elementsWithData = document.querySelectorAll('[data-project-id], [data-id], [data-title]');
  console.log(`Elements with data attributes: ${elementsWithData.length}`);
  
  elementsWithData.forEach((el, index) => {
    if (index < 5) { // Only show first 5 to avoid spam
      console.log(`Element ${index + 1}:`, el.dataset);
    }
  });
}

// Function to check project card structure
function checkProjectCardStructure() {
  console.log('\n2. Checking project card structure...');
  
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
  console.log('\n3. Checking for application logs...');
  
  console.log('Look for these log patterns in the console:');
  console.log('- "Portfolio: Loading projects"');
  console.log('- "Portfolio: Found projects"');
  console.log('- "UnifiedService: Supabase query successful"');
  console.log('- "UnifiedService: Data received"');
  console.log('- Any errors mentioning "status" or "featured"');
}

// Function to check network requests
function checkNetworkRequests() {
  console.log('\n4. Checking network requests...');
  
  console.log('In the Network tab of DevTools, look for:');
  console.log('- Requests to Supabase');
  console.log('- API calls to /projects or similar');
  console.log('- Any failed requests');
  console.log('- Response data containing project information');
}

// Function to check the current page context
function checkPageContext() {
  console.log('\n5. Page context:');
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

// Function to check for any error messages
function checkForErrors() {
  console.log('\n6. Checking for errors...');
  
  console.log('Look for these error patterns in the console:');
  console.log('- "Failed to fetch"');
  console.log('- "Network error"');
  console.log('- "Supabase" errors');
  console.log('- "status is not defined"');
  console.log('- "Cannot read property"');
}

// Function to check if projects have the right data structure
function checkProjectDataStructure() {
  console.log('\n7. Checking project data structure...');
  
  // Look for any text that might indicate project titles
  const projectTitles = ['Flow-SIGHT', 'KHC-HOSPITAL', 'WOOD-ID'];
  
  projectTitles.forEach(title => {
    const elements = document.querySelectorAll('*');
    let found = false;
    
    elements.forEach(el => {
      if (el.textContent && el.textContent.includes(title)) {
        console.log(`✅ Found project title: ${title}`);
        found = true;
      }
    });
    
    if (!found) {
      console.log(`❌ Project title not found: ${title}`);
    }
  });
}

// Run all debug functions
function runDebug() {
  console.log('🚀 Starting project data debug (FIXED)...');
  
  checkReactState();
  checkProjectCardStructure();
  checkForAppLogs();
  checkNetworkRequests();
  checkPageContext();
  checkForErrors();
  checkProjectDataStructure();
  
  console.log('\n✅ Debug complete!');
  console.log('\n📋 Based on the SQL results you showed:');
  console.log('- KHC-HOSPITAL: featured=true, status=published');
  console.log('- WOOD-ID: featured=true, status=Research');
  console.log('- Flow-SIGHT: featured=true, status=published');
  console.log('\n📋 Next steps:');
  console.log('1. Check if the Portfolio component is receiving this data');
  console.log('2. Look for any JavaScript errors preventing badge rendering');
  console.log('3. Verify the badge rendering logic in Portfolio.tsx');
  console.log('4. Check if there are any CSS issues hiding the badges');
}

runDebug(); 