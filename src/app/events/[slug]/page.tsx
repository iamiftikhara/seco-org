import type { Metadata, ResolvingMetadata } from 'next';
import { generateMeta } from '@/meta/config';
import { eventService } from '../utils/eventService';
import EventDetailClient from './EventDetail';

type Props = {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function generateMetadata(
  { params }: Props,
  _parent: ResolvingMetadata
): Promise<Metadata> {
  const { slug } = await params;
  // console.log('slug', slug, _parent);

  try {
    const eventResponse = await eventService.getEventBySlug(slug);
    const event = eventResponse?.data;

    if (!event) {
      return generateMeta({
        title: 'Event Not Found',
        description: 'The requested event could not be found.',
        type: 'website',
        image: '/images/og-default.jpg',
      });
    }

    return {
      description: event.shortDescription.text,
      openGraph: {
        type: 'website',
        siteName: 'SECO',
        title: event.title.text,
        description: event.shortDescription.text,
        url: `/events/${event.slug}`,
        images: [
          {
            url: event.featuredImage,
            width: 1200,
            height: 630,
            alt: event.title.text,
          },
        ],
      },
      twitter: {
        card: 'summary_large_image',
        title: event.title.text,
        description: event.shortDescription.text,
        creator: event.socialShare?.twitterHandle || '@SECO',
        images: [event.featuredImage],
      },
      keywords: event.socialShare?.hashtags || [],
    };
  } catch (error) {
    console.error('Error generating metadata:', error);
    return generateMeta({
      title: 'Error',
      description: 'An error occurred while loading the event.',
      type: 'website',
      image: '/images/og-default.jpg',
    });
  }
}

export default function EventPage() {
  return <EventDetailClient />;
}
