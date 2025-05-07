import { Metadata } from 'next';
import { generateMeta } from '@/meta/config';
import { eventService } from '../utils/eventService';

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const eventResponse = await eventService.getEventBySlug(params.slug as string);
  const event = eventResponse.data;

  if (!event) {
    return generateMeta({
      title: 'Event Not Found',
      description: 'The requested event could not be found.'
    });
  }

  return generateMeta({
    title: event.socialShare.title.text,
    description: event.socialShare.description.text,
    image: event.featuredImage,
    type: event.socialShare.ogType || 'article',
    keywords: event.socialShare.hashtags
  });
}