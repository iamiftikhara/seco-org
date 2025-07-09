export type BilingualKeyFeature = {
  id: string;
  en: { title: { text: string }; description: { text: string } };
  ur: { title: { text: string }; description: { text: string } };
};

export type BilingualImpact = {
  id: string;
  en: { label: { text: string } };
  ur: { label: { text: string } };
  value: string;
  iconName: string;
  prefix?: string;
  suffix?: string;
};

export interface TextWithLanguage {
  text: string;
  language?: 'en' | 'ur';
}

export interface KeyFeature {
  id: string;
  title: TextWithLanguage;
  description: TextWithLanguage;
}

export interface ImpactMetric {
  id: string;
  label: TextWithLanguage;
  value: string;
  suffix?: string;
  prefix?: string;
  iconName: string;
}

export interface SocialShare {
  title: TextWithLanguage;
  description: TextWithLanguage;
  hashtags: string[];
  twitterHandle: string;
  ogType: string;
}

export interface ServiceDetail {
  id: string;
  slug: string;
  iconName: string;
  heroImage: string;
  isActive: boolean;
  showOnHomepage: boolean;
  createdAt: Date;
  updatedAt: Date;
  socialShare: SocialShare;
  en: {
    title: { text: string };
    shortDescription: { text: string };
    fullDescription: { text: string };
    impactTitle: { text: string };
    keyFeaturesTitle: { text: string };
    overviewTitle: { text: string };
    keyFeatures?: KeyFeature[];
    impact?: ImpactMetric[];
  };
  ur: {
    title: { text: string };
    shortDescription: { text: string };
    fullDescription: { text: string };
    impactTitle: { text: string };
    keyFeaturesTitle: { text: string };
    overviewTitle: { text: string };
    keyFeatures?: KeyFeature[];
    impact?: ImpactMetric[];
  };
}

export interface ServicePageContent {
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

export interface Services {
  servicePage: {
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