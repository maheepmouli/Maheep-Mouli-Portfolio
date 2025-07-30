// Comprehensive Badge Debugging Script
// Run this in your browser console on the portfolio page

console.log('🔍 COMPREHENSIVE BADGE DEBUGGING');

// Step 1: Check if there are any JavaScript errors
function checkJavaScriptErrors() {
  console.log('\n1. Checking for JavaScript errors...');
  
  console.log('Look for any red error messages in the console, especially:');
  console.log('- "Badge is not defined"');
  console.log('- "Cannot resolve Badge"');
  console.log('- "cn is not defined"');
  console.log('- "class-variance-authority" errors');
  console.log('- "clsx" errors');
  console.log('- "tailwind-merge" errors');
  console.log('- "React" errors');
  console.log('- "Portfolio" component errors');
  
  console.log('\nIf you see any red error messages, please share them.');
}

// Step 2: Check if Portfolio component is logging data
function checkPortfolioLogs() {
  console.log('\n2. Checking Portfolio component logs...');
  
  console.log('Look for these specific log messages in the console:');
  console.log('- "Portfolio: Project status: [value] Project featured: [value]"');
  console.log('- "DEBUG: Project data: { status: ..., featured: ..., title: ... }"');
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

// Step 3: Check if the test badge is showing
function checkTestBadge() {
  console.log('\n3. Checking if test badge is showing...');
  
  console.log('Look for a "Test Badge" on each project card.');
  console.log('If you see "Test Badge" but not status/featured badges:');
  console.log('- The Badge component is working');
  console.log('- The issue is with the conditional logic (project.status/project.featured)');
  
  console.log('\nIf you don\'t see "Test Badge" at all:');
  console.log('- The Badge component is not working');
  console.log('- There\'s an import or component issue');
}

// Step 4: Check if technology badges are showing
function checkTechnologyBadges() {
  console.log('\n4. Checking technology badges...');
  
  console.log('Look for technology badges (like "React", "TypeScript", etc.) on each project card.');
  console.log('If technology badges are showing:');
  console.log('- The Badge component is working');
  console.log('- The issue is with status/featured data or conditional logic');
  
  console.log('\nIf technology badges are not showing:');
  console.log('- The Badge component is not working');
  console.log('- There\'s a fundamental component issue');
}

// Step 5: Check the data structure
function checkDataStructure() {
  console.log('\n5. Checking data structure...');
  
  console.log('From the console logs, check if:');
  console.log('- project.status has a truthy value (not null, undefined, or empty string)');
  console.log('- project.featured is true (not false, null, or undefined)');
  
  console.log('\nExample of good data:');
  console.log('  status: "published" or "draft" or "in-progress"');
  console.log('  featured: true');
  
  console.log('\nExample of bad data:');
  console.log('  status: null or undefined or ""');
  console.log('  featured: false or null or undefined');
}

// Step 6: Check if the issue is with Tailwind CSS
function checkTailwindCSS() {
  console.log('\n6. Checking Tailwind CSS...');
  
  console.log('The Badge component uses these Tailwind classes:');
  console.log('- inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold');
  console.log('- bg-primary text-primary-foreground (for default variant)');
  console.log('- bg-secondary text-secondary-foreground (for secondary variant)');
  console.log('- text-foreground (for outline variant)');
  
  console.log('\nIf badges are rendered but not styled correctly:');
  console.log('- It\'s a Tailwind CSS issue');
  console.log('- Check if Tailwind is properly configured');
  console.log('- Check if the CSS classes are being applied');
}

// Step 7: Manual test
function manualTest() {
  console.log('\n7. Manual test...');
  
  console.log('Try creating a badge manually in the console:');
  console.log('1. Open browser console');
  console.log('2. Run this command:');
  console.log('   document.body.innerHTML += \'<div class="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold bg-primary text-primary-foreground">Manual Test Badge</div>\'');
  
  console.log('\nIf the manual badge appears:');
  console.log('- CSS is working');
  console.log('- The issue is with the React component');
  
  console.log('\nIf the manual badge doesn\'t appear:');
  console.log('- There\'s a CSS issue');
  console.log('- Tailwind might not be loaded properly');
}

// Step 8: Check if the issue is with the build
function checkBuild() {
  console.log('\n8. Checking build...');
  
  console.log('The build completed successfully, which means:');
  console.log('- TypeScript compilation passed');
  console.log('- No import errors');
  console.log('- No syntax errors');
  
  console.log('\nIf the build passed but badges don\'t render:');
  console.log('- It\'s a runtime issue, not a build issue');
  console.log('- The component is being imported but not rendering');
}

// Run all checks
function runChecks() {
  console.log('🚀 Starting comprehensive Badge debugging...');
  
  checkJavaScriptErrors();
  checkPortfolioLogs();
  checkTestBadge();
  checkTechnologyBadges();
  checkDataStructure();
  checkTailwindCSS();
  manualTest();
  checkBuild();
  
  console.log('\n✅ Checks complete!');
  console.log('\n📋 Based on the findings:');
  console.log('1. If you see "Test Badge" → Badge component works, issue is with data');
  console.log('2. If you don\'t see "Test Badge" → Badge component is broken');
  console.log('3. If technology badges work → Badge component works, issue is with status/featured');
  console.log('4. If no badges work → Fundamental component or CSS issue');
  console.log('5. If manual badge works → CSS is fine, React component issue');
  
  console.log('\n📋 Next steps:');
  console.log('1. Check the console logs for project data');
  console.log('2. Look for the "Test Badge" on project cards');
  console.log('3. Check if technology badges are showing');
  console.log('4. Try the manual test in the console');
  console.log('5. Share the results with me for the final fix');
}

runChecks(); 