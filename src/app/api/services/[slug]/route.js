import { NextResponse } from 'next/server';
import { getCollection } from '@/lib/mongodb';

export async function GET(request, { params }) {
  try {
    console.log('Fetching service with slug:', params.slug);

    // Get services from MongoDB
    const collection = await getCollection('services');
    const servicesData = await collection.findOne({});

    if (!servicesData || !servicesData.servicesList) {
      console.log('No services data found in database');
      return NextResponse.json(
        { success: false, message: 'No services found' },
        { status: 404 }
      );
    }

    console.log('Found services data, searching for slug:', params.slug);
    console.log('Available services:', servicesData.servicesList.map(s => s.slug));

    // Find service by slug in the new data structure
    const service = servicesData.servicesList.find(s => s.slug === params.slug);

    if (!service) {
      console.log('Service not found with slug:', params.slug);
      return NextResponse.json(
        { success: false, message: 'Service not found' },
        { status: 404 }
      );
    }

    console.log('Service found:', service.en?.title?.text || 'Unknown title');
    return NextResponse.json({ success: true, data: service });
  } catch (err) {
    console.error('Error fetching service:', err);
    console.error('Error details:', {
      name: err.name,
      message: err.message,
      stack: err.stack
    });
    return NextResponse.json(
      { success: false, message: 'Internal server error', details: err.message },
      { status: 500 }
    );
  }
}