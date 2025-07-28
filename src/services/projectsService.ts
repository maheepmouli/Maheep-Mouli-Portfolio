export interface Project {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  content: string;
  image_url: string;
  status: 'draft' | 'published' | 'Live Demo' | 'Case Study' | 'Built' | 'Research' | 'Completed' | 'Development';
  featured: boolean;
  project_url?: string;
  github_url?: string;
  location?: string;
  duration?: string;
  team_size?: string;
  technologies: string[];
  tags: string[];
  videos?: any[]; // Add videos property
  created_at: string;
  updated_at: string;
}

export interface ProjectImage {
  id: string;
  project_id: string;
  image_url: string;
  caption: string;
  alt_text?: string;
  width?: string;
  height?: string;
  sort_order: number;
  created_at: string;
}

import { storageService } from './storageService';

const STORAGE_KEY = 'portfolio_projects';
const IMAGES_STORAGE_KEY = 'portfolio_project_images';
const DRIVE_BACKUP_KEY = 'portfolio_drive_backup';

// Initialize with sample data if no projects exist
const initializeSampleData = (): Project[] => [
  {
    id: '1',
    title: "Flow-SIGHT",
    subtitle: "Real-time Congestion Prediction Dashboard",
    description: "AI-powered urban mobility analysis system using Graph ML to predict traffic patterns and optimize city flow in real-time.",
    content: "<h2>Project Overview</h2><p>Flow-SIGHT is an advanced urban mobility analysis system that leverages Graph Machine Learning to predict traffic patterns and optimize city flow in real-time.</p>",
    image_url: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&h=600&fit=crop",
    status: "Live Demo",
    featured: true,
    technologies: ["Python", "TensorFlow", "Graph ML", "React", "Urban Data"],
    tags: ["AI Tools", "Urban Analytics"],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: '2',
    title: "WOOD-ID",
    subtitle: "ML-driven Wood Optimization & Fabrication Pipeline",
    description: "Computer vision system for automated wood classification and CNC optimization, reducing material waste by 35%.",
    content: "<h2>Project Overview</h2><p>WOOD-ID is a computer vision system for automated wood classification and CNC optimization, significantly reducing material waste.</p>",
    image_url: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=800&h=600&fit=crop",
    status: "Case Study",
    featured: true,
    technologies: ["Computer Vision", "CNC", "Rhino", "Python", "ML"],
    tags: ["AI Tools", "Fabrication"],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: '3',
    title: "Atelier24: KHC Hospital & Hotel",
    subtitle: "14,000 m² Mixed-Use Development",
    description: "Complete BIM coordination and technical documentation for large-scale healthcare and hospitality project using advanced Revit workflows.",
    content: "<h2>Project Overview</h2><p>Complete BIM coordination and technical documentation for large-scale healthcare and hospitality project using advanced Revit workflows.</p>",
    image_url: "https://images.unsplash.com/photo-1488972685288-c3fd157d7c7a?w=800&h=600&fit=crop",
    status: "Built",
    featured: true,
    technologies: ["Revit", "AutoCAD", "BIM", "Construction Docs"],
    tags: ["BIM", "Architecture"],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: '4',
    title: "Bioplastic Lab",
    subtitle: "Sustainable Material Prototyping",
    description: "Research and development of bio-based materials for architectural applications using parametric design and digital fabrication.",
    content: "<h2>Project Overview</h2><p>Research and development of bio-based materials for architectural applications using parametric design and digital fabrication.</p>",
    image_url: "https://images.unsplash.com/photo-1487058792275-0ad4aaf24ca7?w=800&h=600&fit=crop",
    status: "Research",
    featured: false,
    technologies: ["Grasshopper", "3D Printing", "Material Science", "Rhino"],
    tags: ["Fabrication"],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: '5',
    title: "Chopra Residence",
    subtitle: "Built Execution & Site Experience",
    description: "Residential project with comprehensive site supervision and execution through K12 Atelier, focusing on sustainable building practices.",
    content: "<h2>Project Overview</h2><p>Residential project with comprehensive site supervision and execution through K12 Atelier, focusing on sustainable building practices.</p>",
    image_url: "https://images.unsplash.com/photo-1496307653780-42ee777d4833?w=800&h=600&fit=crop",
    status: "Completed",
    featured: false,
    technologies: ["Site Management", "AutoCAD", "Construction", "Sustainability"],
    tags: ["Architecture"],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: '6',
    title: "Urban Data Visualization",
    subtitle: "Interactive City Analytics Platform",
    description: "Web-based dashboard for real-time urban data visualization combining GIS, IoT sensors, and predictive analytics.",
    content: "<h2>Project Overview</h2><p>Web-based dashboard for real-time urban data visualization combining GIS, IoT sensors, and predictive analytics.</p>",
    image_url: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=800&h=600&fit=crop",
    status: "Development",
    featured: false,
    technologies: ["React", "D3.js", "QGIS", "IoT", "Data Visualization"],
    tags: ["Urban Analytics"],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  }
];

export const projectsService = {
  // Get all projects
  getAllProjects: (): Project[] => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (!stored) {
        // Initialize with sample data
        const sampleData = initializeSampleData();
        localStorage.setItem(STORAGE_KEY, JSON.stringify(sampleData));
        return sampleData;
      }
      return JSON.parse(stored);
    } catch (error) {
      console.error('Error loading projects:', error);
      return [];
    }
  },

  // Get a single project by ID
  getProjectById: (id: string): Project | null => {
    const projects = projectsService.getAllProjects();
    return projects.find(project => project.id === id) || null;
  },

  // Create a new project
  createProject: async (projectData: Omit<Project, 'id' | 'created_at' | 'updated_at'>): Promise<Project> => {
    const projects = projectsService.getAllProjects();
    const newProject: Project = {
      ...projectData,
      id: Date.now().toString(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    
    projects.push(newProject);
    
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(projects));
      return newProject;
    } catch (error) {
      console.error('LocalStorage quota exceeded, trying cleanup...');
      
      // Try to clean up by removing large image_url data
      try {
        const cleanedProjects = projects.map(project => ({
          ...project,
          image_url: project.image_url.startsWith('data:') ? '' : project.image_url
        }));
        localStorage.setItem(STORAGE_KEY, JSON.stringify(cleanedProjects));
        console.log('Successfully saved after cleanup');
        return newProject;
      } catch (cleanupError) {
        console.error('Cleanup failed, trying storage service...');
        
        // Try Supabase as fallback
        try {
          const result = await storageService.uploadWithFallback(projects, `projects_backup_${newProject.id}`);
          if (result) {
            localStorage.setItem(DRIVE_BACKUP_KEY, result);
            console.log('Successfully saved using Supabase');
            return newProject;
          }
        } catch (supabaseError) {
          console.error('Supabase failed:', supabaseError);
        }
        
        throw new Error('Storage quota exceeded and all backup methods failed');
      }
    }
  },

  // Update an existing project
  updateProject: async (id: string, projectData: Partial<Project>): Promise<Project | null> => {
    const projects = projectsService.getAllProjects();
    const index = projects.findIndex(project => project.id === id);
    
    if (index === -1) return null;
    
    projects[index] = {
      ...projects[index],
      ...projectData,
      updated_at: new Date().toISOString()
    };
    
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(projects));
      return projects[index];
    } catch (error) {
      console.error('LocalStorage quota exceeded, trying cleanup...');
      
      // Try to clean up by removing large image_url data
      try {
        const cleanedProjects = projects.map(project => ({
          ...project,
          image_url: project.image_url.startsWith('data:') ? '' : project.image_url
        }));
        localStorage.setItem(STORAGE_KEY, JSON.stringify(cleanedProjects));
        console.log('Successfully saved after cleanup');
        return projects[index];
      } catch (cleanupError) {
        console.error('Cleanup failed, trying storage service...');
        
        // Try Supabase as fallback
        try {
          const result = await storageService.uploadWithFallback(projects, `projects_backup_${id}`);
          if (result) {
            localStorage.setItem(DRIVE_BACKUP_KEY, result);
            console.log('Successfully saved using Supabase');
            return projects[index];
          }
        } catch (supabaseError) {
          console.error('Supabase failed:', supabaseError);
        }
        
        throw new Error('Storage quota exceeded and all backup methods failed');
      }
    }
  },

  // Delete a project
  deleteProject: (id: string): boolean => {
    const projects = projectsService.getAllProjects();
    const filteredProjects = projects.filter(project => project.id !== id);
    
    if (filteredProjects.length === projects.length) {
      return false; // Project not found
    }
    
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filteredProjects));
    
    // Also delete associated images
    const images = projectsService.getProjectImages(id);
    images.forEach(image => projectsService.deleteProjectImage(image.id));
    
    return true;
  },

  // Get project images
  getProjectImages: (projectId: string): ProjectImage[] => {
    try {
      const stored = localStorage.getItem(IMAGES_STORAGE_KEY);
      if (!stored) return [];
      
      const allImages: ProjectImage[] = JSON.parse(stored);
      return allImages.filter(image => image.project_id === projectId);
    } catch (error) {
      console.error('Error loading project images:', error);
      return [];
    }
  },

  // Add project image
  addProjectImage: (projectId: string, imageData: Omit<ProjectImage, 'id' | 'project_id' | 'created_at'>): ProjectImage => {
    const allImages = projectsService.getAllProjectImages();
    const newImage: ProjectImage = {
      ...imageData,
      id: Date.now().toString(),
      project_id: projectId,
      created_at: new Date().toISOString()
    };
    
    allImages.push(newImage);
    localStorage.setItem(IMAGES_STORAGE_KEY, JSON.stringify(allImages));
    return newImage;
  },

  // Delete project image
  deleteProjectImage: (imageId: string): boolean => {
    const allImages = projectsService.getAllProjectImages();
    const filteredImages = allImages.filter(image => image.id !== imageId);
    
    if (filteredImages.length === allImages.length) {
      return false; // Image not found
    }
    
    localStorage.setItem(IMAGES_STORAGE_KEY, JSON.stringify(filteredImages));
    return true;
  },

  // Get all project images (internal use)
  getAllProjectImages: (): ProjectImage[] => {
    try {
      const stored = localStorage.getItem(IMAGES_STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error('Error loading all project images:', error);
      return [];
    }
  }
}; 