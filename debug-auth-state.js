// Debug Authentication State
// Run this in your browser console to check the current auth state

console.log('🔍 Debugging Authentication State...');

// Check localStorage
console.log('📦 localStorage contents:');
console.log('- portfolio_user:', localStorage.getItem('portfolio_user'));
console.log('- portfolio_last_login:', localStorage.getItem('portfolio_last_login'));

// Check if user data exists
const userData = localStorage.getItem('portfolio_user');
if (userData) {
  try {
    const parsed = JSON.parse(userData);
    console.log('✅ Parsed user data:', parsed);
    
    // Check if session is expired
    const lastLogin = localStorage.getItem('portfolio_last_login');
    if (lastLogin) {
      const loginTime = new Date(lastLogin).getTime();
      const currentTime = new Date().getTime();
      const sessionTimeout = 24 * 60 * 60 * 1000; // 24 hours
      const timeDiff = currentTime - loginTime;
      const isExpired = timeDiff > sessionTimeout;
      
      console.log('⏰ Session timing:');
      console.log('- Last login:', new Date(lastLogin).toLocaleString());
      console.log('- Current time:', new Date().toLocaleString());
      console.log('- Time difference:', Math.round(timeDiff / (1000 * 60 * 60)), 'hours');
      console.log('- Session expired:', isExpired);
      
      if (isExpired) {
        console.log('🚨 SESSION IS EXPIRED - should be cleared!');
        console.log('💡 To fix: localStorage.removeItem("portfolio_user"); localStorage.removeItem("portfolio_last_login");');
      }
    }
  } catch (error) {
    console.error('❌ Error parsing user data:', error);
  }
} else {
  console.log('❌ No user data found in localStorage');
}

// Check if we're on the portfolio page
if (window.location.pathname === '/portfolio') {
  console.log('📍 Currently on portfolio page');
  
  // Check if Add New Project button exists
  const addButton = document.querySelector('a[href="/portfolio/create"]');
  if (addButton) {
    console.log('🔘 Add New Project button found:', addButton);
    console.log('🔍 Button text:', addButton.textContent);
    console.log('🔍 Button visible:', addButton.offsetParent !== null);
  } else {
    console.log('✅ Add New Project button not found (good for visitors)');
  }
  
  // Check for admin action buttons
  const editButtons = document.querySelectorAll('a[href*="/portfolio/edit/"]');
  const deleteButtons = document.querySelectorAll('button[onclick*="delete"]');
  
  console.log('🔍 Admin buttons found:');
  console.log('- Edit buttons:', editButtons.length);
  console.log('- Delete buttons:', deleteButtons.length);
  
  if (editButtons.length > 0 || deleteButtons.length > 0) {
    console.log('🚨 ADMIN BUTTONS FOUND - should be hidden for visitors!');
  } else {
    console.log('✅ No admin buttons found (good for visitors)');
  }
}

// Check React component state (if available)
if (window.__REACT_DEVTOOLS_GLOBAL_HOOK__) {
  console.log('⚛️ React DevTools available');
  console.log('💡 Check the Components tab to see the current user state');
}

console.log('🔍 Debug complete. Check the output above for issues.');
