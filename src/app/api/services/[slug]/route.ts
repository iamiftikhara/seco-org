import { NextResponse } from 'next/server';
import { services } from '@/data/services';

export async function GET(
  _request: Request,
  { params }: { params: { slug: string } }
) {
  try {
    const service = Object.values(services).find(s => s.slug === params.slug);
    
    if (!service) {
      return NextResponse.json(
        { success: false, message: 'Service not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: service });
  } catch (err) {
    console.error('Error fetching service:', err);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}