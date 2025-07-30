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

// Check for existing data in various storage locations
export const recoverExistingData = (): RecoveredProject[] => {
  const recoveredProjects: RecoveredProject[] = [];
  
  // Check localStorage for existing projects
  try {
    const stored = localStorage.getItem('portfolio_projects');
    if (stored) {
      const projects = JSON.parse(stored);
      console.log('DataRecovery: Found projects in localStorage:', projects.length);
      recoveredProjects.push(...projects);
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
      // Only add projects that aren't already in recoveredProjects
      projects.forEach((project: RecoveredProject) => {
        if (!recoveredProjects.find(p => p.id === project.id)) {
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
              if (!recoveredProjects.find(p => p.id === project.id)) {
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
  
  console.log('DataRecovery: Total recovered projects:', recoveredProjects.length);
  return recoveredProjects;
};

// Save recovered data to primary storage
export const saveRecoveredData = (projects: RecoveredProject[]): void => {
  try {
    localStorage.setItem('portfolio_projects', JSON.stringify(projects));
    localStorage.setItem('portfolio_projects_backup', JSON.stringify(projects));
    console.log('DataRecovery: Saved', projects.length, 'projects to storage');
  } catch (error) {
    console.error('DataRecovery: Error saving recovered data:', error);
  }
};

// Merge recovered data with sample data
export const mergeWithSampleData = (recoveredProjects: RecoveredProject[]): RecoveredProject[] => {
  const sampleProjects: RecoveredProject[] = [
    {
      id: '1',
      title: 'HYPAR PORTABLES',
      slug: 'hypar-portables',
      subtitle: 'Robotic Assembly of Lightweight Cork Modules for Adaptive Urbanism',
      description: 'Hypar Portables is a robotically fabricated, modular seating system created using natural cork panels. The project explores adaptive urbanism through lightweight, sustainable materials and robotic assembly techniques.',
      content: 'HYPAR PORTABLES\nRobotic Assembly of Lightweight Cork Modules for Adaptive Urbanism\n\nThis innovative project explores the intersection of robotic fabrication, sustainable materials, and adaptive urban design. Using natural cork panels, we created a modular seating system that can be robotically assembled and adapted to various urban contexts.',
      image_url: '',
      project_images: [],
      technologies: ['Rhino', 'Grasshopper', 'Python', 'Robotics', 'Cork Materials'],
      github_url: '',
      live_url: '',
      featured: true,
      status: 'published',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    },
    {
      id: '2',
      title: 'R&E - BioFoam Thermal Performance',
      slug: 'biofoam-thermal-performance',
      subtitle: 'Investigating Porosity & Thermal Insulation in Banana-Agar Based Bioplastics',
      description: 'This project investigates the thermal performance of bio-based materials by experimenting with bioplastics derived from banana and agar. The research focuses on porosity optimization for thermal insulation applications.',
      content: 'R&E - BIOFOAM THERMAL PERFORMANCE\nInvestigating Porosity & Thermal Insulation in Banana-Agar Based Bioplastics\n\nThis research project explores the thermal properties of bio-based materials, specifically focusing on bioplastics derived from banana and agar. The study investigates how porosity affects thermal insulation performance in sustainable building materials.',
      image_url: '',
      project_images: [],
      technologies: ['Material Science', 'Thermal Analysis', 'Bio-materials', 'Research'],
      github_url: '',
      live_url: '',
      featured: true,
      status: 'published',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    },
    {
      id: '3',
      title: 'Blasters Park: Multi-Functional Stadium Complex',
      slug: 'blasters-park-stadium',
      subtitle: 'Bachelor Thesis Project - 52 Acres of Integrated Design Thinking',
      description: 'A 52-acre urban-scale stadium and recreational complex designed as a comprehensive thesis project. The development integrates multiple functions within a cohesive urban framework.',
      content: 'BLASTERS PARK: MULTI-FUNCTIONAL STADIUM COMPLEX\nBachelor Thesis Project - 52 Acres of Integrated Design Thinking\n\nThis comprehensive thesis project explores the design of a 52-acre urban-scale stadium and recreational complex. The project demonstrates integrated design thinking across multiple scales, from urban planning to architectural detail.',
      image_url: '',
      project_images: [],
      technologies: ['AutoCAD', 'SketchUp', 'Urban Planning', 'Architectural Design'],
      github_url: '',
      live_url: '',
      featured: true,
      status: 'published',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }
  ];
  
  // Merge recovered projects with sample data
  const mergedProjects = [...recoveredProjects];
  
  // Add sample projects only if they don't already exist
  sampleProjects.forEach(sampleProject => {
    if (!mergedProjects.find(p => p.title === sampleProject.title)) {
      mergedProjects.push(sampleProject);
    }
  });
  
  return mergedProjects;
};

// Initialize data recovery
export const initializeDataRecovery = (): RecoveredProject[] => {
  console.log('DataRecovery: Starting data recovery process...');
  
  // Recover existing data
  const recoveredProjects = recoverExistingData();
  
  // Merge with sample data
  const mergedProjects = mergeWithSampleData(recoveredProjects);
  
  // Save merged data
  saveRecoveredData(mergedProjects);
  
  console.log('DataRecovery: Recovery process completed. Total projects:', mergedProjects.length);
  return mergedProjects;
}; 