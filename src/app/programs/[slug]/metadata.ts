import { Metadata } from 'next';
import { generateMeta } from '@/meta/config';
import { programService } from '../utils/programService';

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  console.log('Generating program metadata for slug:', params.slug);
  try {
    const programResponse = await programService.getProgramBySlug(params.slug as string);
    console.log('Program data received:', programResponse);

    const program = programResponse.data;
    console.log('Program metadata being generated:', program?.title?.text);

    if (!program) {
      console.log('No program found, returning default metadata');
      return generateMeta({
        title: 'Program Not Found',
        description: 'The requested program could not be found.',
        type: 'website',
        image: '/images/og-default.jpg'
      });
    }

    const metadata = {
      title: `${program.title.text} | SECO`,
      description: program.shortDescription.text,
      openGraph: {
        type: (program.socialShare?.ogType || 'article') as 'website' | 'article' | 'book' | 'profile' | 'music.song' | 'music.album' | 'music.playlist' | 'music.radio_station' | 'video.movie' | 'video.episode' | 'video.tv_show' | 'video.other',
        siteName: 'SECO',
        title: program.title.text,
        description: program.shortDescription.text,
        url: `/programs/${params.slug}`,
        images: [
          {
            url: program.featuredImage,
            width: 1200,
            height: 630,
            alt: program.title.text
          }
        ]
      },
      twitter: {
        card: 'summary_large_image',
        title: program.title.text,
        description: program.shortDescription.text,
        creator: program.socialShare?.twitterHandle || '@SECO',
        images: [program.featuredImage]
      },
      keywords: program.socialShare?.hashtags || []
    };
    
    console.log('Generated metadata:', metadata);
    return metadata;
  } catch (error) {
    console.error('Error generating metadata:', error);
    return generateMeta({
      title: 'Error',
      description: 'An error occurred while loading the program.',
      type: 'website',
      image: '/images/og-default.jpg'
    });
  }
}