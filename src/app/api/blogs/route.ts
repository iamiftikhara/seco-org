import { NextRequest, NextResponse } from 'next/server';
import { BlogPost, BlogData, TextContent } from '@/types/blog';
import { blogData } from '@/data/blog';

interface BlogApiResponse {
  success: boolean;
  data: {
    blogPage: {
      pageTitle: TextContent;
      pageDescription: TextContent;
      heroImage: string;
      title: TextContent;
      description: TextContent;
    };
    blogsList: BlogPost[];
  };
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    
    // Get query parameters
    const limit = searchParams.get('limit');
    const language = searchParams.get('language') as 'en' | 'ur' | null;
    const category = searchParams.get('category');
    const showOnHome = searchParams.get('showOnHome');
    const slug = searchParams.get('slug');
    
    let filteredPosts = [...blogData.posts] as BlogPost[];

    // Apply filters
    if (language) {
      filteredPosts = filteredPosts.filter(post => post.title.language === language);
    }
    
    if (category) {
      filteredPosts = filteredPosts.filter(post => 
        post.category.toLowerCase() === category.toLowerCase()
      );
    }

    if (showOnHome === 'true') {
      filteredPosts = filteredPosts.filter(post => post.showOnHome);
    }

    if (slug) {
      filteredPosts = filteredPosts.filter(post => post.slug === slug);
    }

    // Sort posts by date (most recent first)
    filteredPosts.sort((a, b) => 
      new Date(b.date).getTime() - new Date(a.date).getTime()
    );

    // Apply limit if specified and not 0
    if (limit && parseInt(limit) > 0) {
      filteredPosts = filteredPosts.slice(0, parseInt(limit));
    }

    // Log the count of posts being returned
    console.log(`Returning ${filteredPosts.length} blog posts`);

    const response: BlogApiResponse = {
      success: true,
      data: {
        blogPage: {
          pageTitle: blogData.pageTitle,
          pageDescription: blogData.pageDescription,
          heroImage: blogData.heroImage,
          title: blogData.title,
          description: blogData.description
        },
        blogsList: filteredPosts
      }
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('Error in blogs API:', error);
    return NextResponse.json(
      { success: false, error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}

interface BlogPostResponse {
  success: boolean;
  message: string;
  data: BlogPost;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json() as BlogPost;
    
    // Here you would typically validate the body and save to a database
    // For now, we'll just return a success response with the provided data
    const response: BlogPostResponse = {
      success: true,
      message: 'Blog post created successfully',
      data: body
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('Error in blogs API:', error);
    return NextResponse.json(
      { success: false, error: 'Internal Server Error' },
      { status: 500 }
    );
  }
} 