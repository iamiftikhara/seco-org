import type { GalleryConfig } from '@/types/gallery';

export const galleryData: GalleryConfig = {
  hero: {
    image: '/images/gallery-hero.jpeg',
    title: {
      en: 'Our Gallery',
      ur: 'ہماری گیلری'
    },
    description: {
      en: 'Explore our collection of memorable moments and impactful initiatives',
      ur: 'یادگار لمحات اور اثر انگیز اقدامات کے ہمارے مجموعے کو دریافت کریں'
    }
  },
  sections: [
    {
      title: {
        en: "Community Events",
        ur: "کمیونٹی ایونٹس"
      },
      images: [
        {
          src: '/images/gallery1.jpeg',
          tags: ['community', 'events'],
          alt: 'Community gathering',
          category: 'events',
          showOnHome: true
        },
        {
          src: '/images/gallery2.jpeg',
          tags: ['community', 'celebration'],
          alt: 'Community celebration',
          category: 'events',
          showOnHome: true
        },
        {
          src: '/images/gallery3.jpeg',
          tags: ['community', 'events'],
          alt: 'Community gathering',
          category: 'events',
          showOnHome: true
        },
        {
          src: '/images/gallery4.jpg',
          tags: ['community', 'celebration'],
          alt: 'Community celebration',
          category: 'events',
          showOnHome: true
        },
        {
          src: '/images/gallery5.jpg',
          tags: ['community', 'events'],
          alt: 'Community gathering',
          category: 'events',
          showOnHome: true
        },
        {
          src: '/images/gallery6.jpeg',
          tags: ['community', 'celebration'],
          alt: 'Community celebration',
          category: 'events',
          showOnHome: true
        },
        {
          src: '/images/gallery7.jpeg',
          tags: ['community', 'events'],
          alt: 'Community gathering',
          category: 'events',
          showOnHome: false
        },
        {
          src: '/images/gallery8.jpg',
          tags: ['community', 'celebration'],
          alt: 'Community celebration',
          category: 'events',
          showOnHome: false
        },
        {
          src: '/images/gallery9.jpg',
          tags: ['community', 'events'],
          alt: 'Community gathering',
          category: 'events',
          showOnHome: false
        },
        {
          src: '/images/gallery10.jpg',
          tags: ['community', 'celebration'],
          alt: 'Community celebration',
          category: 'events',
          showOnHome: false
        },
        {
          src: '/images/gallery11.jpeg',
          tags: ['community', 'events'],
          alt: 'Community gathering',
          category: 'events',
          showOnHome: false
        },
        {
          src: '/images/gallery12.jpeg',
          tags: ['community', 'celebration'],
          alt: 'Community celebration',
          category: 'events',
          showOnHome: false
        }
      ]
    },
    {
      title: {
        en: "Educational Programs",
        ur: "تعلیمی پروگرام"
      },
      images: [
        {
          src: '/images/gallery3.jpeg',
          tags: ['education', 'youth'],
          alt: 'Youth education program',
          category: 'education',
          showOnHome: true
        },
        {
          src: '/images/gallery4.jpg',
          tags: ['education', 'workshop'],
          alt: 'Educational workshop',
          category: 'education'
        }
      ]
    },
    {
      title: {
        en: "Support Services",
        ur: "سپورٹ سروسز"
      },
      images: [
        {
          src: '/images/gallery5.jpg',
          tags: ['support', 'community'],
          alt: 'Community support service',
          category: 'support',
          showOnHome: true
        }
      ]
    }
  ]
};