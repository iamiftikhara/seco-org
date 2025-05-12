import { NextRequest, NextResponse } from 'next/server';
import { createAdminUser, findAdminUserByUsername } from '@/lib/users';
import { UserRole, UserStatus } from '@/types/user';

export async function POST(request: NextRequest) {
  try {
    const session = request.cookies.get('adminSession');
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const sessionData = JSON.parse(session.value);
    if (sessionData.role !== UserRole.SUPER_ADMIN) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const userData = await request.json();
    
    // Validate required fields
    const requiredFields = ['username', 'password', 'firstName', 'lastName', 'email', 'role'];
    for (const field of requiredFields) {
      if (!userData[field]) {
        return NextResponse.json(
          { error: `Missing required field: ${field}` },
          { status: 400 }
        );
      }
    }

    // Check if username already exists
    const existingUser = await findAdminUserByUsername(userData.username);
    if (existingUser) {
      return NextResponse.json(
        { error: 'Username already exists' },
        { status: 409 }
      );
    }

    // Validate role
    if (!Object.values(UserRole).includes(userData.role)) {
      return NextResponse.json(
        { error: 'Invalid role value' },
        { status: 400 }
      );
    }

    // Set default values for new user
    const newUserData = {
      ...userData,
      status: UserStatus.ACTIVE,
      profile: {
        ...userData.profile,
        preferences: {
          theme: 'light',
          twoFactorEnabled: false,
          emailFrequency: 'daily',
          ...userData.profile?.preferences
        }
      },
      permissions: {
        users: {
          read: true,
          write: false,
          update: false,
          delete: false
        },
        ...userData.permissions
      }
    };

    const newUser = await createAdminUser(newUserData);

    // Remove password from response
    const { password, ...userResponse } = newUser;

    return NextResponse.json({
      success: true,
      user: userResponse
    });
  } catch (error) {
    console.error('Create user error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}