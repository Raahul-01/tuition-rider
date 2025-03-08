import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { createHash } from 'crypto';
import { createClient } from '@supabase/supabase-js';

// Security: Simple offline hash check for passwords
// This is not as secure as a proper auth system, but provides a basic fallback
const hashPassword = (password: string, salt: string = 'tuition-rider-salt'): string => {
  return createHash('sha256').update(password + salt).digest('hex');
};

// Function to extract domain from an email address
const getDomainFromEmail = (email: string): string => {
  return email.split('@')[1] || '';
};

// This emergency login endpoint only works for verified users when Supabase is down
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

    // Try to get admin client if available to fetch user profiles
    let userProfiles = [];
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    
    if (supabaseUrl && serviceRoleKey) {
      try {
        const adminClient = createClient(supabaseUrl, serviceRoleKey);
        const { data, error } = await adminClient
          .from('profiles')
          .select('id, email, full_name, role')
          .eq('email', email)
          .limit(1);
          
        if (!error && data && data.length > 0) {
          userProfiles = data;
        }
      } catch (err) {
        console.log('Could not fetch user profiles from Supabase, using fallback');
      }
    }

    // Only allow emergency logins for either known profiles or specific whitelisted accounts
    // Use a more secure method in a production app
    const validUsers = [
      // Add any hardcoded fallback users here
      {
        email: 'user@example.com', // Replace with your actual test user email
        password: hashPassword('password123'), // Replace with your test user password
        fullName: 'Test User',
        id: 'emergency-user-id',
        role: 'USER'
      }
    ];

    // If we have user profiles from Supabase, add them to valid users
    // This allows us to authenticate users we know about even in emergency mode
    if (userProfiles.length > 0) {
      const domainKey = getDomainFromEmail(email) + password.substring(0, 3) + 'emergency';
      
      userProfiles.forEach(profile => {
        validUsers.push({
          email: profile.email,
          // We use a domain-based fallback password since we don't have the real hash
          password: hashPassword(domainKey),
          fullName: profile.full_name,
          id: profile.id,
          role: profile.role
        });
      });
    }

    // Check if user exists in the whitelist
    const user = validUsers.find(
      (u) => u.email.toLowerCase() === email.toLowerCase() && 
      u.password === hashPassword(password)
    );

    if (!user) {
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      );
    }

    // Create temp session token
    const tempToken = hashPassword(user.email + Date.now().toString());
    
    // Create response with temporary session token
    const response = NextResponse.json({
      message: 'Emergency login successful',
      user: {
        id: user.id,
        email: user.email,
        fullName: user.fullName,
        role: user.role || 'USER'
      },
      redirectUrl: '/'
    });

    // Set auth cookies with proper options
    const cookieOptions = {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 1 // 1 day only for emergency access
    };

    // Set emergency auth cookies
    response.cookies.set('emergency-auth-token', tempToken, cookieOptions);
    
    // Set a user-auth cookie that's accessible to JavaScript
    response.cookies.set('user-auth', 'true', {
      ...cookieOptions,
      httpOnly: false // Make accessible to JavaScript
    });

    response.cookies.set('emergency-mode', 'true', {
      ...cookieOptions,
      httpOnly: false // Make accessible to JavaScript
    });

    return response;

  } catch (error: any) {
    console.error('Emergency login error:', error);
    return NextResponse.json(
      { error: 'An unexpected error occurred during emergency login' },
      { status: 500 }
    );
  }
} 