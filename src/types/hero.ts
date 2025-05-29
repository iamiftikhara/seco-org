export interface LocalizedString {
  en: string;
  ur: string;
}

export interface HeroSlide {
  image: string;
  mobileImage: string;
  title: LocalizedString;
  subtitle: LocalizedString;
}

export interface Announcement {
  text: string;
  icon: string;
  language: string;
}

export interface SliderConfig {
  autoplayDelay: number;
  transitionSpeed: number;
  pauseOnHover: boolean;
}

export interface MarqueeConfig {
  repetitions: number;
  speed: number;
}

export interface HeroConfig {
  slider: SliderConfig;
  marquee: MarqueeConfig;
}

export interface HeroData {
  logo: {
    src: string;
    width: number;
    height: number;
  };
  slides: HeroSlide[];
  announcements: Announcement[];
  config: HeroConfig;
}