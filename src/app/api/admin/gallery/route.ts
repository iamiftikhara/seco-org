import { NextResponse } from 'next/server';
import { withAdminAuth } from '@/lib/authMiddleware';
import { getCollection } from '@/lib/mongodb';
import type { GalleryConfig, GalleryHero, GallerySection, GalleryImage } from '@/types/gallery';
import { Document, UpdateFilter } from 'mongodb';

// GET: Fetch gallery data
async function getGalleryData() {
  try {
    const collection = await getCollection('gallery');
    const galleryData = await collection.findOne({});

    if (!galleryData) {
      return NextResponse.json(
        { success: false, error: 'Gallery data not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: galleryData
    });
  } catch (error) {
    console.error('Error fetching gallery data:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch gallery data' },
      { status: 500 }
    );
  }
}

// POST: Add a new section or image, or set hero if first-time init
// Body supports actions:
// - { action: 'addSection', section: { title: {en, ur} } }
// - { action: 'addImage', sectionIndex: number, image: GalleryImage }
// - { action: 'setHero', hero: GalleryHero }
async function createGalleryItem(request: Request) {
  try {
    const body = await request.json();
    const { action } = body as { action?: string };

    const collection = await getCollection('gallery');
    const current = (await collection.findOne({})) as GalleryConfig | null;

    if (action === 'setHero') {
      const { hero } = body as { hero: GalleryHero };
      if (!hero) {
        return NextResponse.json(
          { success: false, error: 'Hero is required' },
          { status: 400 }
        );
      }

      if (!current) {
        const newDoc: GalleryConfig = {
          hero,
          sections: []
        };
        await collection.insertOne(newDoc as unknown as Document);
      } else {
        await collection.updateOne({}, { $set: { hero } });
      }

      return NextResponse.json({ success: true, message: 'Hero saved successfully' });
    }

    if (action === 'addSection') {
      const { section } = body as { section: Pick<GallerySection, 'title'> };
      if (!section || !section.title) {
        return NextResponse.json(
          { success: false, error: 'Section title is required' },
          { status: 400 }
        );
      }
      if (!current) {
        const newDoc: GalleryConfig = {
          hero: { image: '', title: { en: '', ur: '' }, description: { en: '', ur: '' } },
          sections: [{ title: section.title, images: [] }]
        };
        await collection.insertOne(newDoc as unknown as Document);
      } else {
        await collection.updateOne(
          {},
          { $push: { sections: { title: section.title, images: [] } as GallerySection } as UpdateFilter<Document> }
        );
      }
      return NextResponse.json({ success: true, message: 'Section added successfully' });
    }

    if (action === 'addImage') {
      const { sectionIndex, image } = body as { sectionIndex: number; image: GalleryImage };
      if (sectionIndex === undefined || !image) {
        return NextResponse.json(
          { success: false, error: 'sectionIndex and image are required' },
          { status: 400 }
        );
      }
      if (!current) {
        return NextResponse.json(
          { success: false, error: 'Gallery data not found' },
          { status: 404 }
        );
      }

      // Push image to the specific section by index
      const path = `sections.${sectionIndex}.images`;
      await collection.updateOne({}, { $push: { [path]: image } as unknown as UpdateFilter<Document> });
      return NextResponse.json({ success: true, message: 'Image added successfully' });
    }

    return NextResponse.json(
      { success: false, error: 'Invalid action' },
      { status: 400 }
    );
  } catch (error) {
    console.error('Error creating gallery item:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create gallery item' },
      { status: 500 }
    );
  }
}

// PUT: Update hero, section or image
// - { action: 'updateHero', hero }
// - { action: 'updateSection', sectionIndex, section }
// - { action: 'updateImage', sectionIndex, imageIndex, image }
async function updateGalleryItem(request: Request) {
  try {
    const body = await request.json();
    const { action } = body as { action?: string };
    const collection = await getCollection('gallery');

    if (action === 'updateHero') {
      const { hero } = body as { hero: GalleryHero };
      if (!hero) {
        return NextResponse.json(
          { success: false, error: 'Hero is required' },
          { status: 400 }
        );
      }
      const result = await collection.updateOne({}, { $set: { hero } });
      if (result.matchedCount === 0) {
        return NextResponse.json(
          { success: false, error: 'Gallery data not found' },
          { status: 404 }
        );
      }
      return NextResponse.json({ success: true, message: 'Hero updated successfully' });
    }

    if (action === 'updateSection') {
      const { sectionIndex, section } = body as { sectionIndex: number; section: Pick<GallerySection, 'title'> };
      if (sectionIndex === undefined || !section) {
        return NextResponse.json(
          { success: false, error: 'sectionIndex and section are required' },
          { status: 400 }
        );
      }
      const path = `sections.${sectionIndex}.title`;
      const result = await collection.updateOne({}, { $set: { [path]: section.title } });
      if (result.matchedCount === 0) {
        return NextResponse.json(
          { success: false, error: 'Gallery data not found' },
          { status: 404 }
        );
      }
      return NextResponse.json({ success: true, message: 'Section updated successfully' });
    }

    if (action === 'updateImage') {
      const { sectionIndex, imageIndex, image } = body as { sectionIndex: number; imageIndex: number; image: GalleryImage };
      if (sectionIndex === undefined || imageIndex === undefined || !image) {
        return NextResponse.json(
          { success: false, error: 'sectionIndex, imageIndex and image are required' },
          { status: 400 }
        );
      }
      const path = `sections.${sectionIndex}.images.${imageIndex}`;
      const result = await collection.updateOne({}, { $set: { [path]: image } });
      if (result.matchedCount === 0) {
        return NextResponse.json(
          { success: false, error: 'Gallery data not found' },
          { status: 404 }
        );
      }
      return NextResponse.json({ success: true, message: 'Image updated successfully' });
    }

    return NextResponse.json(
      { success: false, error: 'Invalid action' },
      { status: 400 }
    );
  } catch (error) {
    console.error('Error updating gallery item:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update gallery item' },
      { status: 500 }
    );
  }
}

// DELETE: Delete section or image via indices
// Query params: action=deleteSection&sectionIndex=0
// or action=deleteImage&sectionIndex=0&imageIndex=2
async function deleteGalleryItem(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const action = searchParams.get('action');
    const collection = await getCollection('gallery');

    if (action === 'deleteSection') {
      const sectionIndex = parseInt(searchParams.get('sectionIndex') || '');
      if (isNaN(sectionIndex)) {
        return NextResponse.json(
          { success: false, error: 'Valid sectionIndex is required' },
          { status: 400 }
        );
      }
      // Unset then pull null to remove by index
      const unsetPath = `sections.${sectionIndex}`;
      await collection.updateOne({}, { $unset: { [unsetPath]: 1 } as unknown as UpdateFilter<Document> });
      await collection.updateOne({}, { $pull: { sections: null } as unknown as UpdateFilter<Document> });
      return NextResponse.json({ success: true, message: 'Section deleted successfully' });
    }

    if (action === 'deleteImage') {
      const sectionIndex = parseInt(searchParams.get('sectionIndex') || '');
      const imageIndex = parseInt(searchParams.get('imageIndex') || '');
      if (isNaN(sectionIndex) || isNaN(imageIndex)) {
        return NextResponse.json(
          { success: false, error: 'Valid sectionIndex and imageIndex are required' },
          { status: 400 }
        );
      }
      const unsetPath = `sections.${sectionIndex}.images.${imageIndex}`;
      await collection.updateOne({}, { $unset: { [unsetPath]: 1 } as unknown as UpdateFilter<Document> });
      const pullPath = `sections.${sectionIndex}.images`;
      await collection.updateOne({}, { $pull: { [pullPath]: null } as unknown as UpdateFilter<Document> });
      return NextResponse.json({ success: true, message: 'Image deleted successfully' });
    }

    return NextResponse.json(
      { success: false, error: 'Invalid action' },
      { status: 400 }
    );
  } catch (error) {
    console.error('Error deleting gallery item:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete gallery item' },
      { status: 500 }
    );
  }
}

export const GET = withAdminAuth(getGalleryData);
export const POST = withAdminAuth(createGalleryItem);
export const PUT = withAdminAuth(updateGalleryItem);
export const DELETE = withAdminAuth(deleteGalleryItem);
