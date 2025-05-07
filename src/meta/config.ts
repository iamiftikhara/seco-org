'use client';

import { useEffect } from 'react';

interface MetaConfig {
  title: string;
  description?: string;
  keywords?: string[];
  image?: string;
  type?: string;
  canonical?: string;
}

export const defaultMeta = {
  title: {
    default: "SECO - Sustainable Development",
    template: "%s | SECO"
  },
  description: "Supporting communities through sustainable development initiatives",
  keywords: ["sustainable development", "community support", "social empowerment"],
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://seco.org",
    siteName: "SECO",
    images: [
      {
        url: "/images/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "SECO"
      }
    ]
  },
  twitter: {
    handle: "@seco",
    site: "@seco",
    cardType: "summary_large_image"
  }
};

export const MetaComponent = ({ config }: { config: Partial<MetaConfig> }) => {
  useEffect(() => {
    // Update document title
    document.title = config.title 
      ? defaultMeta.title.template.replace("%s", config.title)
      : defaultMeta.title.default;

    // Update meta tags
    const metaTags = [
      { name: 'description', content: config.description || defaultMeta.description },
      { name: 'keywords', content: (config.keywords || defaultMeta.keywords).join(', ') },
      // OpenGraph tags
      { property: 'og:title', content: config.title || defaultMeta.title.default },
      { property: 'og:description', content: config.description || defaultMeta.description },
      { property: 'og:type', content: config.type || defaultMeta.openGraph.type },
      { property: 'og:image', content: config.image || defaultMeta.openGraph.images[0].url },
      { property: 'og:url', content: defaultMeta.openGraph.url },
      { property: 'og:site_name', content: defaultMeta.openGraph.siteName },
      // Twitter tags
      { name: 'twitter:card', content: defaultMeta.twitter.cardType },
      { name: 'twitter:site', content: defaultMeta.twitter.site },
      { name: 'twitter:creator', content: defaultMeta.twitter.handle },
      { name: 'twitter:title', content: config.title || defaultMeta.title.default },
      { name: 'twitter:description', content: config.description || defaultMeta.description },
      { name: 'twitter:image', content: config.image || defaultMeta.openGraph.images[0].url }
    ];

    // Update or create meta tags
    metaTags.forEach(({ name, property, content }) => {
      let meta = document.querySelector(`meta[${name ? `name="${name}"` : `property="${property}"`}]`);
      if (!meta) {
        meta = document.createElement('meta');
        if (name) meta.setAttribute('name', name);
        if (property) meta.setAttribute('property', property);
        document.head.appendChild(meta);
      }
      meta.setAttribute('content', content);
    });

    // Handle canonical URL
    let canonical = document.querySelector('link[rel="canonical"]');
    if (config.canonical) {
      if (!canonical) {
        canonical = document.createElement('link');
        canonical.setAttribute('rel', 'canonical');
        document.head.appendChild(canonical);
      }
      canonical.setAttribute('href', config.canonical);
    } else if (canonical) {
      canonical.remove();
    }
  }, [config]);

  return null; // This component doesn't render anything
};

export const generateMeta = (config: Partial<MetaConfig>) => {
  return {
    title: config.title 
      ? defaultMeta.title.template.replace("%s", config.title)
      : defaultMeta.title.default,
    description: config.description || defaultMeta.description,
    keywords: config.keywords || defaultMeta.keywords,
    openGraph: {
      ...defaultMeta.openGraph,
      title: config.title || defaultMeta.title.default,
      description: config.description || defaultMeta.description,
      type: config.type || defaultMeta.openGraph.type,
      images: config.image ? [
        {
          url: config.image,
          width: 1200,
          height: 630,
          alt: config.title || defaultMeta.title.default
        }
      ] : defaultMeta.openGraph.images
    },
    twitter: {
      ...defaultMeta.twitter,
      title: config.title || defaultMeta.title.default,
      description: config.description || defaultMeta.description,
      image: config.image || defaultMeta.openGraph.images[0].url
    }
  };
};