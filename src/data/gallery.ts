export interface GalleryImage {
  src: string;
  tags: string[];
  alt: string;
  category: string;
  showOnHome?: boolean;
}

export interface GallerySection {
  title: string;
  images: GalleryImage[];
}

export interface GalleryConfig {
  hero: {
    image: string;
    title: string;
    description: string;
  };
  sections: GallerySection[];
}

export const galleryData: GalleryConfig = {
  hero: {
    image: '/images/gallery-hero.jpeg',
    title: 'Our Gallery',
    description: 'Explore our collection of memorable moments and impactful initiatives'
  },
  sections: [
    {
      title: "Community Events",
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
      title: "Educational Programs",
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
      title: "Support Services",
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