import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

/**
 * Makes an authenticated fetch request to the Supabase REST API
 * @param {string} endpoint - The endpoint to fetch from (without the base URL)
 * @param {Object} options - Fetch options
 * @returns {Promise<Response>} - The fetch response
 */
export async function supabaseFetch(endpoint, options = {}) {
  const supabase = createClientComponentClient();
  const { data: { session } } = await supabase.auth.getSession();
  
  // Get the anon key from environment variables
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  
  if (!supabaseKey) {
    console.error('Supabase anon key is not defined in environment variables');
    throw new Error('Supabase anon key is not defined');
  }
  
  // Prepare headers with authentication
  const headers = {
    'apikey': supabaseKey,
    'Content-Type': 'application/json',
    ...options.headers,
  };
  
  // Add Authorization header if user is authenticated
  if (session?.access_token) {
    headers['Authorization'] = `Bearer ${session.access_token}`;
  } else {
    console.warn('No active session found. Request may fail with 401 Unauthorized');
  }
  
  // Prepare the full URL
  const baseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://amcqnrbsdqrjihuxmtfn.supabase.co';
  const url = endpoint.startsWith('http') ? endpoint : `${baseUrl}/rest/v1/${endpoint}`;
  
  console.log('Making authenticated request to:', url);
  
  // Make the authenticated request
  return fetch(url, {
    ...options,
    headers,
  });
}

/**
 * Makes an authenticated RPC call to Supabase
 * @param {string} functionName - The RPC function name to call
 * @param {Object} params - The parameters to pass to the function
 * @returns {Promise<any>} - The response data
 */
export async function supabaseRpc(functionName, params = {}) {
  try {
    const response = await supabaseFetch(
      `rpc/${functionName}`,
      {
        method: 'POST',
        body: JSON.stringify(params),
      }
    );
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error(`RPC call to ${functionName} failed:`, response.status, errorText);
      throw new Error(`RPC call failed: ${response.status} ${response.statusText}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error(`Error in RPC call to ${functionName}:`, error);
    throw error;
  }
}

/**
 * Helper function to get a profile by email
 * @param {string} email - The email to look up
 * @returns {Promise<Object>} - The profile data
 */
export async function getProfileByEmail(email) {
  try {
    const response = await supabaseFetch(
      `profiles?select=*&email=eq.${encodeURIComponent(email)}&limit=1`
    );
    
    if (!response.ok) {
      throw new Error(`Failed to fetch profile: ${response.status} ${response.statusText}`);
    }
    
    const data = await response.json();
    return data[0] || null;
  } catch (error) {
    console.error('Error fetching profile by email:', error);
    throw error;
  }
}

/**
 * Alternative method using the Supabase client (recommended)
 * @param {string} email - The email to look up
 * @returns {Promise<Object>} - The profile data
 */
export async function getProfileByEmailWithClient(email) {
  try {
    const supabase = createClientComponentClient();
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('email', email)
      .limit(1)
      .single();
    
    if (error) {
      throw error;
    }
    
    return data;
  } catch (error) {
    console.error('Error fetching profile by email:', error);
    throw error;
  }
}

/**
 * Monkey patch the global fetch to automatically add Supabase authentication headers
 * for Supabase API calls. This should be used with caution as it affects all fetch calls.
 */
export function patchGlobalFetch() {
  const originalFetch = global.fetch;
  
  global.fetch = async function(url, options = {}) {
    const urlString = url.toString();
    
    // Only intercept Supabase API calls
    if (urlString.includes('supabase.co/rest/v1')) {
      const supabase = createClientComponentClient();
      const { data: { session } } = await supabase.auth.getSession();
      
      // Get the anon key from environment variables
      const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
      
      if (!supabaseKey) {
        console.warn('Supabase anon key is not defined in environment variables');
      }
      
      // Prepare headers with authentication
      const headers = {
        ...(options.headers || {}),
      };
      
      // Add apikey header if not present
      if (!headers['apikey'] && supabaseKey) {
        headers['apikey'] = supabaseKey;
      }
      
      // Add Authorization header if user is authenticated and header not present
      if (!headers['Authorization'] && session?.access_token) {
        headers['Authorization'] = `Bearer ${session.access_token}`;
      }
      
      // Update options with new headers
      options = {
        ...options,
        headers,
      };
      
      console.log('Patched fetch request to:', urlString);
    }
    
    // Call original fetch with possibly modified options
    return originalFetch(url, options);
  };
  
  // Return a function to restore the original fetch
  return function unpatch() {
    global.fetch = originalFetch;
  };
} 