// Script to check projects in localStorage and Supabase
console.log('🔍 Checking projects in localStorage and Supabase...\n');

// Check localStorage projects
console.log('📦 LOCALSTORAGE PROJECTS:');
try {
  const storedProjects = localStorage.getItem('portfolio_projects');
  if (storedProjects) {
    const projects = JSON.parse(storedProjects);
    console.log(`Found ${projects.length} projects in localStorage:`);
    projects.forEach((project, index) => {
      console.log(`${index + 1}. ${project.title} (${project.slug}) - Status: ${project.status} - Featured: ${project.featured}`);
    });
  } else {
    console.log('No projects found in localStorage');
  }
} catch (error) {
  console.error('Error reading localStorage:', error);
}

console.log('\n📦 LOCALSTORAGE BACKUP:');
try {
  const backupProjects = localStorage.getItem('portfolio_projects_backup');
  if (backupProjects) {
    const projects = JSON.parse(backupProjects);
    console.log(`Found ${projects.length} projects in backup:`);
    projects.forEach((project, index) => {
      console.log(`${index + 1}. ${project.title} (${project.slug}) - Status: ${project.status} - Featured: ${project.featured}`);
    });
  } else {
    console.log('No projects found in backup');
  }
} catch (error) {
  console.error('Error reading backup:', error);
}

console.log('\n🔍 CHECKING ALL LOCALSTORAGE KEYS:');
try {
  const allKeys = Object.keys(localStorage);
  const projectKeys = allKeys.filter(key => key.includes('project') || key.includes('portfolio'));
  console.log('Keys containing "project" or "portfolio":', projectKeys);
  
  projectKeys.forEach(key => {
    try {
      const data = localStorage.getItem(key);
      if (data) {
        const parsed = JSON.parse(data);
        if (Array.isArray(parsed) && parsed.length > 0 && parsed[0].title) {
          console.log(`\n📁 ${key}: ${parsed.length} projects`);
          parsed.forEach((project, index) => {
            console.log(`  ${index + 1}. ${project.title} (${project.slug}) - Status: ${project.status} - Featured: ${project.featured}`);
          });
        }
      }
    } catch (error) {
      console.log(`Error reading ${key}:`, error.message);
    }
  });
} catch (error) {
  console.error('Error checking localStorage keys:', error);
}

console.log('\n🌐 SUPABASE PROJECTS:');
console.log('To check Supabase projects, run this in your browser console:');
console.log(`
// Check Supabase projects
async function checkSupabaseProjects() {
  try {
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error('Supabase error:', error);
      return;
    }
    
    console.log('Found', data.length, 'projects in Supabase:');
    data.forEach((project, index) => {
      console.log(\`\${index + 1}. \${project.title} (\${project.slug}) - Status: \${project.status} - Featured: \${project.featured}\`);
    });
  } catch (error) {
    console.error('Error checking Supabase:', error);
  }
}

checkSupabaseProjects();
`);

console.log('\n📊 SUMMARY:');
console.log('1. Check the localStorage projects above');
console.log('2. Run the Supabase check code in your browser console');
console.log('3. Compare the results to see what projects exist where'); 