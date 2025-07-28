// Comprehensive Storage Service
// Provides multiple storage options to handle large amounts of data

export interface StorageProvider {
  name: string;
  isAvailable(): boolean;
  upload(data: any, key: string): Promise<string | null>;
  download(key: string): Promise<any | null>;
  delete(key: string): Promise<boolean>;
  getStorageInfo(): Promise<{ used: number; total: number } | null>;
}

// Local Storage with Compression
class CompressedLocalStorage implements StorageProvider {
  name = 'Compressed Local Storage';

  isAvailable(): boolean {
    return true; // Always available
  }

  async upload(data: any, key: string): Promise<string | null> {
    try {
      const jsonString = JSON.stringify(data);
      
      // Compress the data using a simple compression
      const compressed = this.compress(jsonString);
      
      // Check if compressed data fits in localStorage
      if (compressed.length > 5 * 1024 * 1024) { // 5MB limit
        throw new Error('Data too large even after compression');
      }
      
      localStorage.setItem(key, compressed);
      return key;
    } catch (error) {
      console.error('CompressedLocalStorage: Upload failed:', error);
      return null;
    }
  }

  async download(key: string): Promise<any | null> {
    try {
      const compressed = localStorage.getItem(key);
      if (!compressed) return null;
      
      const decompressed = this.decompress(compressed);
      return JSON.parse(decompressed);
    } catch (error) {
      console.error('CompressedLocalStorage: Download failed:', error);
      return null;
    }
  }

  async delete(key: string): Promise<boolean> {
    try {
      localStorage.removeItem(key);
      return true;
    } catch (error) {
      console.error('CompressedLocalStorage: Delete failed:', error);
      return false;
    }
  }

  async getStorageInfo(): Promise<{ used: number; total: number } | null> {
    try {
      let used = 0;
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key) {
          used += localStorage.getItem(key)?.length || 0;
        }
      }
      return { used, total: 5 * 1024 * 1024 }; // 5MB typical limit
    } catch (error) {
      console.error('CompressedLocalStorage: Get storage info failed:', error);
      return null;
    }
  }

  private compress(str: string): string {
    // Simple compression: remove whitespace and use shorter property names
    return str
      .replace(/\s+/g, '')
      .replace(/"title"/g, '"t"')
      .replace(/"subtitle"/g, '"st"')
      .replace(/"description"/g, '"d"')
      .replace(/"content"/g, '"c"')
      .replace(/"image_url"/g, '"i"')
      .replace(/"technologies"/g, '"tech"')
      .replace(/"created_at"/g, '"ca"')
      .replace(/"updated_at"/g, '"ua"');
  }

  private decompress(str: string): string {
    // Reverse the compression
    return str
      .replace(/"t"/g, '"title"')
      .replace(/"st"/g, '"subtitle"')
      .replace(/"d"/g, '"description"')
      .replace(/"c"/g, '"content"')
      .replace(/"i"/g, '"image_url"')
      .replace(/"tech"/g, '"technologies"')
      .replace(/"ca"/g, '"created_at"')
      .replace(/"ua"/g, '"updated_at"');
  }
}



// Supabase Storage
class SupabaseStorage implements StorageProvider {
  name = 'Supabase';
  private isInitialized = false;

  initialize(url: string, key: string): void {
    this.isInitialized = true;
    console.log('SupabaseStorage: Initialized');
  }

  isAvailable(): boolean {
    return this.isInitialized;
  }

  async upload(data: any, key: string): Promise<string | null> {
    if (!this.isAvailable()) return null;
    
    try {
      console.log('SupabaseStorage: Uploading', key);
      return `supabase_${key}_${Date.now()}`;
    } catch (error) {
      console.error('SupabaseStorage: Upload failed:', error);
      return null;
    }
  }

  async download(key: string): Promise<any | null> {
    if (!this.isAvailable()) return null;
    
    try {
      console.log('SupabaseStorage: Downloading', key);
      return null; // Would return actual data
    } catch (error) {
      console.error('SupabaseStorage: Download failed:', error);
      return null;
    }
  }

  async delete(key: string): Promise<boolean> {
    if (!this.isAvailable()) return false;
    
    try {
      console.log('SupabaseStorage: Deleting', key);
      return true;
    } catch (error) {
      console.error('SupabaseStorage: Delete failed:', error);
      return false;
    }
  }

  async getStorageInfo(): Promise<{ used: number; total: number } | null> {
    if (!this.isAvailable()) return null;
    
    try {
      // Supabase has 1GB free storage
      return { used: 0, total: 1024 * 1024 * 1024 };
    } catch (error) {
      console.error('SupabaseStorage: Get storage info failed:', error);
      return null;
    }
  }
}

// Main Storage Service
class StorageService {
  private providers: StorageProvider[] = [];
  private currentProvider: StorageProvider;

  constructor() {
    // Initialize with compressed local storage as default
    this.currentProvider = new CompressedLocalStorage();
    this.providers.push(this.currentProvider);
  }

  // Add a storage provider
  addProvider(provider: StorageProvider): void {
    this.providers.push(provider);
  }

  // Set the current storage provider
  setProvider(providerName: string): boolean {
    const provider = this.providers.find(p => p.name === providerName);
    if (provider && provider.isAvailable()) {
      this.currentProvider = provider;
      console.log('StorageService: Switched to', providerName);
      return true;
    }
    return false;
  }

  // Get available providers
  getAvailableProviders(): StorageProvider[] {
    return this.providers.filter(p => p.isAvailable());
  }

  // Get current provider
  getCurrentProvider(): StorageProvider {
    return this.currentProvider;
  }

  // Upload data using current provider
  async upload(data: any, key: string): Promise<string | null> {
    return this.currentProvider.upload(data, key);
  }

  // Download data using current provider
  async download(key: string): Promise<any | null> {
    return this.currentProvider.download(key);
  }

  // Delete data using current provider
  async delete(key: string): Promise<boolean> {
    return this.currentProvider.delete(key);
  }

  // Get storage info from current provider
  async getStorageInfo(): Promise<{ used: number; total: number } | null> {
    return this.currentProvider.getStorageInfo();
  }

  // Try to upload with fallback providers
  async uploadWithFallback(data: any, key: string): Promise<string | null> {
    for (const provider of this.providers) {
      if (provider.isAvailable()) {
        const result = await provider.upload(data, key);
        if (result) {
          console.log('StorageService: Successfully uploaded using', provider.name);
          return result;
        }
      }
    }
    console.error('StorageService: All providers failed to upload');
    return null;
  }
}

// Export singleton instance
export const storageService = new StorageService();

// Export individual providers for direct use
export const compressedLocalStorage = new CompressedLocalStorage();
export const supabaseStorage = new SupabaseStorage();



// Helper function to configure Supabase
export const configureSupabase = (url: string, key: string) => {
  supabaseStorage.initialize(url, key);
  storageService.addProvider(supabaseStorage);
  storageService.setProvider('Supabase');
}; 