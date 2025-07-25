import { NextResponse } from 'next/server';
import { getCollection } from '@/lib/mongodb';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = searchParams.get('limit') ? parseInt(searchParams.get('limit')!) : undefined;
    const status = searchParams.get('status') || 'all';
    const showOnHome = searchParams.get('showOnHome');

    const collection = await getCollection('events');
    const eventsData = await collection.findOne({});

    if (!eventsData) {
      return NextResponse.json(
        { success: false, error: 'Events data not found' },
        { status: 404 }
      );
    }

    let eventsList = eventsData.eventsList || [];

    // Apply filters
    if (status !== 'all') {
      eventsList = eventsList.filter((event: any) => event.status === status);
    }

    if (showOnHome === 'true') {
      eventsList = eventsList.filter((event: any) => event.showOnHome === true);
    }

    // Filter only active events
    eventsList = eventsList.filter((event: any) => event.isActive === true);

    if (limit) {
      eventsList = eventsList.slice(0, limit);
    }

    return NextResponse.json({
      success: true,
      data: {
        eventsList,
        eventsPage: eventsData.eventsPage
      }
    });
  } catch (error) {
    console.error('Error fetching events:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch events data' },
      { status: 500 }
    );
  }
}