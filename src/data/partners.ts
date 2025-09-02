import { PartnersData } from '@/types/partners';

export const partnersData: PartnersData = {
  partnerPage: {
    title: {
      en: { text: "Our Partners" },
      ur: { text: "ہمارے پارٹنرز" }
    },
    description: {
      en: { text: "We work with leading organizations to create positive impact in our communities." },
      ur: { text: "ہم اپنی کمیونٹیز میں مثبت اثرات پیدا کرنے کے لیے سرکردہ تنظیموں کے ساتھ کام کرتے ہیں۔" }
    },
    image: "/images/partners-hero.jpg"
  },
  partnersList: [
    {
      id: "1",
      name: "UNICEF",
      image: "/images/unicef-logo.png",
      altText: "UNICEF logo - United Nations Children's Fund",
      isActive: true,
      showOnHomepage: true
    },
    {
      id: "2",
      name: "WHO",
      image: "/images/who.jpg",
      altText: "WHO logo - World Health Organization",
      isActive: true,
      showOnHomepage: true
    },
    {
      id: "3",
      name: "UNESCO",
      image: "/images/edu-logo.jpg",
      altText: "UNESCO logo - United Nations Educational, Scientific and Cultural Organization",
      isActive: true,
      showOnHomepage: true
    },
    {
      id: "4",
      name: "UNDP",
      image: "/images/undp-logo.png",
      altText: "UNDP logo - United Nations Development Programme",
      isActive: true,
      showOnHomepage: true
    },
    {
      id: "5",
      name: "World Bank",
      image: "/images/world-bank.jpg",
      altText: "World Bank logo - International financial institution",
      isActive: true,
      showOnHomepage: true
    }
  ]
};