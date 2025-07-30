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

// Initialize data recovery - only use sample data if NO good projects exist
export const initializeDataRecovery = (): RecoveredProject[] => {
  console.log('DataRecovery: Starting data recovery process...');
  
  // Recover existing data (only good projects)
  const recoveredProjects = recoverExistingData();
  
  // Only use sample data if we have NO good projects at all
  if (recoveredProjects.length === 0) {
    console.log('DataRecovery: No good projects found, using sample data...');
    const sampleProjects: RecoveredProject[] = [
      {
        id: '1',
        title: 'Flow-SIGHT',
        slug: 'flow-sight',
        subtitle: 'Real-time Congestion Prediction Dashboard',
        description: 'AI-powered urban mobility analysis system using Graph Neural Networks to predict traffic patterns and optimize city flow in real-time.',
        content: 'FLOW-SIGHT\nPredictive Urban Mobility Intelligence\n\nAn advanced AI-powered urban mobility analysis system that leverages Graph Neural Networks to predict traffic patterns and optimize city flow in real-time. The system provides real-time congestion prediction, dynamic route optimization, and comprehensive urban mobility insights.',
        image_url: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=600&fit=crop',
        project_images: [],
        technologies: ['Python', 'TensorFlow', 'React', 'Node.js', 'PostgreSQL'],
        github_url: 'https://github.com/maheepmouli/flow-sight',
        live_url: 'https://flow-sight.demo.com',
        featured: true,
        status: 'published',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      },
      {
        id: '2',
        title: 'HYPAR PORTABLES',
        slug: 'hypar-portables',
        subtitle: 'Robotic Assembly of Lightweight Cork Modules for Adaptive Urbanism',
        description: 'Hypar Portables is a robotically fabricated, modular seating system created using natural cork panels. The project explores adaptive urbanism through lightweight, sustainable materials and robotic assembly techniques.',
        content: 'HYPAR PORTABLES\nRobotic Assembly of Lightweight Cork Modules for Adaptive Urbanism\n\nThis innovative project explores the intersection of robotic fabrication, sustainable materials, and adaptive urban design. Using natural cork panels, we created a modular seating system that can be robotically assembled and adapted to various urban contexts.',
        image_url: 'https://images.unsplash.com/photo-1541888946425-d81bb19240f5?w=800&h=600&fit=crop',
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
        id: '3',
        title: 'R&E - BioFoam Thermal Performance',
        slug: 'biofoam-thermal-performance',
        subtitle: 'Investigating Porosity & Thermal Insulation in Banana-Agar Based Bioplastics',
        description: 'This project investigates the thermal performance of bio-based materials by experimenting with bioplastics derived from banana and agar. The research focuses on porosity optimization for thermal insulation applications.',
        content: 'R&E - BIOFOAM THERMAL PERFORMANCE\nInvestigating Porosity & Thermal Insulation in Banana-Agar Based Bioplastics\n\nThis research project explores the thermal properties of bio-based materials, specifically focusing on bioplastics derived from banana and agar. The study investigates how porosity affects thermal insulation performance in sustainable building materials.',
        image_url: 'https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=800&h=600&fit=crop',
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
        id: '4',
        title: 'Blasters Park: Multi-Functional Stadium Complex',
        slug: 'blasters-park-stadium',
        subtitle: 'Bachelor Thesis Project - 52 Acres of Integrated Design Thinking',
        description: 'A 52-acre urban-scale stadium and recreational complex designed as a comprehensive thesis project. The development integrates multiple functions within a cohesive urban framework.',
        content: 'BLASTERS PARK: MULTI-FUNCTIONAL STADIUM COMPLEX\nBachelor Thesis Project - 52 Acres of Integrated Design Thinking\n\nThis comprehensive thesis project explores the design of a 52-acre urban-scale stadium and recreational complex. The project demonstrates integrated design thinking across multiple scales, from urban planning to architectural detail.',
        image_url: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=600&fit=crop',
        project_images: [],
        technologies: ['AutoCAD', 'SketchUp', 'Urban Planning', 'Architectural Design'],
        github_url: '',
        live_url: '',
        featured: true,
        status: 'published',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      },
      {
        id: '5',
        title: 'WOOD-ID',
        slug: 'wood-id',
        subtitle: 'ML-driven Wood Optimization & Fabrication Pipeline',
        description: 'WOOD-ID is a machine learning-driven wood optimization and fabrication pipeline that uses advanced algorithms to optimize wood cutting patterns and fabrication processes.',
        content: 'WOOD-ID\nML-driven Wood Optimization & Fabrication Pipeline\n\nThis innovative project combines machine learning with traditional woodworking techniques to create an optimized fabrication pipeline. The system uses advanced algorithms to optimize wood cutting patterns, reduce waste, and improve efficiency in wood fabrication processes.',
        image_url: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&h=600&fit=crop',
        project_images: [],
        technologies: ['Machine Learning', 'Python', 'Grasshopper3D', 'KUKA|prc', 'C# Scripting'],
        github_url: '',
        live_url: '',
        featured: true,
        status: 'published',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      },
      {
        id: '6',
        title: 'KHC-HOSPITAL',
        slug: 'khc-hospital',
        subtitle: '14,000 m² Multidisciplinary Healthcare Complex - India',
        description: 'A comprehensive healthcare facility designed to provide multidisciplinary medical services in a modern, patient-centered environment.',
        content: 'KHC-HOSPITAL\n14,000 m² Multidisciplinary Healthcare Complex - India\n\nThis comprehensive healthcare facility is designed to provide multidisciplinary medical services in a modern, patient-centered environment. The project demonstrates advanced healthcare architecture with integrated technology and sustainable design principles.',
        image_url: 'https://images.unsplash.com/photo-1551076805-e1869033e561?w=800&h=600&fit=crop',
        project_images: [],
        technologies: ['Revit', 'AutoCAD', 'BIM', 'Healthcare Design', 'Sustainable Architecture'],
        github_url: '',
        live_url: '',
        featured: true,
        status: 'published',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }
    ];
    
    saveRecoveredData(sampleProjects);
    console.log('DataRecovery: Recovery process completed. Total projects:', sampleProjects.length);
    return sampleProjects;
  }
  
  // If we have good projects, just save them as they are
  console.log('DataRecovery: Found existing good projects, preserving them...');
  saveRecoveredData(recoveredProjects);
  console.log('DataRecovery: Recovery process completed. Total projects:', recoveredProjects.length);
  return recoveredProjects;
}; 