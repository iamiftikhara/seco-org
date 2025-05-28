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

export interface NavbarData {
  logo: {
    image: string;
    alt: string;
    width: number;
    height: number;
    url: string;
  };
  logoTitle: {
    title: TextContent;
    subTitle: TextContent;
  };
  navigationLinks: NavLink[];
}