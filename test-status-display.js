// Test Status Display
// Run this in your browser console to test status functionality

console.log('=== TESTING STATUS DISPLAY ===');

// 1. Check if status is being saved in the database
console.log('1. Database Status Check:');
console.log('- Go to your Supabase SQL Editor and run:');
console.log('SELECT id, title, status, featured FROM projects ORDER BY created_at DESC;');

// 2. Check if status is being loaded in the form
console.log('\n2. Form Status Check:');
console.log('- Go to a project edit page');
console.log('- Check if the status dropdown shows the current value');
console.log('- Try changing the status and saving');

// 3. Check if status is being displayed on project detail page
console.log('\n3. Project Detail Status Check:');
console.log('- Go to a project detail page');
console.log('- Look for status badge in the sidebar');
console.log('- Status should appear as a secondary badge');

// 4. Check if status is being displayed on portfolio page
console.log('\n4. Portfolio Status Check:');
console.log('- Go to the portfolio page');
console.log('- Look for status badges on project cards');
console.log('- Status should appear as a secondary badge');

// 5. Test the complete flow
console.log('\n5. Complete Flow Test:');
console.log('- Edit a project and change its status');
console.log('- Save the project');
console.log('- Check if status appears on portfolio page');
console.log('- Check if status appears on project detail page');

console.log('\n=== END TEST ==='); 