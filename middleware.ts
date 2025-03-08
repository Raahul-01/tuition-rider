import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Define which routes should be protected
// Include ALL possible admin routes - especially user-specific routes
const adminRoutes = [
  '/admin', 
  '/admin/resources', 
  '/admin/users', 
  '/admin/settings',
  '/admin/user/'  // Add this to catch all user detail pages
]
const userProtectedRoutes = ['/profile', '/settings', '/my-courses']

// Middleware runs on all routes
export async function middleware(req: NextRequest) {
  const adminAuthCookie = req.cookies.get('admin-auth');
  const userAuthCookie = req.cookies.get('user-auth');
  const url = req.nextUrl.clone();
  const path = url.pathname;

  // Check if the path is an admin route (using a more flexible approach)
  const isAdminRoute = path.startsWith('/admin');
  
  // Check if admin authentication is required
  if (isAdminRoute) {
    if (!adminAuthCookie || adminAuthCookie.value !== 'true') {
      url.pathname = '/auth';
      url.searchParams.set('callbackUrl', path);
      url.searchParams.set('mode', 'admin'); // Hint to show admin login
      return NextResponse.redirect(url);
    }
  }

  // Check if the route is a user-protected route
  if (userProtectedRoutes.some(route => path.startsWith(route))) {
    if (!userAuthCookie || userAuthCookie.value !== 'true') {
      url.pathname = '/auth';
      url.searchParams.set('callbackUrl', path);
      return NextResponse.redirect(url);
    }
  }

  // Add CORS headers for API routes
  if (path.startsWith('/api/')) {
    const response = NextResponse.next();
    response.headers.append('Access-Control-Allow-Credentials', 'true');
    response.headers.append('Access-Control-Allow-Origin', process.env.NEXT_PUBLIC_APP_URL || '*');
    response.headers.append('Access-Control-Allow-Methods', 'GET,DELETE,PATCH,POST,PUT,OPTIONS');
    response.headers.append(
      'Access-Control-Allow-Headers',
      'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
    );
    return response;
  }

  return NextResponse.next();
}

// Configure which paths should run middleware
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public (public files)
     * But include all admin routes, API routes, and protected user routes
     */
    '/((?!_next/static|_next/image|favicon.ico|public).*)',
    '/api/:path*',
    '/admin/:path*'
  ],
}