import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { verifyToken } from '@/lib/jwt';

export async function middleware(request: NextRequest) {
  // Check if it's an admin route
  if (request.nextUrl.pathname.startsWith('/admin')) {
    // Skip middleware for login page
    if (request.nextUrl.pathname === '/admin/login') {
      return NextResponse.next();
    }

    try {
      // Check JWT token
      const token = request.cookies.get('jwt')?.value;
      if (!token) {
        console.log('No token');
        const response = NextResponse.redirect(new URL('/admin/login', request.url));
        response.cookies.delete('jwt');
        return response;
      }

      // Verify JWT token
      const payload = await verifyToken(token);
      if (!payload) {
        console.log('Invalid token', payload);
        const response = NextResponse.redirect(new URL('/admin/login', request.url));
        response.cookies.delete('jwt');
        return response;
      }

      // Create response with user info in both headers and cookies
      const response = NextResponse.next();
      
      // Set headers
      response.headers.set('x-user-id', payload.userId);
      response.headers.set('x-user-role', payload.role);
      response.headers.set('x-user-name', payload.username);
      
      // Set cookies with same data
      response.cookies.set('x-user-id', payload.userId, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict'
      });
      response.cookies.set('x-user-role', payload.role, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict'
      });
      response.cookies.set('x-user-name', payload.username, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict'
      });

      return response;
    } catch (error) {
      console.error('Middleware error:', error);
      const response = NextResponse.redirect(new URL('/admin/login', request.url));
      response.cookies.delete('jwt');
      return response;
    }
  }

  // For API routes
  if (request.nextUrl.pathname.startsWith('/api/admin')) {
    // Skip middleware for login route
    if (request.nextUrl.pathname === '/api/admin/login') {
      return NextResponse.next();
    }

    try {
      const token = request.cookies.get('jwt')?.value;
      if (!token) {
        return NextResponse.json(
          { error: 'Unauthorized - No token provided' },
          { status: 401 }
        );
      }

      const payload = await verifyToken(token);
      if (!payload) {
        return NextResponse.json(
          { error: 'Unauthorized - Invalid or expired token' },
          { status: 401 }
        );
      }

      // Create response with user info in both headers and cookies
      const response = NextResponse.next();
      
      // Set headers
      response.headers.set('x-user-id', payload.userId);
      response.headers.set('x-user-role', payload.role);
      response.headers.set('x-user-name', payload.username);

      return response;
    } catch (error) {
      console.error('API middleware error:', error);
      return NextResponse.json(
        { error: 'Internal server error' },
        { status: 500 }
      );
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/admin/:path*',
    '/api/admin/:path*'
  ]
};