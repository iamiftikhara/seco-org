import { NextResponse } from 'next/server';
import { events } from '@/data/events';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = searchParams.get('limit') ? parseInt(searchParams.get('limit')!) : undefined;
    const language = searchParams.get('language') || 'all';
    const status = searchParams.get('status') || 'all';
    
    let eventsList = events.eventsList;

    // Apply filters
    if (language !== 'all') {
      eventsList = eventsList.filter(event => event.language === language);
    }

    if (status !== 'all') {
      eventsList = eventsList.filter(event => event.status === status);
    }

    if (limit) {
      eventsList = eventsList.slice(0, limit);
    }

    return NextResponse.json({
      success: true,
      data: {
        eventsList,
        eventsPage: events.eventsPage
      }
    });
  } catch (error) {
    console.error('Error fetching events:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}