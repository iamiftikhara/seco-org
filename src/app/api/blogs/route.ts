import { NextRequest, NextResponse } from 'next/server';
import { BlogPost, BlogData } from '@/types/blog';
import { getCollection } from '@/lib/mongodb';

interface BlogApiResponse {
  success: boolean;
  data: {
    blogPage: BlogData['blogPage'];
    blogsList: BlogPost[];
  };
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    
    // Get query parameters
    const limit = searchParams.get('limit');
    const category = searchParams.get('category');
    const showOnHome = searchParams.get('showOnHome');
    const slug = searchParams.get('slug');
    
    const collection = await getCollection('blogs');
    const blogsDoc = await collection.findOne({});
    if (!blogsDoc) {
      return new NextResponse(null, { status: 204 });
    }

    // Accept both possible keys in DB: 'posts' (new) or 'blogsList' (legacy)
    let rawPosts: any[] = [];
    if (Array.isArray(blogsDoc.posts)) rawPosts = blogsDoc.posts;
    else if (Array.isArray(blogsDoc.blogsList)) rawPosts = blogsDoc.blogsList;
    let blogsList: BlogPost[] = rawPosts as BlogPost[];

    if (category) {
      blogsList = blogsList.filter(post => post.category?.toLowerCase() === category.toLowerCase());
    }

    if (showOnHome === 'true') {
      blogsList = blogsList.filter(post => post.showOnHome === true);
    }

    if (slug) {
      blogsList = blogsList.filter(post => post.slug === slug);
    }

    // If requesting homepage items with a limit, randomize order so selection varies
    if (showOnHome === 'true' && limit && parseInt(limit) > 0) {
      // Fisher-Yates shuffle
      const arr = [...blogsList];
      for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
      }
      blogsList = arr.slice(0, parseInt(limit));
    } else {
      // Default: latest first
      blogsList.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
      if (limit && parseInt(limit) > 0) {
        blogsList = blogsList.slice(0, parseInt(limit));
      }
    }

    if (!blogsList.length) {
      return new NextResponse(null, { status: 204 });
    }

    return NextResponse.json({
      success: true,
      data: {
        blogPage: blogsDoc.blogPage as BlogData['blogPage'],
        blogsList,
      }
    });
  } catch (error) {
    console.error('Error in blogs API:', error);
    return NextResponse.json(
      { success: false, error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
