import { NavbarData } from '@/types/navbar';

export const navbarData: NavbarData = {
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
  ]
};
