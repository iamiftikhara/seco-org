export interface BilingualText {
  en: string;
  ur: string;
}

export interface FooterLinkItem {
  name: BilingualText;
  url: string;
}

export interface FooterColumn {
  title: BilingualText;
  links: FooterLinkItem[];
}

export interface SocialMedia {
  platform: BilingualText;
  url: string;
  icon: string;
}

export interface ContactInfo {
  address: BilingualText;
  email: string;
  phone: string;
}

export interface FooterData {
  logo: {
    image: string;
    alt: BilingualText;
    width: number;
    height: number;
    url: string;
  };
  description: BilingualText;
  columns: FooterColumn[];
  socialMedia: SocialMedia[];
  contactInfo: ContactInfo;
  copyright: BilingualText;
}