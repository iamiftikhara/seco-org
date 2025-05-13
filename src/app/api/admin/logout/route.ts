import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function POST() {
  try {
    const cookieStore = cookies();
    
    // List of cookies to clear
    const cookiesToClear = [
      'jwt',
      'adminSession',
      'isAdminLoggedIn',
      'x-user-id',
      'x-user-role',
      'x-user-name'
    ];

    // Create response
    const response = NextResponse.json({ 
      success: true,
      message: 'Logged out successfully'
    });

    // Clear all auth cookies
    cookiesToClear.forEach(name => {
      response.cookies.set(name, '', {
        maxAge: 0,
        path: '/',
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict'
      });
    });

    return response;
  } catch (error) {
    console.error('Logout error:', error);
    return NextResponse.json(
      { error: 'Failed to logout' },
      { status: 500 }
    );
  }
} 