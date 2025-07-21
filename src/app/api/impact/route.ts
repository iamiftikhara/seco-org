import { NextResponse, NextRequest } from 'next/server';
import { getCollection } from '@/lib/mongodb';

// GET: Fetch impact data
async function getImpactData(request: NextRequest) {
  try {
    const collection = await getCollection('impact');

    // Get query parameters
    const { searchParams } = new URL(request.url);
    const homepage = searchParams.get('homepage');

    let impactData = await collection.findOne({});

    // If no data exists, return empty response
    if (!impactData) {
      return NextResponse.json({
        success: true,
        data: null
      });
    }

    // Filter for homepage if requested
    if (homepage === 'true') {
      if (!impactData.showOnHomepage) {
        return NextResponse.json({
          success: true,
          data: null
        });
      }

      // Filter only homepage stats and sort by order
      const homepageStats = impactData.stats
        ? impactData.stats
            .filter((stat: any) => stat.showOnHomepage)
            .sort((a: any, b: any) => a.order - b.order)
        : [];

      return NextResponse.json({
        success: true,
        data: {
          ...impactData,
          stats: homepageStats
        }
      });
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

export async function GET(request: NextRequest) {
  return getImpactData(request);
}

