import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { createClient } from '@supabase/supabase-js'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export const runtime = 'edge'

// Initialize admin client only if environment variables are available
const initSupabaseAdmin = () => {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY
  
  if (!supabaseUrl || !serviceRoleKey) {
    return null
  }

  return createClient(supabaseUrl, serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  })
}

export async function POST(request: Request) {
  try {
    const { fullName, email, password, phone } = await request.json();

    // Validate input
    if (!fullName || !email || !password) {
      return NextResponse.json(
        { error: 'Full name, email, and password are required' },
        { status: 400 }
      );
    }

    // Create Supabase client
    const supabase = createRouteHandlerClient({ cookies });

    // Try admin client for more advanced operations
    const adminClient = initSupabaseAdmin();

    // Check if email exists in auth system
    if (adminClient) {
      const { data: existingAuth } = await adminClient.auth.admin.listUsers({
        filters: {
          email: email
        }
      });

      if (existingAuth?.users?.length > 0) {
        return NextResponse.json(
          { error: 'Email already registered. Please use login instead.' },
          { status: 400 }
        );
      }
    } else {
      // Fallback check using regular client
      const { data: existingUser } = await supabase
        .from('profiles')
        .select('email')
        .eq('email', email)
        .single();

      if (existingUser) {
        return NextResponse.json(
          { error: 'Email already registered. Please use login instead.' },
          { status: 400 }
        );
      }
    }

    // Format phone number properly
    const formattedPhone = phone ? phone.trim() : '';

    // Create auth user with enhanced metadata
    const { data: { user }, error: createError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
          phone: formattedPhone
        },
        emailRedirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/auth/callback`
      }
    });

    if (createError) {
      console.error('User creation error:', createError);
      
      // Handle specific error messages
      if (createError.message.includes('Password should be at least')) {
        return NextResponse.json(
          { error: 'Password is too weak. Please use at least 6 characters including letters and numbers.' },
          { status: 400 }
        );
      }
      
      if (createError.message.includes('Email already registered')) {
        return NextResponse.json(
          { error: 'Email already registered. Please use login instead.' },
          { status: 400 }
        );
      }
      
      return NextResponse.json(
        { error: createError.message || 'Failed to create user account' },
        { status: 500 }
      );
    }

    if (!user) {
      return NextResponse.json(
        { error: 'Failed to create user account' },
        { status: 500 }
      );
    }

    // Check if the user was created but email confirmation is required
    const isEmailConfirmationRequired = user.confirmation_sent_at && !user.confirmed_at;

    // Create user profile regardless of email confirmation status
    try {
      const { error: profileError } = await supabase
        .from('profiles')
        .insert({
          id: user.id,
          full_name: fullName,
          email,
          phone: formattedPhone,
          role: 'USER',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          last_login: null,
          login_count: 0,
          failed_attempts: 0,
          security_level: 'STANDARD'
        });

      if (profileError) {
        console.error('Profile creation error:', profileError);
        
        // Try to clean up the auth user if profile creation fails
        try {
          if (adminClient) {
            await adminClient.auth.admin.deleteUser(user.id);
          }
        } catch (deletionError) {
          console.error('Failed to clean up auth user:', deletionError);
        }
        
        return NextResponse.json(
          { error: 'Failed to create user profile' },
          { status: 500 }
        );
      }
    } catch (profileCreationError) {
      console.error('Profile creation exception:', profileCreationError);
      return NextResponse.json(
        { error: 'Error during profile creation' },
        { status: 500 }
      );
    }

    // Return appropriate response based on email confirmation status
    if (isEmailConfirmationRequired) {
      return NextResponse.json({
        message: 'Registration successful! Please check your email to verify your account.',
        requiresEmailConfirmation: true,
        user: {
          id: user.id,
          email: user.email,
          fullName,
          role: 'USER'
        }
      });
    } else {
      // If email confirmation is not required, allow immediate login
      return NextResponse.json({
        message: 'Registration successful! You can now log in.',
        requiresEmailConfirmation: false,
        user: {
          id: user.id,
          email: user.email,
          fullName,
          role: 'USER'
        }
      });
    }

  } catch (error: any) {
    console.error('Registration failed:', error);
    return NextResponse.json(
      { error: 'Registration failed. Please try again.' },
      { status: 500 }
    );
  }
} 