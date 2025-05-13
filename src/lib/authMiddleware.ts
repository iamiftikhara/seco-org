import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from './jwt';
import { findAdminUserById } from './users';
import { UserStatus } from '@/types/user';

type Handler = (req: NextRequest) => Promise<NextResponse>;

// Extend NextRequest to include user
declare module 'next/server' {
  interface NextRequest {
    user?: {
      id: string;
      username: string;
      firstName: string;
      lastName: string;
      email: string;
      role: string;
      permissions: any;
      profile: any;
      status: UserStatus;
    };
  }
}

/**
 * Middleware to validate admin authentication and attach user to request
 */
export function withAdminAuth(handler: Handler): Handler {
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
        // Create response with 403 status
        const response = NextResponse.json(
          { error: 'Unauthorized - Account is not active' },
          { status: 403 }
        );

        // Clear all auth cookies
        const cookiesToClear = [
          'jwt',
          'x-user-id',
          'x-user-role',
          'x-user-name'
        ];

        cookiesToClear.forEach(name => {
          response.cookies.delete(name);
        });

        return response;
      }

      // Attach user to request
      req.user = {
        id: user.id,
        username: user.username,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role,
        permissions: user.permissions,
        profile: user.profile,
        status: user.status
      };

      // Call the handler with the enhanced request
      return handler(req);

    } catch (error) {
      console.error('Auth middleware error:', error);
      return NextResponse.json(
        { error: 'Internal server error' },
        { status: 500 }
      );
    }
  };
} 