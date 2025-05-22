import { navbarData } from '@/data/navbar';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    return NextResponse.json({ 
      success: true, 
      data: navbarData 
    });
  } catch (error) {
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to fetch navbar data' 
      },
      { status: 500 }
    );
  }
}
