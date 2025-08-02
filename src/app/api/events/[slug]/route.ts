import { NextResponse } from 'next/server';
import { getCollection } from '@/lib/mongodb';
import { EventDetail } from '@/types/events';

export async function GET(
  request: Request,
  context: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await context.params;

    const collection = await getCollection('events');
    const eventsData = await collection.findOne({});

    if (!eventsData || !eventsData.eventsList) {
      return NextResponse.json(
        { success: false, error: 'Events data not found' },
        { status: 404 }
      );
    }

    // Find the event with matching slug
    const event = eventsData.eventsList.find((event: EventDetail) => event.slug === slug);

    if (!event) {
      return NextResponse.json(
        { success: false, error: 'Event not found' },
        { status: 404 }
      );
    }

    // Get navigation data - find active events only
    const activeEvents = eventsData.eventsList.filter((e: EventDetail) => e.isActive === true);
    const currentIndex = activeEvents.findIndex((e: EventDetail) => e.slug === event.slug);

    const navigationData = {
      prev: currentIndex > 0 ? activeEvents[currentIndex - 1] : null,
      next: currentIndex < activeEvents.length - 1 ? activeEvents[currentIndex + 1] : null
    };

    return NextResponse.json({
      success: true,
      data: {
        event,
        navigation: navigationData
      }
    });
  } catch (error) {
    console.error('Error fetching event:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch event data' },
      { status: 500 }
    );
  }
}
