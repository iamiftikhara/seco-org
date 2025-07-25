import type { Metadata, ResolvingMetadata } from 'next';
import { headers } from 'next/headers';
import EventDetailClient from './EventDetail';

type Props = {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export async function generateMetadata(
  { params }: Props,
  _parent: ResolvingMetadata
): Promise<Metadata> {
  const { slug } = await params;

  try {
    // Get the host from headers
    const headersList = headers();
    const host = (await headersList).get('host') || 'localhost:3000';
    const protocol = process.env.NODE_ENV === 'development' ? 'http' : 'https';

    // Construct absolute URL
    const url = `${protocol}://${host}/api/events/${slug}`;
    const response = await fetch(url);
    const data = await response.json();
    
    const event = data.data.event;

    if (!event) {
      return {
        title: 'Event Not Found',
        description: 'The requested event could not be found.',
        openGraph: {
          title: 'Event Not Found',
          description: 'The requested event could not be found.',
          images: ['/images/og-default.jpg'],
        },
      };
    }

    // Use English as default for metadata
    const eventData = event.en || event.ur;

    return {
      title: `${eventData.title.text} | SECO Events`,
      description: eventData.shortDescription.text,
      openGraph: {
        type: 'website',
        siteName: 'SECO',
        title: eventData.title.text,
        description: eventData.shortDescription.text,
        url: `/events/${event.slug}`,
        images: [
          {
            url: event.featuredImage,
            width: 1200,
            height: 630,
            alt: eventData.title.text,
          },
        ],
      },
      twitter: {
        card: 'summary_large_image',
        title: eventData.title.text,
        description: eventData.shortDescription.text,
        creator: event.socialShare?.twitterHandle || '@SECO',
        images: [event.featuredImage],
      },
      keywords: event.socialShare?.hashtags || [],
    };
  } catch (error) {
    console.error('Error generating metadata:', error);
    return {
      title: 'Error | SECO Events',
      description: 'An error occurred while loading the event.',
      openGraph: {
        title: 'Error',
        description: 'An error occurred while loading the event.',
        images: ['/images/og-default.jpg'],
      },
    };
  }
}

export default function EventPage() {
  return <EventDetailClient />;
}
