import { NextRequest, NextResponse } from 'next/server';
import { getCollection } from '@/lib/mongodb';
import { Partner } from '@/types/partners';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const showOnHome = searchParams.get('showOnHome');

    const collection = await getCollection('partners');
    const partnersData = await collection.findOne({});

    if (!partnersData || !partnersData.partnersList) {
      return NextResponse.json({
        success: false,
        error: 'No partners available',
        message: 'Partners are currently being set up. Please check back later or contact the administrator.',
        isEmpty: true
      }, { status: 404 });
    }

    let partnersList = partnersData.partnersList;

    // Filter active partners
    partnersList = partnersList.filter((partner: { isActive: boolean }) => partner.isActive);

    // Filter for homepage if requested
    if (showOnHome === 'true') {
      partnersList = partnersList.filter((partner: { showOnHomepage: boolean }) => partner.showOnHomepage);
    }

    return NextResponse.json({
      success: true,
      data: {
        partnerPage: partnersData.partnerPage,
        partnersList: partnersList
      }
    });
  } catch (error) {
    console.error('Error in partners API:', error);
    return NextResponse.json(
      { success: false, error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
