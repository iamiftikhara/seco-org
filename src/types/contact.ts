type Language = 'en' | 'ur';

type TranslatedText = {
  [key in Language]: string;
};

interface ContactInfo {
  label: TranslatedText;
  value: string | TranslatedText;
  url: string;
  icon: string;
}

interface FormField {
  label: TranslatedText;
  placeholder: TranslatedText;
}

export interface SocialMedia {
  title: TranslatedText;
  platforms: SocialPlatform[];
}

export interface SocialPlatform {
  label: TranslatedText;
  url: string;
  icon: string;
}

interface OfficeLocation {
  title: TranslatedText;
  address: TranslatedText;
  incharge: {
    name: TranslatedText;
    designation: TranslatedText;
  };
  contact: {
    phone: string;
    email: string;
  };
  icons: {
    location: string;
    person: string;
    phone: string;
    email: string;
  };
}

export interface ContactData {
  title: TranslatedText;
  subtitle: TranslatedText;
  contactInfo: {
    phone: ContactInfo;
    whatsapp: ContactInfo;
    email: ContactInfo;
    address: ContactInfo;
  };
  form: {
    title: TranslatedText;
    name: FormField;
    email: FormField;
    message: FormField;
    submitButton: TranslatedText;
    successMessage: TranslatedText;
    errorMessage: TranslatedText;
    loadingMessage: TranslatedText;
  };
  socialMedia: {
    title: TranslatedText;
    platforms: SocialPlatform[];
  };
  offices: {
    title: TranslatedText;
    locations: OfficeLocation[];
  };
}