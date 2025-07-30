// Script to remove unwanted projects from portfolio
console.log('🗑️  REMOVING UNWANTED PROJECTS...');
console.log('=====================================');

// List of projects to remove (the unwanted ones)
const projectsToRemove = [
  "Flow-SIGHT - Urban traffic Analytics",
  "k", 
  "fed",
  "fxv dz",
  "gh ch.gch",
  "SLINSZID",
  "WSRDVFG",
  "Atelier24: KHC Hospital & Hotel",
  "Bioplastic Lab", 
  "Chopra Residence"
];

console.log('📋 Projects to remove:');
projectsToRemove.forEach((title, index) => {
  console.log(`${index + 1}. ${title}`);
});

console.log('');
console.log('🔄 Removing projects...');

try {
  const storedProjects = localStorage.getItem('portfolio_projects');
  if (storedProjects) {
    const projects = JSON.parse(storedProjects);
    console.log(`📊 Before: ${projects.length} projects`);
    
    // Filter out unwanted projects
    const filteredProjects = projects.filter(project => !projectsToRemove.includes(project.title));
    
    console.log(`📊 After: ${filteredProjects.length} projects`);
    console.log(`✅ Removed: ${projects.length - filteredProjects.length} projects`);
    
    // Save the filtered projects
    localStorage.setItem('portfolio_projects', JSON.stringify(filteredProjects));
    localStorage.setItem('portfolio_projects_backup', JSON.stringify(filteredProjects));
    
    console.log('');
    console.log('📋 Remaining projects:');
    filteredProjects.forEach((project, index) => {
      console.log(`${index + 1}. ${project.title} (${project.status})`);
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
  console.error('❌ Error removing projects:', error);
}

console.log('');
console.log('💡 Expected result:');
console.log('- Only 6 projects should remain');
console.log('- All generic/placeholder projects removed');
console.log('- Duplicate projects removed'); 