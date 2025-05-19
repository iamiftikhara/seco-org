export interface TextContent {
  text: string;
  language: string;
}

export interface FooterLink {
  text: string;
  url: string;
}

export interface SocialLink extends FooterLink {
  icon: string;
}

export interface FooterColumn {
  title: TextContent;
  type: "links" | "text" | "contact" | "social" | "partners";
  content: {
    links?: FooterLink[];
    text?: TextContent;
    contact?: {
      address: string[];
      phone: string;
      email: string;
    };
    social?: SocialLink[];
    partners?: Array<{
      name: string;
      logo: string;
    }>;
  };
}

export const footerData = {
  logo: {
    image: "/images/logo.png",
    alt: "SECO Logo",
    width: 50,
    height: 48,
    url: "/",
  },
  logoTitle: {
    title: {
      text: "SECO ORG",
      language: "en",
    },
    subTitle: {
      text: "Social & Environmental Conservation Organizations",
      language: "en",
    },
  },
  columns: [
    {
      title: {text: "About Us", language: "en"},
      type: "text",
      content: {
        text: {
          text: "Supporting communities through sustainable development initiatives, fostering growth, and building a better future together.",
          language: "en",
        },
      },
    },
    {
      title: {text: "Quick Links", language: "en"},
      type: "links",
      content: {
        links: [
          {text: "About", url: "/about"},
          {text: "Programs", url: "/programs"},
          {text: "Blog", url: "/blog"},
          {text: "Contact", url: "/contact"},
        ],
      },
    },
    {
      title: {text: "Contact Info", language: "en"},
      type: "contact",
      content: {
        contact: {
          address: ["123 Main Street", "City, Country", "12345"],
          phone: "+1 234 567 890",
          email: "info@seco.org",
        },
      },
    },
    {
      title: {text: "Connect With Us", language: "en"},
      type: "social",
      content: {
        social: [
          {text: "Facebook", url: "https://facebook.com", icon: "FaFacebook"},
          {text: "Twitter", url: "https://twitter.com", icon: "FaTwitter"},
          {text: "Instagram", url: "https://instagram.com", icon: "FaInstagram"},
          {text: "LinkedIn", url: "https://linkedin.com", icon: "FaLinkedin"},
        ],
      },
    },
  ],
  copyright: {
    text: "© 2024 SECO. All rights reserved.",
    language: "en",
  },
};
