import { NextRequest, NextResponse } from 'next/server';
import { withAdminAuth } from '@/lib/authMiddleware';

async function handler(req: NextRequest) {
  // If we get here, it means authentication was successful
  return NextResponse.json({ 
    authenticated: true,
    userId: req.headers.get('x-user-id'),
    role: req.headers.get('x-user-role')
  });
}

export const GET = withAdminAuth(handler); 