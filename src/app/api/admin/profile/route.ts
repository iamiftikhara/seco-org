import { NextRequest, NextResponse } from 'next/server';
import { withAdminAuth } from '@/lib/authMiddleware';

async function handler(req: NextRequest) {
  if (!req.user) {
    return NextResponse.json(
      { error: 'User not found' },
      { status: 404 }
    );
  }

  return NextResponse.json({
    ...req.user,
    lastActivity: new Date().toISOString()
  });
}

export const GET = withAdminAuth(handler); 