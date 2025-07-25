export interface TextWithLanguage {
  text: string;
  language?: 'en' | 'ur';
}

export interface SocialShare {
  title: { text: string };
  description: { text: string };
  hashtags: string[];
  twitterHandle: string;
  ogType: string;
}

export interface EventsPageContent {
  image: string;
  title: {
    en: { text: string };
    ur: { text: string };
  };
  description: {
    en: { text: string };
    ur: { text: string };
  };
}

export interface EventDetail {
  id: string;
  slug: string;
  featuredImage: string;
  date: string;
  status: "upcoming" | "past";
  showOnHome: boolean;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  socialShare: SocialShare;
  en: {
    title: { text: string };
    shortDescription: { text: string };
    fullDescription: { text: string };
    content: { text: string };
    location: { text: string };
    time?: { text: string };
    outcome?: { text: string };
  };
  ur: {
    title: { text: string };
    shortDescription: { text: string };
    fullDescription: { text: string };
    content: { text: string };
    location: { text: string };
    time?: { text: string };
    outcome?: { text: string };
  };
}

export interface Events {
  eventsPage: EventsPageContent;
  eventsList: EventDetail[];
}