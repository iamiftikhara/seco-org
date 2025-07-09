import { NextResponse } from 'next/server';
import { getCollection } from '@/lib/mongodb';
import type { ServiceDetail } from '@/types/services';

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const homepageParam = url.searchParams.get('homepage');
    const homepageOnly = homepageParam === 'true';

    console.log('Attempting to connect to MongoDB...');
    const collection = await getCollection('services');
    console.log('MongoDB connection successful, querying data...');

    const servicesData = await collection.findOne({});
    console.log('Query result:', servicesData ? 'Data found' : 'No data found');

    if (!servicesData || !servicesData.servicesList) {
      console.log('No services data found, creating initial structure...');

      // Create initial empty structure if no data exists
      const initialData = {
        servicePage: {
          image: "/images/community-hero.jpeg",
          title: {
            en: { text: "Our Services" },
            ur: { text: "ہماری خدمات" }
          },
          description: {
            en: { text: "Discover our comprehensive range of services designed to support and empower communities" },
            ur: { text: "کمیونٹیز کی مدد اور بااختیار بنانے کے لیے ڈیزائن کی گئی ہماری جامع خدمات دریافت کریں" }
          }
        },
        servicesList: []
      };

      try {
        await collection.insertOne(initialData);
        console.log('Initial data created successfully');
      } catch (insertError) {
        console.error('Failed to create initial data:', insertError);
      }

      return NextResponse.json({
        success: true,
        data: { servicePage: initialData.servicePage, servicesList: [] }
      });
    }

    let servicesList: ServiceDetail[] = servicesData.servicesList || [];
    if (homepageOnly) {
      servicesList = servicesList.filter((service: ServiceDetail) => service.showOnHomepage === true);
    }
    const servicePage = servicesData.servicePage || null;

    console.log(`Returning ${servicesList.length} services`);
    return NextResponse.json({
      success: true,
      data: { servicePage, servicesList }
    });
  } catch (error) {
    console.error('Error in services API:', error);

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