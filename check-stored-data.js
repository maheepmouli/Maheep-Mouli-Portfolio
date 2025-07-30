// Check what data is stored in localStorage
console.log('=== CHECKING LOCALSTORAGE DATA ===');

// Check all localStorage keys
console.log('All localStorage keys:');
for (let i = 0; i < localStorage.length; i++) {
  const key = localStorage.key(i);
  console.log(`Key ${i}: ${key}`);
}

// Check specific project-related keys
const keysToCheck = [
  'portfolio_projects',
  'portfolio_projects_backup',
  'projects',
  'projects_backup',
  'unified_projects',
  'unified_projects_backup'
];

console.log('\n=== CHECKING PROJECT DATA ===');
keysToCheck.forEach(key => {
  const data = localStorage.getItem(key);
  if (data) {
    try {
      const parsed = JSON.parse(data);
      console.log(`\n${key}:`);
      console.log(`- Type: ${typeof parsed}`);
      console.log(`- Length: ${Array.isArray(parsed) ? parsed.length : 'N/A'}`);
      if (Array.isArray(parsed) && parsed.length > 0) {
        console.log(`- Projects: ${parsed.map(p => p.title || 'Unknown').join(', ')}`);
        console.log(`- Sample project:`, parsed[0]);
      }
    } catch (e) {
      console.log(`${key}: Error parsing - ${e.message}`);
    }
  } else {
    console.log(`${key}: Not found`);
  }
});

console.log('\n=== DONE ==='); 