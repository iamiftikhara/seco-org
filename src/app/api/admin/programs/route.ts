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

// GET: Fetch programs data
async function getProgramsData() {
  try {
    const collection = await getCollection('programs');
    let programsData = await collection.findOne({});

    // If no data exists, create default structure
    if (!programsData) {
      const defaultData = {
        programPage: {
          title: {
            en: { text: "Our Programs" },
            ur: { text: "ہمارے پروگرامز" }
          },
          description: {
            en: { text: "Discover our comprehensive programs designed to make a positive impact." },
            ur: { text: "ہمارے جامع پروگرامز دریافت کریں جو مثبت اثرات کے لیے ڈیزائن کیے گئے ہیں۔" }
          },
          image: "/images/programs-hero.jpg"
        },
        programsList: []
      };

      await collection.insertOne(defaultData);
      programsData = defaultData;
    }

    return NextResponse.json({
      success: true,
      data: programsData
    });
  } catch (error) {
    console.error('Error fetching programs data:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch programs data'
      },
      { status: 500 }
    );
  }
}

// POST: Add a new program
async function addProgram(request: Request) {
  try {
    const body = await request.json();
    const program = body;
    if (!program) {
      return NextResponse.json(
        { success: false, error: 'Program data is required' },
        { status: 400 }
      );
    }
    const collection = await getCollection('programs');
    const programsData = await collection.findOne({});
    if (!programsData) {
      // If no programs data exists, create new with the data
      const newProgramsData = {
        programPage: {
          title: {
            en: { text: "Our Programs" },
            ur: { text: "ہمارے پروگرامز" }
          },
          description: {
            en: { text: "Discover our comprehensive programs designed to make a positive impact." },
            ur: { text: "ہمارے جامع پروگرامز دریافت کریں جو مثبت اثرات کے لیے ڈیزائن کیے گئے ہیں۔" }
          },
          image: "/images/programs-hero.jpg"
        },
        programsList: [{ ...program, id: '1' }]
      };
      await collection.insertOne(newProgramsData);
    } else {
      // Add program to existing array with new string ID
      const newProgram = {
        ...program,
        id: generateNewId(programsData.programsList || [])
      };
      await collection.updateOne(
        {},
        { $push: { programsList: newProgram } as UpdateFilter<Document> }
      );
    }
    return NextResponse.json({
      success: true,
      message: 'Program added successfully'
    });
  } catch (error) {
    console.error('Error adding program:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to add program'
      },
      { status: 500 }
    );
  }
}

// PUT: Update a program
async function updateProgram(request: Request) {
  try {
    const body = await request.json();

    // Handle programPage update separately
    if (body.type === 'page') {
      const collection = await getCollection('programs');
      const result = await collection.updateOne(
        {},
        { $set: { programPage: body.programPage } }
      );
      if (result.matchedCount === 0) {
        return NextResponse.json(
          { success: false, error: 'Programs data not found' },
          { status: 404 }
        );
      }
      return NextResponse.json({
        success: true,
        message: 'Program page updated successfully'
      });
    }

    // Handle program updates
    const { id, ...program } = body;
    if (!id || !program) {
      return NextResponse.json(
        { success: false, error: 'ID and program data are required' },
        { status: 400 }
      );
    }

    const collection = await getCollection('programs');
    const result = await collection.updateOne(
      { 'programsList.id': id },
      { $set: { 'programsList.$': { ...program, id } } }
    );
    if (result.matchedCount === 0) {
      return NextResponse.json(
        { success: false, error: 'Program not found' },
        { status: 404 }
      );
    }
    return NextResponse.json({
      success: true,
      message: 'Program updated successfully'
    });
  } catch (error) {
    console.error('Error updating program:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to update program'
      },
      { status: 500 }
    );
  }
}

// Delete program
async function deleteProgram(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'Program ID is required' },
        { status: 400 }
      );
    }

    const collection = await getCollection('programs');
    const result = await collection.updateOne(
      { 'programsList.id': id },
      { $pull: { programsList: { id } } }
    );

    if (result.matchedCount === 0) {
      return NextResponse.json(
        { success: false, error: 'Program not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Program deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting program:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to delete program'
      },
      { status: 500 }
    );
  }
}

// Export the protected routes
export const GET = withAdminAuth(getProgramsData);
export const POST = withAdminAuth(addProgram);
export const PUT = withAdminAuth(updateProgram);
export const DELETE = withAdminAuth(deleteProgram);