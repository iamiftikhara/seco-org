import { NextRequest, NextResponse } from 'next/server';
import { validateAdminCredentials } from '@/lib/users';
import { generateToken } from '@/lib/jwt';

export async function POST(request: NextRequest) {
  try {
    const { username, password } = await request.json();
    const { user, error, status } = await validateAdminCredentials(username, password);

    if (error || !user) {
      console.log('Login error:', error);
      if (error ==='no-user') {
        return NextResponse.json(
          { error: `User name not found.` },
          { status: 400 }
        );
      }
      else if (error ==='incorrect-pass') {
        return NextResponse.json(
          { error: `Password is incorrect.` },
          { status: 401 }
        );
      }
      else if (error === 'status') {
        return NextResponse.json(
          { error: `Account is ${status}. Please contact administrator.` },
          { status: 403 }
        );
      }
      return NextResponse.json(
        { error: 'Server Error.' },
        { status: 500 }
      );
    }

    // Generate JWT token
    const token = await generateToken({
      userId: user.id,
      username: user.username,
      role: user.role
    });

    // Set JWT token in HTTP-only cookie
    const response = NextResponse.json({
      success: true,
      user: {
        userId: user.id,
        username: user.username,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role,
        permissions: user.permissions
      }
    });

    response.cookies.set('jwt', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 60 * 60 * 24 // 24 hours
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