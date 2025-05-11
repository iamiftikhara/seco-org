import { Metadata, ResolvingMetadata } from 'next';
import { generateMeta } from '@/meta/config';
import { headers } from 'next/headers';


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
    console.log('Event metadata being generated:', event?.title?.text);

    if (!event) {
      console.log('No event found, returning default metadata');
      return generateMeta({
        title: 'Event Not Found',
        description: 'The requested event could not be found.',
        type: 'website',
        image: '/images/og-default.jpg'
      });
    }

    const metadata = {
      title: `${event.title.text} | SECO`,
      description: event.shortDescription.text,
      openGraph: {
        type: (event.socialShare?.ogType || 'article') as 'website' | 'article' | 'book' | 'profile' | 'music.song' | 'music.album' | 'music.playlist' | 'music.radio_station' | 'video.movie' | 'video.episode' | 'video.tv_show' | 'video.other',
        siteName: 'SECO',
        title: event.title.text,
        description: event.shortDescription.text,
        url: `/events/${slug}`,
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
    
    console.log('Generated metadata:', metadata);
    return metadata;
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
