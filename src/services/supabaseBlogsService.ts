import supabase from '@/lib/supabaseClient';

export interface SupabaseBlog {
  id: string;
  user_id: string;
  title: string;
  slug: string;
  content: string;
  excerpt?: string;
  cover_image_url?: string;
  tags: string[];
  status: 'draft' | 'published';
  created_at: string;
  updated_at: string;
}

// Define excluded slugs that should not be shown to anyone
const EXCLUDED_SLUGS = [
  'atelier24-khc-hospital-hotel',
  'bioplastic-lab',
  'chopra-residence',
  'flow-sight-urban-traffic-analytics',
  'kt',
  'fed',
  'fox-dz',
  'gh-dgugh',
  'slunszuj',
  'wsrdvrg'
];

// Helper function to filter out excluded slugs
const filterExcludedSlugs = (blogs: SupabaseBlog[]): SupabaseBlog[] => {
  return blogs.filter(blog => !EXCLUDED_SLUGS.includes(blog.slug));
};

// Helper function to check which table exists
const getBlogTableName = async (): Promise<string> => {
  try {
    console.log('Supabase: Checking for blog tables...');
    
    // Try blogs table first
    const { error: blogsError } = await supabase
      .from('blogs')
      .select('id')
      .limit(1);
    
    if (!blogsError) {
      console.log('Supabase: ✅ Found blogs table, using it');
      return 'blogs';
    } else {
      console.log('Supabase: ❌ blogs table not found:', blogsError.message);
    }
    
    // Try blog_posts table
    const { error: blogPostsError } = await supabase
      .from('blog_posts')
      .select('id')
      .limit(1);
    
    if (!blogPostsError) {
      console.log('Supabase: ✅ Found blog_posts table, using it');
      return 'blog_posts';
    } else {
      console.log('Supabase: ❌ blog_posts table not found:', blogPostsError.message);
    }
    
    console.error('Supabase: ❌ Neither blogs nor blog_posts table exists');
    return 'blogs'; // Default to blogs
  } catch (error) {
    console.error('Supabase: Error checking table existence:', error);
    return 'blogs'; // Default to blogs
  }
};

export const supabaseBlogsService = {
  // Get all blogs (with server-side filtering)
  async getAllBlogs(): Promise<SupabaseBlog[]> {
    try {
      if (!supabase) {
        console.error('Supabase not configured, cannot get blogs');
        return [];
      }

      const tableName = await getBlogTableName();
      const { data, error } = await supabase
        .from(tableName)
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Supabase: Error getting blogs:', error);
        return [];
      }

      // Apply server-side filtering to exclude unwanted slugs
      const filteredData = filterExcludedSlugs(data || []);
      console.log(`Supabase: Filtered out ${(data?.length || 0) - filteredData.length} excluded blogs`);
      
      return filteredData;
    } catch (error) {
      console.error('Supabase: Exception in getAllBlogs:', error);
      return [];
    }
  },

  // Get blog by slug (with server-side filtering)
  async getBlogBySlug(slug: string): Promise<SupabaseBlog | null> {
    try {
      if (!supabase) {
        console.error('Supabase not configured, cannot get blog');
        return null;
      }

      // Check if slug is in excluded list
      if (EXCLUDED_SLUGS.includes(slug)) {
        console.log(`Supabase: Slug "${slug}" is in excluded list, returning null`);
        return null;
      }

      const tableName = await getBlogTableName();
      const { data, error } = await supabase
        .from(tableName)
        .select('*')
        .eq('slug', slug)
        .single();

      if (error) {
        console.error('Supabase: Error getting blog:', error);
        return null;
      }

      return data;
    } catch (error) {
      console.error('Supabase: Exception in getBlogBySlug:', error);
      return null;
    }
  },

  // Create new blog
  async createBlog(blogData: Omit<SupabaseBlog, 'id' | 'created_at' | 'updated_at'>): Promise<SupabaseBlog | null> {
    try {
      if (!supabase) {
        console.error('Supabase not configured, cannot create blog');
        return null;
      }

      const tableName = await getBlogTableName();
      console.log('Supabase: Attempting to create blog with data:', blogData);
      console.log('Supabase: Using table:', tableName);

      const { data, error } = await supabase
        .from(tableName)
        .insert([{
          ...blogData,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }])
        .select()
        .single();

      if (error) {
        console.error('Supabase: Error creating blog:', error);
        console.error('Supabase: Error details:', {
          message: error.message,
          details: error.details,
          hint: error.hint,
          code: error.code
        });
        
        // If table doesn't exist, try to create it
        if (error.code === 'PGRST116') {
          console.log('Supabase: Table does not exist, attempting to create blogs table...');
          await this.createBlogsTable();
          
          // Retry the insert
          const { data: retryData, error: retryError } = await supabase
            .from('blogs')
            .insert([{
              ...blogData,
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString()
            }])
            .select()
            .single();
            
          if (retryError) {
            console.error('Supabase: Error creating blog after table creation:', retryError);
            return null;
          }
          
          console.log('Supabase: Blog created successfully after table creation:', retryData);
          return retryData;
        }
        
        return null;
      }

      console.log('Supabase: Blog created successfully:', data);
      return data;
    } catch (error) {
      console.error('Supabase: Exception in createBlog:', error);
      return null;
    }
  },

  // Create blogs table
  async createBlogsTable(): Promise<boolean> {
    try {
      console.log('Supabase: Creating blogs table...');
      
      // This would require admin privileges, so we'll just log it
      console.log('Supabase: Please run the create-blogs-table.sql script in your Supabase dashboard');
      
      return false;
    } catch (error) {
      console.error('Supabase: Error creating blogs table:', error);
      return false;
    }
  },

  // Update blog
  async updateBlog(id: string, updates: Partial<SupabaseBlog>): Promise<SupabaseBlog | null> {
    try {
      if (!supabase) {
        console.error('Supabase not configured, cannot update blog');
        return null;
      }

      const tableName = await getBlogTableName();
      const { data, error } = await supabase
        .from(tableName)
        .update({
          ...updates,
          updated_at: new Date().toISOString()
        })
        .eq('id', id)
        .select()
        .single();

      if (error) {
        console.error('Error updating blog:', error);
        return null;
      }
      
      return data;
    } catch (error) {
      console.error('Error in updateBlog:', error);
      return null;
    }
  },

  // Delete blog
  async deleteBlog(id: string): Promise<boolean> {
    try {
      if (!supabase) {
        console.error('Supabase not configured, cannot delete blog');
        return false;
      }

      const tableName = await getBlogTableName();
      const { error } = await supabase
        .from(tableName)
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Error deleting blog:', error);
        return false;
      }
      
      return true;
    } catch (error) {
      console.error('Error in deleteBlog:', error);
      return false;
    }
  },

  // Get published blogs (with server-side filtering)
  async getPublishedBlogs(): Promise<SupabaseBlog[]> {
    try {
      if (!supabase) {
        console.error('Supabase not configured, cannot get published blogs');
        return [];
      }

      const tableName = await getBlogTableName();
      const { data, error } = await supabase
        .from(tableName)
        .select('*')
        .eq('status', 'published')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Supabase: Error getting published blogs:', error);
        return [];
      }

      // Apply server-side filtering to exclude unwanted slugs
      const filteredData = filterExcludedSlugs(data || []);
      console.log(`Supabase: Filtered out ${(data?.length || 0) - filteredData.length} excluded published blogs`);
      
      return filteredData;
    } catch (error) {
      console.error('Supabase: Exception in getPublishedBlogs:', error);
      return [];
    }
  }
}; 