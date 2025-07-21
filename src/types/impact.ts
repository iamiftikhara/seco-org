// Impact Types

export interface TextWithLanguage {
  text: string;
}

export interface BilingualText {
  en: TextWithLanguage;
  ur: TextWithLanguage;
}

export interface ImpactStat {
  id: string;
  value: string;
  label: BilingualText;
  suffix: string;
  iconName: string;
  showOnHomepage: boolean;
  order: number;
}

export interface ImpactData {
  id: string;
  title: BilingualText;
  backgroundImage: string;
  showOnHomepage: boolean;
  stats: ImpactStat[];
  updatedAt: Date;
  createdAt: Date;
}

// API Response Types
export interface ImpactApiResponse {
  success: boolean;
  data?: ImpactData;
  error?: string;
}

// For homepage filtering
export interface HomepageImpactData {
  id: string;
  title: BilingualText;
  backgroundImage: string;
  stats: ImpactStat[];
}