import type { Metadata, ResolvingMetadata } from 'next';
import { generateMeta } from '@/meta/config';
import { blogData } from '@/data/blog';
import BlogPost from './BlogPost';

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
    const post = blogData.posts.find((p) => p.slug ===slug);

    if (!post) {
      return generateMeta({
        title: 'Blog Post Not Found',
        description: 'The requested blog post could not be found.',
        type: 'website',
        image: '/images/og-default.jpg'
      });
    }

    return {
      title: `${post.title.en} | SECO`,
      description: post.excerpt.en,
      openGraph: {
        type: 'article',
        siteName: 'SECO',
        title: post.title.en,
        description: post.excerpt.en,
        url: `/blog/${post.slug}`,
        images: [
          {
            url: post.image,
            width: 1200,
            height: 630,
            alt: post.title.en
          }
        ],
        authors: [post.author],
        publishedTime: post.date,
        section: post.category
      },
      twitter: {
        card: 'summary_large_image',
        title: post.title.en,
        description: post.excerpt.en,
        creator: post.socialShare?.twitterHandle || '@SECO',
        images: [post.image]
      },
      keywords: post.socialShare?.hashtags || [],
      authors: [{ name: post.author }],
      publisher: 'SECO',
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

export default function BlogPage({ params }: Props) {
  return <BlogPost params={params} />;
}
