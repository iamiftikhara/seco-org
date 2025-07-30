import { NextResponse, NextRequest } from 'next/server';
import { withAdminAuth } from '@/lib/authMiddleware';
import { getCollection } from '@/lib/mongodb';
import { Document, UpdateFilter } from 'mongodb';

// Helper function to generate new string ID
const generateNewId = (items: { id: string }[]): string => {
  if (!items || items.length === 0) return '1';
  const maxId = Math.max(...items.map(item => parseInt(item.id, 10)));
  return String(maxId + 1);
};

// GET: Fetch events data
async function getEventsData() {
  try {
    const collection = await getCollection('events');
    let eventsData = await collection.findOne({});

    // If no data exists, create default structure
    if (!eventsData) {
      const defaultData = {
        eventsPage: {
          title: {
            en: { text: "All Events" },
            ur: { text: "تمام پروگرامز" }
          },
          description: {
            en: { text: "Explore all our events and activities making an impact in our communities" },
            ur: { text: "ہماری کمیونٹیز میں اثر انداز ہونے والے تمام پروگرامز اور سرگرمیاں دیکھیں" }
          },
          image: "/images/gallery11.jpeg"
        },
        eventsList: []
      };

      await collection.insertOne(defaultData);
      eventsData = await collection.findOne({});
    }

    return NextResponse.json({
      success: true,
      data: eventsData
    });
  } catch (error) {
    console.error('Error fetching events data:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch events data'
      },
      { status: 500 }
    );
  }
}

// POST: Add a new event
async function addEvent(request: Request) {
  try {
    const body = await request.json();
    const event = body;
    if (!event) {
      return NextResponse.json(
        { success: false, error: 'Event data is required' },
        { status: 400 }
      );
    }
    const collection = await getCollection('events');
    const eventsData = await collection.findOne({});
    if (!eventsData) {
      // If no events data exists, create new with the data
      const newEventsData = {
        eventsPage: {
          title: {
            en: { text: "All Events" },
            ur: { text: "تمام پروگرامز" }
          },
          description: {
            en: { text: "Explore all our events and activities making an impact in our communities" },
            ur: { text: "ہماری کمیونٹیز میں اثر انداز ہونے والے تمام پروگرامز اور سرگرمیاں دیکھیں" }
          },
          image: "/images/gallery11.jpeg"
        },
        eventsList: [{ ...event, id: '1' }]
      };
      await collection.insertOne(newEventsData);
    } else {
      // Add event to existing array with new string ID
      const newEvent = {
        ...event,
        id: generateNewId(eventsData.eventsList || [])
      };
      await collection.updateOne(
        {},
        { $push: { eventsList: newEvent } as UpdateFilter<Document> }
      );
    }
    return NextResponse.json({
      success: true,
      message: 'Event added successfully'
    });
  } catch (error) {
    console.error('Error adding event:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to add event'
      },
      { status: 500 }
    );
  }
}

// PUT: Update an event
async function updateEvent(request: Request) {
  try {
    const body = await request.json();

    // Handle eventsPage update separately
    if (body.type === 'page') {
      const collection = await getCollection('events');
      const result = await collection.updateOne(
        {},
        { $set: { eventsPage: body.eventsPage } }
      );
      if (result.matchedCount === 0) {
        return NextResponse.json(
          { success: false, error: 'Events data not found' },
          { status: 404 }
        );
      }
      return NextResponse.json({
        success: true,
        message: 'Events page updated successfully'
      });
    }

    // Handle event updates
    const { id, ...event } = body;
    if (!id || !event) {
      return NextResponse.json(
        { success: false, error: 'ID and event data are required' },
        { status: 400 }
      );
    }

    const collection = await getCollection('events');
    const result = await collection.updateOne(
      { 'eventsList.id': id },
      { $set: { 'eventsList.$': { ...event, id } } }
    );
    if (result.matchedCount === 0) {
      return NextResponse.json(
        { success: false, error: 'Event not found' },
        { status: 404 }
      );
    }
    return NextResponse.json({
      success: true,
      message: 'Event updated successfully'
    });
  } catch (error) {
    console.error('Error updating event:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to update event'
      },
      { status: 500 }
    );
  }
}

// Delete event
async function deleteEvent(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'Event ID is required' },
        { status: 400 }
      );
    }

    const collection = await getCollection('events');
    const result = await collection.updateOne(
      { 'eventsList.id': id },
      { $pull: { eventsList: { id: id } } } as unknown as UpdateFilter<Document>
    );

    if (result.matchedCount === 0) {
      return NextResponse.json(
        { success: false, error: 'Event not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Event deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting event:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to delete event'
      },
      { status: 500 }
    );
  }
}

// Export the protected routes
export const GET = withAdminAuth(getEventsData);
export const POST = withAdminAuth(addEvent);
export const PUT = withAdminAuth(updateEvent);
export const DELETE = withAdminAuth(deleteEvent);
