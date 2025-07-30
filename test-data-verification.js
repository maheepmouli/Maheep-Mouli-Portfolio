// Test Data Verification Script
// Run this in your browser console on the portfolio page

console.log('🔍 TESTING PROJECT DATA VERIFICATION');

function testDataVerification() {
  console.log('\n📋 What to look for in the console:');
  
  console.log('\n✅ GOOD DATA (badges should show):');
  console.log('  DEBUG: Project data: {');
  console.log('    id: "...",');
  console.log('    title: "Flow-SIGHT",');
  console.log('    status: "published",  ← This should be truthy');
  console.log('    featured: true,       ← This should be true');
  console.log('    ...');
  console.log('  }');
  console.log('  Portfolio: Project status: published Project featured: true');
  
  console.log('\n❌ BAD DATA (badges won\'t show):');
  console.log('  DEBUG: Project data: {');
  console.log('    id: "...",');
  console.log('    title: "Flow-SIGHT",');
  console.log('    status: null,         ← This is falsy');
  console.log('    featured: undefined,  ← This is falsy');
  console.log('    ...');
  console.log('  }');
  console.log('  Portfolio: Project status: null Project featured: undefined');
  console.log('  ⚠️ Project missing status or featured: Flow-SIGHT {...}');
  
  console.log('\n🔧 If you see BAD DATA:');
  console.log('1. The issue is with Supabase data loading');
  console.log('2. Check if the database has the correct values');
  console.log('3. Check if the service layer is fetching the data correctly');
  
  console.log('\n✅ If you see GOOD DATA but no badges:');
  console.log('1. The issue is with the Badge component');
  console.log('2. Check for JavaScript errors in the console');
  console.log('3. Check if the Badge component is imported correctly');
  
  console.log('\n📋 Expected Results:');
  console.log('- You should see "Test Badge" on every project card');
  console.log('- You should see technology badges (like "React", "TypeScript")');
  console.log('- You should see status badges if project.status is truthy');
  console.log('- You should see "Featured" badges if project.featured is true');
  
  console.log('\n🚨 If Test Badge doesn\'t show:');
  console.log('- There\'s a fundamental Badge component issue');
  console.log('- Check for red error messages in the console');
  console.log('- The Badge component might not be imported correctly');
}

testDataVerification(); 