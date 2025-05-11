export const theme = {
  colors: {
    primary: '#4B0082', // Deep Purple
    primaryHover: '#6B238E', // Lighter Purple for hover
    secondary: '#FFD700', // Gold
    secondaryHover: '#FFE44D', // Lighter Gold for hover
    text: {
      primary: '#1F2937',  // Dark gray for main text
      secondary: '#4B5563', // Medium gray for secondary text
      light: '#FFFFFF',    // White text
      accent: '#4B0082',    // Accent text color
      muted: '#9CA3AF'     // Muted text for less emphasis
    },
    background: {
      primary: '#FFFFFF',  // White
      secondary: '#F3F4F6', // Light gray
      overlay: 'rgba(0, 0, 0, 0.1)', // Overlay color
      accent: '#F8F7FF',    // Light purple background
      highlight: '#FFF8E6',  // Light gold background
      naturalGray : '#70707029' // is a medium gray
    },
    status: {
      upcoming: '#45c474',  // Green for upcoming events
      past: '#6B7280',      // Gray for past events
      upcomingBlink: '#FFD700', // Gold color for blinking effect
      success: '#10B981',   // Green for success states
      error: '#EF4444',     // Red for error states
      warning: '#F59E0B',   // Yellow for warning states
      info: '#3B82F6'       // Blue for info states
    },
    border: {
      light: '#E5E7EB',     // Light border
      default: '#D1D5DB',   // Default border
      dark: '#9CA3AF'       // Dark border
    },
    shadow: {
      sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
      md: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
      lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1)'
    }
  },
  fonts: {
    en: {
      primary: 'Inter, system-ui, sans-serif',
      secondary: 'Roboto, Arial, sans-serif',
    },
    ur: {
      primary: '"BBC Reith Qalam", "Times New Roman", Arial, Verdana, Geneva, Helvetica, sans-serif',
      secondary: '"Noto Nastaliq Urdu", serif',
    }
  },
  spacing: {
    xs: '0.25rem',    // 4px
    sm: '0.5rem',     // 8px
    md: '1rem',       // 16px
    lg: '1.5rem',     // 24px
    xl: '2rem',       // 32px
    '2xl': '2.5rem',  // 40px
    '3xl': '3rem'     // 48px
  },
  borderRadius: {
    none: '0',
    sm: '0.125rem',   // 2px
    default: '0.25rem', // 4px
    md: '0.375rem',   // 6px
    lg: '0.5rem',     // 8px
    xl: '0.75rem',    // 12px
    full: '9999px'
  },
  transition: {
    default: '0.3s ease-in-out',
    fast: '0.15s ease-in-out',
    slow: '0.5s ease-in-out'
  },
  zIndex: {
    hide: -1,
    auto: 'auto',
    base: 0,
    docked: 10,
    dropdown: 1000,
    sticky: 1100,
    banner: 1200,
    overlay: 1300,
    modal: 1400,
    popover: 1500,
    tooltip: 1600
  },
  organization: {
    logoTitle: {
      title: {
        text: "SECO ORG",
        language: "en",
      },
      fullName: {
        text: "SECO Organization",
        language: "en",
      },
      subTitle: {
        text: "Social & Environmental Conservation Organizations",
        language: "en",
      },
    },
    description:{
      text: "Empowering communities through education and cultural exchange",
      language: "en",
    },
    logo: {
      default: '/images/logo.png',
      light: '/images/logo-light.png',
      dark: '/images/logo-dark.png',
      icon: '/images/favicon.ico'
    },
    contact: {
      email: 'info@seco.org',
      phone: '+1 (123) 456-7890',
      address: 'Your Organization Address'
    },
    social: [
      {text: "Facebook", url: "https://facebook.com", icon: "FaFacebook"},
      {text: "Twitter", url: "https://twitter.com", icon: "FaTwitter"},
      {text: "Instagram", url: "https://instagram.com", icon: "FaInstagram"},
      {text: "LinkedIn", url: "https://linkedin.com", icon: "FaLinkedin"},
    ],
    meta: {
      title: 'SECO - Empowering Communities',
      description: 'SECO is dedicated to fostering cultural understanding and educational growth across communities.',
      keywords: ['education', 'culture', 'community', 'exchange', 'empowerment'],
      ogImage: '/images/og-image.jpg',
      twitterHandle: '@SECO'
    },
    languages: {
      default: 'en',
      supported: ['en', 'ur'],
      labels: {
        en: 'English',
        ur: 'اردو'
      }
    },
    branding: {
      tagline: 'Building Bridges, Empowering Lives',
      values: ['Education', 'Community', 'Culture', 'Innovation'],
      mission: 'To create positive change through education and cultural exchange',
      vision: 'A world where communities thrive through shared knowledge and understanding'
    }
  }
};
