import { supabase, makeAuthenticatedRequest } from './client';

export async function getProfileByEmail(email: string) {
  try {
    // First try with the Supabase client
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('email', email)
      .limit(1)
      .single();
    
    if (!error && data) {
      return data;
    }

    // If that fails, try with the authenticated request
    const response = await makeAuthenticatedRequest(
      `/rest/v1/profiles?select=*&email=eq.${encodeURIComponent(email)}`,
      {
        headers: {
          'Accept': 'application/vnd.pgrst.object+json',
          'Accept-Profile': 'public'
        }
      }
    );
    
    if (!response.ok) {
      console.error('Profile fetch error:', {
        status: response.status,
        statusText: response.statusText,
        headers: Object.fromEntries(response.headers.entries())
      });
      throw new Error(`Failed to fetch profile: ${response.status} ${response.statusText}`);
    }
    
    const responseData = await response.json();
    return responseData;
  } catch (error) {
    console.error('Error fetching profile by email:', error);
    throw error;
  }
}

export async function getProfileByEmailWithClient(email: string) {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('email', email)
      .single();
    
    if (error) {
      console.error('Supabase client error:', error);
      throw error;
    }
    
    return data;
  } catch (error) {
    console.error('Error fetching profile by email:', error);
    throw error;
  }
} 