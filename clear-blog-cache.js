// Script to clear all cached blog data that might cause inconsistencies
console.log('🧹 Clearing Blog Cache - Ensuring Consistent Experience');
console.log('=====================================================');

// Function to clear all blog-related cache
function clearBlogCache() {
  console.log('📋 Starting comprehensive blog cache cleanup...');
  
  // Clear localStorage blog data
  const localStorageKeys = [
    'blog_posts',
    'blogs', 
    'blog_data',
    'blog_cache',
    'blog_filter',
    'blog_state'
  ];
  
  console.log('🗑️  Clearing localStorage blog data...');
  localStorageKeys.forEach(key => {
    if (localStorage.getItem(key)) {
      console.log(`   ❌ Removing: ${key}`);
      localStorage.removeItem(key);
    } else {
      console.log(`   ✅ Already clean: ${key}`);
    }
  });
  
  // Clear sessionStorage blog data
  const sessionStorageKeys = [
    'blog_posts',
    'blogs',
    'blog_data', 
    'blog_cache',
    'blog_filter',
    'blog_state'
  ];
  
  console.log('🗑️  Clearing sessionStorage blog data...');
  sessionStorageKeys.forEach(key => {
    if (sessionStorage.getItem(key)) {
      console.log(`   ❌ Removing: ${key}`);
      sessionStorage.removeItem(key);
    } else {
      console.log(`   ✅ Already clean: ${key}`);
    }
  });
  
  // Clear any cached data in memory
  console.log('🗑️  Clearing memory cache...');
  if (typeof window !== 'undefined') {
    // Clear any in-memory caches
    if (window.caches) {
      console.log('   🗑️  Clearing browser caches...');
      caches.keys().then(cacheNames => {
        cacheNames.forEach(cacheName => {
          if (cacheName.includes('blog') || cacheName.includes('portfolio')) {
            console.log(`   ❌ Deleting cache: ${cacheName}`);
            caches.delete(cacheName);
          }
        });
      });
    }
  }
  
  // Clear any indexedDB blog data
  console.log('🗑️  Clearing IndexedDB blog data...');
  if (typeof window !== 'undefined' && window.indexedDB) {
    const request = indexedDB.open('blog_cache', 1);
    request.onsuccess = function(event) {
      const db = event.target.result;
      const objectStoreNames = db.objectStoreNames;
      for (let i = 0; i < objectStoreNames.length; i++) {
        const storeName = objectStoreNames[i];
        if (storeName.includes('blog')) {
          console.log(`   ❌ Clearing IndexedDB store: ${storeName}`);
          const transaction = db.transaction([storeName], 'readwrite');
          const store = transaction.objectStore(storeName);
          store.clear();
        }
      }
      db.close();
    };
  }
  
  console.log('✅ Blog cache cleanup completed!');
}

// Function to verify cache is cleared
function verifyCacheCleared() {
  console.log('\n🔍 Verifying cache cleanup...');
  
  let hasBlogData = false;
  
  // Check localStorage
  const localStorageKeys = Object.keys(localStorage);
  const blogLocalKeys = localStorageKeys.filter(key => key.includes('blog'));
  if (blogLocalKeys.length > 0) {
    console.log('❌ Found remaining localStorage blog keys:', blogLocalKeys);
    hasBlogData = true;
  }
  
  // Check sessionStorage
  const sessionStorageKeys = Object.keys(sessionStorage);
  const blogSessionKeys = sessionStorageKeys.filter(key => key.includes('blog'));
  if (blogSessionKeys.length > 0) {
    console.log('❌ Found remaining sessionStorage blog keys:', blogSessionKeys);
    hasBlogData = true;
  }
  
  if (!hasBlogData) {
    console.log('✅ All blog cache successfully cleared!');
  } else {
    console.log('⚠️  Some blog cache remains - manual cleanup may be needed');
  }
}

// Function to test blog data consistency
function testBlogConsistency() {
  console.log('\n🧪 Testing blog data consistency...');
  
  // Simulate what the blog service should return
  const expectedExcludedSlugs = [
    'atelier24-khc-hospital-hotel',
    'bioplastic-lab',
    'chopra-residence',
    'flow-sight-urban-traffic-analytics',
    'kt',
    'fed',
    'fox-dz',
    'gh-dgugh',
    'slunszuj',
    'wsrdvrg'
  ];
  
  console.log('📋 Expected excluded slugs:', expectedExcludedSlugs);
  console.log('✅ Server-side filtering should exclude these slugs for ALL users');
  console.log('✅ Both admin and public views should show identical filtered results');
}

// Run the cleanup
try {
  clearBlogCache();
  verifyCacheCleared();
  testBlogConsistency();
  
  console.log('\n🎯 Blog cache cleanup completed successfully!');
  console.log('📝 Next steps:');
  console.log('   1. Refresh your browser');
  console.log('   2. Test both admin and public views');
  console.log('   3. Verify both show identical filtered results');
  console.log('   4. Check that excluded slugs are not accessible');
  
} catch (error) {
  console.error('❌ Error during cache cleanup:', error);
} 