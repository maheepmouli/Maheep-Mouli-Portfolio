// Test script to verify form submission
// Run this in your browser console when on the project edit form

// Test 1: Check if form data includes featured
function testFormData() {
  console.log('🧪 Testing Form Data...');
  
  // Check if we can find the form
  const form = document.querySelector('form');
  if (!form) {
    console.log('❌ No form found on page');
    return;
  }
  
  console.log('✅ Form found');
  
  // Check for featured checkbox
  const featuredCheckbox = document.querySelector('input[id="featured"]');
  if (featuredCheckbox) {
    console.log('✅ Featured checkbox found');
    console.log('📋 Checkbox checked:', featuredCheckbox.checked);
    console.log('📋 Checkbox value:', featuredCheckbox.value);
    
    // Test changing the checkbox
    console.log('🧪 Testing checkbox change...');
    const originalState = featuredCheckbox.checked;
    featuredCheckbox.checked = !originalState;
    featuredCheckbox.dispatchEvent(new Event('change'));
    
    console.log('📋 Checkbox after change:', featuredCheckbox.checked);
    
    // Reset to original state
    featuredCheckbox.checked = originalState;
    featuredCheckbox.dispatchEvent(new Event('change'));
    
  } else {
    console.log('❌ Featured checkbox not found');
  }
  
  // Check for status dropdown
  const statusSelect = document.querySelector('select[id="status"]');
  if (statusSelect) {
    console.log('✅ Status select found');
    console.log('📋 Status value:', statusSelect.value);
    console.log('📋 Available options:', Array.from(statusSelect.options).map(opt => opt.value));
  } else {
    console.log('❌ Status select not found');
  }
}

// Test 2: Check if form submission includes featured
function testFormSubmission() {
  console.log('🧪 Testing Form Submission...');
  
  // Find the form
  const form = document.querySelector('form');
  if (!form) {
    console.log('❌ No form found');
    return;
  }
  
  // Add a test submit handler
  const originalSubmit = form.onsubmit;
  
  form.onsubmit = function(e) {
    console.log('📝 Form submission intercepted');
    
    // Get form data
    const formData = new FormData(form);
    console.log('📋 Form data entries:');
    for (let [key, value] of formData.entries()) {
      console.log(`  ${key}: ${value}`);
    }
    
    // Check if featured is in the form data
    const featuredValue = formData.get('featured');
    console.log('⭐ Featured value in form data:', featuredValue);
    
    // Restore original submit handler
    form.onsubmit = originalSubmit;
    
    // Continue with original submission
    if (originalSubmit) {
      originalSubmit.call(form, e);
    }
  };
  
  console.log('✅ Test submit handler added. Try submitting the form now.');
}

// Test 3: Check console logs during form submission
function monitorConsoleLogs() {
  console.log('🧪 Monitoring Console Logs...');
  console.log('📋 Look for these logs during form submission:');
  console.log('  - "ProjectForm: Current form data:"');
  console.log('  - "ProjectForm: Project data being saved:"');
  console.log('  - "ProjectForm: Update data:"');
  console.log('📋 Check if "featured" appears in the logged data');
}

// Test 4: Manual form data check
function checkFormDataObject() {
  console.log('🧪 Checking Form Data Object...');
  
  // Try to access the form data from the component
  // This might not work depending on how the component is structured
  console.log('📋 Try to find formData in the component state');
  console.log('📋 Look for React DevTools or component state');
}

// Main test function
function runFormTests() {
  console.log('🚀 Starting Form Submission Tests...');
  console.log('=====================================');
  
  testFormData();
  console.log('---');
  
  testFormSubmission();
  console.log('---');
  
  monitorConsoleLogs();
  console.log('---');
  
  checkFormDataObject();
  console.log('---');
  
  console.log('✅ Tests completed!');
  console.log('📋 Now try editing a project and check the console logs');
}

// Run tests
runFormTests(); 