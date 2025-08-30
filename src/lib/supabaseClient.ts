import { createClient, SupabaseClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

let supabase: SupabaseClient | null = null;

try {
  if (!supabaseUrl || !supabaseKey) {
    console.warn('Supabase environment variables missing. Some features may not work.');
    console.warn('Please set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in your environment variables.');
    
    // Create a mock client for development/fallback
    supabase = null;
  } else {
    supabase = createClient(supabaseUrl, supabaseKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
      },
      global: {
        headers: {
          'X-Client-Info': 'maheep-portfolio'
        }
      }
    });
    console.log('Supabase client initialized successfully');
  }
} catch (error) {
  console.error('Failed to initialize Supabase client:', error);
  supabase = null;
}

export default supabase; 