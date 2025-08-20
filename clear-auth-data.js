// Clear Authentication Data
// Run this in your browser console if you're experiencing authentication issues

console.log('🧹 Clearing authentication data...');

// Clear all portfolio-related localStorage items
const keysToRemove = [
  'portfolio_user',
  'portfolio_last_login',
  'unified_portfolio_projects_backup',
  'portfolio_projects_cache'
];

let clearedCount = 0;
keysToRemove.forEach(key => {
  if (localStorage.getItem(key)) {
    localStorage.removeItem(key);
    console.log(`✅ Cleared: ${key}`);
    clearedCount++;
  } else {
    console.log(`ℹ️ Not found: ${key}`);
  }
});

// Clear any sessionStorage items
const sessionKeysToRemove = [
  'blog_posts',
  'blogs', 
  'blog_data',
  'portfolio_data'
];

sessionKeysToRemove.forEach(key => {
  if (sessionStorage.getItem(key)) {
    sessionStorage.removeItem(key);
    console.log(`✅ Cleared session: ${key}`);
    clearedCount++;
  }
});

console.log(`🧹 Authentication cleanup complete. Cleared ${clearedCount} items.`);

// Reload the page to reset the React state
console.log('🔄 Reloading page to reset application state...');
setTimeout(() => {
  window.location.reload();
}, 1000);
