import { NextResponse } from 'next/server';
import { connectToDatabase, getCollection } from '@/lib/mongodb';

export async function GET() {
  try {
    await connectToDatabase();
    const collection = await getCollection('navbar');
    const navbarData = await collection.findOne({});

    if (!navbarData) {
      return NextResponse.json(
        { success: false, error: 'Navbar data not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ 
      success: true, 
      data: navbarData 
    });
  } catch (error) {
    console.error('Error fetching navbar data:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to fetch navbar data' 
      },
      { status: 500 }
    );
  }
}
