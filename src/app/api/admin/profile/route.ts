import { NextRequest, NextResponse } from 'next/server';
import { withAdminAuth } from '@/lib/authMiddleware';

async function handler(req: NextRequest) {
  // The middleware will handle everything
  return NextResponse.json({});
}

export const GET = withAdminAuth(handler); 