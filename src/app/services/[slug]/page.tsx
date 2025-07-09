import { Metadata, ResolvingMetadata } from 'next';
import { getCollection } from '@/lib/mongodb';
import { ServiceDetail } from '@/types/services';
import ServiceDetailComponent from './ServiceDetail';

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
    // Fetch services from MongoDB
    const collection = await getCollection('services');
    const servicesData = await collection.findOne({});

    if (!servicesData || !servicesData.servicesList) {
      return {
        title: 'Service Not Found',
        description: 'The requested service could not be found.',
        openGraph: {
          type: 'website',
          images: ['/images/og-default.jpg']
        }
      };
    }

    // Find service by slug in the new bilingual structure
    const service: ServiceDetail = servicesData.servicesList.find((s: ServiceDetail) => s.slug === slug);

    if (!service) {
      return {
        title: 'Service Not Found',
        description: 'The requested service could not be found.',
        openGraph: {
          type: 'website',
          images: ['/images/og-default.jpg']
        }
      };
    }

    // Use English as default for metadata (can be enhanced to detect language)
    const defaultLang = 'en';
    const title = service[defaultLang].title.text;
    const description = service[defaultLang].shortDescription.text;

    return {
      title: `${title} | SECO`,
      description: description,
      openGraph: {
        type: (service.socialShare?.ogType || 'article') as 'website' | 'article' | 'book' | 'profile',
        siteName: 'SECO',
        title: service.socialShare?.title?.text || title,
        description: service.socialShare?.description?.text || description,
        url: `/services/${service.slug}`,
        images: [
          {
            url: service.heroImage,
            width: 1200,
            height: 630,
            alt: title
          }
        ]
      },
      twitter: {
        card: 'summary_large_image',
        title: service.socialShare?.title?.text || title,
        description: service.socialShare?.description?.text || description,
        creator: service.socialShare?.twitterHandle || '@SECO',
        images: [service.heroImage]
      },
      keywords: service.socialShare?.hashtags || [],
      alternates: {
        languages: {
          'en': `/en/services/${service.slug}`,
          'ur': `/ur/services/${service.slug}`
        }
      }
    };
  } catch (error) {
    console.error('Error generating metadata:', error);
    return {
      title: 'Error',
      description: 'An error occurred while loading the service.',
      openGraph: {
        type: 'website',
        images: ['/images/og-default.jpg']
      }
    };
  }
}


export default function ServicePage() {
  return <ServiceDetailComponent />;
}