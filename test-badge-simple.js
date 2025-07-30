// Simple test to check if Badge component can be imported and used
// Run this in your browser console on the portfolio page

console.log('🧪 TESTING BADGE COMPONENT SIMPLE');

// Test 1: Check if there are any actual JavaScript errors
function checkForErrors() {
  console.log('\n1. Checking for actual JavaScript errors...');
  
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

// Test 2: Check if Portfolio component is logging data
function checkPortfolioLogs() {
  console.log('\n2. Checking Portfolio component logs...');
  
  console.log('Look for these specific log messages in the console:');
  console.log('- "Portfolio: Loading projects"');
  console.log('- "Portfolio: Found projects"');
  console.log('- "Portfolio: Project status: [value] Project featured: [value]"');
  console.log('- "UnifiedService: Supabase query successful"');
  console.log('- "UnifiedService: Data received"');
  
  console.log('\nIf you see logs like:');
  console.log('  Portfolio: Project status: undefined Project featured: undefined');
  console.log('Then the data is not being passed correctly to the component.');
  
  console.log('\nIf you see logs like:');
  console.log('  Portfolio: Project status: published Project featured: true');
  console.log('Then the data is correct but badges are not rendering.');
}

// Test 3: Check if the issue is with the build/bundle
function checkBuildIssues() {
  console.log('\n3. Checking for build/bundle issues...');
  
  console.log('Look for these build-related errors:');
  console.log('- "Bundle error"');
  console.log('- "Compilation error"');
  console.log('- "Vite" errors');
  console.log('- "Webpack" errors');
  console.log('- "Module resolution error"');
}

// Test 4: Check if the issue is with dependencies
function checkDependencies() {
  console.log('\n4. Checking dependencies...');
  
  console.log('The Badge component depends on:');
  console.log('- class-variance-authority');
  console.log('- clsx');
  console.log('- tailwind-merge');
  console.log('- React');
  
  console.log('\nIf any of these are missing, the Badge component won\'t work.');
}

// Test 5: Check if the issue is with the conditional rendering
function checkConditionalRendering() {
  console.log('\n5. Checking conditional rendering logic...');
  
  console.log('The current badge rendering logic is:');
  console.log('  {project.status && (');
  console.log('    <Badge variant="secondary" className="text-xs">');
  console.log('      {project.status}');
  console.log('    </Badge>');
  console.log('  )}');
  console.log('  {project.featured && (');
  console.log('    <Badge variant="default" className="text-xs">');
  console.log('      Featured');
  console.log('    </Badge>');
  console.log('  )}');
  
  console.log('\nIf project.status is falsy (null, undefined, empty string), the badge won\'t render.');
  console.log('If project.featured is falsy (false, null, undefined), the badge won\'t render.');
}

// Test 6: Check if the issue is with the technology badges
function checkTechnologyBadges() {
  console.log('\n6. Checking technology badges...');
  
  console.log('Technology badges should always render because they don\'t depend on conditional logic:');
  console.log('  {project.technologies.map((tech, index) => (');
  console.log('    <Badge variant="outline" className="text-xs">');
  console.log('      {tech}');
  console.log('    </Badge>');
  console.log('  ))}');
  
  console.log('\nIf technology badges are not showing, it\'s definitely a Badge component issue.');
}

// Run all tests
function runTests() {
  console.log('🚀 Starting simple Badge tests...');
  
  checkForErrors();
  checkPortfolioLogs();
  checkBuildIssues();
  checkDependencies();
  checkConditionalRendering();
  checkTechnologyBadges();
  
  console.log('\n✅ Tests complete!');
  console.log('\n📋 Based on the findings:');
  console.log('- No badges are rendering at all (including technology badges)');
  console.log('- Manual badge creation works (CSS is fine)');
  console.log('- This suggests a Badge component import/definition issue');
  console.log('\n📋 Most likely issues:');
  console.log('1. Badge component file missing or corrupted');
  console.log('2. Import path issue');
  console.log('3. Dependencies not installed');
  console.log('4. Build/bundle error');
  console.log('5. React rendering issue');
  
  console.log('\n📋 Next steps:');
  console.log('1. Check for any red error messages in the console');
  console.log('2. Look for Portfolio component logs');
  console.log('3. Check if Badge component is properly imported');
  console.log('4. Verify the Badge component file exists and is correct');
  console.log('5. Check if dependencies are installed');
}

runTests(); 