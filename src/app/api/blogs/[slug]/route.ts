import { NextResponse } from 'next/server';
import { getCollection } from '@/lib/mongodb';
import type { BlogPost } from '@/types/blog';

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

    const post = (blogsDoc.posts as BlogPost[]).find((p) => p.slug === slug);

    if (!post) {
      return NextResponse.json(
        { success: false, message: 'Blog post not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: post });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    console.error('Error fetching blog post:', err);
    return NextResponse.json(
      { success: false, message: 'Internal server error', details: message },
      { status: 500 }
    );
  }
}


