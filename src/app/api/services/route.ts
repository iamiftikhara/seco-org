import { NextResponse } from 'next/server';
import { getCollection } from '@/lib/mongodb';

export async function GET() {
  try {
    const collection = await getCollection('services');
    const servicesData = await collection.findOne({});

    if (!servicesData || !servicesData.servicesList) {
      return NextResponse.json(
        { success: false, error: 'No services found' },
        { status: 404 }
      );
    }

    // Only return services with showOnHomepage: true
    const servicesList = servicesData.servicesList.filter((service: any) => service.showOnHomepage === true);
    const servicePage = servicesData.servicePage || null;

    return NextResponse.json({
      success: true,
      data: { servicePage, servicesList }
    });
  } catch (error) {
    console.error('Error fetching services:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch services' },
      { status: 500 }
    );
  }
}