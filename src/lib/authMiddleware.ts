import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from './jwt';
import { findAdminUserById } from './users';
import { UserStatus } from '@/types/user';

/**
 * Middleware to validate admin authentication
 * Use as a wrapper around your API route handlers
 */
export async function withAdminAuth(handler: (req: NextRequest) => Promise<NextResponse>) {
  return async function(req: NextRequest) {
    try {
      // Skip auth for login route
      if (req.nextUrl.pathname === '/api/admin/login') {
        return handler(req);
      }

      // Get JWT token from cookie
      const token = req.cookies.get('jwt')?.value;
      if (!token) {
        return NextResponse.json(
          { error: 'Unauthorized - No token provided' },
          { status: 401 }
        );
      }

      // Verify JWT token
      const payload = await verifyToken(token);
      if (!payload) {
        return NextResponse.json(
          { error: 'Unauthorized - Invalid or expired token' },
          { status: 401 }
        );
      }

      // Verify user exists and is active
      const user = await findAdminUserById(payload.userId);
      if (!user) {
        return NextResponse.json(
          { error: 'Unauthorized - User not found' },
          { status: 401 }
        );
      }

      if (user.status !== UserStatus.ACTIVE) {
        return NextResponse.json(
          { error: 'Unauthorized - Account is not active' },
          { status: 403 }
        );
      }

      // Call the handler
      const response = await handler(req);

      // Create user data object
      const userData = {
        userId: user.id,
        username: user.username,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role,
        permissions: user.permissions,
        profile: user.profile,
        status: user.status,
        lastActivity: new Date().toISOString()
      };

      // Return new response with user data
      return NextResponse.json(userData, response);

    } catch (error) {
      console.error('Auth middleware error:', error);
      return NextResponse.json(
        { error: 'Internal server error' },
        { status: 500 }
      );
    }
  };
} 