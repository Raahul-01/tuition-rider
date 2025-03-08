// This script tests the admin login functionality
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase URL or key in environment variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function testAdminLogin() {
  try {
    console.log('Testing admin login...');
    
    // First, sign in with a known admin account to get a valid session
    console.log('Signing in with admin account...');
    const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
      email: 'tuitionrider1@gmail.com', // Replace with your admin email
      password: 'your-admin-password' // Replace with your admin password
    });
    
    if (signInError) {
      console.error('Sign in error:', signInError);
      return;
    }
    
    console.log('Sign in successful:', signInData.user.email);
    
    // Now call the admin_login RPC function
    console.log('Calling admin_login RPC function...');
    const { data: adminProfile, error: loginError } = await supabase
      .rpc('admin_login', {
        p_registration_number: 'ADMIN001', // Replace with your admin registration number
        p_password: 'your-admin-password' // Replace with your admin password
      });
    
    if (loginError) {
      console.error('Admin login error:', loginError);
      return;
    }
    
    console.log('Admin login successful:', adminProfile);
    
    // Sign out
    await supabase.auth.signOut();
    console.log('Signed out');
  } catch (error) {
    console.error('Test failed:', error);
  }
}

// Run the test
testAdminLogin(); 