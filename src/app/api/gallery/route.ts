import { NextResponse } from 'next/server';
import { getCollection } from '@/lib/mongodb';
import type { GalleryConfig } from '@/types/gallery';
import type { Collection } from 'mongodb';

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const homepageParam = url.searchParams.get('homepage');
    const homepageOnly = homepageParam === 'true';

    const collection = (await getCollection('gallery')) as unknown as Collection<GalleryConfig>;
    const galleryDoc = await collection.findOne({});

    if (!galleryDoc) {
      return NextResponse.json(
        { success: false, error: 'Gallery data not found' },
        { status: 404 }
      );
    }

    let data: GalleryConfig = {
      hero: galleryDoc.hero,
      sections: galleryDoc.sections || []
    };

    if (homepageOnly) {
      const filteredSections = (data.sections || [])
        .map(section => ({
          title: section.title,
          images: (section.images || []).filter(image => image.showOnHome === true)
        }))
        .filter(section => section.images.length > 0);

      data = {
        hero: data.hero,
        sections: filteredSections
      };
    }

    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error('Error fetching gallery data:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch gallery data',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
} 