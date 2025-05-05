import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import Content from '@/models/Content';

export async function POST(request: Request) {
  let client;
  try {
    // Connect to DB
    const dbConnection = await connectToDatabase();
    client = dbConnection.client;

    // Safely parse the request body
    let body;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json({ message: 'Invalid JSON' }, { status: 400 });
    }

    const { heroTitle, heroSubtitle, heroImage } = body;

    if (!heroTitle || !heroSubtitle || !heroImage) {
      return NextResponse.json(
        { message: 'Missing required fields' },
        { status: 400 }
      );
    }

    const result = await Content.findOneAndUpdate(
      { section: 'hero' },
      {
        $set: {
          content: {
            title: heroTitle,
            subtitle: heroSubtitle,
            backgroundImage: heroImage,
          }
        }
      },
      { upsert: true, new: true }
    );

    return NextResponse.json({ 
      message: 'Content updated successfully',
      data: result 
    });

  } catch (error) {
    console.error('Error updating content:', error);
    return NextResponse.json(
      { message: 'Failed to update content', error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  } finally {
    if (client) {
      try {
        await client.close();
      } catch (error) {
        console.error('Error closing database connection:', error);
      }
    }
  }
}
