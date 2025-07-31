// Data Recovery Utility
// This utility helps preserve and restore uploaded content

export interface RecoveredProject {
  id: string;
  title: string;
  slug: string;
  subtitle?: string;
  description: string;
  content: string;
  image_url: string;
  project_images?: string[];
  technologies: string[];
  github_url?: string;
  live_url?: string;
  featured: boolean;
  status?: string;
  created_at: string;
  updated_at: string;
}

// List of projects to KEEP (the 6 good ones)
const GOOD_PROJECTS = [
  "HYPAR PORTABLES",
  "R&E – BioFoam Thermal Performance", 
  "Blasters Park: Multi-Functional Stadium Complex",
  "KHC-HOSPITAL",
  "WOOD-ID",
  "Flow-SIGHT"
];

// Check for existing data in various storage locations
export const recoverExistingData = (): RecoveredProject[] => {
  const recoveredProjects: RecoveredProject[] = [];
  
  // Check localStorage for existing projects
  try {
    const stored = localStorage.getItem('portfolio_projects');
    if (stored) {
      const projects = JSON.parse(stored);
      console.log('DataRecovery: Found projects in localStorage:', projects.length);
      // Only keep good projects
      const goodProjects = projects.filter((project: RecoveredProject) => 
        GOOD_PROJECTS.includes(project.title)
      );
      recoveredProjects.push(...goodProjects);
    }
  } catch (error) {
    console.error('DataRecovery: Error reading localStorage:', error);
  }
  
  // Check backup storage
  try {
    const backup = localStorage.getItem('portfolio_projects_backup');
    if (backup) {
      const projects = JSON.parse(backup);
      console.log('DataRecovery: Found projects in backup:', projects.length);
      // Only add good projects that aren't already in recoveredProjects
      projects.forEach((project: RecoveredProject) => {
        if (GOOD_PROJECTS.includes(project.title) && !recoveredProjects.find(p => p.id === project.id)) {
          recoveredProjects.push(project);
        }
      });
    }
  } catch (error) {
    console.error('DataRecovery: Error reading backup:', error);
  }
  
  // Check for any other storage keys that might contain project data
  const storageKeys = Object.keys(localStorage);
  storageKeys.forEach(key => {
    if (key.includes('project') || key.includes('portfolio')) {
      try {
        const data = localStorage.getItem(key);
        if (data) {
          const parsed = JSON.parse(data);
          if (Array.isArray(parsed) && parsed.length > 0 && parsed[0].title) {
            console.log('DataRecovery: Found projects in', key, ':', parsed.length);
            parsed.forEach((project: RecoveredProject) => {
              if (GOOD_PROJECTS.includes(project.title) && !recoveredProjects.find(p => p.id === project.id)) {
                recoveredProjects.push(project);
              }
            });
          }
        }
      } catch (error) {
        console.error('DataRecovery: Error reading', key, ':', error);
      }
    }
  });
  
  console.log('DataRecovery: Total recovered good projects:', recoveredProjects.length);
  return recoveredProjects;
};

// Save recovered data to primary storage
export const saveRecoveredData = (projects: RecoveredProject[]): void => {
  try {
    localStorage.setItem('portfolio_projects', JSON.stringify(projects));
    localStorage.setItem('portfolio_projects_backup', JSON.stringify(projects));
    console.log('DataRecovery: Saved', projects.length, 'good projects to storage');
  } catch (error) {
    console.error('DataRecovery: Error saving recovered data:', error);
  }
};

// Initialize data recovery - FORCE CLEAN DATA
export const initializeDataRecovery = (): RecoveredProject[] => {
  console.log('DataRecovery: Starting FORCED data recovery process...');
  
  // START WITH EMPTY PORTFOLIO - Allow project creation
  console.log('DataRecovery: Starting with empty portfolio - allowing project creation...');
  
  // Check if there are any existing projects in localStorage
  const existingProjects = recoverExistingData();
  
  if (existingProjects.length > 0) {
    console.log('DataRecovery: Found existing projects, preserving them...');
    saveRecoveredData(existingProjects);
    return existingProjects;
  }
  
  // Start with empty portfolio
  const sampleProjects: RecoveredProject[] = [];
  
  // Clear any existing data first
  try {
    Object.keys(localStorage).forEach(key => {
      if (key.includes('project') || key.includes('portfolio')) {
        localStorage.removeItem(key);
        console.log('DataRecovery: Cleared old data:', key);
      }
    });
  } catch (error) {
    console.error('DataRecovery: Error clearing old data:', error);
  }
  
  // Save clean data
  saveRecoveredData(sampleProjects);
  console.log('DataRecovery: FORCED recovery completed. Total projects:', sampleProjects.length);
  return sampleProjects;
}; 