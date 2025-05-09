import { Metadata, ResolvingMetadata } from 'next';
import { generateMeta } from '@/meta/config';
import { services } from '@/data/services';
import ServiceDetail from './ServiceDetail';

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
    const service = services.servicesList.find((s) => s.slug === slug);

    if (!service) {
      return generateMeta({
        title: 'Service Not Found',
        description: 'The requested service could not be found.',
        type: 'website',
        image: '/images/og-default.jpg'
      });
    }

    return {
      title: `${service.socialShare.title.text} | SECO`,
      description: service.socialShare.description.text,
      openGraph: {
        type: (service.socialShare?.ogType || 'article') as 'website' | 'article' | 'book' | 'profile',
        siteName: 'SECO',
        title: service.socialShare.title.text,
        description: service.socialShare.description.text,
        url: `/services/${service.slug}`,
        images: [
          {
            url: service.heroImage,
            width: 1200,
            height: 630,
            alt: service.title.text
          }
        ]
      },
      twitter: {
        card: 'summary_large_image',
        title: service.socialShare.title.text,
        description: service.socialShare.description.text,
        creator: service.socialShare?.twitterHandle || '@SECO',
        images: [service.heroImage]
      },
      keywords: service.socialShare?.hashtags || []
    };
  } catch (error) {
    console.error('Error generating metadata:', error);
    return generateMeta({
      title: 'Error',
      description: 'An error occurred while loading the service.',
      type: 'website',
      image: '/images/og-default.jpg'
    });
  }
}


export default function ServicePage() {
  return <ServiceDetail />;
}