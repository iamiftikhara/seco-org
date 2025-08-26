export interface LocalizedString {
  en: string;
  ur: string;
}

export interface BlogContentBlock {
  type: 'content-block';
  text: LocalizedString;
  image?: {
    src: string;
    alt: LocalizedString;
    position: 'left' | 'right' | 'full' | 'above' | 'below';
  };
}

export interface BlogQuoteBlock {
  type: 'quote';
  content: LocalizedString;
}

export type BlogSection = BlogContentBlock | BlogQuoteBlock;

export interface SocialShare {
  title: LocalizedString;
  description: LocalizedString;
  hashtags: string[];
  twitterHandle: string;
  ogType: string;
}

export interface BlogPost {
  id: string;
  title: LocalizedString;
  excerpt: LocalizedString;
  content: BlogSection[];
  author: string;
  date: string;
  image: string;
  category: string;
  showOnHome: boolean;
  slug: string;
  socialShare: SocialShare;
}

export interface BlogPageMeta {
  heroImage: string;
  title: LocalizedString;
  description: LocalizedString;
  pageTitle: LocalizedString;
  pageDescription: LocalizedString;
}

export interface BlogData {
  blogPage: BlogPageMeta;
  posts: BlogPost[];
}