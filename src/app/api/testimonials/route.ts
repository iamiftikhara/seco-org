import { NextResponse } from 'next/server';
import { connectToDatabase, getCollection } from '@/lib/mongodb';

// GET: Fetch testimonials data
export async function GET() {
  try {
    await connectToDatabase();
    const collection = await getCollection('testimonials');
    const testimonialsData = await collection.findOne({});

    if (!testimonialsData) {
      return NextResponse.json(
        { success: false, error: 'Testimonials data not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: testimonialsData
    });
  } catch (error) {
    console.error('Error fetching testimonials data:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch testimonials data'
      },
      { status: 500 }
    );
  }
} 