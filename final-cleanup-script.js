// FINAL COMPREHENSIVE CLEANUP SCRIPT
console.log('🧹 FINAL PROJECT CLEANUP...');
console.log('=====================================');

// List of projects to KEEP (the 6 good ones)
const GOOD_PROJECTS = [
  "HYPAR PORTABLES",
  "R&E – BioFoam Thermal Performance", 
  "Blasters Park: Multi-Functional Stadium Complex",
  "KHC-HOSPITAL",
  "WOOD-ID",
  "Flow-SIGHT"
];

console.log('📋 Projects to KEEP:');
GOOD_PROJECTS.forEach((title, index) => {
  console.log(`${index + 1}. ${title}`);
});

console.log('');
console.log('🔄 Starting comprehensive cleanup...');

try {
  // 1. Clean localStorage
  const storedProjects = localStorage.getItem('portfolio_projects');
  if (storedProjects) {
    const projects = JSON.parse(storedProjects);
    console.log(`📊 localStorage before: ${projects.length} projects`);
    
    // Keep only the good projects
    const filteredProjects = projects.filter(project => 
      GOOD_PROJECTS.includes(project.title)
    );
    
    console.log(`📊 localStorage after: ${filteredProjects.length} projects`);
    
    // Save cleaned data
    localStorage.setItem('portfolio_projects', JSON.stringify(filteredProjects));
    localStorage.setItem('portfolio_projects_backup', JSON.stringify(filteredProjects));
  }
  
  // 2. Clean all other localStorage keys that might contain project data
  const allKeys = Object.keys(localStorage);
  const projectKeys = allKeys.filter(key => 
    key.includes('project') || 
    key.includes('portfolio') || 
    key.includes('data')
  );
  
  console.log(`🔍 Found ${projectKeys.length} potential project-related keys:`, projectKeys);
  
  // Clear any other project-related data
  projectKeys.forEach(key => {
    if (key !== 'portfolio_projects' && key !== 'portfolio_projects_backup') {
      try {
        const data = localStorage.getItem(key);
        if (data) {
          const parsed = JSON.parse(data);
          if (Array.isArray(parsed) && parsed.length > 0 && parsed[0].title) {
            console.log(`🗑️  Clearing ${key} (${parsed.length} projects)`);
            localStorage.removeItem(key);
          }
        }
      } catch (error) {
        console.log(`Error processing ${key}:`, error.message);
      }
    }
  });
  
  // 3. Force clear any cached data
  console.log('🗑️  Clearing any cached data...');
  if (typeof window !== 'undefined') {
    // Clear any in-memory caches
    if (window.projectCache) {
      delete window.projectCache;
    }
    if (window.projectsData) {
      delete window.projectsData;
    }
  }
  
  console.log('');
  console.log('✅ CLEANUP COMPLETE!');
  console.log('');
  console.log('📋 Final projects in localStorage:');
  const finalProjects = JSON.parse(localStorage.getItem('portfolio_projects') || '[]');
  finalProjects.forEach((project, index) => {
    console.log(`${index + 1}. ${project.title} (${project.status})`);
  });
  
  console.log('');
  console.log('🔄 Refreshing page in 3 seconds...');
  setTimeout(() => {
    window.location.reload();
  }, 3000);
  
} catch (error) {
  console.error('❌ Error during cleanup:', error);
}

console.log('');
console.log('💡 Expected result:');
console.log('- Only 6 good projects should remain');
console.log('- All duplicates and unwanted projects removed');
console.log('- Clean portfolio display');
console.log('');
console.log('🎯 After refresh, you should see exactly 6 projects:');
GOOD_PROJECTS.forEach((title, index) => {
  console.log(`${index + 1}. ${title}`);
}); 