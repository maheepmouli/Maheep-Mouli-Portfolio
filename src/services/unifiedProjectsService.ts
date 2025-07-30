import supabase from '@/lib/supabaseClient';
import { VideoItem } from '@/components/VideoManager';
import { initializeDataRecovery } from '@/utils/dataRecovery';

// Storage keys
const STORAGE_KEY = 'portfolio_projects';
const BACKUP_KEY = 'portfolio_projects_backup';

// Environment variables check
console.log('UnifiedService: Environment variables check:');
console.log('VITE_SUPABASE_URL:', import.meta.env.VITE_SUPABASE_URL ? 'Set' : 'Not set');
console.log('VITE_SUPABASE_ANON_KEY:', import.meta.env.VITE_SUPABASE_ANON_KEY ? 'Set' : 'Not set');
console.log('UnifiedService: Supabase client created:', !!supabase);

export interface UnifiedProject {
  id: string;
  user_id?: string;
  title: string;
  slug: string;
  subtitle?: string;
  description: string;
  content: string;
  image_url: string;
  project_images?: string[];
  images?: string[]; // For database operations
  technologies: string[];
  github_url?: string;
  live_url?: string;
  project_url?: string;
  featured: boolean;
  status?: string; // Add status field
  videos?: VideoItem[];
  location?: string;
  duration?: string;
  team_size?: string;
  created_at: string;
  updated_at: string;
}

// Helper functions
const generateId = (): string => Date.now().toString();
const generateSlug = (title: string): string => 
  title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

// Enhanced sample data with your actual projects
const initializeSampleData = (): UnifiedProject[] => [
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
  }
];

const createBackup = (data: UnifiedProject[]) => {
  try {
    localStorage.setItem(BACKUP_KEY, JSON.stringify(data));
    console.log('UnifiedService: Backup created successfully');
  } catch (error) {
    console.warn('UnifiedService: Could not create backup:', error);
  }
};

const restoreFromBackup = (): UnifiedProject[] | null => {
  try {
    const backup = localStorage.getItem(BACKUP_KEY);
    if (backup) {
      const data = JSON.parse(backup);
      console.log('UnifiedService: Restored from backup:', data.length, 'projects');
      return data;
    }
  } catch (error) {
    console.error('UnifiedService: Error restoring from backup:', error);
  }
  return null;
};

const getProjectsFromLocalStorage = (): UnifiedProject[] => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const projects = JSON.parse(stored);
      console.log('UnifiedService: Found projects in localStorage:', projects.length);
      return projects;
    }
  } catch (error) {
    console.error('UnifiedService: Error reading from localStorage:', error);
  }
  return [];
};

const saveProjectsToLocalStorage = (projects: UnifiedProject[]) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(projects));
    console.log('UnifiedService: Projects saved to localStorage');
  } catch (error) {
    console.error('UnifiedService: Error saving to localStorage:', error);
  }
};

const clearStorage = (): void => {
  try {
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem(BACKUP_KEY);
    console.log('UnifiedService: Storage cleared');
  } catch (error) {
    console.error('UnifiedService: Error clearing storage:', error);
  }
};

const forceFreshData = (): UnifiedProject[] => {
  console.log('UnifiedService: Forcing fresh data...');
  clearStorage();
  
  const freshData = [
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
    }
  ];
  
  saveProjectsToLocalStorage(freshData);
  createBackup(freshData);
  console.log('UnifiedService: Fresh data saved');
  return freshData;
};

// List of projects to KEEP (the 6 good ones)
const GOOD_PROJECTS = [
  "HYPAR PORTABLES",
  "R&E – BioFoam Thermal Performance", 
  "Blasters Park: Multi-Functional Stadium Complex",
  "KHC-HOSPITAL",
  "WOOD-ID",
  "Flow-SIGHT"
];

// Function to remove unwanted projects and ensure no duplicates
const removeBottomProjects = (projects: UnifiedProject[]): UnifiedProject[] => {
  console.log('UnifiedService: Filtering to keep only good projects...');
  
  // First remove duplicates based on title
  const uniqueProjects = projects.filter((project, index, self) => 
    index === self.findIndex(p => p.title === project.title)
  );
  
  // Then keep only the good projects
  const goodProjects = uniqueProjects.filter(project => 
    GOOD_PROJECTS.includes(project.title)
  );
  
  console.log('UnifiedService: Kept good projects:', goodProjects.map(p => p.title));
  return goodProjects;
};

// Enhanced sync function with better error handling
export const syncLocalStorageToSupabase = async (): Promise<void> => {
  try {
    console.log('UnifiedService: Starting sync to Supabase...');
    
    if (!supabase) {
      console.log('UnifiedService: Supabase not available, skipping sync');
      return;
    }

    const localProjects = getProjectsFromLocalStorage();
    if (localProjects.length === 0) {
      console.log('UnifiedService: No local projects to sync');
      return;
    }

    console.log('UnifiedService: Syncing', localProjects.length, 'projects to Supabase...');
    
    for (const project of localProjects) {
      try {
        const { error } = await supabase
          .from('projects')
          .upsert([project], { onConflict: 'id' });

        if (error) {
          console.error('UnifiedService: Error syncing project', project.title, ':', error);
        } else {
          console.log('UnifiedService: Successfully synced project:', project.title);
        }
      } catch (error) {
        console.error('UnifiedService: Error syncing project', project.title, ':', error);
      }
    }
    
    console.log('UnifiedService: Sync completed');
  } catch (error) {
    console.error('UnifiedService: Error in syncLocalStorageToSupabase:', error);
  }
};

export const unifiedProjectsService = {
  // Get all projects - prioritize Supabase, fallback to localStorage
  async getAllProjects(): Promise<UnifiedProject[]> {
    console.log('UnifiedService: Getting all projects...');
    
    // First try to recover existing data
    const recoveredProjects = initializeDataRecovery();
    console.log('UnifiedService: Data recovery completed, found projects:', recoveredProjects.length);
    console.log('UnifiedService: Recovered projects details:', recoveredProjects.map(p => ({
      title: p.title,
      featured: p.featured,
      status: p.status,
      id: p.id
    })));
    
    // If we have projects, filter them to remove duplicates and bottom 7
    if (recoveredProjects.length > 0) {
      console.log('UnifiedService: Filtering recovered projects...');
      const filteredProjects = removeBottomProjects(recoveredProjects);
      
      // Save the filtered projects back to storage
      saveProjectsToLocalStorage(filteredProjects);
      createBackup(filteredProjects);
      
      console.log('UnifiedService: Returning filtered projects');
      return filteredProjects;
    }
    
    // Only use sample data if we have NO projects at all
    console.log('UnifiedService: No projects found, using sample data...');
    return forceFreshData();
  },

  // Manual clear storage function for debugging
  clearAllStorage(): void {
    clearStorage();
    console.log('UnifiedService: All storage cleared manually');
  },

  // Force fresh data function for debugging
  forceFreshData(): UnifiedProject[] {
    return forceFreshData();
  },

  // Force complete refresh - clear storage and return fresh data
  forceCompleteRefresh(): UnifiedProject[] {
    console.log('UnifiedService: Force complete refresh...');
    clearStorage();
    const freshData = forceFreshData();
    console.log('UnifiedService: Complete refresh completed with', freshData.length, 'projects');
    return freshData;
  },

  // Clean up projects - remove duplicates and bottom 7
  async cleanupProjects(): Promise<UnifiedProject[]> {
    console.log('UnifiedService: Cleaning up projects...');
    const currentProjects = await this.getAllProjects();
    const cleanedProjects = removeBottomProjects(currentProjects);
    
    // Save cleaned projects back to storage
    saveProjectsToLocalStorage(cleanedProjects);
    createBackup(cleanedProjects);
    
    console.log('UnifiedService: Cleanup completed with', cleanedProjects.length, 'projects');
    return cleanedProjects;
  },

  // Get project by ID
  async getProjectById(id: string): Promise<UnifiedProject | null> {
    const projects = await this.getAllProjects();
    return projects.find(project => project.id === id) || null;
  },

  // Create new project - save to both Supabase and localStorage
  async createProject(projectData: Omit<UnifiedProject, 'id' | 'created_at' | 'updated_at'>): Promise<UnifiedProject> {
    try {
      console.log('UnifiedService: Creating project...');
      
      // Generate slug from title if not provided
      const slug = projectData.slug || generateSlug(projectData.title);
      
      const projectToCreate = {
        ...projectData,
        slug,
        user_id: null, // Set to null since we don't have real authentication yet
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      console.log('UnifiedService: Project data prepared for Supabase:', projectToCreate);

      if (supabase) {
        try {
          const { data, error } = await supabase
            .from('projects')
            .insert([projectToCreate])
            .select()
            .single();

          if (error) {
            console.error('UnifiedService: Supabase insert error:', error);
            throw new Error(`Failed to create project in Supabase: ${error.message}`);
          }

          console.log('UnifiedService: Project created in Supabase:', data);
          
          const unifiedProject = {
            ...data,
            id: data.id.toString(),
            user_id: data.user_id?.toString() || null
          };

          // Update localStorage directly without triggering getAllProjects
          const currentProjects = getProjectsFromLocalStorage();
          const updatedProjects = [unifiedProject, ...currentProjects];
          saveProjectsToLocalStorage(updatedProjects);
          createBackup(updatedProjects);

          // Trigger update events
          this.triggerUpdateEvents('created', unifiedProject.id, unifiedProject.image_url || '');

          return unifiedProject;
        } catch (supabaseError) {
          console.error('UnifiedService: Supabase creation failed:', supabaseError);
          // Continue to localStorage fallback
        }
      }

      // Fallback to localStorage
      console.log('UnifiedService: Creating project in localStorage...');
      const newProject: UnifiedProject = {
        id: generateId(),
        ...projectToCreate,
        user_id: null
      };

      const currentProjects = getProjectsFromLocalStorage();
      const updatedProjects = [newProject, ...currentProjects];
      saveProjectsToLocalStorage(updatedProjects);
      createBackup(updatedProjects);

      // Trigger update events
      this.triggerUpdateEvents('created', newProject.id, newProject.image_url || '');

      return newProject;
    } catch (error) {
      console.error('UnifiedService: Error creating project:', error);
      throw error;
    }
  },

  // Update existing project
  async updateProject(id: string, updates: Partial<UnifiedProject>): Promise<UnifiedProject | null> {
    try {
      const projects = getProjectsFromLocalStorage();
      const projectIndex = projects.findIndex(p => p.id === id);
      
      if (projectIndex === -1) {
        console.error('UnifiedService: Project not found for update:', id);
        return null;
      }

      const updatedProject = { ...projects[projectIndex], ...updates, updated_at: new Date().toISOString() };
      projects[projectIndex] = updatedProject;

      // Try to update in Supabase first
      if (supabase) {
        try {
          console.log('UnifiedService: Sending update to Supabase:', {
            id,
            updates,
            featured: updates.featured,
            status: updates.status
          });
          
          const { error } = await supabase
            .from('projects')
            .update({
              ...updates,
              updated_at: new Date().toISOString()
            })
            .eq('id', id);

          if (error) {
            console.error('UnifiedService: Supabase update error:', error);
          } else {
            console.log('UnifiedService: Project updated in Supabase');
          }
        } catch (supabaseError) {
          console.error('UnifiedService: Supabase update failed:', supabaseError);
        }
      }

      // Update localStorage
      saveProjectsToLocalStorage(projects);
      createBackup(projects);

      // Trigger update events
      this.triggerUpdateEvents('updated', id, updatedProject.image_url || '');

      return updatedProject;
    } catch (error) {
      console.error('UnifiedService: Error updating project:', error);
      return null;
    }
  },

  // Delete project
  async deleteProject(id: string): Promise<boolean> {
    try {
      console.log('UnifiedService: Deleting project from Supabase...');
      
      // Try to delete from Supabase first
      if (supabase) {
        try {
          const { error } = await supabase
            .from('projects')
            .delete()
            .eq('id', id);

          if (error) {
            console.error('UnifiedService: Supabase delete error:', error);
          } else {
            console.log('UnifiedService: Project deleted from Supabase');
          }
        } catch (supabaseError) {
          console.error('UnifiedService: Supabase delete failed:', supabaseError);
        }
      }

      // Try to delete from localStorage
      try {
        const projects = getProjectsFromLocalStorage();
        const filteredProjects = projects.filter(p => p.id !== id);
        
        saveProjectsToLocalStorage(filteredProjects);
        createBackup(filteredProjects);
        
        console.log('UnifiedService: Project deleted from localStorage');
        
        // Trigger update events
        this.triggerUpdateEvents('deleted', id, '');
        
        return true;
      } catch (storageError) {
        console.error('UnifiedService: Error deleting from localStorage:', storageError);
        return false;
      }
    } catch (error) {
      console.error('UnifiedService: Error deleting project:', error);
      return false;
    }
  },

  // Get featured projects
  async getFeaturedProjects(): Promise<UnifiedProject[]> {
    const projects = await this.getAllProjects();
    return projects.filter(project => project.featured);
  },

  // Search projects
  async searchProjects(query: string): Promise<UnifiedProject[]> {
    const projects = await this.getAllProjects();
    const lowercaseQuery = query.toLowerCase();
    
    return projects.filter(project => 
      project.title.toLowerCase().includes(lowercaseQuery) ||
      project.description.toLowerCase().includes(lowercaseQuery) ||
      project.content.toLowerCase().includes(lowercaseQuery) ||
      project.technologies.some(tech => tech.toLowerCase().includes(lowercaseQuery))
    );
  },

  // Get projects by tag
  async getProjectsByTag(tag: string): Promise<UnifiedProject[]> {
    const projects = await this.getAllProjects();
    return projects.filter(project => 
      project.technologies.some(projectTag => 
        projectTag.toLowerCase() === tag.toLowerCase()
      )
    );
  },

  // Clear all storage
  clearStorage(): void {
    try {
      localStorage.removeItem(STORAGE_KEY);
      localStorage.removeItem(BACKUP_KEY);
      console.log('UnifiedService: Storage cleared');
    } catch (error) {
      console.error('UnifiedService: Error clearing storage:', error);
    }
  },

  // Trigger update events for real-time updates
  triggerUpdateEvents(action: 'created' | 'updated' | 'deleted', projectId: string, imageUrl: string): void {
    console.log('UnifiedService: Triggering update events:', { action, projectId, imageUrl });
    
    // Dispatch custom event for real-time updates
    const event = new CustomEvent('projectUpdate', {
      detail: { action, projectId, imageUrl }
    });
    window.dispatchEvent(event);
  }
}; 