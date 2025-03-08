import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

const ADMIN_EMAIL = 'tuitionrider1@gmail.com';
const ADMIN_PASSWORD = 'Admin@123';
const ADMIN_REG_NO = 'ADM00191';

export async function POST() {
  try {
    console.log('Starting admin setup...');
    
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
      throw new Error('Missing Supabase URL or Anon Key');
    }

    // Create regular client
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    );

    // Step 1: Sign up the admin user
    console.log('Creating admin user account...');
    const { data: signupData, error: signupError } = await supabase.auth.signUp({
      email: ADMIN_EMAIL,
      password: ADMIN_PASSWORD,
      options: {
        data: {
          role: 'ADMIN',
          full_name: 'Admin User',
          registration_number: ADMIN_REG_NO
        }
      }
    });

    if (signupError) {
      console.error('Error creating admin user:', signupError);
      throw new Error(`Failed to create admin user: ${signupError.message}`);
    }

    if (!signupData.user) {
      throw new Error('No user returned from creation');
    }

    console.log(`Admin user created with ID: ${signupData.user.id}`);

    // Step 2: Create admin profile
    console.log('Creating admin profile...');
    const profileData = {
      id: signupData.user.id,
      email: ADMIN_EMAIL,
      role: 'ADMIN',
      registration_number: ADMIN_REG_NO,
      full_name: 'Admin User',
      phone: '0000000000',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      last_login: null,
      login_count: 0,
      failed_attempts: 0,
      security_level: 'ADMIN'
    };

    console.log('Profile data:', profileData);

    const { error: profileError } = await supabase
      .from('profiles')
      .upsert(profileData);

    if (profileError) {
      console.error('Error creating profile:', profileError);
      throw new Error(`Failed to create admin profile: ${profileError.message}`);
    }

    // Verify the admin profile was created
    const { data: verifyProfile, error: verifyError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', signupData.user.id)
      .single();

    if (verifyError) {
      console.error('Error verifying profile:', verifyError);
    } else {
      console.log('Verified admin profile:', verifyProfile);
    }

    console.log('Admin setup completed successfully');

    return NextResponse.json({
      success: true,
      message: 'Admin setup completed successfully',
      credentials: {
        email: ADMIN_EMAIL,
        password: ADMIN_PASSWORD,
        registrationNumber: ADMIN_REG_NO
      }
    });

  } catch (error: any) {
    console.error('Admin setup failed:', error);
    return NextResponse.json(
      { 
        error: error.message || 'Admin setup failed',
        details: error.stack
      },
      { status: 500 }
    );
  }
} 