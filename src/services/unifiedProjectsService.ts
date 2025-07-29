import supabase from '@/lib/supabaseClient';
import { VideoItem } from '@/components/VideoManager';

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
  featured: boolean;
  videos?: VideoItem[];
  location?: string;
  created_at: string;
  updated_at: string;
}

// Helper functions
const generateId = (): string => Date.now().toString();
const generateSlug = (title: string): string => 
  title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

const initializeSampleData = (): UnifiedProject[] => [
  {
    id: '1',
    title: 'Flow-SIGHT',
    slug: 'flow-sight',
    subtitle: 'Real-time Congestion Prediction Dashboard',
    description: 'AI-powered urban mobility analysis system using Graph Neural Networks to predict traffic patterns and optimize city flow in real-time.',
    content: 'FLOW-SIGHT\nPredictive Urban Mobility Intelligence\n\nAn advanced AI-powered urban mobility analysis system that leverages Graph Neural Networks to predict traffic patterns and optimize city flow in real-time. The system provides real-time congestion prediction, dynamic route optimization, and comprehensive urban mobility insights.\n\nKey Features:\n• Real-time traffic pattern analysis\n• Predictive congestion modeling\n• Dynamic route optimization\n• Interactive dashboard visualization\n• Multi-modal transportation integration\n\nTechnologies: Python, TensorFlow, React, Node.js, PostgreSQL\n\nThis project demonstrates the power of AI in creating resilient, data-informed mobility ecosystems.',
    image_url: '',
    project_images: [],
    technologies: ['Python', 'TensorFlow', 'React', 'Node.js', 'PostgreSQL'],
    github_url: 'https://github.com/maheepmouli/flow-sight',
    live_url: 'https://flow-sight.demo.com',
    featured: true,
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
      return JSON.parse(stored);
    }
  } catch (error) {
    console.error('UnifiedService: Error reading from localStorage:', error);
  }
  return [];
};

const saveProjectsToLocalStorage = (projects: UnifiedProject[]) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(projects));
  } catch (error) {
    console.error('UnifiedService: Error saving to localStorage:', error);
  }
};

export const syncLocalStorageToSupabase = async (): Promise<void> => {
  try {
    console.log('UnifiedService: Syncing localStorage projects to Supabase...');
    
    if (!supabase) {
      console.log('UnifiedService: Supabase not available for sync');
      return;
    }

    // Get projects from localStorage
    const localProjects = getProjectsFromLocalStorage();
    
    if (localProjects.length === 0) {
      console.log('UnifiedService: No local projects to sync');
      return;
    }

    console.log('UnifiedService: Found', localProjects.length, 'projects in localStorage to sync');

    // Convert localStorage projects to Supabase format
    const supabaseProjects = localProjects.map(project => ({
      title: project.title,
      slug: project.slug || generateSlug(project.title),
      subtitle: project.subtitle || '',
      description: project.description || '',
      content: project.content || '',
      image_url: project.image_url || '',
      project_images: project.project_images || [],
      technologies: project.technologies || [],
      github_url: project.github_url || '',
      live_url: project.live_url || '',
      featured: project.featured || false,
      user_id: null, // Set to null since we don't have real authentication
      created_at: project.created_at || new Date().toISOString(),
      updated_at: project.updated_at || new Date().toISOString()
    }));

    // Insert projects into Supabase
    const { data, error } = await supabase
      .from('projects')
      .insert(supabaseProjects)
      .select();

    if (error) {
      console.error('UnifiedService: Error syncing to Supabase:', error);
      return;
    }

    console.log('UnifiedService: Successfully synced', data?.length || 0, 'projects to Supabase');
    
    // Update localStorage with Supabase IDs
    if (data && data.length > 0) {
      const updatedProjects = data.map((supabaseProject, index) => ({
        ...localProjects[index],
        id: supabaseProject.id.toString(),
        created_at: supabaseProject.created_at,
        updated_at: supabaseProject.updated_at
      }));
      
      saveProjectsToLocalStorage(updatedProjects);
      createBackup(updatedProjects);
      console.log('UnifiedService: Updated localStorage with Supabase IDs');
    }
  } catch (error) {
    console.error('UnifiedService: Error in syncLocalStorageToSupabase:', error);
  }
};

export const unifiedProjectsService = {
  // Get all projects - prioritize Supabase, fallback to localStorage
  async getAllProjects(): Promise<UnifiedProject[]> {
    try {
      console.log('UnifiedService: Attempting to fetch from Supabase...');
      
      if (!supabase) {
        console.log('UnifiedService: Supabase client not available, falling back to localStorage...');
        return getProjectsFromLocalStorage();
      }

      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('UnifiedService: Supabase query error:', error);
        console.log('UnifiedService: Falling back to localStorage...');
        return getProjectsFromLocalStorage();
      }

      console.log('UnifiedService: Supabase query successful');
      console.log('UnifiedService: Data received:', data);
      console.log('UnifiedService: Data length:', data?.length || 0);

      if (data && data.length > 0) {
        console.log('UnifiedService: Found projects in Supabase:', data.length);
        const unifiedProjects = data.map(project => ({
          ...project,
          id: project.id.toString(),
          user_id: project.user_id?.toString() || null,
          project_images: project.images || project.project_images || [] // Map images to project_images for compatibility
        }));
        
        // Sync with localStorage
        saveProjectsToLocalStorage(unifiedProjects);
        createBackup(unifiedProjects);
        return unifiedProjects;
      } else {
        console.log('UnifiedService: No projects found in Supabase, checking localStorage...');
        const localProjects = getProjectsFromLocalStorage();
        
        if (localProjects.length > 0) {
          console.log('UnifiedService: Found projects in localStorage, syncing to Supabase...');
          await syncLocalStorageToSupabase();
          return localProjects;
        } else {
          console.log('UnifiedService: No projects found anywhere, initializing with sample data...');
          return initializeSampleData();
        }
      }
    } catch (error) {
      console.error('UnifiedService: Error fetching projects:', error);
      console.log('UnifiedService: Falling back to localStorage...');
      return getProjectsFromLocalStorage();
    }
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

          // Update localStorage
          const currentProjects = await this.getAllProjects();
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

      const currentProjects = await this.getAllProjects();
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
      const projects = await this.getAllProjects();
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
        const projects = await this.getAllProjects();
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