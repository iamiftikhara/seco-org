export interface TestimonialItem {
  id: number;
  quote: {
    en: string;
    ur: string;
  };
  author: {
    en: string;
    ur: string;
  };
  role: {
    en: string;
    ur: string;
  };
  image: string;
}

export interface TestimonialConfig {
  autoplayDelay: number;
  spaceBetween: number;
  pauseOnHover: boolean
  breakpoints: {
    [key: number]: {
      slidesPerView: number;
    };
  };
}

export interface TestimonialsData {
  title: {
    en: string;
    ur: string;
  };
  items: TestimonialItem[];
  config: TestimonialConfig;
}

// Form data interfaces for admin operations
export interface TestimonialFormData {
  id?: number;
  quote: {
    en: string;
    ur: string;
  };
  author: {
    en: string;
    ur: string;
  };
  role: {
    en: string;
    ur: string;
  };
  image: string;
}

export interface TestimonialConfigFormData {
  autoplayDelay: number;
  spaceBetween: number;
  pauseOnHover: boolean;
  breakpoints: {
    [key: number]: {
      slidesPerView: number;
    };
  };
} 