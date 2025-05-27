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

export interface NavLink {
  name: string;
  url: string;
}

export const navbarData = {
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
  navigationLinks: [
    {name: "home", url: "/"},
    {name: "about", url: "/about"},
    {name: "services", url: "/services"},
    {name: "programs", url: "/programs"},
    {name: "events", url: "/events"},
    {name: "gallery", url: "/gallery"},
    {name: "blog", url: "/blog"},
    {name: "contact", url: "/contact"},
  ] as NavLink[],
};
