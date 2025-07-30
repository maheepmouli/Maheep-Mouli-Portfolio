// Debug script for featured project settings
// Run this in your browser console to check what's happening

// Debug function to check project data
async function debugFeaturedSettings() {
  console.log('🔍 Debugging Featured Project Settings...');
  
  try {
    // Get all projects from the service
    console.log('📊 Fetching projects from unifiedProjectsService...');
    
    // This would need to be adapted to your actual service call
    // For now, let's check what we can from the browser
    
    // Check if we can access the service
    if (window.unifiedProjectsService) {
      const projects = await window.unifiedProjectsService.getAllProjects();
      console.log('📋 All projects:', projects);
      
      // Check featured projects
      const featuredProjects = projects.filter(p => p.featured === true);
      console.log('⭐ Featured projects found:', featuredProjects.length);
      console.log('⭐ Featured projects:', featuredProjects);
      
      // Check projects with featured = false
      const nonFeaturedProjects = projects.filter(p => p.featured === false);
      console.log('📋 Non-featured projects:', nonFeaturedProjects.length);
      
      // Check projects with featured = null/undefined
      const nullFeaturedProjects = projects.filter(p => p.featured === null || p.featured === undefined);
      console.log('❌ Projects with null/undefined featured:', nullFeaturedProjects.length);
      
    } else {
      console.log('❌ unifiedProjectsService not available in window object');
    }
    
  } catch (error) {
    console.error('❌ Error debugging featured settings:', error);
  }
}

// Debug function to check form data
function debugFormData() {
  console.log('🔍 Debugging Form Data...');
  
  // Check if we can find the form on the page
  const form = document.querySelector('form');
  if (form) {
    console.log('📝 Form found:', form);
    
    // Check for featured checkbox
    const featuredCheckbox = document.querySelector('input[name="featured"], input[id="featured"]');
    if (featuredCheckbox) {
      console.log('✅ Featured checkbox found:', featuredCheckbox);
      console.log('✅ Featured checkbox checked:', featuredCheckbox.checked);
      console.log('✅ Featured checkbox value:', featuredCheckbox.value);
    } else {
      console.log('❌ Featured checkbox not found');
    }
    
    // Check for status dropdown
    const statusSelect = document.querySelector('select[name="status"], select[id="status"]');
    if (statusSelect) {
      console.log('✅ Status select found:', statusSelect);
      console.log('✅ Status select value:', statusSelect.value);
    } else {
      console.log('❌ Status select not found');
    }
  } else {
    console.log('❌ No form found on page');
  }
}

// Debug function to check database directly
async function debugDatabase() {
  console.log('🔍 Debugging Database...');
  
  try {
    // Try to fetch projects from your API endpoint
    const response = await fetch('/api/projects');
    if (response.ok) {
      const projects = await response.json();
      console.log('📊 Projects from API:', projects);
      
      // Check featured projects
      const featuredProjects = projects.filter(p => p.featured === true);
      console.log('⭐ Featured projects from API:', featuredProjects);
      
    } else {
      console.log('❌ API endpoint not available');
    }
  } catch (error) {
    console.log('❌ Could not fetch from API:', error.message);
  }
}

// Debug function to check localStorage
function debugLocalStorage() {
  console.log('🔍 Debugging LocalStorage...');
  
  try {
    const keys = Object.keys(localStorage);
    const projectKeys = keys.filter(key => key.includes('project'));
    console.log('📋 Project-related localStorage keys:', projectKeys);
    
    projectKeys.forEach(key => {
      try {
        const data = JSON.parse(localStorage.getItem(key));
        console.log(`📋 ${key}:`, data);
      } catch (e) {
        console.log(`📋 ${key}: (not JSON)`, localStorage.getItem(key));
      }
    });
  } catch (error) {
    console.error('❌ Error checking localStorage:', error);
  }
}

// Main debug function
async function runDebug() {
  console.log('🚀 Starting Featured Settings Debug...');
  console.log('=====================================');
  
  debugFormData();
  console.log('---');
  
  debugLocalStorage();
  console.log('---');
  
  await debugDatabase();
  console.log('---');
  
  await debugFeaturedSettings();
  console.log('---');
  
  console.log('✅ Debug completed!');
}

// Run debug when script is loaded
runDebug(); 