// Test script to verify featured toggle functionality
// Run this in your browser console when on a project edit form

console.log('🧪 Testing Featured Toggle Functionality...');

// Test 1: Check if featured checkbox exists and works
function testFeaturedCheckbox() {
  console.log('\n1. Testing Featured Checkbox:');
  
  const featuredCheckbox = document.querySelector('input[id="featured"]');
  if (!featuredCheckbox) {
    console.log('❌ Featured checkbox not found');
    return false;
  }
  
  console.log('✅ Featured checkbox found');
  console.log('📋 Current state:', featuredCheckbox.checked);
  console.log('📋 Checkbox type:', featuredCheckbox.type);
  console.log('📋 Checkbox name:', featuredCheckbox.name);
  
  // Test toggling the checkbox
  const originalState = featuredCheckbox.checked;
  console.log('🔄 Testing toggle...');
  
  // Toggle to opposite state
  featuredCheckbox.checked = !originalState;
  featuredCheckbox.dispatchEvent(new Event('change', { bubbles: true }));
  
  console.log('📋 After toggle:', featuredCheckbox.checked);
  
  // Reset to original state
  featuredCheckbox.checked = originalState;
  featuredCheckbox.dispatchEvent(new Event('change', { bubbles: true }));
  
  console.log('📋 Reset to original:', featuredCheckbox.checked);
  
  return true;
}

// Test 2: Check form data structure
function testFormData() {
  console.log('\n2. Testing Form Data Structure:');
  
  // Look for React state or form data
  console.log('🔍 Looking for form data...');
  
  // Check if we can find any form elements
  const form = document.querySelector('form');
  if (form) {
    console.log('✅ Form found');
    console.log('📋 Form action:', form.action);
    console.log('📋 Form method:', form.method);
  } else {
    console.log('❌ No form found');
  }
  
  // Check for any hidden inputs that might contain featured data
  const hiddenInputs = document.querySelectorAll('input[type="hidden"]');
  console.log('📋 Hidden inputs found:', hiddenInputs.length);
  hiddenInputs.forEach((input, index) => {
    console.log(`  ${index}: name="${input.name}", value="${input.value}"`);
  });
}

// Test 3: Check console logs for form submission
function testFormSubmission() {
  console.log('\n3. Testing Form Submission:');
  
  console.log('📋 Look for these console logs when you submit the form:');
  console.log('  - "ProjectForm: Form submitted"');
  console.log('  - "ProjectForm: Featured value: true/false"');
  console.log('  - "ProjectForm: Featured being saved: true/false"');
  console.log('  - "ProjectForm: Featured type: boolean"');
  
  console.log('\n📋 To test:');
  console.log('  1. Check the featured checkbox');
  console.log('  2. Submit the form');
  console.log('  3. Check the console logs above');
  console.log('  4. Check if the project appears in featured section');
}

// Test 4: Check localStorage for saved data
function testLocalStorage() {
  console.log('\n4. Testing LocalStorage:');
  
  const keys = ['portfolio_projects', 'projects', 'unified_projects'];
  keys.forEach(key => {
    const data = localStorage.getItem(key);
    if (data) {
      try {
        const parsed = JSON.parse(data);
        console.log(`📋 ${key}:`, parsed.length, 'projects');
        if (Array.isArray(parsed) && parsed.length > 0) {
          parsed.forEach((project, index) => {
            console.log(`  ${index}: "${project.title}" - featured: ${project.featured}`);
          });
        }
      } catch (e) {
        console.log(`❌ Error parsing ${key}:`, e.message);
      }
    } else {
      console.log(`📋 ${key}: Not found`);
    }
  });
}

// Run all tests
console.log('🚀 Running Featured Toggle Tests...\n');

const checkboxWorks = testFeaturedCheckbox();
testFormData();
testFormSubmission();
testLocalStorage();

console.log('\n✅ Test completed!');
console.log('📋 If checkbox toggle works but featured projects don\'t show, check:');
console.log('  1. Form submission logs in console');
console.log('  2. LocalStorage data after saving');
console.log('  3. Portfolio page refresh after saving'); 