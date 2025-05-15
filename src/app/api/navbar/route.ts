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

export async function PUT(request: Request) {
  try {
    const data = await request.json();
    
    // Validate the incoming data structure
    if (!data.logo || !data.logoTitle) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Invalid data structure' 
        },
        { status: 400 }
      );
    }

    // In a real application, you would update the data in a database
    // For now, we'll just return success
    return NextResponse.json({ 
      success: true, 
      data: data 
    });
  } catch (error) {
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to update navbar data' 
      },
      { status: 500 }
    );
  }
}