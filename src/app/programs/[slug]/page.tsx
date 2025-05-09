import type { Metadata, ResolvingMetadata } from 'next';
import { generateMeta } from '@/meta/config';
import { programService } from '../utils/programService';
import ProgramDetail from './ProgramDetail';

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
    const programResponse = await programService.getProgramBySlug(slug);
    const program = programResponse?.data;

    if (!program) {
      return generateMeta({
        title: 'Program Not Found',
        description: 'The requested program could not be found.',
        type: 'website',
        image: '/images/og-default.jpg',
      });
    }

    return {
      description: program.shortDescription.text,
      openGraph: {
        type: 'website',
        siteName: 'SECO',
        title: program.title.text,
        description: program.shortDescription.text,
        url: `/programs/${program.slug}`,
        images: [
          {
            url: program.featuredImage,
            width: 1200,
            height: 630,
            alt: program.title.text,
          },
        ],
      },
      twitter: {
        card: 'summary_large_image',
        title: program.title.text,
        description: program.shortDescription.text,
        creator: program.socialShare?.twitterHandle || '@SECO',
        images: [program.featuredImage],
      },
      keywords: program.socialShare?.hashtags || [],
    };
  } catch (error) {
    console.error('Error generating metadata:', error);
    return generateMeta({
      title: 'Error',
      description: 'An error occurred while loading the program.',
      type: 'website',
      image: '/images/og-default.jpg',
    });
  }
}

export default function ProgramPage() {
  return <ProgramDetail />;
}
