import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

// This is a simplified login endpoint for testing only - DISABLED IN PRODUCTION
export async function POST(request: Request) {
  // Don't allow this in production
  if (process.env.NODE_ENV === 'production') {
    return NextResponse.json(
      { error: 'Test login is not available in production' },
      { status: 403 }
    );
  }
  
  try {
    const { email, password } = await request.json();

    // Validate basic input
    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      );
    }

    // For testing, generate a user ID based on email
    const userId = Buffer.from(email).toString('base64').substring(0, 36);

    // Create response with session cookies
    const response = NextResponse.json({
      message: 'Test login successful - Debugging mode',
      user: {
        id: userId,
        email: email,
        fullName: email.split('@')[0],
        role: 'USER'
      },
      redirectUrl: '/'
    });

    // Set auth cookies
    const cookieOptions = {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 7 // 1 week
    };

    // Set test auth cookies
    response.cookies.set('test-auth-token', userId, cookieOptions);
    
    // Set standard auth cookies for compatibility
    response.cookies.set('user-auth', 'true', {
      ...cookieOptions,
      httpOnly: false
    });

    // Set a flag to indicate this is a test login
    response.cookies.set('test-mode', 'true', {
      ...cookieOptions,
      httpOnly: false
    });

    return response;

  } catch (error: any) {
    console.error('Test login error:', error);
    return NextResponse.json(
      { error: 'An unexpected error occurred during test login' },
      { status: 500 }
    );
  }
} 