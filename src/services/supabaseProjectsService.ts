import supabase from '@/lib/supabaseClient';
import { VideoItem } from '@/components/VideoManager';

export interface SupabaseProject {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  content: string;
  image_url: string;
  images?: string[];
  videos?: VideoItem[];
  status: string;
  featured: boolean;
  project_url?: string;
  github_url?: string;
  location?: string;
  duration?: string;
  team_size?: string;
  technologies: string[];
  tags: string[];
  slug: string;
  user_id?: string;
  created_at: string;
  updated_at: string;
}

export const supabaseProjectsService = {
  // Fetch all projects from Supabase with real-time updates
  async getAllProjects(): Promise<SupabaseProject[]> {
    try {
      if (!supabase) {
        console.error('Supabase not configured');
        return [];
      }

      console.log('Supabase: Attempting to fetch projects...');
      console.log('Supabase: URL:', import.meta.env.VITE_SUPABASE_URL);
      console.log('Supabase: Key configured:', !!import.meta.env.VITE_SUPABASE_ANON_KEY);

      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Supabase: Error fetching projects:', error);
        console.error('Supabase: Error details:', {
          message: error.message,
          details: error.details,
          hint: error.hint,
          code: error.code
        });
        return [];
      }

      console.log('Supabase: Successfully fetched projects:', data);
      console.log('Supabase: Number of projects found:', data?.length || 0);
      return data || [];
    } catch (error) {
      console.error('Supabase: Exception in getAllProjects:', error);
      return [];
    }
  },

  // Create new project
  async createProject(projectData: Omit<SupabaseProject, 'id' | 'created_at' | 'updated_at'>): Promise<SupabaseProject | null> {
    try {
      if (!supabase) {
        console.error('Supabase not configured, cannot create project');
        return null;
      }

      console.log('Supabase: Attempting to create project with data:', projectData);

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
        console.error('Supabase: Error creating project:', error);
        console.error('Supabase: Error details:', {
          message: error.message,
          details: error.details,
          hint: error.hint,
          code: error.code
        });
        return null;
      }

      console.log('Supabase: Project created successfully:', data);
      return data;
    } catch (error) {
      console.error('Supabase: Exception in createProject:', error);
      return null;
    }
  },

  // Update project
  async updateProject(id: string, updates: Partial<SupabaseProject>): Promise<SupabaseProject | null> {
    try {
      if (!supabase) {
        console.error('Supabase not configured, cannot update project');
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
        console.error('Supabase not configured, cannot delete project');
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
        console.error('Supabase not configured');
        return null;
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
  }
}; 