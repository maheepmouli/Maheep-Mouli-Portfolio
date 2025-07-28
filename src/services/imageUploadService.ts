import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

export interface UploadResult {
  url: string;
  path: string;
  error?: string;
}

export const imageUploadService = {
  // Upload image to Supabase Storage
  async uploadImage(file: File, folder: string = 'project-images'): Promise<UploadResult> {
    try {
      // Generate unique filename
      const timestamp = Date.now();
      const fileExt = file.name.split('.').pop();
      const fileName = `${folder}/${timestamp}-${Math.random().toString(36).substring(2)}.${fileExt}`;

      // Upload to Supabase Storage
      const { data, error } = await supabase.storage
        .from('portfolio-assets')
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (error) {
        console.error('Upload error:', error);
        return { url: '', path: '', error: error.message };
      }

      // Get public URL
      const { data: urlData } = supabase.storage
        .from('portfolio-assets')
        .getPublicUrl(fileName);

      return {
        url: urlData.publicUrl,
        path: fileName
      };
    } catch (error) {
      console.error('Image upload failed:', error);
      return { url: '', path: '', error: 'Upload failed' };
    }
  },

  // Delete image from Supabase Storage
  async deleteImage(path: string): Promise<boolean> {
    try {
      const { error } = await supabase.storage
        .from('portfolio-assets')
        .remove([path]);

      if (error) {
        console.error('Delete error:', error);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Image deletion failed:', error);
      return false;
    }
  },

  // Convert base64 to file and upload
  async uploadBase64Image(base64Data: string, fileName: string): Promise<UploadResult> {
    try {
      // Convert base64 to blob
      const response = await fetch(base64Data);
      const blob = await response.blob();
      
      // Create file from blob
      const file = new File([blob], fileName, { type: 'image/jpeg' });
      
      // Upload using the regular upload method
      return await this.uploadImage(file);
    } catch (error) {
      console.error('Base64 upload failed:', error);
      return { url: '', path: '', error: 'Base64 upload failed' };
    }
  },

  // Get optimized URL with cache busting
  getOptimizedUrl(url: string): string {
    if (!url) return '';
    
    // For base64 images, return as-is (temporary)
    if (url.startsWith('data:')) {
      return url;
    }
    
    // For Supabase URLs, add cache busting
    if (url.includes('supabase.co')) {
      const timestamp = Date.now();
      const separator = url.includes('?') ? '&' : '?';
      return `${url}${separator}v=${timestamp}&t=${timestamp}`;
    }
    
    return url;
  }
}; 