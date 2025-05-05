import { NextResponse } from 'next/server';
import { Services } from '@/types/services';  // Add this import
import { services } from '@/data/services';

export async function GET() {
  try {
    return NextResponse.json({ success: true, data: services });
  } catch (error) {
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

    const serviceToAdd: Services = {  // Type the new service
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