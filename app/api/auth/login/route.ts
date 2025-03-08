import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();

    // Validate input
    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      );
    }

    // Create Supabase client
    const supabase = createRouteHandlerClient({ cookies });

    // Attempt to sign in
    const { data, error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password
    });
    
    if (signInError) {
      console.error('Sign in error:', signInError);
      
      // Format the error message for users
      let errorMessage = 'Invalid email or password';
      let statusCode = 401;
      
      // Check for specific error conditions
      if (signInError.message.includes('Email not confirmed')) {
        errorMessage = 'Please verify your email address before signing in.';
      }
      
      // Network-related errors
      if (signInError.message.includes('fetch failed') || signInError.status === 0) {
        errorMessage = 'Connection failed. Please check your internet connection.';
        statusCode = 503;
      }
      
      return NextResponse.json(
        { error: errorMessage },
        { status: statusCode }
      );
    }

    if (!data?.user) {
      return NextResponse.json(
        { error: 'No user data returned' },
        { status: 401 }
      );
    }

    // Try to get user profile
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', data.user.id)
      .single();

    // If profile doesn't exist, create one
    if (profileError && profileError.code === 'PGRST116') {
      console.log('Profile not found, creating profile for user');
      
      // Create user profile
      await supabase
        .from('profiles')
        .insert({
          id: data.user.id,
          full_name: data.user.user_metadata?.full_name || data.user.email?.split('@')[0] || 'User',
          email: data.user.email,
          phone: data.user.user_metadata?.phone || '',
          role: 'USER',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          last_login: new Date().toISOString(),
          login_count: 1,
          failed_attempts: 0
        });
    } else if (profile) {
      // Update login info for existing profile
      await supabase
        .from('profiles')
        .update({
          last_login: new Date().toISOString(),
          login_count: (profile.login_count || 0) + 1,
          failed_attempts: 0,
          updated_at: new Date().toISOString()
        })
        .eq('id', data.user.id);
    }

    // Create user data for the response
    const userData = {
      id: data.user.id,
      email: data.user.email,
      fullName: profile?.full_name || data.user.user_metadata?.full_name || data.user.email?.split('@')[0] || 'User',
      role: profile?.role || 'USER'
    };

    // Create response with proper session handling
    const response = NextResponse.json({
      message: 'Login successful',
      user: userData,
      redirectUrl: '/'
    });

    // Set auth cookies with proper options
    const cookieOptions = {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 7 // 1 week in seconds
    };

    response.cookies.set('sb-access-token', data.session.access_token, cookieOptions);
    response.cookies.set('sb-refresh-token', data.session.refresh_token, cookieOptions);
    
    // Set a user-auth cookie that's accessible to JavaScript
    response.cookies.set('user-auth', 'true', {
      ...cookieOptions,
      httpOnly: false // Make accessible to JavaScript
    });

    return response;

  } catch (error: any) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: 'An unexpected error occurred. Please try again later.' },
      { status: 500 }
    );
  }
} 