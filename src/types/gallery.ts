export interface GalleryLocalizedText {
  en: string;
  ur: string;
}

export interface GalleryHero {
  image: string;
  title: GalleryLocalizedText;
  description: GalleryLocalizedText;
}

export interface GalleryImage {
  src: string;
  tags: string[];
  alt: string;
  category: string;
  showOnHome?: boolean;
}

export interface GallerySection {
  title: GalleryLocalizedText;
  images: GalleryImage[];
}

export interface GalleryConfig {
  hero: GalleryHero;
  sections: GallerySection[];
} 