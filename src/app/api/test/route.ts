import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';


export async function GET() {
  try {
    await connectToDatabase();
    return NextResponse.json({ status: 'Connected to MongoDB' });
  } catch (error) {
    console.error('Database connection error:', error);
    return NextResponse.json(
      { error: 'Failed to connect to database' },
      { status: 500 }
    );
  }
}