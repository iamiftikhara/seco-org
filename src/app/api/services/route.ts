import { NextResponse } from 'next/server';
import { getCollection } from '@/lib/mongodb';
import type { ServiceDetail } from '@/types/services';

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const homepageParam = url.searchParams.get('homepage');
    const homepageOnly = homepageParam === 'true';

    const collection = await getCollection('services');

    const servicesData = await collection.findOne({});

    if (!servicesData || !servicesData.servicesList) {

      return NextResponse.json({
        success: false,
        error: 'No services available',
        message: 'Services are currently being set up. Please check back later or contact the administrator.',
        isEmpty: true
      }, { status: 404 });
    }

    let servicesList: ServiceDetail[] = servicesData.servicesList || [];
    if (homepageOnly) {
      servicesList = servicesList.filter((service: ServiceDetail) => service.showOnHomepage === true);
    }
    const servicePage = servicesData.servicePage || null;

    return NextResponse.json({
      success: true,
      data: { servicePage, servicesList }
    });
  } catch (error) {

    // Detailed error logging
    if (error instanceof Error) {
      console.error('Error details:', {
        name: error.name,
        message: error.message,
        stack: error.stack
      });
    }

    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch services',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}