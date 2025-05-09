import { Metadata, ResolvingMetadata } from 'next';
import { generateMeta } from '@/meta/config';
import { blogData } from '@/data/blog';

type Props = {
  params: { slug: string };
  searchParams: { [key: string]: string | string[] | undefined };
};

export async function generateMetadata(
  { params }: Props,
  _parent: ResolvingMetadata
): Promise<Metadata> {
  try {
    const post = blogData.posts.find((p) => p.slug === params.slug);

    if (!post) {
      return generateMeta({
        title: 'Blog Post Not Found',
        description: 'The requested blog post could not be found.',
        type: 'website',
        image: '/images/og-default.jpg'
      });
    }

    return {
      title: `${post.title.text} | SECO`,
      description: post.excerpt.text,
      openGraph: {
        type: (post.socialShare?.ogType || 'article') as 'website' | 'article',
        siteName: 'SECO',
        title: post.title.text,
        description: post.excerpt.text,
        url: `/blog/${params.slug}`,
        images: [
          {
            url: post.image,
            width: 1200,
            height: 630,
            alt: post.title.text
          }
        ]
      },
      twitter: {
        card: 'summary_large_image',
        title: post.title.text,
        description: post.excerpt.text,
        creator: post.socialShare?.twitterHandle || '@SECO',
        images: [post.image]
      },
      keywords: post.socialShare?.hashtags || []
    };
  } catch (error) {
    console.error('Error generating metadata:', error);
    return generateMeta({
      title: 'Error',
      description: 'An error occurred while loading the blog post.',
      type: 'website',
      image: '/images/og-default.jpg'
    });
  }
}