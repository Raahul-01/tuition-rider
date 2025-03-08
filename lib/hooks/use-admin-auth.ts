'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { getCookie, setCookie } from 'cookies-next';

export function useAdminAuth() {
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const checkAdminAuth = () => {
      const adminAuth = getCookie('admin-auth');
      
      if (adminAuth === 'true') {
        setIsAdmin(true);
        // Refresh the cookie to extend its lifetime
        setCookie('admin-auth', 'true', {
          maxAge: 60 * 60 * 24 * 7, // 1 week
          path: '/',
        });
      } else if (pathname?.startsWith('/admin') && !pathname.includes('/auth')) {
        // Redirect to auth page if not authenticated and accessing admin routes
        router.push('/auth');
      }
      
      setIsLoading(false);
    };

    checkAdminAuth();
    
    // Set up cookie refresh interval
    const interval = setInterval(() => {
      const adminAuth = getCookie('admin-auth');
      if (adminAuth === 'true') {
        setCookie('admin-auth', 'true', {
          maxAge: 60 * 60 * 24 * 7, // 1 week
          path: '/',
        });
      }
    }, 1000 * 60 * 60); // Refresh every hour
    
    return () => clearInterval(interval);
  }, [pathname, router]);

  const logout = () => {
    setCookie('admin-auth', '', { maxAge: -1, path: '/' });
    setCookie('admin-session', '', { maxAge: -1, path: '/' });
    setIsAdmin(false);
    router.push('/auth');
  };

  return { isAdmin, isLoading, logout };
} 