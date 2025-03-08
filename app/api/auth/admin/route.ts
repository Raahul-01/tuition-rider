import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

// Hard-coded admin credentials - in a real app, these would be securely stored
const ADMIN_EMAIL = 'tuitionrider1@gmail.com';
const ADMIN_PASSWORD = 'Admin91912';
const ADMIN_REG_NO = 'ADM00191';

export async function POST(request: Request) {
  try {
    const { registrationNumber, password } = await request.json();

    // Validate input
    if (!registrationNumber || !password) {
      return NextResponse.json(
        { error: 'Registration number and password are required' },
        { status: 400 }
      );
    }

    // Simple direct credential check
    if (registrationNumber !== ADMIN_REG_NO || password !== ADMIN_PASSWORD) {
      return NextResponse.json(
        { error: 'Invalid admin credentials' },
        { status: 401 }
      );
    }

    // Create response with proper session handling
    const response = NextResponse.json({
      message: 'Login successful',
      redirectUrl: '/admin', // Explicitly specify the redirect URL
      profile: {
        id: '00000000-0000-0000-0000-000000000000', // Valid UUID format
        email: ADMIN_EMAIL,
        role: 'ADMIN',
        registration_number: ADMIN_REG_NO,
        full_name: 'Admin User',
        last_login: new Date().toISOString()
      },
      user: {
        id: '00000000-0000-0000-0000-000000000000', // Valid UUID format
        email: ADMIN_EMAIL,
        role: 'ADMIN'
      }
    });

    // Set a persistent admin auth cookie
    response.cookies.set('admin-auth', 'true', {
      httpOnly: false, // Allow JavaScript to read this cookie
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 7 // 1 week in seconds
    });

    // Set admin session cookie
    response.cookies.set('admin-session', JSON.stringify({
      id: '00000000-0000-0000-0000-000000000000', // Valid UUID format
      email: ADMIN_EMAIL,
      role: 'ADMIN',
      exp: Math.floor(Date.now() / 1000) + (60 * 60 * 24 * 7) // 1 week expiry
    }), {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 7 // 1 week in seconds
    });

    return response;

  } catch (error: any) {
    return NextResponse.json(
      { error: 'An unexpected error occurred. Please try again.' },
      { status: 500 }
    );
  }
} 