import BlogPost from './BlogPost';

type Props = {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export default function BlogPage({ params }: Props) {
  return <BlogPost params={params} />;
}
