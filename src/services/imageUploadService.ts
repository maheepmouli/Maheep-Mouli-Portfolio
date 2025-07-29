import supabase from '@/lib/supabaseClient';

const BUCKET_NAME = 'portfolio-assets';

export const uploadImageToSupabase = async (file: File, folder: string = 'project-images'): Promise<string> => {
  try {
    console.log('imageUploadService: Starting upload to Supabase...');
    
    if (!supabase) {
      throw new Error('Supabase client not available');
    }

    // Generate a unique filename
    const timestamp = Date.now();
    const randomString = Math.random().toString(36).substring(2, 15);
    const fileExtension = file.name.split('.').pop();
    const fileName = `${timestamp}-${randomString}.${fileExtension}`;
    const filePath = `${folder}/${fileName}`;

    console.log('imageUploadService: Uploading file:', filePath);

    const { data, error } = await supabase.storage
      .from(BUCKET_NAME)
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false
      });

    if (error) {
      console.error('imageUploadService: Upload error:', error);
      
      if (error.message.includes('Bucket not found')) {
        throw new Error('Storage bucket not found. Please create the portfolio-assets bucket in Supabase.');
      }
      
      throw new Error(`Upload failed: ${error.message}`);
    }

    if (!data?.path) {
      throw new Error('Upload succeeded but no path returned');
    }

    // Get the public URL
    const { data: urlData } = supabase.storage
      .from(BUCKET_NAME)
      .getPublicUrl(data.path);

    const publicUrl = urlData.publicUrl;
    console.log('imageUploadService: Upload successful, public URL:', publicUrl);

    return publicUrl;
  } catch (error) {
    console.error('imageUploadService: Error uploading image:', error);
    throw error;
  }
};

export const deleteImageFromSupabase = async (imageUrl: string): Promise<void> => {
  try {
    if (!supabase || !imageUrl) {
      return;
    }

    // Extract the file path from the URL
    const urlParts = imageUrl.split('/');
    const filePath = urlParts.slice(-2).join('/'); // Get the last two parts (folder/filename)

    console.log('imageUploadService: Deleting file:', filePath);

    const { error } = await supabase.storage
      .from(BUCKET_NAME)
      .remove([filePath]);

    if (error) {
      console.error('imageUploadService: Delete error:', error);
      throw new Error(`Delete failed: ${error.message}`);
    }

    console.log('imageUploadService: File deleted successfully');
  } catch (error) {
    console.error('imageUploadService: Error deleting image:', error);
    throw error;
  }
};

export interface UploadResult {
  success: boolean;
  url?: string;
  path?: string;
  error?: string;
}

export const imageUploadService = {
  // Upload image to Supabase Storage
  async uploadImage(file: File, folder: string = 'project-images'): Promise<UploadResult> {
    try {
      // Check if Supabase is configured
      if (!supabase) {
        console.warn('Supabase not configured, falling back to base64');
        return { success: false, error: 'Supabase not configured' };
      }

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
        
        // Handle bucket not found error
        if (error.message.includes('Bucket not found')) {
          console.error('Storage bucket "portfolio-assets" not found. Please create it in your Supabase dashboard.');
          return { 
            success: false, 
            error: 'Storage bucket not found. Please create the "portfolio-assets" bucket in your Supabase dashboard.' 
          };
        }
        
        return { success: false, error: error.message };
      }

      // Get public URL
      const { data: urlData } = supabase.storage
        .from('portfolio-assets')
        .getPublicUrl(fileName);

      return {
        success: true,
        url: urlData.publicUrl,
        path: fileName
      };
    } catch (error) {
      console.error('Image upload failed:', error);
      return { success: false, error: 'Upload failed' };
    }
  },

  // Delete image from Supabase Storage
  async deleteImage(path: string): Promise<boolean> {
    try {
      if (!supabase) {
        console.warn('Supabase not configured, cannot delete image');
        return false;
      }

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
      return { success: false, error: 'Base64 upload failed' };
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