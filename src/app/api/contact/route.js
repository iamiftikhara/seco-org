import { NextResponse } from 'next/server';
import emailjs from '@emailjs/browser';
import { getCollection } from '@/lib/mongodb';

export async function GET() {
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

export async function POST(request) {
  try {
    const body = await request.json();
    const { name, email, message } = body;

    await emailjs.send(
      process.env.EMAILJS_SERVICE_ID,
      process.env.EMAILJS_TEMPLATE_ID,
      {
        from_name: name,
        from_email: email,
        message: message,
      },
      process.env.EMAILJS_PUBLIC_KEY
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { error: `Failed to send message: ${error}` },
      { status: 500 }
    );
  }
}