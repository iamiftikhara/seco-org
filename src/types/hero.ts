export interface LocalizedString {
  en: string;
  ur: string;
}

export interface HeroSlide {
  id: number;
  image: string;
  mobileImage: string;
  title: LocalizedString;
  subtitle: LocalizedString;
}

export interface Announcement {
  id: number;
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
  slides: HeroSlide[];
  announcements: Announcement[];
  config: HeroConfig;
}