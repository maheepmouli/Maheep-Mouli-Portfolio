// Script to fix user ID in localStorage
console.log('🔧 FIXING USER ID...');
console.log('=====================================');

try {
  // Check current user data
  const storedUser = localStorage.getItem('portfolio_user');
  if (storedUser) {
    const userData = JSON.parse(storedUser);
    console.log('📊 Current user data:', userData);
    
    // Fix the user ID to proper UUID
    const fixedUserData = {
      ...userData,
      id: '550e8400-e29b-41d4-a716-446655440000' // Proper UUID
    };
    
    // Save the fixed user data
    localStorage.setItem('portfolio_user', JSON.stringify(fixedUserData));
    
    console.log('✅ Fixed user data:', fixedUserData);
    console.log('');
    console.log('🔄 Refreshing page in 3 seconds...');
    setTimeout(() => {
      window.location.reload();
    }, 3000);
    
  } else {
    console.log('❌ No user data found in localStorage');
    console.log('💡 You may need to log in again');
  }
} catch (error) {
  console.error('❌ Error fixing user ID:', error);
}

console.log('');
console.log('💡 After refresh, try creating a blog post again');
console.log('The user ID should now be a proper UUID format'); 