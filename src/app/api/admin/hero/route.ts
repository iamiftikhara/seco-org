// API route for hero section data
import { NextResponse } from 'next/server';
import { withAdminAuth } from '@/lib/authMiddleware';
import { getCollection } from '@/lib/mongodb';
import type { HeroData, HeroSlide, Announcement } from '@/types/hero';
import { Document, UpdateFilter } from 'mongodb';

// Helper function to generate new ID
const generateNewId = (items: { id: number }[]): number => {
  if (items.length === 0) return 1;
  return Math.max(...items.map(item => item.id)) + 1;
};

// GET: Fetch hero data
export async function getHeroData() {
  try {
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

    const collection = await getCollection('hero');
    
    // Get current hero data
    const heroData = await collection.findOne({});
    
    if (!heroData) {
      // If no hero data exists, create new with the data
      const newHeroData = {
        slides: slide ? [{ ...slide, id: 1 }] : [],
        announcements: announcement ? [{ ...announcement, id: 1 }] : [],
        config: {}
      };
      await collection.insertOne(newHeroData);
    } else {
      // Add data to existing arrays with new ID
      if (slide) {
        const newSlide: HeroSlide = {
          ...slide,
          id: generateNewId(heroData.slides)
        };
        await collection.updateOne(
          {},
          { $push: { slides: newSlide } as UpdateFilter<Document> }
        );
      }
      if (announcement) {
        const newAnnouncement: Announcement = {
          ...announcement,
          id: generateNewId(heroData.announcements)
        };
        await collection.updateOne(
          {},
          { $push: { announcements: newAnnouncement } as UpdateFilter<Document> }
        );
      }
    }

    return NextResponse.json({
      success: true,
      message: slide ? 'Slide added successfully' : 'Announcement added successfully'
    });
  } catch (error) {
    console.error('Error adding data:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to add data'
      },
      { status: 500 }
    );
  }
}

// PUT: Update a slide, announcement, or config
export async function updateSlide(request: Request) {
  try {
    const body = await request.json();
    const { id, slide, announcement, config } = body;

    // Handle config update separately
    if (config) {
      const collection = await getCollection('hero');
      
      const result = await collection.updateOne(
        {},
        { $set: { config } }
      );

      if (result.matchedCount === 0) {
        return NextResponse.json(
          { success: false, error: 'Hero data not found' },
          { status: 404 }
        );
      }

      return NextResponse.json({
        success: true,
        message: 'Configuration updated successfully'
      });
    }

    // Handle slide/announcement updates
    if (!id || (!slide && !announcement)) {
      return NextResponse.json(
        { success: false, error: 'ID and data are required' },
        { status: 400 }
      );
    }

    const collection = await getCollection('hero');
    
    // Update the data with the specified ID
    const updateField = slide ? 'slides' : 'announcements';
    const updateData = slide || announcement;
    
    const result = await collection.updateOne(
      { [`${updateField}.id`]: id },
      { $set: { [`${updateField}.$`]: { ...updateData, id } } }
    );

    if (result.matchedCount === 0) {
      return NextResponse.json(
        { success: false, error: 'Item not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: slide ? 'Slide updated successfully' : 'Announcement updated successfully'
    });
  } catch (error) {
    console.error('Error updating data:', error);
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
    const id = parseInt(searchParams.get('id') || '');
    const type = searchParams.get('type') || 'slide';

    if (isNaN(id)) {
      return NextResponse.json(
        { success: false, error: 'Valid ID is required' },
        { status: 400 }
      );
    }

    const collection = await getCollection('hero');
    
    // Remove the item with the specified ID
    const arrayField = type === 'slide' ? 'slides' : 'announcements';
    await collection.updateOne(
      {},
      { $pull: { [arrayField]: { id } } as UpdateFilter<Document> }
    );

    return NextResponse.json({
      success: true,
      message: type === 'slide' ? 'Slide deleted successfully' : 'Announcement deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting data:', error);
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
