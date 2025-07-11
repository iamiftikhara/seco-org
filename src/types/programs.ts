export interface TextWithLanguage {
  text: string;
  language?: 'en' | 'ur';
}

export interface BilingualImpact {
  id: string;
  en: { label: { text: string } };
  ur: { label: { text: string } };
  value: string;
  iconName: string;
  prefix?: string;
  suffix?: string;
}

export interface BilingualIconStat {
  id: string;
  en: { label: { text: string } };
  ur: { label: { text: string } };
  value: string;
  iconName: string;
}

export interface BilingualPartner {
  id: string;
  en: { name: { text: string } };
  ur: { name: { text: string } };
  logo: string;
}

export interface ImpactMetric {
  id: string;
  label: TextWithLanguage;
  value: string;
  suffix?: string;
  prefix?: string;
  iconName: string;
}

export interface IconStat {
  id: string;
  label: TextWithLanguage;
  value: string;
  iconName: string;
}

export interface Partner {
  id: string;
  name: TextWithLanguage;
  logo: string;
}

export interface SocialShare {
  title: TextWithLanguage;
  description: TextWithLanguage;
  hashtags: string[];
  twitterHandle: string;
  ogType: string;
}

export interface ProgramDetail {
  id: string;
  slug: string;
  featuredImage: string;
  isActive: boolean;
  showOnHomepage: boolean;
  createdAt: Date;
  updatedAt: Date;
  socialShare: SocialShare;
  en: {
    title: { text: string };
    shortDescription: { text: string };
    fullDescription: { text: string };
    category: { text: string };
    duration: { text: string };
    coverage: { text: string };
    impactTitle: { text: string };
    iconStatsTitle: { text: string };
    partnersTitle: { text: string };
    impact?: ImpactMetric[];
    iconStats?: IconStat[];
    partners?: Partner[];
  };
  ur: {
    title: { text: string };
    shortDescription: { text: string };
    fullDescription: { text: string };
    category: { text: string };
    duration: { text: string };
    coverage: { text: string };
    impactTitle: { text: string };
    iconStatsTitle: { text: string };
    partnersTitle: { text: string };
    impact?: ImpactMetric[];
    iconStats?: IconStat[];
    partners?: Partner[];
  };
}

export interface ProgramPageContent {
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

export interface Programs {
  programPage: {
    image: string;
    title: {
      en: { text: string };
      ur: { text: string };
    };
    description: {
      en: { text: string };
      ur: { text: string };
    };
  };
  programsList: ProgramDetail[];
}

export interface ProgramResponse {
  success: boolean;
  data: ProgramDetail | null;
  error?: string;
}

export interface ProgramsListResponse {
  success: boolean;
  data: ProgramDetail[];
  error?: string;
}