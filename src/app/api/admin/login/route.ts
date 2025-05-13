import { NextRequest, NextResponse } from 'next/server';
import { validateAdminCredentials } from '@/lib/users';

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

    // Create session data
    const session = {
      userId: user.id,
      username: user.username,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      role: user.role,
      permissions: {
        users: {
          read: user.permissions?.users?.read || false,
          write: user.permissions?.users?.write || false,
          update: user.permissions?.users?.update || false,
          delete: user.permissions?.users?.delete || false
        }
      },
      profile: {
        avatar: user.profile?.avatar,
        language: user.profile?.language || 'en',
        preferences: user.profile?.preferences
      },
      lastActivity: new Date().toISOString(),
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString() // 24 hours
    };

    // Create the response first
    const response = NextResponse.json({ 
      success: true,
      user: session
    });

    // Then set cookies on the response object
    response.cookies.set('isAdminLoggedIn', 'true', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 60 * 60 * 24, // 24 hours
      path: '/'
    });

    response.cookies.set('adminSession', JSON.stringify(session), {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 60 * 60 * 24, // 24 hours
      path: '/'
    });

    return response;
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}