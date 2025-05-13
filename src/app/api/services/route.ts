import { NextResponse } from 'next/server';
import { Services } from '@/types/services';
import { services } from '@/data/services';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = searchParams.get('limit') ? parseInt(searchParams.get('limit')!) : undefined;
    const status = searchParams.get('status') || 'all';
    const language = searchParams.get('language') || 'all';
    
    let servicesList = services.servicesList;

    // Apply filters if they exist
    if (status !== 'all') {
      servicesList = servicesList.filter((service) => service.isActive === (status === 'active'));
    }

    if (language !== 'all') {
      servicesList = servicesList.filter((service) => service.language === language);
    }

    // Only apply limit if it's greater than 0
    if (limit && limit > 0) {
      servicesList = servicesList.slice(0, limit);
    }

    console.log('API: Returning services count:', servicesList.length);

    // Maintain the same response structure
    return NextResponse.json({ 
      success: true, 
      data: {
        servicePage: services.servicePage,
        servicesList: servicesList
      }
    });
  } catch (error) {
    console.error('Error fetching services:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch services', Error: error},
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const newService = await request.json();
    
    // Add validation here
    if (!newService.title || !newService.description) {
      return NextResponse.json(
        { success: false, message: 'Missing required fields'},
        { status: 400 }
      );
    }

    const serviceToAdd: Services = {
      ...newService,
      id: Date.now().toString(),
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    return NextResponse.json({
      success: true,
      data: serviceToAdd
    });
  } catch (err) {
    console.error('Error creating service:', err);
    return NextResponse.json(
      { success: false, message: 'Failed to create service' },
      { status: 500 }
    );
  }
}