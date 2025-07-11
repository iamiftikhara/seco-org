import { Programs } from "@/types/programs";

export const programs: Programs = {
  programPage: {
    image: "/images/programs-hero2.jpg",
    title: {
      en: { text: "Our Programs" },
      ur: { text: "ہمارے پروگرامز" }
    },
    description: {
      en: { text: "Discover our initiatives that are making a difference in communities across Balochistan" },
      ur: { text: "بلوچستان کی کمیونٹیز میں تبدیلی لانے والے ہمارے اقدامات کو جانیں" }
    }
  },
  programsList: [
    {
      id: "1",
      slug: "sustainable-agriculture",
      featuredImage: "/images/project1.jpeg",
      isActive: true,
      showOnHomepage: true,
      createdAt: new Date(),
      updatedAt: new Date(),
      socialShare: {
        title: { text: "Sustainable Agriculture in Balochistan" },
        description: { text: "Empowering local farmers with modern agricultural practices while preserving traditional knowledge. Join us in transforming agriculture in Balochistan!" },
        hashtags: ["SustainableAgriculture", "FarmingPakistan", "BalochistanFarmers", "ModernFarming"],
        twitterHandle: "SECOPakistan",
        ogType: "article"
      },
      en: {
        title: { text: "Sustainable Agriculture" },
        shortDescription: { text: "Empowering farmers with modern agricultural practices" },
        fullDescription: { text: "Our sustainable agriculture program focuses on empowering local farmers with modern farming techniques while preserving traditional knowledge. Through comprehensive training programs, demonstration farms, and community-based approaches, we're helping farmers increase productivity while maintaining environmental sustainability." },
        category: { text: "Agriculture" },
        duration: { text: "2 Years (2023-2025)" },
        coverage: { text: "5 Districts in Balochistan" },
        impactTitle: { text: "Program Impact" },
        iconStatsTitle: { text: "Key Statistics" },
        partnersTitle: { text: "Our Partners" },
        impact: [
          { id: "impact-1", label: { text: "Farmers Benefited" }, value: "500", suffix: "+", iconName: "FaUsers" },
          { id: "impact-2", label: { text: "Hectares Covered" }, value: "1000", suffix: "+", iconName: "FaLeaf" },
          { id: "impact-3", label: { text: "Villages Reached" }, value: "25", suffix: "+", iconName: "FaHome" },
          { id: "impact-4", label: { text: "Training Sessions" }, value: "100", suffix: "+", iconName: "FaGraduationCap" }
        ],
        iconStats: [
          { id: "stat-1", label: { text: "Demonstration Farms" }, value: "12", iconName: "FaSeedling" },
          { id: "stat-2", label: { text: "Water Projects" }, value: "15", iconName: "FaHandHoldingWater" },
          { id: "stat-3", label: { text: "Community Groups" }, value: "50+", iconName: "FaUsers" },
          { id: "stat-4", label: { text: "Organic Farms" }, value: "8", iconName: "FaLeaf" }
        ],
        partners: [
          { id: "partner-1", name: { text: "Agricultural Research Institute" }, logo: "/images/ari-logo.jpg" },
          { id: "partner-2", name: { text: "FAO Pakistan" }, logo: "/images/fao-logo.jpg" },
          { id: "partner-3", name: { text: "Local Farmers Association" }, logo: "/images/lfa-logo.jpg" }
        ]
      },
      ur: {
        title: { text: "پائیدار زراعت" },
        shortDescription: { text: "جدید زرعی طریقوں کے ساتھ کسانوں کو بااختیار بنانا" },
        fullDescription: { text: "ہمارا پائیدار زراعت پروگرام روایتی علم کو برقرار رکھتے ہوئے جدید کاشتکاری کی تکنیکوں کے ساتھ مقامی کسانوں کو بااختیار بنانے پر توجہ مرکوز کرتا ہے۔ جامع تربیتی پروگرامز، مظاہرہ فارمز، اور کمیونٹی پر مبنی نقطہ نظر کے ذریعے، ہم کسانوں کو ماحولیاتی پائیداری برقرار رکھتے ہوئے پیداوار بڑھانے میں مدد کر رہے ہیں۔" },
        category: { text: "زراعت" },
        duration: { text: "2 سال (2023-2025)" },
        coverage: { text: "بلوچستان کے 5 اضلاع" },
        impactTitle: { text: "پروگرام کا اثر" },
        iconStatsTitle: { text: "اہم اعداد و شمار" },
        partnersTitle: { text: "ہمارے شراکت دار" },
        impact: [
          { id: "impact-1", label: { text: "فائدہ اٹھانے والے کسان" }, value: "500", suffix: "+", iconName: "FaUsers" },
          { id: "impact-2", label: { text: "احاطہ کردہ ہیکٹر" }, value: "1000", suffix: "+", iconName: "FaLeaf" },
          { id: "impact-3", label: { text: "متاثرہ دیہات" }, value: "25", suffix: "+", iconName: "FaHome" },
          { id: "impact-4", label: { text: "تربیتی سیشنز" }, value: "100", suffix: "+", iconName: "FaGraduationCap" }
        ],
        iconStats: [
          { id: "stat-1", label: { text: "مظاہرہ فارمز" }, value: "12", iconName: "FaSeedling" },
          { id: "stat-2", label: { text: "پانی کے منصوبے" }, value: "15", iconName: "FaHandHoldingWater" },
          { id: "stat-3", label: { text: "کمیونٹی گروپس" }, value: "50+", iconName: "FaUsers" },
          { id: "stat-4", label: { text: "نباتاتی فارمز" }, value: "8", iconName: "FaLeaf" }
        ],
        partners: [
          { id: "partner-1", name: { text: "زرعی تحقیقاتی ادارہ" }, logo: "/images/ari-logo.jpg" },
          { id: "partner-2", name: { text: "ایف اے او پاکستان" }, logo: "/images/fao-logo.jpg" },
          { id: "partner-3", name: { text: "مقامی کسان ایسوسی ایشن" }, logo: "/images/lfa-logo.jpg" }
        ]
      }
    },
    {
      id: "2",
      slug: "women-empowerment",
      featuredImage: "/images/women-empowerment.jpg",
      isActive: true,
      showOnHomepage: true,
      createdAt: new Date(),
      updatedAt: new Date(),
      socialShare: {
        title: { text: "Women Empowerment Initiative in Balochistan" },
        description: { text: "Creating sustainable economic opportunities for women in rural communities. Join our mission to empower women entrepreneurs in Balochistan!" },
        hashtags: ["WomenEmpowerment", "RuralWomen", "WomenEntrepreneurs", "BalochistanWomen"],
        twitterHandle: "SECOPakistan",
        ogType: "article"
      },
      en: {
        title: { text: "Women Empowerment" },
        shortDescription: { text: "Supporting women entrepreneurs in rural communities" },
        fullDescription: { text: "The Women Empowerment program is designed to create sustainable economic opportunities for women in rural communities. Through skills development, financial literacy training, and micro-enterprise support, we help women establish and grow their businesses. This program also addresses social barriers and promotes women's participation in community decision-making processes." },
        category: { text: "Social Development" },
        duration: { text: "3 Years (2023-2026)" },
        coverage: { text: "8 Districts in Balochistan" },
        impactTitle: { text: "Program Impact" },
        iconStatsTitle: { text: "Key Statistics" },
        partnersTitle: { text: "Our Partners" },
        impact: [
          { id: "impact-1", label: { text: "Businesses Started" }, value: "200", suffix: "+", iconName: "FaStore" },
          { id: "impact-2", label: { text: "Women Trained" }, value: "500", suffix: "+", iconName: "FaUsers" },
          { id: "impact-3", label: { text: "Communities Impacted" }, value: "30", suffix: "+", iconName: "FaHome" },
          { id: "impact-4", label: { text: "Success Stories" }, value: "150", suffix: "+", iconName: "FaStar" }
        ],
        iconStats: [
          { id: "stat-1", label: { text: "Active Businesses" }, value: "200+", iconName: "FaStore" },
          { id: "stat-2", label: { text: "Training Centers" }, value: "20", iconName: "FaGraduationCap" },
          { id: "stat-3", label: { text: "Micro Loans" }, value: "300+", iconName: "FaHandHoldingUsd" },
          { id: "stat-4", label: { text: "Women Groups" }, value: "25", iconName: "FaUsers" }
        ],
        partners: [
          { id: "partner-1", name: { text: "UN Women Pakistan" }, logo: "/images/unwomen-logo.jpg" },
          { id: "partner-2", name: { text: "USAID" }, logo: "/images/usaid-logo.png" },
          { id: "partner-3", name: { text: "Local Women Council" }, logo: "/images/lwc-logo.jpg" }
        ]
      },
      ur: {
        title: { text: "خواتین کی ترقی" },
        shortDescription: { text: "دیہی علاقوں میں خواتین کاروباری افراد کی معاونت" },
        fullDescription: { text: "خواتین کی ترقی کا پروگرام دیہی علاقوں میں خواتین کے لیے پائیدار معاشی مواقع پیدا کرنے کے لیے ڈیزائن کیا گیا ہے۔ ہم مہارت کی ترقی، مالی خواندگی کی تربیت، اور مائیکرو انٹرپرائز کی معاونت کے ذریعے، خواتین کو اپنا کاروبار قائم کرنے اور بڑھانے میں مدد کرتے ہیں۔" },
        category: { text: "سماجی ترقی" },
        duration: { text: "3 سال (2023-2026)" },
        coverage: { text: "بلوچستان کے 8 اضلاع" },
        impactTitle: { text: "پروگرام کا اثر" },
        iconStatsTitle: { text: "اہم اعداد و شمار" },
        partnersTitle: { text: "ہمارے شراکت دار" },
        impact: [
          { id: "impact-1", label: { text: "شروع کیے گئے کاروبار" }, value: "200", suffix: "+", iconName: "FaStore" },
          { id: "impact-2", label: { text: "تربیت یافتہ خواتین" }, value: "500", suffix: "+", iconName: "FaUsers" },
          { id: "impact-3", label: { text: "متاثر ہونے والی کمیونٹیز" }, value: "30", suffix: "+", iconName: "FaHome" },
          { id: "impact-4", label: { text: "کامیابی کی کہانیاں" }, value: "150", suffix: "+", iconName: "FaStar" }
        ],
        iconStats: [
          { id: "stat-1", label: { text: "فعال کاروبار" }, value: "200+", iconName: "FaStore" },
          { id: "stat-2", label: { text: "تربیتی مراکز" }, value: "20", iconName: "FaGraduationCap" },
          { id: "stat-3", label: { text: "مائیکرو لونز" }, value: "300+", iconName: "FaHandHoldingUsd" },
          { id: "stat-4", label: { text: "خواتین گروپس" }, value: "25", iconName: "FaUsers" }
        ],
        partners: [
          { id: "partner-1", name: { text: "اقوام متحدہ خواتین پاکستان" }, logo: "/images/unwomen-logo.jpg" },
          { id: "partner-2", name: { text: "یو ایس ایڈ" }, logo: "/images/usaid-logo.png" },
          { id: "partner-3", name: { text: "مقامی خواتین کونسل" }, logo: "/images/lwc-logo.jpg" }
        ]
      }
    },

    {
      id: "3",
      slug: "clean-water-initiative",
      featuredImage: "/images/project3.jpg",
      isActive: true,
      showOnHomepage: true,
      createdAt: new Date(),
      updatedAt: new Date(),
      socialShare: {
        title: { text: "Clean Water Access in Balochistan" },
        description: { text: "Ensuring sustainable access to safe drinking water in remote communities. Help us bring clean water to every corner of Balochistan!" },
        hashtags: ["CleanWater", "WaterAccess", "SafeDrinkingWater", "BalochistanWater"],
        twitterHandle: "SECOPakistan",
        ogType: "article"
      },
      en: {
        title: { text: "Clean Water Initiative" },
        shortDescription: { text: "Providing access to clean water in remote areas" },
        fullDescription: { text: "Our Clean Water Initiative aims to ensure sustainable access to safe drinking water in remote communities of Balochistan. Through innovative water management systems and community participation, we're creating lasting solutions to water scarcity challenges." },
        category: { text: "Infrastructure" },
        duration: { text: "2.5 Years (2023-2025)" },
        coverage: { text: "12 Districts in Balochistan" },
        impactTitle: { text: "Program Impact" },
        iconStatsTitle: { text: "Key Statistics" },
        partnersTitle: { text: "Our Partners" },
        impact: [
          { id: "impact-1", label: { text: "Water Systems Installed" }, value: "100", suffix: "+", iconName: "FaWater" },
          { id: "impact-2", label: { text: "Communities Served" }, value: "50", suffix: "+", iconName: "FaHome" },
          { id: "impact-3", label: { text: "People with Clean Water" }, value: "10000", suffix: "+", iconName: "FaUsers" },
          { id: "impact-4", label: { text: "Water Quality Tests" }, value: "500", suffix: "+", iconName: "FaFlask" }
        ],
        iconStats: [
          { id: "stat-1", label: { text: "Water Plants" }, value: "25", iconName: "FaWater" },
          { id: "stat-2", label: { text: "Water Sources" }, value: "75", iconName: "FaTint" },
          { id: "stat-3", label: { text: "Community Teams" }, value: "40", iconName: "FaHandsHelping" },
          { id: "stat-4", label: { text: "Maintenance Points" }, value: "150", iconName: "FaTools" }
        ],
        partners: [
          { id: "partner-1", name: { text: "UNICEF Water Program" }, logo: "/images/unicef-logo.png" },
          { id: "partner-2", name: { text: "Water Aid" }, logo: "/images/wateraid-logo.png" },
          { id: "partner-3", name: { text: "Local Water Board" }, logo: "/images/lwb-logo.jpg" }
        ]
      },
      ur: {
        title: { text: "صاف پانی کا منصوبہ" },
        shortDescription: { text: "دور دراز علاقوں میں صاف پانی تک رسائی فراہم کرنا" },
        fullDescription: { text: "ہمارا صاف پانی کا منصوبہ بلوچستان کی دور دراز کمیونٹیز میں محفوظ پینے کے پانی تک پائیدار رسائی کو یقینی بنانے کا ہدف رکھتا ہے۔ جدید پانی کے انتظام کے نظام اور کمیونٹی کی شرکت کے ذریعے، ہم پانی کی کمی کے چیلنجز کے لیے پائیدار حل تیار کر رہے ہیں۔" },
        category: { text: "بنیادی ڈھانچہ" },
        duration: { text: "2.5 سال (2023-2025)" },
        coverage: { text: "بلوچستان کے 12 اضلاع" },
        impactTitle: { text: "پروگرام کا اثر" },
        iconStatsTitle: { text: "اہم اعداد و شمار" },
        partnersTitle: { text: "ہمارے شراکت دار" },
        impact: [
          { id: "impact-1", label: { text: "نصب کردہ پانی کے نظام" }, value: "100", suffix: "+", iconName: "FaWater" },
          { id: "impact-2", label: { text: "خدمت کی گئی کمیونٹیز" }, value: "50", suffix: "+", iconName: "FaHome" },
          { id: "impact-3", label: { text: "صاف پانی والے لوگ" }, value: "10000", suffix: "+", iconName: "FaUsers" },
          { id: "impact-4", label: { text: "پانی کے معیار کے ٹیسٹ" }, value: "500", suffix: "+", iconName: "FaFlask" }
        ],
        iconStats: [
          { id: "stat-1", label: { text: "پانی کے پلانٹس" }, value: "25", iconName: "FaWater" },
          { id: "stat-2", label: { text: "پانی کے ذرائع" }, value: "75", iconName: "FaTint" },
          { id: "stat-3", label: { text: "کمیونٹی ٹیمیں" }, value: "40", iconName: "FaHandsHelping" },
          { id: "stat-4", label: { text: "دیکھ بھال کے مقامات" }, value: "150", iconName: "FaTools" }
        ],
        partners: [
          { id: "partner-1", name: { text: "یونیسیف واٹر پروگرام" }, logo: "/images/unicef-logo.png" },
          { id: "partner-2", name: { text: "واٹر ایڈ" }, logo: "/images/wateraid-logo.png" },
          { id: "partner-3", name: { text: "مقامی واٹر بورڈ" }, logo: "/images/lwb-logo.jpg" }
        ]
      }
    },
    {
    id: "4",
    slug: "youth-education",
    featuredImage: "/images/youth-education-1.jpg",
    isActive: true,
    showOnHomepage: true,
    createdAt: new Date(),
    updatedAt: new Date(),
    socialShare: {
      title: { text: "Youth Education Program in Balochistan" },
      description: { text: "Providing quality education and skill development opportunities to young people. Join us in shaping the future of Balochistan's youth!" },
      hashtags: ["YouthEducation", "SkillDevelopment", "BalochistanYouth", "QualityEducation"],
      twitterHandle: "SECOPakistan",
      ogType: "article"
    },
    en: {
      title: { text: "Youth Education" },
      shortDescription: { text: "Creating opportunities through education" },
      fullDescription: { text: "The Youth Education program focuses on providing quality education and skill development opportunities to young people in Balochistan. We combine traditional education with modern learning techniques to prepare students for future challenges and empower them with the knowledge and skills needed for success." },
      category: { text: "Education" },
      duration: { text: "4 Years (2023-2027)" },
      coverage: { text: "15 Districts in Balochistan" },
      impactTitle: { text: "Program Impact" },
      iconStatsTitle: { text: "Key Statistics" },
      partnersTitle: { text: "Our Partners" },
      impact: [
        { id: "impact-1", label: { text: "Students Enrolled" }, value: "1000", suffix: "+", iconName: "FaGraduationCap" },
        { id: "impact-2", label: { text: "Schools Supported" }, value: "25", suffix: "+", iconName: "FaSchool" },
        { id: "impact-3", label: { text: "Teachers Trained" }, value: "150", suffix: "+", iconName: "FaChalkboardTeacher" },
        { id: "impact-4", label: { text: "Digital Labs Created" }, value: "10", suffix: "+", iconName: "FaLaptop" }
      ],
      iconStats: [
        { id: "stat-1", label: { text: "Learning Centers" }, value: "15", iconName: "FaGraduationCap" },
        { id: "stat-2", label: { text: "Computer Labs" }, value: "5", iconName: "FaLaptop" },
        { id: "stat-3", label: { text: "Books Distributed" }, value: "1000+", iconName: "FaBook" },
        { id: "stat-4", label: { text: "Expert Teachers" }, value: "50+", iconName: "FaChalkboardTeacher" }
      ],
      partners: [
        { id: "partner-1", name: { text: "Education Department" }, logo: "/images/edu-logo.jpg" },
        { id: "partner-2", name: { text: "British Council" }, logo: "/images/bc-logo.jpg" },
        { id: "partner-3", name: { text: "Local Education Trust" }, logo: "/images/let-logo.jpg" }
      ]
    },
    ur: {
      title: { text: "نوجوانوں کی تعلیم" },
      shortDescription: { text: "تعلیم کے ذریعے مواقع پیدا کرنا" },
      fullDescription: { text: "نوجوانوں کی تعلیم کا پروگرام بلوچستان کے نوجوانوں کو معیاری تعلیم اور مہارت کی ترقی کے مواقع فراہم کرنے پر توجہ مرکوز کرتا ہے۔ ہم روایتی تعلیم کو جدید تعلیمی تکنیکوں کے ساتھ ملاتے ہیں تاکہ طلباء کو مستقبل کے چیلنجز کے لیے تیار کیا جا سکے اور انہیں کامیابی کے لیے ضروری علم اور مہارت سے آراستہ کیا جا سکے۔" },
      category: { text: "تعلیم" },
      duration: { text: "4 سال (2023-2027)" },
      coverage: { text: "بلوچستان کے 15 اضلاع" },
      impactTitle: { text: "پروگرام کا اثر" },
      iconStatsTitle: { text: "اہم اعداد و شمار" },
      partnersTitle: { text: "ہمارے شراکت دار" },
      impact: [
        { id: "impact-1", label: { text: "داخل شدہ طلباء" }, value: "1000", suffix: "+", iconName: "FaGraduationCap" },
        { id: "impact-2", label: { text: "معاونت شدہ اسکول" }, value: "25", suffix: "+", iconName: "FaSchool" },
        { id: "impact-3", label: { text: "تربیت یافتہ اساتذہ" }, value: "150", suffix: "+", iconName: "FaChalkboardTeacher" },
        { id: "impact-4", label: { text: "قائم کردہ ڈیجیٹل لیبز" }, value: "10", suffix: "+", iconName: "FaLaptop" }
      ],
      iconStats: [
        { id: "stat-1", label: { text: "تعلیمی مراکز" }, value: "15", iconName: "FaGraduationCap" },
        { id: "stat-2", label: { text: "کمپیوٹر لیبز" }, value: "5", iconName: "FaLaptop" },
        { id: "stat-3", label: { text: "تقسیم کردہ کتابیں" }, value: "1000+", iconName: "FaBook" },
        { id: "stat-4", label: { text: "ماہر اساتذہ" }, value: "50+", iconName: "FaChalkboardTeacher" }
      ],
      partners: [
        { id: "partner-1", name: { text: "محکمہ تعلیم" }, logo: "/images/edu-logo.jpg" },
        { id: "partner-2", name: { text: "برٹش کونسل" }, logo: "/images/bc-logo.jpg" },
        { id: "partner-3", name: { text: "مقامی تعلیمی ٹرسٹ" }, logo: "/images/let-logo.jpg" }
      ]
    }
  }

  ],
};
