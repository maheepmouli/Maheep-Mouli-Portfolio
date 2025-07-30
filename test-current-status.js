// Test script to verify featured projects and project status functionality
// Run this in your browser console on your portfolio page

console.log('=== TESTING FEATURED PROJECTS AND PROJECT STATUS ===');

// Test 1: Check if projects are loading with featured and status data
async function testProjectData() {
  console.log('\n1. Testing project data loading...');
  
  try {
    // Check if unifiedProjectsService is available
    if (typeof window !== 'undefined' && window.unifiedProjectsService) {
      const projects = await window.unifiedProjectsService.getAllProjects();
      console.log('✅ Projects loaded:', projects.length);
      
      projects.forEach(project => {
        console.log(`Project: ${project.title}`);
        console.log(`  - Featured: ${project.featured}`);
        console.log(`  - Status: ${project.status}`);
        console.log(`  - Has featured badge: ${project.featured ? 'Yes' : 'No'}`);
        console.log(`  - Has status badge: ${project.status ? 'Yes' : 'No'}`);
      });
    } else {
      console.log('❌ unifiedProjectsService not available in window object');
    }
  } catch (error) {
    console.error('❌ Error loading projects:', error);
  }
}

// Test 2: Check DOM for status and featured badges
function testDOMBadges() {
  console.log('\n2. Testing DOM for status and featured badges...');
  
  // Look for status badges
  const statusBadges = document.querySelectorAll('[class*="badge"][class*="secondary"]');
  console.log('Status badges found:', statusBadges.length);
  
  // Look for featured badges
  const featuredBadges = document.querySelectorAll('[class*="badge"][class*="default"]');
  console.log('Featured badges found:', featuredBadges.length);
  
  // Check project cards
  const projectCards = document.querySelectorAll('[class*="project-card"], [class*="card"]');
  console.log('Project cards found:', projectCards.length);
  
  projectCards.forEach((card, index) => {
    const badges = card.querySelectorAll('[class*="badge"]');
    console.log(`Card ${index + 1} badges:`, badges.length);
    badges.forEach(badge => {
      console.log(`  - Badge text: "${badge.textContent}"`);
    });
  });
}

// Test 3: Check form functionality
function testFormFields() {
  console.log('\n3. Testing form fields...');
  
  // Check if we're on a form page
  const form = document.querySelector('form');
  if (form) {
    console.log('✅ Form found');
    
    // Check for featured checkbox
    const featuredCheckbox = form.querySelector('input[name="featured"]');
    if (featuredCheckbox) {
      console.log('✅ Featured checkbox found');
      console.log('  - Type:', featuredCheckbox.type);
      console.log('  - Checked:', featuredCheckbox.checked);
    } else {
      console.log('❌ Featured checkbox not found');
    }
    
    // Check for status select
    const statusSelect = form.querySelector('select[name="status"]');
    if (statusSelect) {
      console.log('✅ Status select found');
      console.log('  - Value:', statusSelect.value);
      console.log('  - Options:', statusSelect.options.length);
    } else {
      console.log('❌ Status select not found');
    }
  } else {
    console.log('❌ No form found on current page');
  }
}

// Test 4: Check console for any errors
function checkConsoleErrors() {
  console.log('\n4. Checking for console errors...');
  
  // This will be checked manually by looking at the console
  console.log('Please check the console for any red error messages');
  console.log('Common issues to look for:');
  console.log('- Database connection errors');
  console.log('- Missing column errors');
  console.log('- Type errors');
  console.log('- Network request failures');
}

// Test 5: Test database connection
async function testDatabaseConnection() {
  console.log('\n5. Testing database connection...');
  
  try {
    // Try to access Supabase client
    if (window.supabase) {
      console.log('✅ Supabase client available');
      
      // Test a simple query
      const { data, error } = await window.supabase
        .from('projects')
        .select('id, title, featured, status')
        .limit(1);
      
      if (error) {
        console.log('❌ Database query error:', error);
      } else {
        console.log('✅ Database connection successful');
        console.log('Sample data:', data);
      }
    } else {
      console.log('❌ Supabase client not available');
    }
  } catch (error) {
    console.error('❌ Database connection test failed:', error);
  }
}

// Run all tests
async function runAllTests() {
  console.log('🚀 Starting comprehensive test...');
  
  await testProjectData();
  testDOMBadges();
  testFormFields();
  checkConsoleErrors();
  await testDatabaseConnection();
  
  console.log('\n✅ Test complete! Check the results above.');
  console.log('\n📋 Next steps:');
  console.log('1. If status badges are missing, check the Portfolio.tsx component');
  console.log('2. If featured badges are missing, check the form submission');
  console.log('3. If database errors occur, run the SQL fix scripts');
  console.log('4. If form fields are missing, check ProjectForm.tsx');
}

// Run the tests
runAllTests(); 