import { FaFacebook, FaTwitter, FaLinkedin, FaWhatsapp } from 'react-icons/fa';
import { theme } from '@/config/theme';

interface SocialShareProps {
  title: string;
  description: string;
  url: string;
  image?: string;
  language: 'en' | 'ur';
  hashtags?: string[];
  twitterHandle?: string;
  ogType?: string;
}

export default function SocialShare({ 
  title, 
  description, 
  url, 
  image, 
  language,
  hashtags = [],
  twitterHandle = 'YourTwitterHandle',
  ogType = 'article'
}: SocialShareProps) {
  const encodedUrl = encodeURIComponent(url);
  const encodedTitle = encodeURIComponent(title);
  const encodedDescription = encodeURIComponent(description);
  const encodedImage = image ? encodeURIComponent(image) : '';
  const encodedHashtags = hashtags.join(',');

  const shareLinks = {
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}&quote=${encodedDescription}&picture=${encodedImage}`,
    twitter: `https://twitter.com/intent/tweet?text=${encodedTitle}&url=${encodedUrl}&via=${twitterHandle}&hashtags=${encodedHashtags}`,
    linkedin: `https://www.linkedin.com/shareArticle?mini=true&url=${encodedUrl}&title=${encodedTitle}&summary=${encodedDescription}&source=${twitterHandle}`,
    whatsapp: `https://wa.me/?text=${encodedDescription}%0A%0A${encodedTitle}%0A${encodedUrl}${hashtags.length ? '%0A%0A' + hashtags.map(tag => `#${tag}`).join(' ') : ''}`
  };

  // Add Open Graph meta tags dynamically
  if (typeof document !== 'undefined') {
    const metaTags = [
      { property: 'og:title', content: title },
      { property: 'og:description', content: description },
      { property: 'og:url', content: url },
      { property: 'og:type', content: ogType },
      { property: 'twitter:card', content: 'summary_large_image' },
      { property: 'twitter:title', content: title },
      { property: 'twitter:description', content: description },
      { property: 'twitter:site', content: `@${twitterHandle}` },
    ];

    if (image) {
      metaTags.push(
        { property: 'og:image', content: image },
        { property: 'twitter:image', content: image }
      );
    }

    // Update or create meta tags
    metaTags.forEach(({ property, content }) => {
      let meta = document.querySelector(`meta[property="${property}"]`);
      if (!meta) {
        meta = document.createElement('meta');
        meta.setAttribute('property', property);
        document.head.appendChild(meta);
      }
      meta.setAttribute('content', content);
    });
  }

  const shareButtons = [
    { icon: FaFacebook, link: shareLinks.facebook, label: language === 'en' ? 'Share on Facebook' : 'فیس بک پر شیئر کریں' },
    { icon: FaTwitter, link: shareLinks.twitter, label: language === 'en' ? 'Share on Twitter' : 'ٹویٹر پر شیئر کریں' },
    { icon: FaLinkedin, link: shareLinks.linkedin, label: language === 'en' ? 'Share on LinkedIn' : 'لنکڈان پر شیئر کریں' },
    { icon: FaWhatsapp, link: shareLinks.whatsapp, label: language === 'en' ? 'Share on WhatsApp' : 'واٹس ایپ پر شیئر کریں' }
  ];

  return (
    <div className="flex flex-col items-center space-y-4">
      <h3 
        className="text-lg font-semibold"
        style={{
          color: theme.colors.text.primary,
          fontFamily: language === 'ur' ? theme.fonts.ur.primary : theme.fonts.en.primary
        }}
      >
        {language === 'en' ? 'Share This' : 'شیئر کریں'}
      </h3>
      <div className="flex space-x-4">
        {shareButtons.map((button, index) => (
          <a
            key={index}
            href={button.link}
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 rounded-full transition-transform hover:scale-110"
            style={{ backgroundColor: theme.colors.primary }}
            title={button.label}
          >
            <button.icon className="text-white text-xl" />
          </a>
        ))}
      </div>
    </div>
  );
}