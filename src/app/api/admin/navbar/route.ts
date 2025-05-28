import { navbarData } from '@/data/navbar';
import { NextResponse } from 'next/server';
import { withAdminAuth } from '@/lib/authMiddleware';
import { connectToDatabase, getCollection } from '@/lib/mongodb';

const getNavbarData = async () => {
  try {
    const navbarCollection = await getCollection('navbar');
    const navbar = await navbarCollection.findOne({});
    if (!navbar) {
      return NextResponse.json({ success: false, error: 'Navbar data not found' }, { status: 404 });
    }
    return NextResponse.json({ success: true, data: navbar });
  } catch (error) {
    console.error('Failed to fetch navbar data:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch navbar data' },
      { status: 500 }
    );
  }
}

const updateNavbarData = async(request: Request) => {
  try {
    const navbarCollection = await getCollection('navbar');
    const data = await request.json();

    // Validate the incoming data structure
    if (!data.logo || !data.logoTitle) {
      return NextResponse.json(
        { success: false, error: 'Invalid data structure' },
        { status: 400 }
      );
    }

    // Exclude the _id field from the update operation
    const { _id, ...updateData } = data;

    const updatedNavbar = await navbarCollection.findOneAndUpdate({}, { $set: updateData }, { upsert: true, returnDocument: 'after' });

    if (!updatedNavbar) {
      return NextResponse.json(
        { success: false, error: 'Failed to update navbar data' },
        { status: 500 }
      );
    }
    return NextResponse.json({ success: true, data: updatedNavbar.value });
  } catch (error) {
    console.error('Failed to update navbar data:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update navbar data' },
      { status: 500 }
    );
  }
}


// Export the protected routes
export const GET = withAdminAuth(getNavbarData);
export const PUT = withAdminAuth(updateNavbarData);