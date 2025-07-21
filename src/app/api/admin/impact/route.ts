import { NextResponse, NextRequest } from 'next/server';
import { withAdminAuth } from '@/lib/authMiddleware';
import { getCollection } from '@/lib/mongodb';
import { Document, UpdateFilter } from 'mongodb';

// Helper function to generate new string ID
const generateNewId = (items: { id: string }[]): string => {
  if (!items || items.length === 0) return '1';
  const maxId = Math.max(...items.map(item => parseInt(item.id, 10)));
  return String(maxId + 1);
};

// GET: Fetch impact data
async function getImpactData() {
  try {
    const collection = await getCollection('impact');
    let impactData = await collection.findOne({});

    // If no data exists, create default structure
    if (!impactData) {
      const defaultData = {
        title: {
          en: { text: "Our Impact" },
          ur: { text: "ہمارا اثر" }
        },
        backgroundImage: "/images/impact-hero.jpg",
        showOnHomepage: false,
        stats: []
      };

      await collection.insertOne(defaultData);
      impactData = await collection.findOne({});
    }

    return NextResponse.json({
      success: true,
      data: impactData
    });
  } catch (error) {
    console.error('Error fetching impact data:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch impact data'
      },
      { status: 500 }
    );
  }
}

// POST: Add a new statistic
async function addStatistic(request: Request) {
  try {
    const body = await request.json();
    const statistic = body;
    if (!statistic) {
      return NextResponse.json(
        { success: false, error: 'Statistic data is required' },
        { status: 400 }
      );
    }
    const collection = await getCollection('impact');
    const impactData = await collection.findOne({});
    if (!impactData) {
      // If no impact data exists, create new with the data
      const newImpactData = {
        title: {
          en: { text: "Our Impact" },
          ur: { text: "ہمارا اثر" }
        },
        backgroundImage: "/images/impact-hero.jpg",
        showOnHomepage: false,
        stats: [{ ...statistic, id: '1' }]
      };
      await collection.insertOne(newImpactData);
    } else {
      // Add statistic to existing array with new string ID
      const newStatistic = {
        ...statistic,
        id: generateNewId(impactData.stats || [])
      };
      await collection.updateOne(
        {},
        { $push: { stats: newStatistic } as UpdateFilter<Document> }
      );
    }
    return NextResponse.json({
      success: true,
      message: 'Statistic added successfully'
    });
  } catch (error) {
    console.error('Error adding statistic:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to add statistic'
      },
      { status: 500 }
    );
  }
}

// PUT: Update impact data or statistic
async function updateImpact(request: Request) {
  try {
    const body = await request.json();

    // Handle main impact page update
    if (body.type === 'page') {
      const collection = await getCollection('impact');
      const { type, ...impactPageData } = body;
      const result = await collection.updateOne(
        {},
        { $set: impactPageData }
      );
      if (result.matchedCount === 0) {
        return NextResponse.json(
          { success: false, error: 'Impact data not found' },
          { status: 404 }
        );
      }
      return NextResponse.json({
        success: true,
        message: 'Impact page updated successfully'
      });
    }

    // Handle statistic updates
    const { id, ...statistic } = body;
    if (!id || !statistic) {
      return NextResponse.json(
        { success: false, error: 'ID and statistic data are required' },
        { status: 400 }
      );
    }

    const collection = await getCollection('impact');
    const result = await collection.updateOne(
      { 'stats.id': id },
      { $set: { 'stats.$': { ...statistic, id } } }
    );
    if (result.matchedCount === 0) {
      return NextResponse.json(
        { success: false, error: 'Statistic not found' },
        { status: 404 }
      );
    }
    return NextResponse.json({
      success: true,
      message: 'Statistic updated successfully'
    });
  } catch (error) {
    console.error('Error updating impact:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to update impact'
      },
      { status: 500 }
    );
  }
}

// Delete statistic
async function deleteStatistic(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'Statistic ID is required' },
        { status: 400 }
      );
    }

    const collection = await getCollection('impact');
    const result = await collection.updateOne(
      { 'stats.id': id },
      { $pull: { stats: { id: id } } } as unknown as UpdateFilter<Document>
    );

    if (result.matchedCount === 0) {
      return NextResponse.json(
        { success: false, error: 'Statistic not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Statistic deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting statistic:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to delete statistic'
      },
      { status: 500 }
    );
  }
}

// Export the protected routes
export const GET = withAdminAuth(getImpactData);
export const POST = withAdminAuth(addStatistic);
export const PUT = withAdminAuth(updateImpact);
export const DELETE = withAdminAuth(deleteStatistic);
