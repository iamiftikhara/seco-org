export interface LocalizedText {
  text: string;
  language: "en" | "ur";
}

interface SocialShare {
  title: LocalizedText;
  description: LocalizedText;
  hashtags: string[];
  twitterHandle: string;
  ogType: string;
}

export interface ProgramItem {
  id: string;
  title: LocalizedText;
  slug: string;
  shortDescription: LocalizedText;
  fullDescription: LocalizedText;
  featuredImage: string;
  category: LocalizedText;
  impact: {
    label: LocalizedText;
    value: string;
    suffix?: string;
  }[];
  iconStats: {
    icon: string;
    value: string;
    label: LocalizedText;
  }[];
  partners: {
    name: LocalizedText;
    logo: string;
  }[];
  language: "en" | "ur";
  showOnHomepage: boolean;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  duration: LocalizedText;
  coverage: LocalizedText;
  socialShare: SocialShare;
}

interface ProgramsPageContent {
  title: string;
  description: string;
}

export interface Program {
  programsPage: {
    en: ProgramsPageContent;
    ur: ProgramsPageContent;
    hero: {
      image: string;
      alt: string;
    };
  };
  HomePage: {
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
  programsList: ProgramItem[];
}