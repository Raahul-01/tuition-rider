import { patchGlobalFetch } from './fetch';

// This function should be called in your app's entry point
export function initSupabaseAuth() {
  // Patch global fetch to add authentication headers for Supabase API calls
  const unpatch = patchGlobalFetch();
  
  // Return the unpatch function in case you need to restore the original fetch
  return unpatch;
}

// Export a function to get the Supabase URL and key
export function getSupabaseConfig() {
  return {
    url: process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://amcqnrbsdqrjihuxmtfn.supabase.co',
    key: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  };
} 