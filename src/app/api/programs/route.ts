import { NextRequest, NextResponse } from 'next/server';
import { getCollection } from '@/lib/mongodb';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const showOnHome = searchParams.get('showOnHome');

    const collection = await getCollection('programs');
    const programsData = await collection.findOne({});

    if (!programsData || !programsData.programsList) {
      return NextResponse.json({
        success: false,
        error: 'No programs available',
        message: 'Programs are currently being set up. Please check back later or contact the administrator.',
        isEmpty: true
      }, { status: 404 });
    }

    let programsList = programsData.programsList;

    // Filter active programs
    programsList = programsList.filter((program: { isActive: boolean }) => program.isActive);

    // Filter for homepage if requested
    if (showOnHome === 'true') {
      programsList = programsList.filter((program: { showOnHomepage: boolean }) => program.showOnHomepage);
    }

    return NextResponse.json({
      success: true,
      data: {
        programPage: programsData.programPage,
        programsList: programsList
      }
    });
  } catch (error) {
    console.error('Error in programs API:', error);
    return NextResponse.json(
      { success: false, error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Here you would typically validate the body and save to a database
    // For now, we'll just return a success response with the provided data
    return NextResponse.json({
      success: true,
      message: 'Program created successfully',
      data: body
    });
  } catch (error) {
    console.error('Error in programs API:', error);
    return NextResponse.json(
      { success: false, error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}