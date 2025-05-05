import {Services} from "@/types/services";

export const services: Services = {
  servicePage: {
    image: "/images/community-hero.jpeg",
    title: {
      en: {
        text: "Our Services",
        language: "en",
      },
      ur: {
        text: "ہماری خدمات",
        language: "ur",
      },
    },
    description: {
      en: {
        text: "Discover our comprehensive range of services designed to support and empower communities",
        language: "en",
      },
      ur: {
        text: "کمیونٹیز کی مدد اور بااختیار بنانے کے لیے ڈیزائن کی گئی ہماری جامع خدمات دریافت کریں",
        language: "ur",
      },
    },
  },
  servicesList: [
    {
      id: "1",
      slug: "sustainable-agriculture",
      title: {
        text: "Sustainable Agriculture",
        language: "en",
      },
      iconName: "FaSeedling",
      heroImage: "/images/agriculture-hero.jpg",
      shortDescription: {
        text: "Empowering farmers with sustainable practices",
        language: "en",
      },
      fullDescription: {
        text: "Our sustainable agriculture initiatives focus on empowering farmers with modern techniques while preserving traditional knowledge.",
        language: "en",
      },
      impactTitle: {
        text: "Key Impact",
        language: "en",
      },
      keyFeaturesTitle: {
        text: "Key Features",
        language: "en",
      },
      overviewTitle: {
        text: "Overview",
        language: "en",
      },
      keyFeatures: [
        {
          id: "1",
          title: {
            text: "Modern Farming Techniques",
            language: "en",
          },
          description: {
            text: "Implementation of latest agricultural technologies",
            language: "en",
          },
        },
        {
          id: "2",
          title: {
            text: "Organic Farming",
            language: "en",
          },
          description: {
            text: "Promoting chemical-free farming practices",
            language: "en",
          },
        },
      ],
      impact: [
        {
          label: {
            text: "Farmers",
            language: "en",
          },
          value: "1000",
          suffix: "+",
          iconName: "FaUsers",
        },
        {
          label: {
            text: "Hectares",
            language: "en",
          },
          value: "5000",
          suffix: "+",
          iconName: "FaGlobe",
        },
      ],
      isActive: true,
      showOnHomepage: true,
      language: "en",
      createdAt: new Date(),
      updatedAt: new Date(),
      socialShare: {
        title: {
          text: "Sustainable Agriculture: Empowering Farmers with Modern Practices",
          language: "en"
        },
        description: {
          text: "Discover how we're empowering farmers with sustainable agricultural practices while preserving traditional knowledge. Join us in building a sustainable future for farming.",
          language: "en"
        },
        hashtags: ["SustainableAgriculture", "FarmingPractices", "Sustainability", "ModernFarming"],
        twitterHandle: "@YourOrganization",
        ogType: "article"
      },
    },
    {
      id: "2",
      slug: "education-training",
      title: {
        text: "Education & Training",
        language: "en",
      },
      iconName: "FaGraduationCap",
      heroImage: "/images/education-hero.jpg",
      shortDescription: {
        text: "Building capacity through knowledge sharing",
        language: "en",
      },
      fullDescription: {
        text: "We provide comprehensive educational programs and vocational training to empower communities with essential skills and knowledge.",
        language: "en",
      },
      impactTitle: {
        text: "Key Impact",
        language: "en",
      },
      impact: [
        {
          label: {
            text: "Schools & Madaris Facilities",
            language: "en",
          },
          value: "1950",
          suffix: "",
          iconName: "FaSchool",
        },
        {
          label: {
            text: "Students with Resources",
            language: "en",
          },
          value: "7350",
          suffix: "",
          iconName: "FaBookReader",
        },
        {
          label: {
            text: "School Enrollment",
            language: "en",
          },
          value: "23550",
          suffix: "",
          iconName: "FaUserGraduate",
        },
        {
          label: {
            text: "Madaris Enrollment",
            language: "en",
          },
          value: "6676",
          suffix: "",
          iconName: "FaPrayingHands",
        },
        {
          label: {
            text: "ALP Madaris",
            language: "en",
          },
          value: "242",
          suffix: "",
          iconName: "FaLandmark",
        },
        {
          label: {
            text: "Trained Teachers",
            language: "en",
          },
          value: "925",
          suffix: "",
          iconName: "FaChalkboardTeacher",
        },
        {
          label: {
            text: "Adult Literacy Trainees",
            language: "en",
          },
          value: "9810",
          suffix: "",
          iconName: "FaUserCheck",
        },
        {
          label: {
            text: "SMCs Formed",
            language: "en",
          },
          value: "1059",
          suffix: "",
          iconName: "FaUsers",
        },
        {
          label: {
            text: "Exposure Visits",
            language: "en",
          },
          value: "1937",
          suffix: "",
          iconName: "FaGlobe",
        },
        {
          label: {
            text: "TVET Students",
            language: "en",
          },
          value: "2238",
          suffix: "",
          iconName: "FaToolbox",
        },
        {
          label: {
            text: "COVID-19 Awareness",
            language: "en",
          },
          value: "88772",
          suffix: "",
          iconName: "FaVirus",
        },
        {
          label: {
            text: "Sports Engagement",
            language: "en",
          },
          value: "3555",
          suffix: "",
          iconName: "FaRunning",
        },
      ],
      keyFeaturesTitle: {
        text: "Key Features",
        language: "en",
      },
      overviewTitle: {
        text: "Overview",
        language: "en",
      },
      keyFeatures: [
        {
          id: "1",
          title: {
            text: "Vocational Training",
            language: "en",
          },
          description: {
            text: "Practical skills development for sustainable livelihoods",
            language: "en",
          },
        },
        {
          id: "2",
          title: {
            text: "Youth Education",
            language: "en",
          },
          description: {
            text: "Supporting academic growth and development",
            language: "en",
          },
        },
      ],
      isActive: true,
      showOnHomepage: true,
      language: "en",
      createdAt: new Date(),
      updatedAt: new Date(),
      socialShare: {
        title: {
          text: "Education & Training: Building Community Capacity Through Knowledge",
          language: "en"
        },
        description: {
          text: "Explore our comprehensive educational programs and vocational training initiatives empowering communities with essential skills and knowledge for a better future.",
          language: "en"
        },
        hashtags: ["Education", "VocationalTraining", "CommunityDevelopment", "SkillsDevelopment"],
        twitterHandle: "@YourOrganization",
        ogType: "article"
      },
    },

    {
      id: "3",
      slug: "community-development",
      title: {
        text: "Community Development",
        language: "en",
      },
      iconName: "FaHandsHelping",
      heroImage: "/images/community-hero.jpeg",
      shortDescription: {
        text: "Strengthening local communities",
        language: "en",
      },
      fullDescription: {
        text: "Our community development initiatives focus on building resilient and self-sustaining communities through participatory approaches.",
        language: "en",
      },
      impactTitle: {
        text: "Key Impact",
        language: "en",
      },
      keyFeaturesTitle: {
        text: "Key Features",
        language: "en",
      },
      overviewTitle: {
        text: "Overview",
        language: "en",
      },
      keyFeatures: [
        {
          id: "1",
          title: {
            text: "Local Leadership",
            language: "en",
          },
          description: {
            text: "Developing community leaders and change-makers",
            language: "en",
          },
        },
        {
          id: "2",
          title: {
            text: "Social Programs",
            language: "en",
          },
          description: {
            text: "Supporting community welfare and cohesion",
            language: "en",
          },
        },
      ],
      impact: [
        {
          label: {
            text: "Community Members Trained",
            language: "en",
          },
          value: "530478",
          suffix: "",
          iconName: "FaUsers",
        },
        {
          label: {
            text: "Staff Trained",
            language: "en",
          },
          value: "2699",
          suffix: "",
          iconName: "FaUserTie",
        },
        {
          label: {
            text: "International Partners",
            language: "en",
          },
          value: "256",
          suffix: "",
          iconName: "FaHandshake",
        },
        {
          label: {
            text: "Communities",
            language: "en",
          },
          value: "50",
          suffix: "+",
          iconName: "FaPeopleCarry",
        },
      ],
      isActive: true,
      showOnHomepage: true,
      language: "en",
      createdAt: new Date(),
      updatedAt: new Date(),
      socialShare: {
        title: {
          text: "Community Development: Building Resilient Communities Together",
          language: "en"
        },
        description: {
          text: "Learn about our community development initiatives focused on building resilient and self-sustaining communities through participatory approaches.",
          language: "en"
        },
        hashtags: ["CommunityDevelopment", "Resilience", "SustainableDevelopment", "Community"],
        twitterHandle: "@YourOrganization",
        ogType: "article"
      },
    },
    {
      id: "4",
      slug: "infrastructure-support",
      title: {
        text: "Infrastructure Support",
        language: "en",
      },
      iconName: "FaHome",
      heroImage: "/images/infrastructure-hero.jpg",
      shortDescription: {
        text: "Building sustainable infrastructure",
        language: "en",
      },
      fullDescription: {
        text: "We help communities develop and maintain essential infrastructure for improved quality of life and sustainable development.",
        language: "en",
      },
      impactTitle: {
        text: "Key Impact",
        language: "en",
      },
      keyFeaturesTitle: {
        text: "Key Features",
        language: "en",
      },
      overviewTitle: {
        text: "Overview",
        language: "en",
      },
      keyFeatures: [
        {
          id: "1",
          title: {
            text: "Water Systems",
            language: "en",
          },
          description: {
            text: "Clean water access and irrigation solutions",
            language: "en",
          },
        },
        {
          id: "2",
          title: {
            text: "Community Facilities",
            language: "en",
          },
          description: {
            text: "Building and maintaining essential structures",
            language: "en",
          },
        },
      ],
      impact: [
        {
          label: {
            text: "Infrastructure Schemes",
            language: "en",
          },
          value: "31114",
          suffix: "",
          iconName: "FaBuilding",
        },
        {
          label: {
            text: "Total Beneficiaries",
            language: "en",
          },
          value: "1.63",
          suffix: "M",
          iconName: "FaUsers",
        },
        {
          label: {
            text: "Scheme Worth",
            language: "en",
          },
          value: "3.14",
          prefix: "PKR",
          suffix: "B",
          iconName: "FaMoneyBillWave",
        },
        {
          label: {
            text: "Projects",
            language: "en",
          },
          value: "75",
          suffix: "+",
          iconName: "FaTools",
        },
      ],
      isActive: true,
      showOnHomepage: true,
      language: "en",
      createdAt: new Date(),
      updatedAt: new Date(),
      socialShare: {
        title: {
          text: "Infrastructure Support: Building Foundations for Better Lives",
          language: "en"
        },
        description: {
          text: "Discover how we're helping communities develop and maintain essential infrastructure for improved quality of life and sustainable development.",
          language: "en"
        },
        hashtags: ["Infrastructure", "CommunityDevelopment", "SustainableDevelopment", "QualityOfLife"],
        twitterHandle: "@YourOrganization",
        ogType: "article"
      },
    },
   

    // Add these services to the servicesList array
    {
      id: "5",
      slug: "sustainable-agriculture-ur",
      title: {
        text: "پائیدار زراعت",
        language: "ur",
      },
      iconName: "FaSeedling",
      heroImage: "/images/agriculture-hero.jpg",
      shortDescription: {
        text: "کسانوں کو پائیدار طریقوں سے بااختیار بنانا",
        language: "ur",
      },
      fullDescription: {
        text: "ہماری پائیدار زراعت کی پہل کاری روایتی علم کو برقرار رکھتے ہوئے کسانوں کو جدید تکنیکوں سے آراستہ کرنے پر مرکوز ہے۔",
        language: "ur",
      },
      impactTitle: {
        text: "کلیدی اثرات",
        language: "ur",
      },
      keyFeaturesTitle: {
        text: "اہم خصوصیات",
        language: "ur",
      },
      overviewTitle: {
        text: "جائزہ",
        language: "ur",
      },
      keyFeatures: [
        {
          id: "1",
          title: {
            text: "جدید کاشتکاری کے طریقے",
            language: "ur",
          },
          description: {
            text: "جدید زرعی ٹیکنالوجیز کا نفاذ",
            language: "ur",
          },
        },
        {
          id: "2",
          title: {
            text: "نامیاتی کاشتکاری",
            language: "ur",
          },
          description: {
            text: "کیمیکل سے پاک کاشتکاری کے طریقوں کو فروغ دینا",
            language: "ur",
          },
        },
      ],
      impact: [
        {
          label: {
            text: "کسان",
            language: "ur",
          },
          value: "1000",
          suffix: "+",
          iconName: "FaUsers",
        },
        {
          label: {
            text: "ہیکٹر",
            language: "ur",
          },
          value: "5000",
          suffix: "+",
          iconName: "FaGlobe",
        },
      ],
      isActive: true,
      showOnHomepage: true,
      language: "ur",
      createdAt: new Date(),
      updatedAt: new Date(),
      socialShare: {
        title: {
          text: "پائیدار زراعت: کسانوں کو جدید طریقوں سے بااختیار بنانا",
          language: "ur"
        },
        description: {
          text: "جانیں کہ ہم کیسے روایتی علم کو برقرار رکھتے ہوئے کسانوں کو پائیدار زرعی طریقوں سے آراستہ کر رہے ہیں۔ زراعت کے پائیدار مستقبل کی تعمیر میں ہمارے ساتھ شامل ہوں۔",
          language: "ur"
        },
        hashtags: ["پائیدارزراعت", "زرعیترقی", "جدیدکاشتکاری", "کسان"],
        twitterHandle: "@YourOrganization",
        ogType: "article"
      },
    },
    {
      id: "6",
      slug: "education-training-ur",
      title: {
        text: "تعلیم و تربیت",
        language: "ur",
      },
      iconName: "FaGraduationCap",
      heroImage: "/images/education-hero.jpg",
      shortDescription: {
        text: "علم کے تبادلے کے ذریعے صلاحیتوں کی تعمیر",
        language: "ur",
      },
      fullDescription: {
        text: "ہم کمیونٹیز کو ضروری مہارتوں اور علم سے لیس کرنے کے لیے جامع تعلیمی پروگرام اور پیشہ ورانہ تربیت فراہم کرتے ہیں۔",
        language: "ur",
      },
      impactTitle: {
        text: "کلیدی اثرات",
        language: "ur",
      },
      impact: [
        {
          label: {
            text: "اسکول اور مدارس کی سہولیات",
            language: "ur",
          },
          value: "1950",
          suffix: "",
          iconName: "FaSchool",
        },
        {
          label: {
            text: "وسائل کے ساتھ طلباء",
            language: "ur",
          },
          value: "7350",
          suffix: "",
          iconName: "FaBookReader",
        },
        {
          label: {
            text: "اسکول میں داخلہ",
            language: "ur",
          },
          value: "23550",
          suffix: "",
          iconName: "FaUserGraduate",
        },
        {
          label: {
            text: "مدارس میں داخلہ",
            language: "ur",
          },
          value: "6676",
          suffix: "",
          iconName: "FaPrayingHands",
        },
        {
          label: {
            text: "اے ایل پی مدارس",
            language: "ur",
          },
          value: "242",
          suffix: "",
          iconName: "FaLandmark",
        },
        {
          label: {
            text: "تربیت یافتہ اساتذہ",
            language: "ur",
          },
          value: "925",
          suffix: "",
          iconName: "FaChalkboardTeacher",
        },
        {
          label: {
            text: "بالغ خواندگی کے تربیت کار",
            language: "ur",
          },
          value: "9810",
          suffix: "",
          iconName: "FaUserCheck",
        },
        {
          label: {
            text: "ایس ایم سی تشکیل",
            language: "ur",
          },
          value: "1059",
          suffix: "",
          iconName: "FaUsers",
        },
        {
          label: {
            text: "تعلیمی دورے",
            language: "ur",
          },
          value: "1937",
          suffix: "",
          iconName: "FaGlobe",
        },
        {
          label: {
            text: "ٹی وی ای ٹی طلباء",
            language: "ur",
          },
          value: "2238",
          suffix: "",
          iconName: "FaToolbox",
        },
        {
          label: {
            text: "کوویڈ-19 آگاہی",
            language: "ur",
          },
          value: "88772",
          suffix: "",
          iconName: "FaVirus",
        },
        {
          label: {
            text: "کھیلوں میں شرکت",
            language: "ur",
          },
          value: "3555",
          suffix: "",
          iconName: "FaRunning",
        },
      ],
      keyFeaturesTitle: {
        text: "اہم خصوصیات",
        language: "ur",
      },
      overviewTitle: {
        text: "جائزہ",
        language: "ur",
      },
      keyFeatures: [
        {
          id: "1",
          title: {
            text: "پیشہ ورانہ تربیت",
            language: "ur",
          },
          description: {
            text: "پائیدار روزگار کے لیے عملی مہارتوں کی ترقی",
            language: "ur",
          },
        },
        {
          id: "2",
          title: {
            text: "نوجوانوں کی تعلیم",
            language: "ur",
          },
          description: {
            text: "تعلیمی ترقی اور نشوونما میں معاونت",
            language: "ur",
          },
        },
      ],
      isActive: true,
      showOnHomepage: true,
      language: "ur",
      createdAt: new Date(),
      updatedAt: new Date(),
      socialShare: {
        title: {
          text: "تعلیم و تربیت: علم کے ذریعے کمیونٹی کی صلاحیتوں کی تعمیر",
          language: "ur"
        },
        description: {
          text: "بہتر مستقبل کے لیے ضروری مہارتوں اور علم کے ساتھ کمیونٹیز کو بااختیار بنانے والے ہمارے جامع تعلیمی پروگرامز اور پیشہ ورانہ تربیت کے اقدامات دریافت کریں۔",
          language: "ur"
        },
        hashtags: ["تعلیم", "پیشہورانہتربیت", "کمیونٹیترقی", "مہارتیںترقی"],
        twitterHandle: "@YourOrganization",
        ogType: "article"
      },
    },
    {
      id: "7",
      slug: "community-development-ur",
      title: {
        text: "کمیونٹی کی ترقی",
        language: "ur",
      },
      iconName: "FaHandsHelping",
      heroImage: "/images/community-hero.jpeg",
      shortDescription: {
        text: "مقامی کمیونٹیز کو مضبوط بنانا",
        language: "ur",
      },
      fullDescription: {
        text: "ہماری کمیونٹی کی ترقی کی پہل کاری شراکت داری کے طریقوں کے ذریعے مضبوط اور خود انحصار کمیونٹیز کی تعمیر پر مرکوز ہے۔",
        language: "ur",
      },
      impactTitle: {
        text: "کلیدی اثرات",
        language: "ur",
      },
      keyFeaturesTitle: {
        text: "اہم خصوصیات",
        language: "ur",
      },
      overviewTitle: {
        text: "جائزہ",
        language: "ur",
      },
      keyFeatures: [
        {
          id: "1",
          title: {
            text: "مقامی قیادت",
            language: "ur",
          },
          description: {
            text: "کمیونٹی کے رہنماؤں اور تبدیلی لانے والوں کی تیاری",
            language: "ur",
          },
        },
        {
          id: "2",
          title: {
            text: "سماجی پروگرام",
            language: "ur",
          },
          description: {
            text: "کمیونٹی کی فلاح و بہبود اور ہم آہنگی کی معاونت",
            language: "ur",
          },
        },
      ],
      impact: [
        {
          label: {
            text: "تربیت یافتہ کمیونٹی ممبران",
            language: "ur",
          },
          value: "530478",
          suffix: "",
          iconName: "FaUsers",
        },
        {
          label: {
            text: "تربیت یافتہ عملہ",
            language: "ur",
          },
          value: "2699",
          suffix: "",
          iconName: "FaUserTie",
        },
        {
          label: {
            text: "بین الاقوامی شراکت دار",
            language: "ur",
          },
          value: "256",
          suffix: "",
          iconName: "FaHandshake",
        },
        {
          label: {
            text: "کمیونٹیز",
            language: "ur",
          },
          value: "50",
          suffix: "+",
          iconName: "FaPeopleCarry",
        },
      ],
      isActive: true,
      showOnHomepage: true,
      language: "ur",
      createdAt: new Date(),
      updatedAt: new Date(),
      socialShare: {
        title: {
          text: "کمیونٹی کی ترقی: مل کر مضبوط کمیونٹیز کی تعمیر",
          language: "ur"
        },
        description: {
          text: "شراکت داری کے طریقوں کے ذریعے مضبوط اور خود انحصار کمیونٹیز کی تعمیر پر مرکوز ہماری کمیونٹی ترقی کے اقدامات کے بارے میں جانیں۔",
          language: "ur"
        },
        hashtags: ["کمیونٹیترقی", "استحکام", "پائیدارترقی", "کمیونٹی"],
        twitterHandle: "@YourOrganization",
        ogType: "article"
      },
    },
    {
      id: "8",
      slug: "infrastructure-support-ur",
      title: {
        text: "بنیادی ڈھانچے کی معاونت",
        language: "ur",
      },
      iconName: "FaHome",
      heroImage: "/images/infrastructure-hero.jpg",
      shortDescription: {
        text: "پائیدار بنیادی ڈھانچے کی تعمیر",
        language: "ur",
      },
      fullDescription: {
        text: "ہم کمیونٹیز کو زندگی کے معیار کو بہتر بنانے اور پائیدار ترقی کے لیے ضروری بنیادی ڈھانچے کی تعمیر اور دیکھ بھال میں مدد کرتے ہیں۔",
        language: "ur",
      },
      impactTitle: {
        text: "کلیدی اثرات",
        language: "ur",
      },
      keyFeaturesTitle: {
        text: "اہم خصوصیات",
        language: "ur",
      },
      overviewTitle: {
        text: "جائزہ",
        language: "ur",
      },
      keyFeatures: [
        {
          id: "1",
          title: {
            text: "پانی کے نظام",
            language: "ur",
          },
          description: {
            text: "صاف پانی کی رسائی اور آبپاشی کے حل",
            language: "ur",
          },
        },
        {
          id: "2",
          title: {
            text: "کمیونٹی کی سہولیات",
            language: "ur",
          },
          description: {
            text: "ضروری ڈھانچوں کی تعمیر اور دیکھ بھال",
            language: "ur",
          },
        },
      ],
      impact: [
        {
          label: {
            text: "بنیادی ڈھانچے کی اسکیمیں",
            language: "ur",
          },
          value: "31114",
          suffix: "",
          iconName: "FaBuilding",
        },
        {
          label: {
            text: "کل مستفیدین",
            language: "ur",
          },
          value: "1.63",
          suffix: "M",
          iconName: "FaUsers",
        },
        {
          label: {
            text: "اسکیم کی مالیت",
            language: "ur",
          },
          value: "3.14",
          prefix: "PKR",
          suffix: "B",
          iconName: "FaMoneyBillWave",
        },
        {
          label: {
            text: "منصوبے",
            language: "ur",
          },
          value: "75",
          suffix: "+",
          iconName: "FaTools",
        },
      ],
      isActive: true,
      showOnHomepage: true,
      language: "ur",
      createdAt: new Date(),
      updatedAt: new Date(),
      socialShare: {
        title: {
          text: "بنیادی ڈھانچہ: بہتر زندگی کی بنیادوں کی تعمیر",
          language: "ur"
        },
        description: {
          text: "جانیں کہ ہم کیسے کمیونٹیز کو بہتر معیار زندگی اور پائیدار ترقی کے لیے ضروری بنیادی ڈھانچے کی تعمیر اور دیکھ بھال میں مدد کر رہے ہیں۔",
          language: "ur"
        },
        hashtags: ["بنیادیڈھانچہ", "کمیونٹیترقی", "پائیدارترقی", "معیارزندگی"],
        twitterHandle: "@YourOrganization",
        ogType: "article"
      },
    },
  ],
};
