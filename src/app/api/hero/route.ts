// API route for hero section data
import { NextResponse } from 'next/server';
import { connectToDatabase, getCollection } from '@/lib/mongodb';

export async function GET() {
  try {
    await connectToDatabase();
    const collection = await getCollection('hero'); // Use 'hero' as the collection name
    const heroData = await collection.findOne({}); // Fetch the hero data

    if (!heroData) {
      return NextResponse.json(
        { success: false, error: 'Hero data not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: heroData
    });
  } catch (error) {
    console.error('Error fetching hero data:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch hero data'
      },
      { status: 500 }
    );
  }
}