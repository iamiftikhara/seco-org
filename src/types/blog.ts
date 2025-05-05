export interface TextContent {
  text: string;
  language: 'en' | 'ur';
}

export interface BlogSection {
  type: 'content-block';
  text: {
    content: TextContent;
  };
  image?: {
    src: string;
    alt: string;
    position: 'left' | 'right' | 'full' | 'above' | 'below';
  };
}

export interface ContentSection {
  type: 'quote';
  content: TextContent;
}

export type Section = BlogSection | ContentSection;

export interface SocialShare {
  title: TextContent;
  description: TextContent;
  hashtags: string[];
  twitterHandle: string;
  ogType: string;
}

export interface BlogPost {
  id: string;
  title: {
    text: string;
    language: 'en' | 'ur';
  };
  excerpt: {
    text: string;
    language: 'en' | 'ur';
  };
  content: Array<{
    type: 'content-block' | 'quote';
    text?: {
      content: {
        text: string;
        language: 'en' | 'ur';
      }
    };
    content?: {
      text: string;
      language: 'en' | 'ur';
    };
    image?: {
      src: string;
      alt: string;
      position: 'above' | 'below' | 'left' | 'right' | 'full';
    };
  }>;
  author: string;
  date: string;
  image: string;
  category: string;
  showOnHome: boolean;
  slug: string;
  socialShare: {
    title: {
      text: string;
      language: 'en' | 'ur';
    };
    description: {
      text: string;
      language: 'en' | 'ur';
    };
    hashtags: string[];
    twitterHandle: string;
    ogType: string;
  };
}

export interface BlogData {
  pageTitle: TextContent;
  pageDescription: TextContent;
  heroImage: string;
  title: TextContent;
  description: TextContent;
  posts: BlogPost[];
}