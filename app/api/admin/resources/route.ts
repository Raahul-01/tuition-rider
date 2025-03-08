import { createClient } from '@supabase/supabase-js';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

// Environment variables
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!;

export async function GET(request: Request) {
  // Check for admin cookie
  const cookieStore = await cookies();
  const adminCookie = cookieStore.get('admin-auth');
  
  if (!adminCookie || adminCookie.value !== 'true') {
    return NextResponse.json(
      { error: 'Unauthorized: Admin authentication required' },
      { status: 401 }
    );
  }
  
  try {
    // Use the service role key for admin access
    const adminClient = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);
    
    // Try to fetch resources with admin privileges
    const { data, error } = await adminClient
      .from('resources')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error('Error fetching resources with service role:', error);
      return NextResponse.json(
        { error: `Failed to fetch resources: ${error.message}` },
        { status: 500 }
      );
    }
    
    return NextResponse.json({ resources: data || [] });
  } catch (error) {
    console.error('Unexpected error:', error);
    return NextResponse.json(
      { error: 'An unexpected error occurred' },
      { status: 500 }
    );
  }
} 