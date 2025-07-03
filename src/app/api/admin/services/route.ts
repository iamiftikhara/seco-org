import { NextResponse } from 'next/server';
import { withAdminAuth } from '@/lib/authMiddleware';
import { getCollection } from '@/lib/mongodb';
import { Document, UpdateFilter } from 'mongodb';

// Helper function to generate new string ID
const generateNewId = (items: { id: string }[]): string => {
  if (!items || items.length === 0) return '1';
  const maxId = Math.max(...items.map(item => parseInt(item.id, 10)));
  return String(maxId + 1);
};

// GET: Fetch services data
async function getServicesData() {
  try {
    const collection = await getCollection('services');
    const servicesData = await collection.findOne({});
    if (!servicesData) {
      return NextResponse.json(
        { success: false, error: 'Services data not found' },
        { status: 404 }
      );
    }
    return NextResponse.json({
      success: true,
      data: servicesData
    });
  } catch (error) {
    console.error('Error fetching services data:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch services data'
      },
      { status: 500 }
    );
  }
}

// POST: Add a new service
async function addService(request: Request) {
  try {
    const body = await request.json();
    const service = body;
    if (!service) {
      return NextResponse.json(
        { success: false, error: 'Service data is required' },
        { status: 400 }
      );
    }
    const collection = await getCollection('services');
    const servicesData = await collection.findOne({});
    if (!servicesData) {
      // If no services data exists, create new with the data
      const newServicesData = {
        servicePage: {},
        servicesList: [{ ...service, id: '1' }]
      };
      await collection.insertOne(newServicesData);
    } else {
      // Add service to existing array with new string ID
      const newService = {
        ...service,
        id: generateNewId(servicesData.servicesList || [])
      };
      await collection.updateOne(
        {},
        { $push: { servicesList: newService } as UpdateFilter<Document> }
      );
    }
    return NextResponse.json({
      success: true,
      message: 'Service added successfully'
    });
  } catch (error) {
    console.error('Error adding service:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to add service'
      },
      { status: 500 }
    );
  }
}

// PUT: Update a service
async function updateService(request: Request) {
  try {
    const body = await request.json();
    const { id, ...service } = body;
    const collection = await getCollection('services');

    // Handle servicePage update separately
    if (service.servicePage) {
      const result = await collection.updateOne(
        {},
        { $set: { servicePage: service.servicePage } }
      );
      if (result.matchedCount === 0) {
        return NextResponse.json(
          { success: false, error: 'Services data not found' },
          { status: 404 }
        );
      }
      return NextResponse.json({
        success: true,
        message: 'Service page updated successfully'
      });
    }

    // Handle service updates
    if (!id || !service) {
      return NextResponse.json(
        { success: false, error: 'ID and service data are required' },
        { status: 400 }
      );
    }
    const result = await collection.updateOne(
      { 'servicesList.id': id },
      { $set: { 'servicesList.$': { ...service, id } } }
    );
    if (result.matchedCount === 0) {
      return NextResponse.json(
        { success: false, error: 'Service not found' },
        { status: 404 }
      );
    }
    return NextResponse.json({
      success: true,
      message: 'Service updated successfully'
    });
  } catch (error) {
    console.error('Error updating service:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to update service'
      },
      { status: 500 }
    );
  }
}

// DELETE: Delete a service
async function deleteService(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    if (!id) {
      return NextResponse.json(
        { success: false, error: 'Valid ID is required' },
        { status: 400 }
      );
    }
    const collection = await getCollection('services');
    await collection.updateOne(
      {},
      { $pull: { servicesList: { id } } as UpdateFilter<Document> }
    );
    return NextResponse.json({
      success: true,
      message: 'Service deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting service:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to delete service'
      },
      { status: 500 }
    );
  }
}

// Export the protected routes
export const GET = withAdminAuth(getServicesData);
export const POST = withAdminAuth(addService);
export const PUT = withAdminAuth(updateService);
export const DELETE = withAdminAuth(deleteService); 