import type { Metadata, ResolvingMetadata } from 'next';
import { ProgramDetail } from '@/types/programs';
import ProgramDetailComponent from './ProgramDetail';

type Props = {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export async function generateMetadata(
  { params }: Props,
  _parent: ResolvingMetadata
): Promise<Metadata> {
  const { slug } = await params;

  // Default metadata for fallback cases
  const defaultMetadata: Metadata = {
    title: 'Program | SECO',
    description: 'Explore our impactful programs and initiatives.',
    openGraph: {
      type: 'website',
      siteName: 'SECO',
      title: 'Program | SECO',
      description: 'Explore our impactful programs and initiatives.',
      url: `/programs/${slug}`,
      images: [
        {
          url: '/images/og-default.jpg',
          width: 1200,
          height: 630,
          alt: 'SECO Program'
        }
      ]
    },
    twitter: {
      card: 'summary_large_image',
      title: 'Program | SECO',
      description: 'Explore our impactful programs and initiatives.',
      creator: '@SECO',
      images: ['/images/og-default.jpg']
    }
  };

  try {
    // Fetch program data from API
    const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/programs/${slug}`, {
      cache: 'no-store'
    });

    if (!response.ok) {
      console.error(`Failed to fetch program: ${response.status}`);
      return {
        ...defaultMetadata,
        title: 'Program Not Found | SECO',
        description: 'The requested program could not be found.'
      };
    }

    const result = await response.json();

    if (!result.success || !result.data) {
      return {
        ...defaultMetadata,
        title: 'Program Not Found | SECO',
        description: 'The requested program could not be found.'
      };
    }

    const program: ProgramDetail = result.data;

    // Default to English for metadata
    const language = 'en';
    const programData = program[language];

    // Check if programData exists and has required fields
    if (!programData || !programData.title || !programData.shortDescription) {
      console.log('Program data incomplete, returning default metadata');
      return defaultMetadata;
    }

    return {
      title: `${programData.title.text} | SECO`,
      description: programData.shortDescription.text,
      openGraph: {
        type: 'website',
        siteName: 'SECO',
        title: programData.title.text,
        description: programData.shortDescription.text,
        url: `/programs/${slug}`,
        images: [
          {
            url: program.featuredImage || '/images/og-default.jpg',
            width: 1200,
            height: 630,
            alt: programData.title.text,
          },
        ],
      },
      twitter: {
        card: 'summary_large_image',
        title: programData.title.text,
        description: programData.shortDescription.text,
        creator: program.socialShare?.twitterHandle || '@SECO',
        images: [program.featuredImage || '/images/og-default.jpg'],
      },
      keywords: program.socialShare?.hashtags || [],
    };
  } catch (error) {
    console.error('Error generating metadata:', error);
    return {
      ...defaultMetadata,
      title: 'Error | SECO',
      description: 'An error occurred while loading the program.'
    };
  }
}

export default function ProgramPage() {
  return <ProgramDetailComponent />;
}
