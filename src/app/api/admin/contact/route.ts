import { NextResponse, NextRequest } from 'next/server';
import { withAdminAuth } from '@/lib/authMiddleware';
import { getCollection } from '@/lib/mongodb';
import type { UpdateResult } from 'mongodb';

// GET: Fetch contact data
async function getContactData() {
  try {
    const collection = await getCollection('contact');
    const contactData = await collection.findOne({});

    if (!contactData) {
      return NextResponse.json(
        { success: false, error: 'Contact data not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: contactData,
    });
  } catch (error) {
    console.error('Error fetching contact data:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch contact data' },
      { status: 500 }
    );
  }
}

// POST: Create contact data (only if not exists)
async function createContactData(request: Request) {
  try {
    const body = await request.json();
    const contactData = body?.contactData;
    if (!contactData) {
      return NextResponse.json(
        { success: false, error: 'contactData is required' },
        { status: 400 }
      );
    }

    const collection = await getCollection('contact');
    const existing = await collection.findOne({});
    if (existing) {
      return NextResponse.json(
        { success: false, error: 'Contact data already exists' },
        { status: 400 }
      );
    }

    await collection.insertOne(contactData);
    return NextResponse.json({ success: true, message: 'Contact data created successfully' });
  } catch (error) {
    console.error('Error creating contact data:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create contact data' },
      { status: 500 }
    );
  }
}

// PUT: Update (upsert) contact data
async function updateContactData(request: Request) {
  try {
    const body = await request.json();
    const contactData = body?.contactData;
    if (!contactData) {
      return NextResponse.json(
        { success: false, error: 'contactData is required' },
        { status: 400 }
      );
    }

    const collection = await getCollection('contact');
    const result = await collection.updateOne(
      {},
      { $set: contactData },
      { upsert: true }
    );

    const created = (result as UpdateResult).upsertedId !== undefined;
    return NextResponse.json({
      success: true,
      message: created ? 'Contact data created' : 'Contact data updated',
    });
  } catch (error) {
    console.error('Error updating contact data:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update contact data' },
      { status: 500 }
    );
  }
}

// DELETE: Delete the contact data document
async function deleteContactData(request: NextRequest) {
  try {
    const collection = await getCollection('contact');
    const existing = await collection.findOne({});
    if (!existing) {
      return NextResponse.json(
        { success: false, error: 'Contact data not found' },
        { status: 404 }
      );
    }
    await collection.deleteOne({ _id: existing._id });
    return NextResponse.json({ success: true, message: 'Contact data deleted successfully' });
  } catch (error) {
    console.error('Error deleting contact data:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete contact data' },
      { status: 500 }
    );
  }
}

export const GET = withAdminAuth(getContactData);
export const POST = withAdminAuth(createContactData);
export const PUT = withAdminAuth(updateContactData);
export const DELETE = withAdminAuth(deleteContactData);
