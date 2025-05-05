interface TextWithLanguage {
  text: string;
  language: 'en' | 'ur';
}

interface ServicePageContent {
  image: string;
  title: {
    en: TextWithLanguage;
    ur: TextWithLanguage;
  };
  description: {
    en: TextWithLanguage;
    ur: TextWithLanguage;
  };
}

interface KeyFeature {
  id: string;
  title: TextWithLanguage;
  description: TextWithLanguage;
}

interface ImpactMetric {
  label: TextWithLanguage;
  value: string;
  suffix?: string;
  prefix?: string;
  iconName: string;
}

interface SocialShare {
  title: TextWithLanguage;
  description: TextWithLanguage;
  hashtags: string[];
  twitterHandle: string;
  ogType: string;
}

export interface ServiceDetail {
  id: string;
  slug: string;
  title: TextWithLanguage;
  iconName: string;
  heroImage: string;
  shortDescription: TextWithLanguage;
  fullDescription: TextWithLanguage;
  impactTitle: TextWithLanguage;
  keyFeaturesTitle: TextWithLanguage;
  overviewTitle: TextWithLanguage;
  keyFeatures: KeyFeature[];
  impact: ImpactMetric[];
  isActive: boolean;
  showOnHomepage: boolean;
  language: 'en' | 'ur';
  createdAt: Date;
  updatedAt: Date;
  socialShare: SocialShare;
}

export interface Services {
  servicePage: ServicePageContent;
  servicesList: ServiceDetail[];
}

export interface ServiceResponse {
  success: boolean;
  data: ServiceDetail | null;
  error?: string;
}

export interface ServicesListResponse {
  success: boolean;
  data: ServiceDetail[];
  error?: string;
}