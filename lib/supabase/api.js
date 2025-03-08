import { supabaseFetch, supabaseRpc } from './fetch';

/**
 * Get a profile by email using the Supabase REST API
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
 * Get all profiles using the Supabase REST API
 * @param {Object} options - Query options
 * @param {number} options.limit - Maximum number of profiles to return
 * @param {string} options.order - Field to order by
 * @param {boolean} options.ascending - Whether to order ascending or descending
 * @returns {Promise<Array>} - The profiles data
 */
export async function getProfiles({ limit = 10, order = 'created_at', ascending = false } = {}) {
  try {
    const response = await supabaseFetch(
      `profiles?select=*&order=${order}.${ascending ? 'asc' : 'desc'}&limit=${limit}`
    );
    
    if (!response.ok) {
      throw new Error(`Failed to fetch profiles: ${response.status} ${response.statusText}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error fetching profiles:', error);
    throw error;
  }
}

/**
 * Update a profile using the Supabase REST API
 * @param {string} id - The profile ID
 * @param {Object} data - The data to update
 * @returns {Promise<Object>} - The updated profile
 */
export async function updateProfile(id, data) {
  try {
    const response = await supabaseFetch(
      `profiles?id=eq.${id}`,
      {
        method: 'PATCH',
        body: JSON.stringify(data),
        headers: {
          'Prefer': 'return=representation'
        }
      }
    );
    
    if (!response.ok) {
      throw new Error(`Failed to update profile: ${response.status} ${response.statusText}`);
    }
    
    const responseData = await response.json();
    return responseData[0] || null;
  } catch (error) {
    console.error('Error updating profile:', error);
    throw error;
  }
}

/**
 * Admin login using the Supabase RPC function
 * @param {string} registrationNumber - The admin registration number
 * @param {string} password - The admin password
 * @returns {Promise<Object>} - The admin profile
 */
export async function adminLogin(registrationNumber, password) {
  try {
    console.log('Attempting admin login with registration number:', registrationNumber);
    
    // Call the admin_login RPC function
    const result = await supabaseRpc('admin_login', {
      p_registration_number: registrationNumber,
      p_password: password
    });
    
    console.log('Admin login successful:', result);
    
    if (!result || result.length === 0) {
      throw new Error('No profile returned from admin_login');
    }
    
    return result[0];
  } catch (error) {
    console.error('Admin login error:', error);
    throw error;
  }
} 