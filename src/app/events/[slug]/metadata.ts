import { Metadata } from 'next';
import { generateMeta } from '@/meta/config';
import { eventService } from '../utils/eventService';

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  try {
    const eventResponse = await eventService.getEventBySlug(params.slug as string);
    console.log(eventResponse, "dddddddddddddddd")

    const event = eventResponse.data;
    console.log(event, "dddddddddddddddd")

    if (!event) {
      return generateMeta({
        title: 'Event Not Found',
        description: 'The requested event could not be found.',
        type: 'website',
        image: '/images/og-default.jpg'
      });
    }

    return {
      title: `${event.title.text} | SECO`,
      description: event.shortDescription.text,
      openGraph: {
        type: (event.socialShare?.ogType || 'article') as 'website' | 'article' | 'book' | 'profile' | 'music.song' | 'music.album' | 'music.playlist' | 'music.radio_station' | 'video.movie' | 'video.episode' | 'video.tv_show' | 'video.other',
        // type: event.socialShare?.ogType || 'article',
        siteName: 'SECO',
        title: event.title.text,
        description: event.shortDescription.text,
        url: `/events/${params.slug}`,
        images: [
          {
            url: event.featuredImage,
            width: 1200,
            height: 630,
            alt: event.title.text
          }
        ]
      },
      twitter: {
        card: 'summary_large_image',
        title: event.title.text,
        description: event.shortDescription.text,
        creator: event.socialShare?.twitterHandle || '@SECO',
        images: [event.featuredImage]
      },
      keywords: event.socialShare?.hashtags || []
    };
  } catch (error) {
    console.error('Error generating metadata:', error);
    return generateMeta({
      title: 'Error',
      description: 'An error occurred while loading the event.',
      type: 'website',
      image: '/images/og-default.jpg'
    });
  }
}
// The generateMetadata function is already exported in its declaration
