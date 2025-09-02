import { NextResponse, NextRequest } from 'next/server';
import { withAdminAuth } from '@/lib/authMiddleware';
import { getCollection } from '@/lib/mongodb';
import { Document, UpdateFilter, ObjectId } from 'mongodb';
import { Partner } from '@/types/partners';

// Helper function to generate new string ID
const generateNewId = (items: { id: string }[]): string => {
  if (!items || items.length === 0) return '1';
  const maxId = Math.max(...items.map(item => parseInt(item.id, 10)));
  return String(maxId + 1);
};

// GET: Fetch partners data
async function getPartnersData() {
  try {
    const collection = await getCollection('partners');
    let partnersData = await collection.findOne({});

    // If no data exists, create default structure
    if (!partnersData) {
      const defaultData = {
        partnerPage: {
          title: {
            en: { text: "Our Partners" },
            ur: { text: "ہمارے شراکت دار" }
          },
          description: {
            en: { text: "Discover our trusted partners who help us make a positive impact." },
            ur: { text: "ہمارے قابل اعتماد شراکت دار دریافت کریں جو ہمیں مثبت اثرات بنانے میں مدد کرتے ہیں۔" }
          },
          image: "/images/partners-hero.jpg"
        },
        partnersList: []
      };

      await collection.insertOne(defaultData);
      partnersData = await collection.findOne({});
    }

    return NextResponse.json({
      success: true,
      data: partnersData
    });
  } catch (error) {
    console.error('Error fetching partners data:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch partners data'
      },
      { status: 500 }
    );
  }
}

// POST: Add a new partner
async function addPartner(request: Request) {
  try {
    const body = await request.json();
    const partner = body;
    if (!partner) {
      return NextResponse.json(
        { success: false, error: 'Partner data is required' },
        { status: 400 }
      );
    }
    const collection = await getCollection('partners');
    const partnersData = await collection.findOne({});
    if (!partnersData) {
      // If no partners data exists, create new with the data
      const newPartnersData = {
        partnerPage: {
          title: {
            en: { text: "Our Partners" },
            ur: { text: "ہمارے شراکت دار" }
          },
          description: {
            en: { text: "Discover our trusted partners who help us make a positive impact." },
            ur: { text: "ہمارے قابل اعتماد شراکت دار دریافت کریں جو ہمیں مثبت اثرات بنانے میں مدد کرتے ہیں۔" }
          },
          image: "/images/partners-hero.jpg"
        },
        partnersList: [{ ...partner, id: '1' }]
      };
      await collection.insertOne(newPartnersData);
    } else {
      // Add partner to existing array with new string ID
      const newPartner = {
        ...partner,
        id: generateNewId(partnersData.partnersList || [])
      };
      await collection.updateOne(
        {},
        { $push: { partnersList: newPartner } as UpdateFilter<Document> }
      );
    }
    return NextResponse.json({
      success: true,
      message: 'Partner added successfully'
    });
  } catch (error) {
    console.error('Error adding partner:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to add partner'
      },
      { status: 500 }
    );
  }
}

// PUT: Update a partner
async function updatePartner(request: Request) {
  try {
    const body = await request.json();

    // Handle partnerPage update separately
    if (body.type === 'page') {
      const collection = await getCollection('partners');
      const result = await collection.updateOne(
        {},
        { $set: { partnerPage: body.partnerPage } }
      );
      if (result.matchedCount === 0) {
        return NextResponse.json(
          { success: false, error: 'Partners data not found' },
          { status: 404 }
        );
      }
      return NextResponse.json({
        success: true,
        message: 'Partner page updated successfully'
      });
    }

    // Handle partner updates
    const { id, ...partner } = body;
    if (!id || !partner) {
      return NextResponse.json(
        { success: false, error: 'ID and partner data are required' },
        { status: 400 }
      );
    }

    const collection = await getCollection('partners');
    const result = await collection.updateOne(
      { 'partnersList.id': id },
      { $set: { 'partnersList.$': { ...partner, id } } }
    );
    if (result.matchedCount === 0) {
      return NextResponse.json(
        { success: false, error: 'Partner not found' },
        { status: 404 }
      );
    }
    return NextResponse.json({
      success: true,
      message: 'Partner updated successfully'
    });
  } catch (error) {
    console.error('Error updating partner:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to update partner'
      },
      { status: 500 }
    );
  }
}

// Delete partner
async function deletePartner(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'Partner ID is required' },
        { status: 400 }
      );
    }

    const collection = await getCollection('partners');
    const result = await collection.updateOne(
      { 'partnersList.id': id },
      { $pull: { partnersList: { id: id } } } as unknown as UpdateFilter<Document>
    );

    if (result.matchedCount === 0) {
      return NextResponse.json(
        { success: false, error: 'Partner not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Partner deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting partner:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to delete partner'
      },
      { status: 500 }
    );
  }
}

// Export the protected routes
export const GET = withAdminAuth(getPartnersData);
export const POST = withAdminAuth(addPartner);
export const PUT = withAdminAuth(updatePartner);
export const DELETE = withAdminAuth(deletePartner);
