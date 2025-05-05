import { NextResponse } from 'next/server';
import { events } from '@/data/events';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = searchParams.get('limit') ? parseInt(searchParams.get('limit')!) : undefined;
    
    let eventsList = Array.isArray(events) ? [...events] : [];

    if (limit) {
      eventsList = eventsList.slice(0, limit);
    }

    return NextResponse.json({
      success: true,
      data: eventsList
    });
  } catch (error) {
    console.error('Error fetching events:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}