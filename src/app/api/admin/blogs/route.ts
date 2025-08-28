import { NextResponse, NextRequest } from 'next/server';
import { withAdminAuth } from '@/lib/authMiddleware';
import { getCollection } from '@/lib/mongodb';
import { Document, UpdateFilter } from 'mongodb';

// Helper to generate sequential string IDs
const generateNewId = (items: { id: string }[]): string => {
  if (!items || items.length === 0) return '1';
  const maxId = Math.max(...items.map(item => parseInt(item.id, 10)));
  return String(maxId + 1);
};

// GET: Fetch blogs data
async function getBlogsData() {
  try {
    const collection = await getCollection('blogs');
    const blogsData = await collection.findOne({});

    // Do not create defaults; return empty structure if none exists
    if (!blogsData) {
      return NextResponse.json({ success: true, data: { blogPage: null, posts: [] } });
    }

    return NextResponse.json({ success: true, data: blogsData });
  } catch (error) {
    console.error('Error fetching blogs data:', error);
    return NextResponse.json({ success: false, error: 'Failed to fetch blogs data' }, { status: 500 });
  }
}

// POST: Add a new blog post
async function addBlog(request: Request) {
  try {
    const body = await request.json();
    const post = body;
    if (!post) {
      return NextResponse.json({ success: false, error: 'Blog post data is required' }, { status: 400 });
    }
    const collection = await getCollection('blogs');
    const blogsData = await collection.findOne({});
    if (!blogsData) {
      const newData = {
        blogPage: null,
        posts: [{ ...post, id: '1' }]
      };
      await collection.insertOne(newData);
    } else {
      const newPost = { ...post, id: generateNewId(blogsData.posts || []) };
      await collection.updateOne({}, { $push: { posts: newPost } as UpdateFilter<Document> });
    }
    return NextResponse.json({ success: true, message: 'Blog post added successfully' });
  } catch (error) {
    console.error('Error adding blog post:', error);
    return NextResponse.json({ success: false, error: 'Failed to add blog post' }, { status: 500 });
  }
}

// PUT: Update blog page meta or a post
async function updateBlog(request: Request) {
  try {
    const body = await request.json();
    if (body.type === 'page') {
      const collection = await getCollection('blogs');
      const existing = await collection.findOne({});
      if (!existing) {
        await collection.insertOne({ blogPage: body.blogPage, posts: [] });
        return NextResponse.json({ success: true, message: 'Blog page created successfully' });
      }
      const result = await collection.updateOne({}, { $set: { blogPage: body.blogPage } });
      if (result.matchedCount === 0) {
        return NextResponse.json({ success: false, error: 'Blogs data not found' }, { status: 404 });
      }
      return NextResponse.json({ success: true, message: 'Blog page updated successfully' });
    }

    const { id, ...post } = body;
    if (!id || !post) {
      return NextResponse.json({ success: false, error: 'ID and blog post data are required' }, { status: 400 });
    }
    const collection = await getCollection('blogs');
    const result = await collection.updateOne({ 'posts.id': id }, { $set: { 'posts.$': { ...post, id } } });
    if (result.matchedCount === 0) {
      return NextResponse.json({ success: false, error: 'Blog post not found' }, { status: 404 });
    }
    return NextResponse.json({ success: true, message: 'Blog post updated successfully' });
  } catch (error) {
    console.error('Error updating blog post:', error);
    return NextResponse.json({ success: false, error: 'Failed to update blog post' }, { status: 500 });
  }
}

// DELETE: Remove blog post by id
async function deleteBlog(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    if (!id) {
      return NextResponse.json({ success: false, error: 'Blog ID is required' }, { status: 400 });
    }
    const collection = await getCollection('blogs');
    const result = await collection.updateOne(
      { 'posts.id': id },
      { $pull: { posts: { id } } } as unknown as UpdateFilter<Document>
    );
    if (result.matchedCount === 0) {
      return NextResponse.json({ success: false, error: 'Blog post not found' }, { status: 404 });
    }
    return NextResponse.json({ success: true, message: 'Blog post deleted successfully' });
  } catch (error) {
    console.error('Error deleting blog post:', error);
    return NextResponse.json({ success: false, error: 'Failed to delete blog post' }, { status: 500 });
  }
}

export const GET = withAdminAuth(getBlogsData);
export const POST = withAdminAuth(addBlog);
export const PUT = withAdminAuth(updateBlog);
export const DELETE = withAdminAuth(deleteBlog);


