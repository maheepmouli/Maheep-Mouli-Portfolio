// Test script to verify project settings are working
// Run this in your browser console on your website

// Test 1: Check if featured projects are being saved
async function testFeaturedProjects() {
  console.log('🧪 Testing Featured Projects...');
  
  try {
    // Get all projects
    const response = await fetch('/api/projects'); // Adjust URL as needed
    const projects = await response.json();
    
    console.log('📊 All projects:', projects);
    
    // Check featured projects
    const featuredProjects = projects.filter(p => p.featured);
    console.log('⭐ Featured projects:', featuredProjects);
    
    if (featuredProjects.length > 0) {
      console.log('✅ Featured projects are working!');
    } else {
      console.log('❌ No featured projects found');
    }
    
    return featuredProjects;
  } catch (error) {
    console.error('❌ Error testing featured projects:', error);
    return [];
  }
}

// Test 2: Check if status is being saved
async function testProjectStatus() {
  console.log('🧪 Testing Project Status...');
  
  try {
    // Get all projects
    const response = await fetch('/api/projects'); // Adjust URL as needed
    const projects = await response.json();
    
    // Check projects by status
    const publishedProjects = projects.filter(p => p.status === 'published');
    const draftProjects = projects.filter(p => p.status === 'draft');
    
    console.log('📊 Published projects:', publishedProjects);
    console.log('📊 Draft projects:', draftProjects);
    
    if (publishedProjects.length > 0 || draftProjects.length > 0) {
      console.log('✅ Project status is working!');
    } else {
      console.log('❌ No projects with status found');
    }
    
    return { published: publishedProjects, draft: draftProjects };
  } catch (error) {
    console.error('❌ Error testing project status:', error);
    return { published: [], draft: [] };
  }
}

// Test 3: Check database schema
async function testDatabaseSchema() {
  console.log('🧪 Testing Database Schema...');
  
  try {
    // This would need to be run in Supabase SQL Editor
    console.log('📋 Run this in Supabase SQL Editor:');
    console.log(`
      SELECT column_name, data_type, is_nullable, column_default
      FROM information_schema.columns 
      WHERE table_name = 'projects' 
      ORDER BY ordinal_position;
    `);
    
    console.log('📋 Check if featured column exists:');
    console.log(`
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_name = 'projects' AND column_name = 'featured';
    `);
    
    console.log('📋 Check if status column exists:');
    console.log(`
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_name = 'projects' AND column_name = 'status';
    `);
    
  } catch (error) {
    console.error('❌ Error testing database schema:', error);
  }
}

// Test 4: Create a test project with featured and status
async function createTestProject() {
  console.log('🧪 Creating Test Project...');
  
  try {
    const testProject = {
      title: 'Test Project - ' + new Date().toISOString(),
      description: 'This is a test project to verify settings',
      content: 'Test content',
      image_url: '',
      featured: true,
      status: 'published',
      technologies: ['Test'],
      tags: ['test'],
      slug: 'test-project-' + Date.now()
    };
    
    console.log('📝 Test project data:', testProject);
    
    // This would need to be implemented based on your API
    console.log('💡 To test this, create a project through your form with:');
    console.log('- Featured: true');
    console.log('- Status: published');
    console.log('- Then check if it appears in featured projects');
    
  } catch (error) {
    console.error('❌ Error creating test project:', error);
  }
}

// Run all tests
async function runAllTests() {
  console.log('🚀 Starting Project Settings Tests...');
  console.log('=====================================');
  
  await testFeaturedProjects();
  console.log('---');
  
  await testProjectStatus();
  console.log('---');
  
  testDatabaseSchema();
  console.log('---');
  
  createTestProject();
  console.log('---');
  
  console.log('✅ All tests completed!');
}

// Run tests when script is loaded
runAllTests(); 