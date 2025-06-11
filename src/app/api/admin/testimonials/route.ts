import { NextResponse } from 'next/server';
import { withAdminAuth } from '@/lib/authMiddleware';
import { getCollection } from '@/lib/mongodb';
import type { TestimonialsData } from '@/types/testimonials';
import { Document, UpdateFilter } from 'mongodb';

// Helper function to generate new ID
const generateNewId = (items: { id: number }[]): number => {
  if (items.length === 0) return 1;
  return Math.max(...items.map(item => item.id)) + 1;
};

// GET: Fetch testimonials data
async function getTestimonialsData() {
  try {
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

// POST: Add a new testimonial
async function addTestimonial(request: Request) {
  try {
    const body = await request.json();
    const { testimonial } = body;

    if (!testimonial) {
      return NextResponse.json(
        { success: false, error: 'Testimonial data is required' },
        { status: 400 }
      );
    }

    const collection = await getCollection('testimonials');
    
    // Get current testimonials data
    const testimonialsData = await collection.findOne({});
    
    if (!testimonialsData) {
      // If no testimonials data exists, create new with the data
      const newTestimonialsData = {
        items: [{ ...testimonial, id: 1 }],
        config: {}
      };
      await collection.insertOne(newTestimonialsData);
    } else {
      // Add testimonial to existing array with new ID
      const newTestimonial = {
        ...testimonial,
        id: generateNewId(testimonialsData.items)
      };
      await collection.updateOne(
        {},
        { $push: { items: newTestimonial } as UpdateFilter<Document> }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Testimonial added successfully'
    });
  } catch (error) {
    console.error('Error adding testimonial:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to add testimonial'
      },
      { status: 500 }
    );
  }
}

// PUT: Update a testimonial or config
async function updateTestimonial(request: Request) {
  try {
    const body = await request.json();
    const { id, testimonial, config } = body;

    // Handle config update separately
    if (config) {
      const collection = await getCollection('testimonials');
      
      const result = await collection.updateOne(
        {},
        { $set: { config } }
      );

      if (result.matchedCount === 0) {
        return NextResponse.json(
          { success: false, error: 'Testimonials data not found' },
          { status: 404 }
        );
      }

      return NextResponse.json({
        success: true,
        message: 'Configuration updated successfully'
      });
    }

    // Handle testimonial updates
    if (!id || !testimonial) {
      return NextResponse.json(
        { success: false, error: 'ID and testimonial data are required' },
        { status: 400 }
      );
    }

    const collection = await getCollection('testimonials');
    
    const result = await collection.updateOne(
      { 'items.id': id },
      { $set: { 'items.$': { ...testimonial, id } } }
    );

    if (result.matchedCount === 0) {
      return NextResponse.json(
        { success: false, error: 'Testimonial not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Testimonial updated successfully'
    });
  } catch (error) {
    console.error('Error updating testimonial:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to update testimonial'
      },
      { status: 500 }
    );
  }
}

// DELETE: Delete a testimonial
async function deleteTestimonial(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = parseInt(searchParams.get('id') || '');

    if (isNaN(id)) {
      return NextResponse.json(
        { success: false, error: 'Valid ID is required' },
        { status: 400 }
      );
    }

    const collection = await getCollection('testimonials');
    
    // Remove the testimonial with the specified ID
    await collection.updateOne(
      {},
      { $pull: { items: { id } } as UpdateFilter<Document> }
    );

    return NextResponse.json({
      success: true,
      message: 'Testimonial deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting testimonial:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to delete testimonial'
      },
      { status: 500 }
    );
  }
}

// Export the protected routes
export const GET = withAdminAuth(getTestimonialsData);
export const POST = withAdminAuth(addTestimonial);
export const PUT = withAdminAuth(updateTestimonial);
export const DELETE = withAdminAuth(deleteTestimonial); 