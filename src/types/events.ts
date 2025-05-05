type LanguageText = {
  text: string;
  language: "en" | "ur";
};

type PageContent = {
  title: string;
  description: string;
};

type EventsPageType = {
  en: PageContent;
  ur: PageContent;
  hero: {
    image: string;
    alt: string;
  };
};

type HomePageType = {
  en: {
    title: string;
    viewAll: string;
    switchLanguage: string;
  };
  ur: {
    title: string;
    viewAll: string;
    switchLanguage: string;
  };
};


type SocialShare = {
  title: LanguageText;
  description: LanguageText;
  hashtags: string[];
  twitterHandle: string;
  ogType: string;
};

type EventItem = {
  id: string;
  title: LanguageText;
  slug: string;
  shortDescription: LanguageText;
  fullDescription: LanguageText;
  content: LanguageText;
  featuredImage: string;
  date: string;
  time?: LanguageText;
  status: "upcoming" | "past";
  location: LanguageText;
  outcome?: LanguageText;
  language: "en" | "ur";
  showOnHome: boolean;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  socialShare: SocialShare;
};

export type Event = {
  eventsPage: EventsPageType;
  homePage: HomePageType;
  eventsList: EventItem[];
};