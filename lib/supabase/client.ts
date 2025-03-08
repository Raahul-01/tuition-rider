import { createClient } from '@supabase/supabase-js';
import { toast } from 'sonner';
import type { AuthChangeEvent, Session } from '@supabase/supabase-js';

if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
  throw new Error('Missing Supabase URL or Anon Key');
}

// Initialize Supabase client
const supabaseClient = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  {
    auth: {
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: false
    },
    global: {
      headers: {
        'Accept': 'application/vnd.pgrst.object+json, application/json',
        'Content-Type': 'application/json',
        'apikey': process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
        'Prefer': 'return=representation'
      }
    },
    db: {
      schema: 'public'
    }
  }
);

// Add auth state change listener
supabaseClient.auth.onAuthStateChange((event: AuthChangeEvent, session: Session | null) => {
  if (event === 'SIGNED_IN') {
    toast.success('Successfully signed in!');
  } else if (event === 'SIGNED_OUT') {
    toast.info('Signed out');
  }
});

export const supabase = supabaseClient;

// Helper function to make authenticated requests
export const makeAuthenticatedRequest = async (endpoint: string, options: { headers?: Record<string, string> } = {}) => {
  try {
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session) {
      toast.error('Authentication required');
      throw new Error('No active session');
    }

    const headers: Record<string, string> = {
      'Accept': 'application/vnd.pgrst.object+json, application/json',
      'Content-Type': 'application/json',
      'Prefer': 'return=representation',
      'Accept-Profile': 'public'
    };

    if (process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
      headers.apikey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    }

    if (session?.access_token) {
      headers.Authorization = `Bearer ${session.access_token}`;
    }

    const finalHeaders = {
      ...headers,
      ...options.headers
    };

    const fullUrl = endpoint.startsWith('http') ? endpoint : `${process.env.NEXT_PUBLIC_SUPABASE_URL}${endpoint}`;
    
    const response = await fetch(fullUrl, {
      ...options,
      headers: finalHeaders
    });

    if (!response.ok) {
      throw new Error('Request failed');
    }

    return response;
  } catch (error: any) {
    toast.error(error.message || 'Request failed');
    throw error;
  }
};

// Check email verification status without sending emails
export const checkEmailVerification = async (email: string) => {
  try {
    toast.loading('Checking email verification...');
    
    // First try to get user data directly
    const { data, error } = await supabase
      .from('profiles')
      .select('email')
      .eq('email', email)
      .single();

    if (error) {
      toast.error('Email not found');
      return { 
        verified: false, 
        message: 'Email not found in system',
        isRegistered: false
      };
    }

    // If email exists, check auth status
    const { data: authData, error: authError } = await supabase.auth.getUser();
    
    if (authError) {
      toast.warning('Please login to verify your account');
      return { 
        verified: false,
        message: 'Please login to verify your account',
        isRegistered: true
      };
    }

    toast.success('Email is verified');
    return { 
      verified: true,
      message: 'Email is verified',
      isRegistered: true,
      userId: authData.user?.id
    };
  } catch (error: any) {
    console.error('Verification check error:', error);
    toast.error('Unable to verify email status');
    return { 
      verified: false,
      message: 'Unable to verify email status',
      isRegistered: false
    };
  }
};

// Helper function to handle rate limiting
export const withRateLimit = async <T>(
  operation: () => Promise<T>,
  retries = 3,
  delay = 1000
): Promise<T> => {
  for (let i = 0; i < retries; i++) {
    try {
      return await operation()
    } catch (error: any) {
      if (
        error.message.includes('rate limit') ||
        error.message.includes('too many requests')
      ) {
        if (i === retries - 1) throw error
        await new Promise(resolve => setTimeout(resolve, delay * Math.pow(2, i)))
        continue
      }
      throw error
    }
  }
  throw new Error('Rate limit exceeded after retries')
} 