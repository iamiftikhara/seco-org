// API route for footer section data
import { NextResponse } from 'next/server';
import { getCollection } from '@/lib/mongodb';

export async function GET() {
  try {
    const collection = await getCollection('footer'); // Use 'footer' as the collection name
    const footerData = await collection.findOne({}); // Fetch the footer data

    if (!footerData) {
      return NextResponse.json(
        { success: false, error: 'Footer data not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: footerData
    });
  } catch (error) {
    console.error('Error fetching footer data:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch footer data'
      },
      { status: 500 }
    );
  }
}