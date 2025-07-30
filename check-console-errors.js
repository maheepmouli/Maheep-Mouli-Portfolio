// Check for JavaScript errors that might be preventing Badge component rendering
// Run this in your browser console on the portfolio page

console.log('🔍 CHECKING FOR JAVASCRIPT ERRORS');

// Function to check for any console errors
function checkConsoleErrors() {
  console.log('\n1. Checking console for errors...');
  
  console.log('Look for any red error messages in the console, especially:');
  console.log('- "Badge is not defined"');
  console.log('- "Cannot resolve Badge"');
  console.log('- "cn is not defined"');
  console.log('- "class-variance-authority" errors');
  console.log('- "clsx" errors');
  console.log('- "tailwind-merge" errors');
  console.log('- "React" errors');
  console.log('- "Portfolio" component errors');
}

// Function to check if the Portfolio component is logging data
function checkPortfolioLogs() {
  console.log('\n2. Checking for Portfolio component logs...');
  
  console.log('Look for these specific log messages:');
  console.log('- "Portfolio: Loading projects"');
  console.log('- "Portfolio: Found projects"');
  console.log('- "Portfolio: Project status: [value] Project featured: [value]"');
  console.log('- "UnifiedService: Supabase query successful"');
  console.log('- "UnifiedService: Data received"');
  
  console.log('\nIf you don\'t see any Portfolio logs, the component might not be loading.');
}

// Function to check if there are any import errors
function checkImportErrors() {
  console.log('\n3. Checking for import errors...');
  
  console.log('Look for these import-related errors:');
  console.log('- "Cannot resolve module"');
  console.log('- "Module not found"');
  console.log('- "Import error"');
  console.log('- "Badge component import error"');
}

// Function to check if the issue is with the build/bundle
function checkBuildIssues() {
  console.log('\n4. Checking for build/bundle issues...');
  
  console.log('Look for these build-related errors:');
  console.log('- "Bundle error"');
  console.log('- "Compilation error"');
  console.log('- "Vite" errors');
  console.log('- "Webpack" errors');
}

// Function to check if the issue is with React rendering
function checkReactRendering() {
  console.log('\n5. Checking for React rendering issues...');
  
  console.log('Look for these React-related errors:');
  console.log('- "React rendering error"');
  console.log('- "Component error"');
  console.log('- "JSX error"');
  console.log('- "Element type is invalid"');
}

// Function to check if the issue is with the conditional rendering logic
function checkConditionalRendering() {
  console.log('\n6. Checking conditional rendering logic...');
  
  console.log('The badge rendering logic in Portfolio.tsx is:');
  console.log('  {(() => {');
  console.log('    console.log(\'Portfolio: Project status:\', project.status, \'Project featured:\', project.featured);');
  console.log('    return (');
  console.log('      <div className="flex flex-wrap gap-2 mb-4">');
  console.log('        {project.status && (');
  console.log('          <Badge variant="secondary" className="text-xs">');
  console.log('            {project.status}');
  console.log('          </Badge>');
  console.log('        )}');
  console.log('        {project.featured && (');
  console.log('          <Badge variant="default" className="text-xs">');
  console.log('            Featured');
  console.log('          </Badge>');
  console.log('        )}');
  console.log('      </div>');
  console.log('    );');
  console.log('  })()}');
  
  console.log('\nIf you see the console.log but no badges, it\'s a Badge component issue.');
  console.log('If you don\'t see the console.log, it\'s a data/rendering issue.');
}

// Run all checks
function runChecks() {
  console.log('🚀 Starting error checks...');
  
  checkConsoleErrors();
  checkPortfolioLogs();
  checkImportErrors();
  checkBuildIssues();
  checkReactRendering();
  checkConditionalRendering();
  
  console.log('\n✅ Checks complete!');
  console.log('\n📋 Based on the test results:');
  console.log('- No badges are rendering at all (including technology badges)');
  console.log('- Manual badge creation works (CSS is fine)');
  console.log('- This suggests a Badge component import/definition issue');
  console.log('\n📋 Next steps:');
  console.log('1. Check for any red error messages in the console');
  console.log('2. Look for Portfolio component logs');
  console.log('3. Check if Badge component is properly imported');
  console.log('4. Verify the Badge component file exists and is correct');
}

runChecks(); 