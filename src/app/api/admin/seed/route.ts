import { NextResponse } from 'next/server';
import { getCollection } from '@/lib/mongodb';
import { withAdminAuth } from '@/lib/authMiddleware';
import * as navbar from '@/data/navbar';
import * as blog from '@/data/blog';
import * as contact from '@/data/contact';
import * as events from '@/data/events';
import * as footer from '@/data/footer';
import * as gallery from '@/data/gallery';
import * as hero from '@/data/hero';
import * as impact from '@/data/impact';
import * as partners from '@/data/partners';
import * as programs from '@/data/programs';
import * as projects from '@/data/projects';
import * as services from '@/data/services';
import * as testimonials from '@/data/testimonials';

// const dataModules = {
//   navbar, blog, contact, events, footer, gallery,
//   hero, impact, partners, programs, projects,
//   services, testimonials
// };
const dataModules = {testimonials};

async function handler() {
  try {
    const results = [];

    for (const [name, module] of Object.entries(dataModules)) {
      const collection = await getCollection(name.toLowerCase());
      
      // Get the main data export
      const data = (module as Record<string, unknown>)[name] || 
                   (module as Record<string, unknown>)[`${name}Data`] || 
                   (module as Record<string, unknown>)[`${name}List`] || 
                   Object.values(module)[0];

      if (data) {
        if (Array.isArray(data)) {
          if (data.length > 0) {
            await collection.deleteMany({});
            await collection.insertMany(data);
            results.push(`Inserted ${data.length} documents into '${name}' collection`);
          }
        } else if (typeof data === 'object') {
          await collection.deleteMany({});
          await collection.insertOne(data);
          results.push(`Inserted 1 document into '${name}' collection`);
        }
      }
    }

    return NextResponse.json({ 
      success: true, 
      message: 'Database seeded successfully',
      details: results
    });
  } catch (error) {
    console.error('Error seeding database:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to seed database' },
      { status: 500 }
    );
  }
}

export const POST = withAdminAuth(handler);