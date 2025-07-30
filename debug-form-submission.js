// Debug Form Submission
// Run this in your browser console on the project edit page

console.log('=== FORM DEBUG SCRIPT ===');

// 1. Check if the form elements exist
const featuredCheckbox = document.getElementById('featured');
const statusSelect = document.getElementById('status');

console.log('Featured checkbox found:', !!featuredCheckbox);
console.log('Status select found:', !!statusSelect);

if (featuredCheckbox) {
    console.log('Featured checkbox checked:', featuredCheckbox.checked);
    console.log('Featured checkbox value:', featuredCheckbox.value);
}

if (statusSelect) {
    console.log('Status select value:', statusSelect.value);
    console.log('Status select options:', Array.from(statusSelect.options).map(opt => opt.value));
}

// 2. Check form data before submission
const form = document.querySelector('form');
if (form) {
    console.log('Form found:', !!form);
    
    // Add event listener to capture form data
    form.addEventListener('submit', function(e) {
        console.log('=== FORM SUBMISSION DEBUG ===');
        
        const formData = new FormData(form);
        console.log('FormData entries:');
        for (let [key, value] of formData.entries()) {
            console.log(`${key}: ${value}`);
        }
        
        // Check specific fields
        console.log('Featured in FormData:', formData.get('featured'));
        console.log('Status in FormData:', formData.get('status'));
        
        // Check if featured checkbox is checked
        if (featuredCheckbox) {
            console.log('Featured checkbox checked during submit:', featuredCheckbox.checked);
        }
        
        if (statusSelect) {
            console.log('Status select value during submit:', statusSelect.value);
        }
    });
}

// 3. Check React state (if accessible)
console.log('=== REACT STATE DEBUG ===');
console.log('Check browser console for React DevTools or component logs');

// 4. Monitor network requests
console.log('=== NETWORK DEBUG ===');
console.log('Watch the Network tab for the PATCH request to see what data is being sent');

console.log('=== END DEBUG SCRIPT ==='); 