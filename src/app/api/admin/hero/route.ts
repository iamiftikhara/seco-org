// API route for hero section data
import { NextResponse } from 'next/server';
import { withAdminAuth } from '@/lib/authMiddleware';
import { connectToDatabase, getCollection } from '@/lib/mongodb';
import type { HeroData } from '@/types/hero';

// GET: Fetch hero data
export async function getHeroData() {
  try {
    await connectToDatabase();
    const collection = await getCollection('hero');
    const heroData = await collection.findOne({});

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

// POST: Add a new slide
export async function addSlide(request: Request) {
  try {
    const body = await request.json();
    const { slide } = body;

    if (!slide) {
      return NextResponse.json(
        { success: false, error: 'Slide data is required' },
        { status: 400 }
      );
    }

    await connectToDatabase();
    const collection = await getCollection('hero');
    
    // Get current hero data
    const heroData = await collection.findOne({});
    
    if (!heroData) {
      // If no hero data exists, create new with the slide
      const newHeroData = {
        slides: [slide],
        announcements: [],
        config: {}
      };
      await collection.insertOne(newHeroData);
    } else {
      // Add slide to existing slides array
      await collection.updateOne(
        {},
        { $push: { slides: slide } }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Slide added successfully'
    });
  } catch (error) {
    console.error('Error adding slide:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to add slide'
      },
      { status: 500 }
    );
  }
}

// PUT: Update a slide
export async function updateSlide(request: Request) {
  try {
    const body = await request.json();
    const { index, slide } = body;

    if (typeof index !== 'number' || !slide) {
      return NextResponse.json(
        { success: false, error: 'Slide index and data are required' },
        { status: 400 }
      );
    }

    await connectToDatabase();
    const collection = await getCollection('hero');
    
    // Update the slide at the specified index
    const result = await collection.updateOne(
      {},
      { $set: { [`slides.${index}`]: slide } }
    );

    if (result.matchedCount === 0) {
      return NextResponse.json(
        { success: false, error: 'Hero data not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Slide updated successfully'
    });
  } catch (error) {
    console.error('Error updating slide:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to update slide'
      },
      { status: 500 }
    );
  }
}

// DELETE: Delete a slide
export async function deleteSlide(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const index = parseInt(searchParams.get('index') || '');

    if (isNaN(index)) {
      return NextResponse.json(
        { success: false, error: 'Valid slide index is required' },
        { status: 400 }
      );
    }

    await connectToDatabase();
    const collection = await getCollection('hero');
    
    // Remove the slide at the specified index using $unset and $pull
    const result = await collection.updateOne(
      {},
      [
        { $set: { [`slides.${index}`]: null } },
        { $pull: { slides: null } }
      ]
    );

    if (result.matchedCount === 0) {
      return NextResponse.json(
        { success: false, error: 'Hero data not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Slide deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting slide:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to delete slide'
      },
      { status: 500 }
    );
  }
}

// Export the protected routes
export const GET = withAdminAuth(getHeroData);
export const POST = withAdminAuth(addSlide);
export const PUT = withAdminAuth(updateSlide);
export const DELETE = withAdminAuth(deleteSlide);