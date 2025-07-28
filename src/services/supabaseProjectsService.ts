import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Only create Supabase client if environment variables are available
const supabase = supabaseUrl && supabaseKey 
  ? createClient(supabaseUrl, supabaseKey)
  : null;

export interface SupabaseProject {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  content: string;
  image_url: string;
  status: string;
  featured: boolean;
  project_url?: string;
  github_url?: string;
  location?: string;
  duration?: string;
  team_size?: string;
  technologies: string[];
  tags: string[];
  created_at: string;
  updated_at: string;
}

export const supabaseProjectsService = {
  // Fetch all projects from Supabase with real-time updates
  async getAllProjects(): Promise<SupabaseProject[]> {
    try {
      if (!supabase) {
        console.warn('Supabase not configured, falling back to localStorage');
        return this.getFromLocalStorage();
      }

      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching projects from Supabase:', error);
        return this.getFromLocalStorage();
      }

      // Cache the data in localStorage as fallback
      if (data) {
        localStorage.setItem('supabase_projects_cache', JSON.stringify(data));
        return data;
      }

      return [];
    } catch (error) {
      console.error('Error in getAllProjects:', error);
      return this.getFromLocalStorage();
    }
  },

  // Get projects from localStorage as fallback
  getFromLocalStorage(): SupabaseProject[] {
    try {
      const cached = localStorage.getItem('supabase_projects_cache');
      if (cached) {
        return JSON.parse(cached);
      }
      return [];
    } catch (error) {
      console.error('Error reading from localStorage:', error);
      return [];
    }
  },

  // Create new project
  async createProject(projectData: Omit<SupabaseProject, 'id' | 'created_at' | 'updated_at'>): Promise<SupabaseProject | null> {
    try {
      if (!supabase) {
        console.warn('Supabase not configured, cannot create project');
        return null;
      }

      const { data, error } = await supabase
        .from('projects')
        .insert([{
          ...projectData,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }])
        .select()
        .single();

      if (error) {
        console.error('Error creating project:', error);
        return null;
      }

      // Clear cache to force fresh fetch
      localStorage.removeItem('supabase_projects_cache');
      
      return data;
    } catch (error) {
      console.error('Error in createProject:', error);
      return null;
    }
  },

  // Update project
  async updateProject(id: string, updates: Partial<SupabaseProject>): Promise<SupabaseProject | null> {
    try {
      if (!supabase) {
        console.warn('Supabase not configured, cannot update project');
        return null;
      }

      const { data, error } = await supabase
        .from('projects')
        .update({
          ...updates,
          updated_at: new Date().toISOString()
        })
        .eq('id', id)
        .select()
        .single();

      if (error) {
        console.error('Error updating project:', error);
        return null;
      }

      // Clear cache to force fresh fetch
      localStorage.removeItem('supabase_projects_cache');
      
      return data;
    } catch (error) {
      console.error('Error in updateProject:', error);
      return null;
    }
  },

  // Delete project
  async deleteProject(id: string): Promise<boolean> {
    try {
      if (!supabase) {
        console.warn('Supabase not configured, cannot delete project');
        return false;
      }

      const { error } = await supabase
        .from('projects')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Error deleting project:', error);
        return false;
      }

      // Clear cache to force fresh fetch
      localStorage.removeItem('supabase_projects_cache');
      
      return true;
    } catch (error) {
      console.error('Error in deleteProject:', error);
      return false;
    }
  },

  // Get project by ID
  async getProjectById(id: string): Promise<SupabaseProject | null> {
    try {
      if (!supabase) {
        console.warn('Supabase not configured, falling back to localStorage');
        const projects = this.getFromLocalStorage();
        return projects.find(p => p.id === id) || null;
      }

      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .eq('id', id)
        .single();

      if (error) {
        console.error('Error fetching project:', error);
        return null;
      }

      return data;
    } catch (error) {
      console.error('Error in getProjectById:', error);
      return null;
    }
  },

  // Force refresh cache
  async refreshCache(): Promise<void> {
    localStorage.removeItem('supabase_projects_cache');
    await this.getAllProjects();
  }
}; 