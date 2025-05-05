import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Content from '@/models/Content';

export async function GET() {
  try {
    await dbConnect();
    const heroContent = await Content.findOne({ section: 'hero' });
    
    if (!heroContent) {
      return NextResponse.json({
        title: 'Welcome to SECO',
        subtitle: 'Supporting Communities Through Sustainable Development',
        backgroundImage: '/images/hero-bg.jpg'
      });
    }

    return NextResponse.json(heroContent.content);
  } catch (error) {
    console.error('Error fetching hero content:', error);
    return NextResponse.json(
      { message: 'Failed to fetch content' },
      { status: 500 }
    );
  }
}