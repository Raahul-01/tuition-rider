'use client';

import { useEffect } from 'react';
import { initSupabaseAuth } from '@/lib/supabase/init';

interface SupabaseProviderProps {
  children: React.ReactNode;
}

export function SupabaseProvider({ children }: SupabaseProviderProps) {
  useEffect(() => {
    // Initialize Supabase authentication patch
    const unpatch = initSupabaseAuth();
    
    // Clean up when component unmounts
    return () => {
      unpatch();
    };
  }, []);
  
  return <>{children}</>;
} 