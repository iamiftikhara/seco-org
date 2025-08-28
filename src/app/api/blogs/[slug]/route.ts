import { NextResponse } from 'next/server';
import { getCollection } from '@/lib/mongodb';

export async function GET(request: Request, { params }: { params: Promise<{ slug: string }> }) {
  try {
    const { slug } = await params;

    const collection = await getCollection('blogs');
    const blogsDoc = await collection.findOne({});

    if (!blogsDoc || !blogsDoc.posts) {
      return NextResponse.json(
        { success: false, message: 'No blog posts found' },
        { status: 404 }
      );
    }

    const post = blogsDoc.posts.find((p: any) => p.slug === slug);

    if (!post) {
      return NextResponse.json(
        { success: false, message: 'Blog post not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: post });
  } catch (err: any) {
    console.error('Error fetching blog post:', err);
    return NextResponse.json(
      { success: false, message: 'Internal server error', details: err?.message },
      { status: 500 }
    );
  }
}


