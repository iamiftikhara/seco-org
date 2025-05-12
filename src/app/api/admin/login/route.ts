import { NextRequest, NextResponse } from 'next/server';
import { validateAdminCredentials } from '@/lib/users';
import { cookies } from 'next/headers';
import { UserRole } from '@/types/user';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { username, password } = body;

    if (!username || !password) {
      return NextResponse.json(
        { error: 'Username and password are required' },
        { status: 400 }
      );
    }

    const user = await validateAdminCredentials(username, password);
    console.log('Login attempt:', { username, hasUser: !!user });

    if (!user) {
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      );
    }

    // Create session with updated fields and permissions
    const session = {
      userId: user.id,
      username: user.username,
      role: user.role,
      permissions: {
        users: {
          read: user.permissions?.users?.read || false,
          write: user.permissions?.users?.write || false,
          update: user.permissions?.users?.update || false,
          delete: user.permissions?.users?.delete || false
        }
      },
      lastActivity: new Date(),
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours from now
      language: user.profile.language || 'en'
    };

    const cookieStore = cookies();
    
    // Set session cookies with enhanced security
    cookieStore.set('isAdminLoggedIn', 'true', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 60 * 60 * 24, // 24 hours
      path: '/'
    });

    cookieStore.set('adminSession', JSON.stringify(session), {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 60 * 60 * 24, // 24 hours
      path: '/'
    });

    // Return user data with profile information and detailed permissions
    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        username: user.username,
        role: user.role,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        status: user.status,
        profile: {
          avatar: user.profile.avatar,
          language: user.profile.language,
          preferences: user.profile.preferences
        },
        permissions: {
          users: {
            read: user.permissions?.users?.read || false,
            write: user.permissions?.users?.write || false,
            update: user.permissions?.users?.update || false,
            delete: user.permissions?.users?.delete || false
          }
        }
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}