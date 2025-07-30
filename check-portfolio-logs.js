// Check what the Portfolio component is logging about project data
// Run this in your browser console on the portfolio page

console.log('🔍 CHECKING PORTFOLIO COMPONENT LOGS');

// Look for the specific console logs from the Portfolio component
function checkPortfolioLogs() {
  console.log('\n1. Looking for Portfolio component logs...');
  
  console.log('Look for these specific log messages in the console:');
  console.log('- "Portfolio: Project status: [value] Project featured: [value]"');
  console.log('- "Portfolio: Loading projects"');
  console.log('- "Portfolio: Found projects"');
  console.log('- "UnifiedService: Supabase query successful"');
  console.log('- "UnifiedService: Data received"');
  
  console.log('\nIf you see logs like:');
  console.log('  Portfolio: Project status: undefined Project featured: undefined');
  console.log('Then the data is not being passed correctly to the component.');
  
  console.log('\nIf you see logs like:');
  console.log('  Portfolio: Project status: published Project featured: true');
  console.log('Then the data is correct but badges are not rendering.');
}

// Check if there are any JavaScript errors
function checkForErrors() {
  console.log('\n2. Checking for JavaScript errors...');
  
  console.log('Look for any red error messages in the console, especially:');
  console.log('- "Cannot read property status"');
  console.log('- "project.status is undefined"');
  console.log('- "Badge component error"');
  console.log('- Any React rendering errors');
}

// Check if the Badge component is available
function checkBadgeComponent() {
  console.log('\n3. Checking Badge component availability...');
  
  // Look for any Badge-related errors
  console.log('Look for these error patterns:');
  console.log('- "Badge is not defined"');
  console.log('- "Cannot resolve Badge"');
  console.log('- "Badge component import error"');
}

// Check if the data is being passed correctly
function checkDataFlow() {
  console.log('\n4. Checking data flow...');
  
  console.log('The data flow should be:');
  console.log('1. Supabase → unifiedProjectsService.getAllProjects()');
  console.log('2. unifiedProjectsService → Portfolio component');
  console.log('3. Portfolio component → ProjectCard component');
  console.log('4. ProjectCard component → Badge rendering');
  
  console.log('\nIf step 1-2 work but step 4 fails, it\'s a rendering issue.');
  console.log('If step 1-2 fail, it\'s a data loading issue.');
}

// Check if there are any CSS issues
function checkCSSIssues() {
  console.log('\n5. Checking for CSS issues...');
  
  console.log('Look for these CSS-related issues:');
  console.log('- Badges being rendered but hidden by CSS');
  console.log('- Display: none on badge elements');
  console.log('- Opacity: 0 on badge elements');
  console.log('- Z-index issues');
  console.log('- Overflow hidden on parent containers');
}

// Run all checks
function runChecks() {
  console.log('🚀 Starting Portfolio component checks...');
  
  checkPortfolioLogs();
  checkForErrors();
  checkBadgeComponent();
  checkDataFlow();
  checkCSSIssues();
  
  console.log('\n✅ Checks complete!');
  console.log('\n📋 Next steps based on findings:');
  console.log('1. If no Portfolio logs found → Component not loading data');
  console.log('2. If logs show undefined values → Data not being passed');
  console.log('3. If logs show correct values → Badge rendering issue');
  console.log('4. If Badge component errors → Import/component issue');
  console.log('5. If CSS issues → Styling problem');
}

runChecks(); 