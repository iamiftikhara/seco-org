export interface Partner {
  id: string;
  name: string;
  image: string;
  altText: string;
  isActive?: boolean;
  showOnHomepage?: boolean;
}

export interface PartnersData {
  partnerPage: {
    title: {
      en: { text: string };
      ur: { text: string };
    };
    description: {
      en: { text: string };
      ur: { text: string };
    };
    image: string;
  };
  partnersList: Partner[];
}

export interface PartnerFormData {
  name: string;
  image: string;
  altText: string;
  isActive?: boolean;
  showOnHomepage?: boolean;
}
