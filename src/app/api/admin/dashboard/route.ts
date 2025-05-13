import { NextRequest, NextResponse } from 'next/server';
import { withAdminAuth } from '@/lib/authMiddleware';

async function handler(req: NextRequest) {
  if (req.method !== 'GET') {
    return NextResponse.json({ error: 'Method not allowed' }, { status: 405 });
  }

  try {
    // Access authenticated user info from headers
    const userId = req.headers.get('x-user-id');
    const userRole = req.headers.get('x-user-role');

    // Your API logic here
    const data = {
      stats: {
        // Your dashboard data
      },
      user: {
        id: userId,
        role: userRole
      }
    };

    return NextResponse.json(data);
  } catch (error) {
    console.error('Dashboard API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Wrap the handler with authentication middleware
export const GET = withAdminAuth(handler); 