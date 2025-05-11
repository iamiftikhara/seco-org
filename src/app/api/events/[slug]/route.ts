import { NextResponse } from 'next/server';
import { events } from '@/data/events';

export async function GET(
  request: Request,
  context: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await context.params; // ✅ Await the params
    const { searchParams } = new URL(request.url);

    // Find the event with matching slug
    const event = events.eventsList.find(event =>
      event.slug === slug ||
      event.slug === `${slug}-en` ||
      event.slug === `${slug}-ur`
    );

    if (!event) {
      return NextResponse.json(
        { success: false, message: 'Event not found' },
        { status: 404 }
      );
    }

    // Get navigation data
    const languageEvents = events.eventsList.filter(e => e.language === event.language);
    const currentIndex = languageEvents.findIndex(e => e.slug === event.slug);

    const navigationData = {
      prev: currentIndex > 0 ? languageEvents[currentIndex - 1] : null,
      next: currentIndex < languageEvents.length - 1 ? languageEvents[currentIndex + 1] : null
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
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}
