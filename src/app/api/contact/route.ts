import { NextResponse } from 'next/server';
import emailjs from '@emailjs/browser';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, message } = body;

    await emailjs.send(
      process.env.EMAILJS_SERVICE_ID!,
      process.env.EMAILJS_TEMPLATE_ID!,
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