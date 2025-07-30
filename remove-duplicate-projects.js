// Script to remove duplicate projects
console.log('🔄 REMOVING DUPLICATE PROJECTS...');
console.log('=====================================');

try {
  const storedProjects = localStorage.getItem('portfolio_projects');
  if (storedProjects) {
    const projects = JSON.parse(storedProjects);
    console.log(`📊 Before: ${projects.length} projects`);
    
    // Remove duplicates by keeping only the first occurrence of each title
    const uniqueProjects = projects.filter((project, index, self) => 
      index === self.findIndex(p => p.title === project.title)
    );
    
    console.log(`📊 After: ${uniqueProjects.length} projects`);
    console.log(`✅ Removed: ${projects.length - uniqueProjects.length} duplicates`);
    
    // Save the unique projects
    localStorage.setItem('portfolio_projects', JSON.stringify(uniqueProjects));
    localStorage.setItem('portfolio_projects_backup', JSON.stringify(uniqueProjects));
    
    console.log('');
    console.log('📋 Remaining unique projects:');
    uniqueProjects.forEach((project, index) => {
      console.log(`${index + 1}. ${project.title} (${project.status}) - Featured: ${project.featured}`);
    });
    
    console.log('');
    console.log('🔄 Refreshing page in 3 seconds to see changes...');
    setTimeout(() => {
      window.location.reload();
    }, 3000);
    
  } else {
    console.log('❌ No projects found in localStorage');
  }
} catch (error) {
  console.error('❌ Error removing duplicates:', error);
}

console.log('');
console.log('💡 Expected result:');
console.log('- Only unique projects should remain');
console.log('- No more duplicate entries');
console.log('- Clean portfolio display'); 