import { Services } from "@/types/services";

export const services: Services = {
  servicePage: {
    image: "/images/community-hero.jpeg",
    title: {
      en: {
        text: "Our Services"
      },
      ur: {
        text: "ہماری خدمات"

      },
    },
    description: {
      en: {
        text: "Discover our comprehensive range of services designed to support and empower communities"
      },
      ur: {
        text: "کمیونٹیز کی مدد اور بااختیار بنانے کے لیے ڈیزائن کی گئی ہماری جامع خدمات دریافت کریں"
      },
    },
  },
  servicesList: [

    {
      id: "1",
      slug: "sustainable-agriculture",
      iconName: "FaSeedling",
      heroImage: "/images/agriculture-hero.jpg",
      isActive: true,
      showOnHomepage: true,
      createdAt: new Date(),
      updatedAt: new Date(),
      socialShare: {
        title: { text: "Sustainable Agriculture: Empowering Farmers with Modern Practices" },
        description: { text: "Discover how we're empowering farmers with sustainable agricultural practices while preserving traditional knowledge. Join us in building a sustainable future for farming." },
        hashtags: ["SustainableAgriculture", "FarmingPractices", "Sustainability", "ModernFarming"],
        twitterHandle: "@YourOrganization",
        ogType: "article"
      },
      en: {
        title: { text: "Sustainable Agriculture" },
        shortDescription: { text: "Empowering farmers with sustainable practices" },
        fullDescription: { text: "Our sustainable agriculture initiatives focus on empowering farmers with modern techniques while preserving traditional knowledge." },
        impactTitle: { text: "Key Impact" },
        keyFeaturesTitle: { text: "Key Features" },
        overviewTitle: { text: "Overview" },
        keyFeatures: [
          {
            id: "1",
            title: { text: "Modern Farming Techniques" },
            description: { text: "Implementation of latest agricultural technologies" },
          },
          {
            id: "2",
            title: { text: "Organic Farming" },
            description: { text: "Promoting chemical-free farming practices" },
          },
        ],
        impact: [
          {
            id: "1",
            label: { text: "Farmers" },
            value: "1000",
            suffix: "+",
            iconName: "FaUsers",
          },
          {
            id: "2",
            label: { text: "Hectares" },
            value: "5000",
            suffix: "+",
            iconName: "FaGlobe",
          },
        ],

      },
      ur: {
        title: { text: "پائیدار زراعت" },
        shortDescription: { text: "کسانوں کو پائیدار طریقوں سے بااختیار بنانا" },
        fullDescription: { text: "ہماری پائیدار زراعت کی پہل کاری روایتی علم کو برقرار رکھتے ہوئے کسانوں کو جدید تکنیکوں سے آراستہ کرنے پر مرکوز ہے۔" },
        impactTitle: { text: "کلیدی اثرات" },
        keyFeaturesTitle: { text: "اہم خصوصیات" },
        overviewTitle: { text: "جائزہ" },
        keyFeatures: [
          {
            id: "1",
            title: { text: "جدید کاشتکاری کے طریقے" },
            description: { text: "جدید زرعی ٹیکنالوجیز کا نفاذ" },
          },
          {
            id: "2",
            title: { text: "نامیاتی کاشتکاری" },
            description: { text: "کیمیکل سے پاک کاشتکاری کے طریقوں کو فروغ دینا" },
          },
        ],
        impact: [
          {
            id: "1",
            label: { text: "کسان" },
            value: "1000",
            suffix: "+",
            iconName: "FaUsers",
          },
          {
            id: "2",
            label: { text: "ہیکٹر" },
            value: "5000",
            suffix: "+",
            iconName: "FaGlobe",
          },
        ],
      }
    },

    {
      id: "2",
      slug: "education-training",
      iconName: "FaGraduationCap",
      heroImage: "/images/education-hero.jpg",
      isActive: true,
      showOnHomepage: true,
      createdAt: new Date(),
      updatedAt: new Date(),
      socialShare: {
        title: {
          text: "Education & Training: Building Community Capacity Through Knowledge",

        },
        description: {
          text: "Explore our comprehensive educational programs and vocational training initiatives empowering communities with essential skills and knowledge for a better future.",

        },
        hashtags: ["Education", "VocationalTraining", "CommunityDevelopment", "SkillsDevelopment"],
        twitterHandle: "@YourOrganization",
        ogType: "article"
      },
      en: {
        title: {
          text: "Education & Training"
        },
        shortDescription: {
          text: "Building capacity through knowledge sharing"
        },
        fullDescription: {
          text: "We provide comprehensive educational programs and vocational training to empower communities with essential skills and knowledge."
        },
        impactTitle: {
          text: "Key Impact"
        },
        impact: [
          {
            id: "1",
            label: {
              text: "Schools & Madaris Facilities"
            },
            value: "1950",
            suffix: "",
            iconName: "FaSchool",
          },
          {
            id: "2",
            label: {
              text: "Students with Resources"
            },
            value: "7350",
            suffix: "",
            iconName: "FaBookReader",
          },
          {
            id: "3",
            label: {
              text: "School Enrollment"
            },
            value: "23550",
            suffix: "",
            iconName: "FaUserGraduate",
          },
          {
            id: "4",
            label: {
              text: "Madaris Enrollment"
            },
            value: "6676",
            suffix: "",
            iconName: "FaPrayingHands",
          },
          {
            id: "5",
            label: {
              text: "ALP Madaris"
            },
            value: "242",
            suffix: "",
            iconName: "FaLandmark",
          },
          {
            id: "6",
            label: {
              text: "Trained Teachers",

            },
            value: "925",
            suffix: "",
            iconName: "FaChalkboardTeacher",
          },
          {
            id: "7",
            label: {
              text: "Adult Literacy Trainees",

            },
            value: "9810",
            suffix: "",
            iconName: "FaUserCheck",
          },
          {
            id: "8",
            label: {
              text: "SMCs Formed",

            },
            value: "1059",
            suffix: "",
            iconName: "FaUsers",
          },
          {
            id: "9",
            label: {
              text: "Exposure Visits",

            },
            value: "1937",
            suffix: "",
            iconName: "FaGlobe",
          },
          {
            id: "10",
            label: {
              text: "TVET Students",

            },
            value: "2238",
            suffix: "",
            iconName: "FaToolbox",
          },
          {
            id: "11",
            label: {
              text: "COVID-19 Awareness",

            },
            value: "88772",
            suffix: "",
            iconName: "FaVirus",
          },
          {
            id: "12",
            label: {
              text: "Sports Engagement",

            },
            value: "3555",
            suffix: "",
            iconName: "FaRunning",
          },
        ],
        keyFeaturesTitle: {
          text: "Key Features",

        },
        overviewTitle: {
          text: "Overview",

        },
        keyFeatures: [
          {
            id: "1",
            title: {
              text: "Vocational Training",

            },
            description: {
              text: "Practical skills development for sustainable livelihoods",

            },
          },
          {
            id: "2",
            title: {
              text: "Youth Education",

            },
            description: {
              text: "Supporting academic growth and development",

            },
          },
        ],


      },
      ur: {
        title: {
          text: "تعلیم و تربیت",

        },
        shortDescription: {
          text: "علم کے تبادلے کے ذریعے صلاحیتوں کی تعمیر",

        },
        fullDescription: {
          text: "ہم کمیونٹیز کو ضروری مہارتوں اور علم سے لیس کرنے کے لیے جامع تعلیمی پروگرام اور پیشہ ورانہ تربیت فراہم کرتے ہیں۔",

        },
        impactTitle: {
          text: "کلیدی اثرات",

        },
        impact: [
          {
            id: "1",
            label: {
              text: "اسکول اور مدارس کی سہولیات",

            },
            value: "1950",
            suffix: "",
            iconName: "FaSchool",
          },
          {
            id: "2",
            label: {
              text: "وسائل کے ساتھ طلباء",

            },
            value: "7350",
            suffix: "",
            iconName: "FaBookReader",
          },
          {
            id: "3",
            label: {
              text: "اسکول میں داخلہ",

            },
            value: "23550",
            suffix: "",
            iconName: "FaUserGraduate",
          },
          {
            id: "4",
            label: {
              text: "مدارس میں داخلہ",

            },
            value: "6676",
            suffix: "",
            iconName: "FaPrayingHands",
          },
          {
            id: "5",
            label: {
              text: "اے ایل پی مدارس",

            },
            value: "242",
            suffix: "",
            iconName: "FaLandmark",
          },
          {
            id: "6",
            label: {
              text: "تربیت یافتہ اساتذہ",

            },
            value: "925",
            suffix: "",
            iconName: "FaChalkboardTeacher",
          },
          {
            id: "7",
            label: {
              text: "بالغ خواندگی کے تربیت کار",

            },
            value: "9810",
            suffix: "",
            iconName: "FaUserCheck",
          },
          {
            id: "8",
            label: {
              text: "ایس ایم سی تشکیل",

            },
            value: "1059",
            suffix: "",
            iconName: "FaUsers",
          },
          {
            id: "9",
            label: {
              text: "تعلیمی دورے",

            },
            value: "1937",
            suffix: "",
            iconName: "FaGlobe",
          },
          {
            id: "10",
            label: {
              text: "ٹی وی ای ٹی طلباء",

            },
            value: "2238",
            suffix: "",
            iconName: "FaToolbox",
          },
          {
            id: "11",
            label: {
              text: "کوویڈ-19 آگاہی",

            },
            value: "88772",
            suffix: "",
            iconName: "FaVirus",
          },
          {
            id: "12",
            label: {
              text: "کھیلوں میں شرکت",

            },
            value: "3555",
            suffix: "",
            iconName: "FaRunning",
          },
        ],
        keyFeaturesTitle: {
          text: "اہم خصوصیات",

        },
        overviewTitle: {
          text: "جائزہ",

        },
        keyFeatures: [
          {
            id: "1",
            title: {
              text: "پیشہ ورانہ تربیت",

            },
            description: {
              text: "پائیدار روزگار کے لیے عملی مہارتوں کی ترقی",

            },
          },
          {
            id: "2",
            title: {
              text: "نوجوانوں کی تعلیم",

            },
            description: {
              text: "تعلیمی ترقی اور نشوونما میں معاونت",

            },
          },
        ],
      },
    },

    {
      id: "3",
      slug: "community-development",
      iconName: "FaHandsHelping",
      heroImage: "/images/community-hero.jpeg",
      isActive: true,
      showOnHomepage: true,
      createdAt: new Date(),
      updatedAt: new Date(),
      socialShare: {
        title: {
          text: "Community Development: Building Resilient Communities Together",

        },
        description: {
          text: "Learn about our community development initiatives focused on building resilient and self-sustaining communities through participatory approaches.",

        },
        hashtags: ["CommunityDevelopment", "Resilience", "SustainableDevelopment", "Community"],
        twitterHandle: "@YourOrganization",
        ogType: "article"
      },
      en: {
        title: {
          text: "Community Development",

        },

        shortDescription: {
          text: "Strengthening local communities",

        },
        fullDescription: {
          text: "Our community development initiatives focus on building resilient and self-sustaining communities through participatory approaches.",

        },
        impactTitle: {
          text: "Key Impact",

        },
        keyFeaturesTitle: {
          text: "Key Features",

        },
        overviewTitle: {
          text: "Overview",

        },
        keyFeatures: [
          {
            id: "1",
            title: {
              text: "Local Leadership",

            },
            description: {
              text: "Developing community leaders and change-makers",

            },
          },
          {
            id: "2",
            title: {
              text: "Social Programs",

            },
            description: {
              text: "Supporting community welfare and cohesion",

            },
          },
        ],
        impact: [
          {
            id: "1",
            label: {
              text: "Community Members Trained",

            },
            value: "530478",
            suffix: "",
            iconName: "FaUsers",
          },
          {
            id: "2",
            label: {
              text: "Staff Trained",

            },
            value: "2699",
            suffix: "",
            iconName: "FaUserTie",
          },
          {
            id: "3",
            label: {
              text: "International Partners",

            },
            value: "256",
            suffix: "",
            iconName: "FaHandshake",
          },
          {
            id: "4",
            label: {
              text: "Communities",

            },
            value: "50",
            suffix: "+",
            iconName: "FaPeopleCarry",
          },
        ],

      },
      ur: {
        title: {
          text: "کمیونٹی کی ترقی",

        },
        shortDescription: {
          text: "مقامی کمیونٹیز کو مضبوط بنانا",

        },
        fullDescription: {
          text: "ہماری کمیونٹی کی ترقی کی پہل کاری شراکت داری کے طریقوں کے ذریعے مضبوط اور خود انحصار کمیونٹیز کی تعمیر پر مرکوز ہے۔",

        },
        impactTitle: {
          text: "کلیدی اثرات",

        },
        keyFeaturesTitle: {
          text: "اہم خصوصیات",

        },
        overviewTitle: {
          text: "جائزہ",

        },
        keyFeatures: [
          {
            id: "1",
            title: {
              text: "مقامی قیادت",

            },
            description: {
              text: "کمیونٹی کے رہنماؤں اور تبدیلی لانے والوں کی تیاری",

            },
          },
          {
            id: "2",
            title: {
              text: "سماجی پروگرام",

            },
            description: {
              text: "کمیونٹی کی فلاح و بہبود اور ہم آہنگی کی معاونت",

            },
          },
        ],
        impact: [
          {
            id: "1",
            label: {
              text: "تربیت یافتہ کمیونٹی ممبران",

            },
            value: "530478",
            suffix: "",
            iconName: "FaUsers",
          },
          {
            id: "2",
            label: {
              text: "تربیت یافتہ عملہ",

            },
            value: "2699",
            suffix: "",
            iconName: "FaUserTie",
          },
          {
            id: "3",
            label: {
              text: "بین الاقوامی شراکت دار",

            },
            value: "256",
            suffix: "",
            iconName: "FaHandshake",
          },
          {
            id: "4",
            label: {
              text: "کمیونٹیز",

            },
            value: "50",
            suffix: "+",
            iconName: "FaPeopleCarry",
          },
        ],
      }
    },

    {
      id: "4",
      slug: "infrastructure-support",
      iconName: "FaHome",
      heroImage: "/images/infrastructure-hero.jpg",
      isActive: true,
      showOnHomepage: true,
      createdAt: new Date(),
      updatedAt: new Date(),
      socialShare: {
        title: {
          text: "Infrastructure Support: Building Foundations for Better Lives",

        },
        description: {
          text: "Discover how we're helping communities develop and maintain essential infrastructure for improved quality of life and sustainable development.",

        },
        hashtags: ["Infrastructure", "CommunityDevelopment", "SustainableDevelopment", "QualityOfLife"],
        twitterHandle: "@YourOrganization",
        ogType: "article"
      },
      en: {

        title: {
          text: "Infrastructure Support",

        },

        shortDescription: {
          text: "Building sustainable infrastructure",

        },
        fullDescription: {
          text: "We help communities develop and maintain essential infrastructure for improved quality of life and sustainable development.",

        },
        impactTitle: {
          text: "Key Impact",

        },
        keyFeaturesTitle: {
          text: "Key Features",

        },
        overviewTitle: {
          text: "Overview",

        },
        keyFeatures: [
          {
            id: "1",
            title: {
              text: "Water Systems",

            },
            description: {
              text: "Clean water access and irrigation solutions",

            },
          },
          {
            id: "2",
            title: {
              text: "Community Facilities",

            },
            description: {
              text: "Building and maintaining essential structures",

            },
          },
        ],
        impact: [
          {
            id: "1",
            label: {
              text: "Infrastructure Schemes",

            },
            value: "31114",
            suffix: "",
            iconName: "FaBuilding",
          },
          {
            id: "2",
            label: {
              text: "Total Beneficiaries",

            },
            value: "1.63",
            suffix: "M",
            iconName: "FaUsers",
          },
          {
            id: "3",
            label: {
              text: "Scheme Worth",

            },
            value: "3.14",
            prefix: "PKR",
            suffix: "B",
            iconName: "FaMoneyBillWave",
          },
          {
            id: "4",
            label: {
              text: "Projects",

            },
            value: "75",
            suffix: "+",
            iconName: "FaTools",
          },
        ],
      },
      ur: {
        title: {
          text: "بنیادی ڈھانچے کی معاونت",

        },
        shortDescription: {
          text: "پائیدار بنیادی ڈھانچے کی تعمیر",

        },
        fullDescription: {
          text: "ہم کمیونٹیز کو زندگی کے معیار کو بہتر بنانے اور پائیدار ترقی کے لیے ضروری بنیادی ڈھانچے کی تعمیر اور دیکھ بھال میں مدد کرتے ہیں۔",

        },
        impactTitle: {
          text: "کلیدی اثرات",

        },
        keyFeaturesTitle: {
          text: "اہم خصوصیات",

        },
        overviewTitle: {
          text: "جائزہ",

        },
        keyFeatures: [
          {
            id: "1",
            title: {
              text: "پانی کے نظام",

            },
            description: {
              text: "صاف پانی کی رسائی اور آبپاشی کے حل",

            },
          },
          {
            id: "2",
            title: {
              text: "کمیونٹی کی سہولیات",

            },
            description: {
              text: "ضروری ڈھانچوں کی تعمیر اور دیکھ بھال",

            },
          },
        ],
        impact: [
          {
            id: "1",
            label: {
              text: "بنیادی ڈھانچے کی اسکیمیں",

            },
            value: "31114",
            suffix: "",
            iconName: "FaBuilding",
          },
          {
            id: "2",
            label: {
              text: "کل مستفیدین",

            },
            value: "1.63",
            suffix: "M",
            iconName: "FaUsers",
          },
          {
            id: "3",
            label: {
              text: "اسکیم کی مالیت",

            },
            value: "3.14",
            prefix: "PKR",
            suffix: "B",
            iconName: "FaMoneyBillWave",
          },
          {
            id: "4",
            label: {
              text: "منصوبے",

            },
            value: "75",
            suffix: "+",
            iconName: "FaTools",
          },
        ],
      }
    }





    // Add these services to the servicesList array



  ],
};




