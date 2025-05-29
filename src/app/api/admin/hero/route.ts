// API route for hero section data
import { NextResponse } from 'next/server';
import { withAdminAuth } from '@/lib/authMiddleware';
import { connectToDatabase, getCollection, closeDatabaseConnection } from '@/lib/mongodb';
import type { HeroData } from '@/types/hero';

// GET: Fetch hero data
export async function getHeroData() {
  try {
    await connectToDatabase();
    const collection = await getCollection('hero');
    const heroData = await collection.findOne({});
    await closeDatabaseConnection();

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
    await closeDatabaseConnection();
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch hero data'
      },
      { status: 500 }
    );
  }
}

// POST: Add a new slide or announcement
export async function addSlide(request: Request) {
  try {
    const body = await request.json();
    const { slide, announcement } = body;

    if (!slide && !announcement) {
      return NextResponse.json(
        { success: false, error: 'Slide or announcement data is required' },
        { status: 400 }
      );
    }

    await connectToDatabase();
    const collection = await getCollection('hero');
    
    // Get current hero data
    const heroData = await collection.findOne({});
    
    if (!heroData) {
      // If no hero data exists, create new with the data
      const newHeroData = {
        slides: slide ? [slide] : [],
        announcements: announcement ? [announcement] : [],
        config: {}
      };
      await collection.insertOne(newHeroData);
    } else {
      // Add data to existing arrays
      if (slide) {
        await collection.updateOne(
          {},
          { $push: { slides: slide } }
        );
      }
      if (announcement) {
        await collection.updateOne(
          {},
          { $push: { announcements: announcement } }
        );
      }
    }
    await closeDatabaseConnection();

    return NextResponse.json({
      success: true,
      message: slide ? 'Slide added successfully' : 'Announcement added successfully'
    });
  } catch (error) {
    console.error('Error adding data:', error);
    await closeDatabaseConnection();
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to add data'
      },
      { status: 500 }
    );
  }
}

// PUT: Update a slide or announcement
export async function updateSlide(request: Request) {
  try {
    const body = await request.json();
    const { index, slide, announcement } = body;

    if (typeof index !== 'number' || (!slide && !announcement)) {
      return NextResponse.json(
        { success: false, error: 'Index and data are required' },
        { status: 400 }
      );
    }

    await connectToDatabase();
    const collection = await getCollection('hero');
    
    // Update the data at the specified index
    const updateField = slide ? `slides.${index}` : `announcements.${index}`;
    const updateData = slide || announcement;
    
    const result = await collection.updateOne(
      {},
      { $set: { [updateField]: updateData } }
    );
    await closeDatabaseConnection();

    if (result.matchedCount === 0) {
      return NextResponse.json(
        { success: false, error: 'Hero data not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: slide ? 'Slide updated successfully' : 'Announcement updated successfully'
    });
  } catch (error) {
    console.error('Error updating data:', error);
    await closeDatabaseConnection();
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to update data'
      },
      { status: 500 }
    );
  }
}

// DELETE: Delete a slide or announcement
export async function deleteSlide(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const index = parseInt(searchParams.get('index') || '');
    const type = searchParams.get('type') || 'slide';

    if (isNaN(index)) {
      return NextResponse.json(
        { success: false, error: 'Valid index is required' },
        { status: 400 }
      );
    }

    await connectToDatabase();
    const collection = await getCollection('hero');
    
    // First, get the current hero data
    const heroData = await collection.findOne({});
    if (!heroData) {
      await closeDatabaseConnection();
      return NextResponse.json(
        { success: false, error: 'Hero data not found' },
        { status: 404 }
      );
    }

    // Remove the item at the specified index
    const arrayField = type === 'slide' ? 'slides' : 'announcements';
    const updatedArray = heroData[arrayField].filter((_: unknown, i: number) => i !== index);
    
    // Update the document with the new array
    const result = await collection.updateOne(
      {},
      { $set: { [arrayField]: updatedArray } }
    );
    await closeDatabaseConnection();

    if (result.matchedCount === 0) {
      return NextResponse.json(
        { success: false, error: 'Hero data not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: type === 'slide' ? 'Slide deleted successfully' : 'Announcement deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting data:', error);
    await closeDatabaseConnection();
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to delete data. Please try again later.'
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
