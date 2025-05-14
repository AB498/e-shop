import { NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';

export async function middleware(request) {
  const { pathname } = request.nextUrl;

  // Get the token
  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
  });

  // Log token for debugging (in production, you'd want to remove this)
  console.log('Middleware - Path:', pathname);
  console.log('Middleware - Token:', token ? 'Token exists' : 'No token');

  // Check if the user is authenticated
  const isAuthenticated = !!token;

  // Check if the user is an admin
  const isAdmin = token?.role === 'admin';

  // Define protected routes
  const protectedRoutes = [
    '/profile',
    '/checkout',
  ];

  // Define auth routes
  const authRoutes = [
    '/auth/login',
    '/auth/register',
  ];

  // Define admin routes
  const isAdminRoute = pathname.startsWith('/admin');

  // Check if the current route is protected
  const isProtectedRoute = protectedRoutes.some(route =>
    pathname.startsWith(route)
  );

  // Check if the current route is an auth route
  const isAuthRoute = authRoutes.some(route =>
    pathname.startsWith(route)
  );

  // Redirect logic for admin routes
  if (isAdminRoute) {
    // If not authenticated, redirect to login
    if (!isAuthenticated) {
      return NextResponse.redirect(new URL('/auth/login', request.url));
    }

    // If authenticated but not admin, redirect to home with a message
    if (!isAdmin) {
      const redirectUrl = new URL('/', request.url);
      redirectUrl.searchParams.set('adminRedirect', 'true');
      return NextResponse.redirect(redirectUrl);
    }
  }

  // Redirect logic for protected routes
  if (isProtectedRoute && !isAuthenticated) {
    // Redirect to login if trying to access protected route while not authenticated
    return NextResponse.redirect(new URL('/auth/login', request.url));
  }

  // Redirect logic for auth routes
  if (isAuthRoute && isAuthenticated) {
    // Redirect to home if trying to access auth routes while authenticated
    return NextResponse.redirect(new URL('/', request.url));
  }

  // Continue with the request
  return NextResponse.next();
}

// Configure which routes the middleware should run on
export const config = {
  matcher: [
    '/profile/:path*',
    '/checkout/:path*',
    '/auth/:path*',
    '/admin/:path*',
  ],
};
