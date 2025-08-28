import { Metadata } from 'next';

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;

  const defaultMetadata: Metadata = {
    title: 'Blog | SECO',
    description: 'Read our latest updates and stories.',
    openGraph: {
      type: 'website',
      siteName: 'SECO',
      title: 'Blog | SECO',
      description: 'Read our latest updates and stories.',
      url: `/blog/${slug}`,
      images: [
        {
          url: '/images/og-default.jpg',
          width: 1200,
          height: 630,
          alt: 'SECO Blog'
        }
      ]
    },
    twitter: {
      card: 'summary_large_image',
      title: 'Blog | SECO',
      description: 'Read our latest updates and stories.',
      creator: '@SECO',
      images: ['/images/og-default.jpg']
    }
  };

  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/blogs?slug=${encodeURIComponent(slug)}` , {
      cache: 'no-store'
    });

    if (!response.ok) {
      return {
        ...defaultMetadata,
        title: 'Blog Post Not Found | SECO',
        description: 'The requested blog post could not be found.'
      };
    }

    const result = await response.json();
    const post = Array.isArray(result?.data?.blogsList) ? result.data.blogsList[0] : null;

    if (!post) {
      return {
        ...defaultMetadata,
        title: 'Blog Post Not Found | SECO',
        description: 'The requested blog post could not be found.'
      };
    }

    const title = post.title?.en || post.title?.ur || 'Blog';
    const desc = post.excerpt?.en || post.excerpt?.ur || '';

    return {
      title: `${title} | SECO`,
      description: desc,
      openGraph: {
        type: (post.socialShare?.ogType || 'article') as 'website' | 'article',
        siteName: 'SECO',
        title,
        description: desc,
        url: `/blog/${slug}`,
        images: [
          {
            url: post.image || '/images/og-default.jpg',
            width: 1200,
            height: 630,
            alt: title
          }
        ]
      },
      twitter: {
        card: 'summary_large_image',
        title,
        description: desc,
        creator: post.socialShare?.twitterHandle || '@SECO',
        images: [post.image || '/images/og-default.jpg']
      },
      keywords: post.socialShare?.hashtags || []
    };
  } catch (error) {
    console.error('Error generating metadata:', error);
    return {
      ...defaultMetadata,
      title: 'Error | SECO',
      description: 'An error occurred while loading the blog post.'
    };
  }
}