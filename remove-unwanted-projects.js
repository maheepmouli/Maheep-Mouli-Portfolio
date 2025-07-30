// Script to identify and remove unwanted projects
console.log('🔍 CURRENT PROJECTS IN LOCALSTORAGE:');
console.log('=====================================');

try {
  const storedProjects = localStorage.getItem('portfolio_projects');
  if (storedProjects) {
    const projects = JSON.parse(storedProjects);
    console.log(`Found ${projects.length} projects:`);
    console.log('');
    
    projects.forEach((project, index) => {
      console.log(`${index + 1}. ${project.title}`);
      console.log(`   Slug: ${project.slug}`);
      console.log(`   Status: ${project.status}`);
      console.log(`   Featured: ${project.featured}`);
      console.log(`   ID: ${project.id}`);
      console.log('');
    });
    
    console.log('📝 TO REMOVE PROJECTS:');
    console.log('1. Copy the project IDs you want to remove');
    console.log('2. Run the removeProjects function below with those IDs');
    console.log('');
    console.log('Example: removeProjects(["project-id-1", "project-id-2"])');
    
  } else {
    console.log('No projects found in localStorage');
  }
} catch (error) {
  console.error('Error reading localStorage:', error);
}

// Function to remove projects by ID
function removeProjects(projectIdsToRemove) {
  try {
    const storedProjects = localStorage.getItem('portfolio_projects');
    if (storedProjects) {
      const projects = JSON.parse(storedProjects);
      const filteredProjects = projects.filter(project => !projectIdsToRemove.includes(project.id));
      
      localStorage.setItem('portfolio_projects', JSON.stringify(filteredProjects));
      localStorage.setItem('portfolio_projects_backup', JSON.stringify(filteredProjects));
      
      console.log(`✅ Removed ${projectIdsToRemove.length} projects`);
      console.log(`📊 Remaining projects: ${filteredProjects.length}`);
      console.log('');
      console.log('Remaining projects:');
      filteredProjects.forEach((project, index) => {
        console.log(`${index + 1}. ${project.title} (${project.id})`);
      });
      
      // Refresh the page to see changes
      console.log('');
      console.log('🔄 Refreshing page in 3 seconds...');
      setTimeout(() => {
        window.location.reload();
      }, 3000);
      
    } else {
      console.log('No projects found to remove');
    }
  } catch (error) {
    console.error('Error removing projects:', error);
  }
}

// Function to remove projects by title
function removeProjectsByTitle(projectTitlesToRemove) {
  try {
    const storedProjects = localStorage.getItem('portfolio_projects');
    if (storedProjects) {
      const projects = JSON.parse(storedProjects);
      const filteredProjects = projects.filter(project => !projectTitlesToRemove.includes(project.title));
      
      localStorage.setItem('portfolio_projects', JSON.stringify(filteredProjects));
      localStorage.setItem('portfolio_projects_backup', JSON.stringify(filteredProjects));
      
      console.log(`✅ Removed ${projectTitlesToRemove.length} projects`);
      console.log(`📊 Remaining projects: ${filteredProjects.length}`);
      console.log('');
      console.log('Remaining projects:');
      filteredProjects.forEach((project, index) => {
        console.log(`${index + 1}. ${project.title} (${project.id})`);
      });
      
      // Refresh the page to see changes
      console.log('');
      console.log('🔄 Refreshing page in 3 seconds...');
      setTimeout(() => {
        window.location.reload();
      }, 3000);
      
    } else {
      console.log('No projects found to remove');
    }
  } catch (error) {
    console.error('Error removing projects:', error);
  }
}

console.log('');
console.log('💡 USAGE:');
console.log('1. To remove by ID: removeProjects(["id1", "id2", "id3"])');
console.log('2. To remove by title: removeProjectsByTitle(["Title 1", "Title 2"])');
console.log('');
console.log('⚠️  WARNING: This will permanently remove projects from localStorage');
console.log('Make sure you have a backup before proceeding!'); 