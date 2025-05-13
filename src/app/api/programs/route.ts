import { NextRequest, NextResponse } from 'next/server';
import { Program, ProgramItem } from '@/types/programs';
import { programs } from '@/data/programs';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    
    // Get query parameters
    const limit = searchParams.get('limit');
    const status = searchParams.get('status');
    const language = searchParams.get('language');
    const category = searchParams.get('category');
    const showOnHome = searchParams.get('showOnHome');
    
    let filteredPrograms = [...programs.programsList];

    // Apply filters
    if (status === 'active') {
      filteredPrograms = filteredPrograms.filter(program => program.isActive);
    }
    
    if (language) {
      filteredPrograms = filteredPrograms.filter(program => program.language === language);
    }
    
    if (category) {
      filteredPrograms = filteredPrograms.filter(program => program.category.text.toLowerCase() === category.toLowerCase());
    }

    if (showOnHome === 'true') {
      filteredPrograms = filteredPrograms.filter(program => program.showOnHomepage);
    }

    // Apply limit if specified and not 0
    if (limit && parseInt(limit) > 0) {
      filteredPrograms = filteredPrograms.slice(0, parseInt(limit));
    }

    // Log the count of programs being returned
    console.log(`Returning ${filteredPrograms.length} programs`);

    return NextResponse.json({
      success: true,
      data: {
        programPage: programs.programsPage,
        programsList: filteredPrograms
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
    const body = await request.json() as ProgramItem;
    
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