import { NextRequest, NextResponse } from 'next/server';
import { getCollection } from '@/lib/mongodb';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    
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

    // Find the program by slug
    const program = programsData.programsList.find((p: { slug: string }) => p.slug === slug);
    
    if (!program) {
      return NextResponse.json(
        { success: false, error: 'Program not found' },
        { status: 404 }
      );
    }

    // Check if program is active
    if (!program.isActive) {
      return NextResponse.json(
        { success: false, error: 'Program not available' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: program
    });
  } catch (error) {
    console.error('Error in program detail API:', error);
    return NextResponse.json(
      { success: false, error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
