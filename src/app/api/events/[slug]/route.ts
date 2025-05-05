import { NextRequest, NextResponse } from 'next/server';
import { events } from '@/data/events';

type Props = {
  params: {
    slug: string;
  };
};

export async function GET(
  request: NextRequest,
  { params }: Props
): Promise<NextResponse> {
  try {
    const { slug } = params;
    const event = events.eventsList.find(e => e.slug === slug);
    
    if (!event) {
      return NextResponse.json(
        { success: false, message: 'Event not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: event });
  } catch (error) {
    console.error('Error fetching event:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}
