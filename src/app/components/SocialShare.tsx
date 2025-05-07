import { FaFacebook, FaTwitter, FaLinkedin, FaWhatsapp } from 'react-icons/fa';
import { theme } from '@/config/theme';
import Head from 'next/head';

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
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
    whatsapp: `https://wa.me/?text=${encodedTitle}%0A${encodedDescription}%0A${encodedUrl}`
  };

  const shareButtons = [
    { icon: FaFacebook, link: shareLinks.facebook, label: language === 'en' ? 'Share on Facebook' : 'فیس بک پر شیئر کریں' },
    { icon: FaTwitter, link: shareLinks.twitter, label: language === 'en' ? 'Share on Twitter' : 'ٹویٹر پر شیئر کریں' },
    { icon: FaLinkedin, link: shareLinks.linkedin, label: language === 'en' ? 'Share on LinkedIn' : 'لنکڈان پر شیئر کریں' },
    { icon: FaWhatsapp, link: shareLinks.whatsapp, label: language === 'en' ? 'Share on WhatsApp' : 'واٹس ایپ پر شیئر کریں' }
  ];

  return (
    <>
      <Head>
        <meta property="og:title" content={title} />
        <meta property="og:description" content={description} />
        <meta property="og:url" content={url} />
        <meta property="og:type" content={ogType} />
        {image && <meta property="og:image" content={image} />}
        
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={title} />
        <meta name="twitter:description" content={description} />
        <meta name="twitter:site" content={`@${twitterHandle}`} />
        {image && <meta name="twitter:image" content={image} />}
      </Head>

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
              onClick={(e) => {
                e.preventDefault();
                window.open(button.link, '_blank', 'width=600,height=400');
              }}
            >
              <button.icon className="text-white text-xl" />
            </a>
          ))}
        </div>
      </div>
    </>
  );
}