import {Events} from "@/types/events";

export const events: Events = {
  eventsPage: {
    en: {
      title: "All Events",
      description: "Explore all our events and activities making an impact in our communities",
    },
    ur: {
      title: "تمام پروگرامز",
      description: "ہماری کمیونٹیز میں اثر انداز ہونے والے تمام پروگرامز اور سرگرمیاں دیکھیں",
    },
    hero: {
      image: "/images/gallery11.jpeg",
      alt: "Our Events",
    },
  },
  homePage: {
    en: {
      title: "Our Events",
      viewAll: "View All Events",
      switchLanguage: "اردو",
    },
    ur: {
      title: "ہماری تقریبات",
      viewAll: "تمام تقریبات دیکھیں",
      switchLanguage: "English",
    },
  },
  eventsList: [
    // English Events
    {
      id: "1",
      title: {text: "Annual Stakeholders Meeting 2023", language: "en"},
      slug: "annual-stakeholders-meeting-2023",
      shortDescription: {text: "Review of achievements and future planning", language: "en"},
      fullDescription: {
        text: "The annual stakeholders meeting concluded successfully with significant achievements and important decisions for future initiatives.",
        language: "en",
      },
      content: {
        text: `
          <div>
            <h2>Annual Stakeholders Meeting 2023 - Event Highlights</h2>
            <p>The annual stakeholders meeting concluded successfully with significant achievements and important decisions for future initiatives.</p>
            
            <h3>Key Outcomes:</h3>
            <ul>
              <li>Approved 5 new community development projects</li>
              <li>Established partnerships with 3 international organizations</li>
              <li>Launched new youth empowerment program</li>
              <li>Set sustainable development goals for 2024</li>
            </ul>
          </div>
        `,
        language: "en",
      },
      featuredImage: "/images/gallery5.jpg",
      date: "2023-12-15",
      status: "past",
      location: {text: "SECO Main Office, Quetta", language: "en"},
      outcome: {
        text: "Successfully concluded with new initiatives approved for 2024. Over 100 stakeholders participated and approved the strategic plan for 2024.",
        language: "en",
      },
      language: "en",
      showOnHome: true,
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
      socialShare: {
        title: {text: "Annual Stakeholders Meeting 2023 - SECO Pakistan", language: "en"},
        description: {text: "Join us for our annual stakeholders meeting where we review achievements and plan future initiatives for community development in Balochistan.", language: "en"},
        hashtags: ["SECOPakistan", "CommunityDevelopment", "Balochistan", "Stakeholders2023"],
        twitterHandle: "SECOPakistan",
        ogType: "event"
      },
    },

    // Urdu version of the same event
    {
      id: "1-ur",
      title: {text: "سالانہ اسٹیک ہولڈرز میٹنگ 2023", language: "ur"},
      slug: "annual-stakeholders-meeting-2023-ur",
      shortDescription: {text: "کامیابیوں کا جائزہ اور مستقبل کی منصوبہ بندی", language: "ur"},
      fullDescription: {
        text: "سالانہ اسٹیک ہولڈرز میٹنگ اہم کامیابیوں اور مستقبل کے اقدامات کے لیے اہم فیصلوں کے ساتھ کامیابی سے اختتام پذیر ہوئی۔",
        language: "ur",
      },
      content: {
        text: `
          <div>
            <h2>سالانہ اسٹیک ہولڈرز میٹنگ 2023 - پروگرام کی جھلکیاں</h2>
            <p>سالانہ اسٹیک ہولڈرز میٹنگ اہم کامیابیوں اور مستقبل کے اقدامات کے لیے اہم فیصلوں کے ساتھ کامیابی سے اختتام پذیر ہوئی۔</p>
            
            <h3>اہم نتائج:</h3>
            <ul>
              <li>5 نئے کمیونٹی ڈویلپمنٹ پروجیکٹس کی منظوری</li>
              <li>3 بین الاقوامی تنظیموں کے ساتھ شراکت داری قائم</li>
              <li>نوجوانوں کے لیے نیا پروگرام شروع</li>
              <li>2024 کے لیے پائیدار ترقی کے اہداف طے</li>
            </ul>
          </div>
        `,
        language: "ur",
      },
      featuredImage: "/images/gallery5.jpg",
      date: "2023-12-15",
      status: "past",
      location: {text: "سیکو مرکزی دفتر، کوئٹہ", language: "ur"},
      outcome: {
        text: "2024 کے لیے نئے اقدامات کی منظوری کے ساتھ کامیابی سے اختتام۔ 100 سے زیادہ اسٹیک ہولڈرز نے شرکت کی اور 2024 کے حکمت عملی منصوبے کی منظوری دی۔",
        language: "ur",
      },
      language: "ur",
      showOnHome: true,
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
      socialShare: {
        title: {text: "سالانہ اسٹیک ہولڈرز میٹنگ 2023 - سیکو پاکستان", language: "ur"},
        description: {text: "ہماری سالانہ اسٹیک ہولڈرز میٹنگ میں شامل ہوں جہاں ہم کامیابیوں کا جائزہ لیتے ہیں اور بلوچستان میں کمیونٹی کی ترقی کے لیے مستقبل کے اقدامات کی منصوبہ بندی کرتے ہیں۔", language: "ur"},
        hashtags: ["سیکو_پاکستان", "کمیونٹی_ترقی", "بلوچستان", "اسٹیک_ہولڈرز_2023"],
        twitterHandle: "SECOPakistan",
        ogType: "event"
      },
    },
    {
      id: "2",
      title: {text: "Agricultural Workshop 2023", language: "en"},
      slug: "agricultural-workshop-2023",
      shortDescription: {text: "Sustainable farming practices training", language: "en"},
      fullDescription: {
        text: "The workshop provided hands-on training in sustainable farming practices and modern agricultural techniques.",
        language: "en",
      },
      content: {
        text: `
          <div>
            <h2>Agricultural Workshop 2023 - Results</h2>
            <p>The workshop provided hands-on training in sustainable farming practices and modern agricultural techniques.</p>
            
            <h3>Workshop Achievements:</h3>
            <ul>
              <li>Trained 50 local farmers</li>
              <li>Implemented 3 demonstration plots</li>
              <li>Distributed modern farming tools</li>
              <li>Established farmer support network</li>
            </ul>
          </div>
        `,
        language: "en",
      },
      featuredImage: "/images/project1.jpeg",
      date: "2023-11-20",
      status: "past",
      location: {text: "Agricultural Training Center, Quetta", language: "en"},
      outcome: {
        text: "Successfully trained 50 local farmers in modern agricultural techniques. Distributed farming equipment to participants.",
        language: "en",
      },
      language: "en",
      showOnHome: true,
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
      socialShare: {
        title: {text: "Agricultural Workshop 2023 - Sustainable Farming Practices", language: "en"},
        description: {text: "Learn sustainable farming practices and modern agricultural techniques. Join our workshop for hands-on training and networking with agricultural experts.", language: "en"},
        hashtags: ["SustainableAgriculture", "FarmerTraining", "ModernFarming", "Balochistan"],
        twitterHandle: "SECOPakistan",
        ogType: "event"
      },
    },
    {
      id: "2-ur",
      title: {text: "زرعی ورکشاپ 2023", language: "ur"},
      slug: "agricultural-workshop-2023-ur",
      shortDescription: {text: "پائیدار زراعت کی مشقوں کی تربیت", language: "ur"},
      fullDescription: {
        text: "ورکشاپ نے پائیدار زراعت کی مشقوں اور جدید زرعی تکنیکوں میں عملی تربیت فراہم کی۔",
        language: "ur",
      },
      content: {
        text: `
          <div>
            <h2>زرعی ورکشاپ 2023 - نتائج</h2>
            <p>ورکشاپ نے پائیدار زراعت کی مشقوں اور جدید زرعی تکنیکوں میں عملی تربیت فراہم کی۔</p>
            
            <h3>ورکشاپ کی کامیابیاں:</h3>
            <ul>
              <li>50 مقامی کسانوں کو تربیت دی گئی</li>
              <li>3 مظاہرہ پلاٹس نافذ کیے گئے</li>
              <li>جدید زرعی آلات تقسیم کیے گئے</li>
              <li>کسان سپورٹ نیٹ ورک قائم کیا گیا</li>
            </ul>
          </div>
        `,
        language: "ur",
      },
      featuredImage: "/images/project1.jpeg",
      date: "2023-11-20",
      status: "past",
      location: {text: "زرعی تربیتی مرکز، کوئٹہ", language: "ur"},
      outcome: {
        text: "50 مقامی کسانوں کو جدید زرعی تکنیکوں میں کامیابی سے تربیت دی گئی۔ شرکاء کو زرعی آلات تقسیم کیے گئے۔",
        language: "ur",
      },
      language: "ur",
      showOnHome: true,
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
      socialShare: {
        title: {text: "زرعی ورکشاپ 2023 - پائیدار زراعت کے طریقے", language: "ur"},
        description: {text: "پائیدار زراعت کے طریقے اور جدید زرعی تکنیک سیکھیں۔ عملی تربیت اور زرعی ماہرین کے ساتھ نیٹ ورکنگ کے لیے ہماری ورکشاپ میں شامل ہوں۔", language: "ur"},
        hashtags: ["پائیدار_زراعت", "کسان_تربیت", "جدید_زراعت", "بلوچستان"],
        twitterHandle: "SECOPakistan",
        ogType: "event"
      },
    },
    {
      id: "3",
      title: {text: "Youth Leadership Summit 2024", language: "en"},
      slug: "youth-leadership-summit-2024",
      shortDescription: {text: "Empowering young leaders for community development", language: "en"},
      fullDescription: {
        text: "Join us for an inspiring gathering of young leaders from across Balochistan to shape the future of community development.",
        language: "en",
      },
      content: {
        text: `
          <div>
            <h2>Youth Leadership Summit 2024</h2>
            <p>Join us for an inspiring gathering of young leaders from across Balochistan to shape the future of community development.</p>
            
            <h3>Summit Agenda:</h3>
            <ul>
              <li>Leadership workshops by international speakers</li>
              <li>Project planning sessions</li>
              <li>Networking opportunities</li>
              <li>Mentorship program launch</li>
            </ul>
          </div>
        `,
        language: "en",
      },
      featuredImage: "/images/community-hero.jpeg",
      date: "2024-02-15",
      time: {text: "9:00 AM - 5:00 PM", language: "en"},
      status: "upcoming",
      location: {text: "Balochistan University", language: "en"},
      language: "en",
      showOnHome: true,
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
      socialShare: {
        title: {text: "Youth Leadership Summit 2024 - Shaping Future Leaders", language: "en"},
        description: {text: "Join young leaders from across Balochistan for an inspiring summit focused on community development and leadership skills. Be part of shaping our future!", language: "en"},
        hashtags: ["YouthLeadership", "FutureLeaders", "BalochistanYouth", "CommunityDevelopment"],
        twitterHandle: "SECOPakistan",
        ogType: "event"
      },
    },
    {
      id: "3-ur",
      title: {text: "نوجوان قیادت کی کانفرنس 2024", language: "ur"},
      slug: "youth-leadership-summit-2024-ur",
      shortDescription: {text: "کمیونٹی کی ترقی کے لیے نوجوان رہنماؤں کو بااختیار بنانا", language: "ur"},
      fullDescription: {
        text: "کمیونٹی کی ترقی کے مستقبل کو شکل دینے کے لیے بلوچستان بھر سے نوجوان رہنماؤں کے متاثر کن اجتماع میں شامل ہوں۔",
        language: "ur",
      },
      content: {
        text: `
          <div>
            <h2>نوجوان قیادت کی کانفرنس 2024</h2>
            <p>کمیونٹی کی ترقی کے مستقبل کو شکل دینے کے لیے بلوچستان بھر سے نوجوان رہنماؤں کے متاثر کن اجتماع میں شامل ہوں۔</p>
            
            <h3>کانفرنس کا ایجنڈا:</h3>
            <ul>
              <li>بین الاقوامی مقررین کی جانب سے قیادت کی ورکشاپس</li>
              <li>منصوبہ بندی کے سیشنز</li>
              <li>نیٹ ورکنگ کے مواقع</li>
              <li>مینٹرشپ پروگرام کا آغاز</li>
            </ul>
          </div>
        `,
        language: "ur",
      },
      featuredImage: "/images/community-hero.jpeg",
      date: "2024-02-15",
      time: {text: "صبح 9:00 - شام 5:00", language: "ur"},
      status: "upcoming",
      location: {text: "بلوچستان یونیورسٹی", language: "ur"},
      language: "ur",
      showOnHome: true,
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
      socialShare: {
        title: {text: "نوجوان قیادت کی کانفرنس 2024 - مستقبل کے رہنماؤں کی تشکیل", language: "ur"},
        description: {text: "کمیونٹی کی ترقی اور قیادتی صلاحیتوں پر مرکوز متاثر کن کانفرنس کے لیے بلوچستان بھر سے نوجوان رہنماؤں کے ساتھ شامل ہوں۔ ہمارے مستقبل کی تشکیل کا حصہ بنیں!", language: "ur"},
        hashtags: ["نوجوان_قیادت", "مستقبل_کے_رہنما", "بلوچستان_نوجوان", "کمیونٹی_ترقی"],
        twitterHandle: "SECOPakistan",
        ogType: "event"
      },
    },

    {
      id: "4",
      title: {text: "Community Innovation Forum 2024", language: "en"},
      slug: "community-innovation-forum-2024",
      shortDescription: {text: "Technology and innovation for community development", language: "en"},
      fullDescription: {
        text: "Explore the latest technological innovations and their applications in community development.",
        language: "en",
      },
      content: {
        text: `
          <div>
            <h2>Community Innovation Forum 2024</h2>
            <p>Explore the latest technological innovations and their applications in community development.</p>
            
            <h3>Forum Highlights:</h3>
            <ul>
              <li>Tech innovation showcase</li>
              <li>Digital literacy workshops</li>
              <li>Smart community solutions</li>
              <li>Innovation competition</li>
            </ul>
          </div>
        `,
        language: "en",
      },
      featuredImage: "/images/gallery7.jpeg",
      date: "2024-03-20",
      time: {text: "10:00 AM - 4:00 PM", language: "en"},
      status: "upcoming",
      location: {text: "SECO Innovation Hub, Quetta", language: "en"},
      language: "en",
      showOnHome: true,
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
      socialShare: {
        title: {text: "Community Innovation Forum 2024 - Tech Solutions for Development", language: "en"},
        description: {text: "Discover innovative technological solutions for community development. Join us to explore smart community solutions and digital literacy initiatives!", language: "en"},
        hashtags: ["CommunityInnovation", "TechForGood", "SmartCommunities", "DigitalLiteracy"],
        twitterHandle: "SECOPakistan",
        ogType: "event"
      },
    },
    {
      id: "4-ur",
      title: {text: "کمیونٹی جدت فورم 2024", language: "ur"},
      slug: "community-innovation-forum-2024-ur",
      shortDescription: {text: "کمیونٹی کی ترقی کے لیے ٹیکنالوجی اور جدت", language: "ur"},
      fullDescription: {
        text: "کمیونٹی کی ترقی میں جدید ترین ٹیکنالوجی جدت اور ان کے استعمال کو دریافت کریں۔",
        language: "ur",
      },
      content: {
        text: `
          <div>
            <h2>کمیونٹی جدت فورم 2024</h2>
            <p>کمیونٹی کی ترقی میں جدید ترین ٹیکنالوجی جدت اور ان کے استعمال کو دریافت کریں۔</p>
            
            <h3>فورم کی خصوصیات:</h3>
            <ul>
              <li>ٹیک جدت کی نمائش</li>
              <li>ڈیجیٹل خواندگی ورکشاپس</li>
              <li>سمارٹ کمیونٹی حل</li>
              <li>جدت کا مقابلہ</li>
            </ul>
          </div>
        `,
        language: "ur",
      },
      featuredImage: "/images/gallery7.jpeg",
      date: "2024-03-20",
      time: {text: "صبح 10:00 - شام 4:00", language: "ur"},
      status: "upcoming",
      location: {text: "سیکو انوویشن ہب، کوئٹہ", language: "ur"},
      language: "ur",
      showOnHome: true,
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
      socialShare: {
        title: {text: "کمیونٹی جدت فورم 2024 - ترقی کے لیے ٹیکنالوجی حل", language: "ur"},
        description: {text: "کمیونٹی کی ترقی کے لیے جدید ٹیکنالوجی حل دریافت کریں۔ سمارٹ کمیونٹی حل اور ڈیجیٹل خواندگی کے اقدامات کی تلاش کے لیے ہمارے ساتھ شامل ہوں!", language: "ur"},
        hashtags: ["کمیونٹی_جدت", "ٹیک_فار_گڈ", "سمارٹ_کمیونٹیز", "ڈیجیٹل_خواندگی"],
        twitterHandle: "SECOPakistan",
        ogType: "event"
      },
    },
    {
      id: "5",
      title: {text: "Women Empowerment Workshop", language: "en"},
      slug: "women-empowerment-workshop",
      shortDescription: {text: "Skill development and entrepreneurship training for women in rural communities", language: "en"},
      fullDescription: {
        text: "Join us for an intensive workshop focused on empowering women through skill development and entrepreneurship training.",
        language: "en",
      },
      content: {
        text: `
          <div>
            <h2>Women Empowerment Workshop</h2>
            <p>Join us for an intensive workshop focused on empowering women through skill development and entrepreneurship training.</p>
            
            <h3>Workshop Focus Areas:</h3>
            <ul>
              <li>Business planning and management</li>
              <li>Digital literacy and online marketing</li>
              <li>Financial management skills</li>
              <li>Networking and mentorship opportunities</li>
            </ul>
          </div>
        `,
        language: "en",
      },
      featuredImage: "/images/gallery12.jpeg",
      date: "2024-04-10",
      time: {text: "10:00 AM - 3:00 PM", language: "en"},
      status: "upcoming",
      location: {text: "SECO Community Center, Quetta", language: "en"},
      language: "en",
      showOnHome: false,
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
      socialShare: {
        title: {text: "Women Empowerment Workshop - Skills for Success", language: "en"},
        description: {text: "Join our intensive workshop for women entrepreneurs. Learn business skills, digital marketing, and financial management. Empower yourself for success!", language: "en"},
        hashtags: ["WomenEmpowerment", "SkillDevelopment", "WomenEntrepreneurs", "DigitalSkills"],
        twitterHandle: "SECOPakistan",
        ogType: "event"
      },
    },
    {
      id: "5-ur",
      title: {text: "خواتین کی ترقی کی ورکشاپ", language: "ur"},
      slug: "women-empowerment-workshop-ur",
      shortDescription: {text: "دیہی کمیونٹیز میں خواتین کے لیے مہارت کی ترقی اور کاروباری تربیت", language: "ur"},
      fullDescription: {
        text: "مہارت کی ترقی اور کاروباری تربیت کے ذریعے خواتین کو بااختیار بنانے پر مرکوز گہری ورکشاپ میں شامل ہوں۔",
        language: "ur",
      },
      content: {
        text: `
          <div>
            <h2>خواتین کی ترقی کی ورکشاپ</h2>
            <p>مہارت کی ترقی اور کاروباری تربیت کے ذریعے خواتین کو بااختیار بنانے پر مرکوز گہری ورکشاپ میں شامل ہوں۔</p>
            
            <h3>ورکشاپ کے مرکزی شعبے:</h3>
            <ul>
              <li>کاروباری منصوبہ بندی اور انتظام</li>
              <li>ڈیجیٹل خواندگی اور آن لائن مارکیٹنگ</li>
              <li>مالی انتظام کی مہارتیں</li>
              <li>نیٹ ورکنگ اور مینٹرشپ کے مواقع</li>
            </ul>
          </div>
        `,
        language: "ur",
      },
      featuredImage: "/images/gallery12.jpeg",
      date: "2024-04-10",
      time: {text: "صبح 10:00 - دوپہر 3:00", language: "ur"},
      status: "upcoming",
      location: {text: "سیکو کمیونٹی سنٹر، کوئٹہ", language: "ur"},
      language: "ur",
      showOnHome: false,
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
      socialShare: {
        title: {text: "خواتین کی ترقی کی ورکشاپ - کامیابی کے لیے مہارتیں", language: "ur"},
        description: {text: "خواتین کاروباری افراد کے لیے ہماری گہری ورکشاپ میں شامل ہوں۔ کاروباری مہارتیں، ڈیجیٹل مارکیٹنگ، اور مالی انتظام سیکھیں۔ کامیابی کے لیے خود کو بااختیار بنائیں!", language: "ur"},
        hashtags: ["خواتین_کی_ترقی", "مہارت_کی_ترقی", "خواتین_کاروبار", "ڈیجیٹل_مہارتیں"],
        twitterHandle: "SECOPakistan",
        ogType: "event"
      },
    },
    {
      id: "6",
      title: {text: "Environmental Conservation Drive", language: "en"},
      slug: "environmental-conservation-drive",
      shortDescription: {text: "Community-led initiative for local environmental protection and awareness", language: "en"},
      fullDescription: {
        text: "A community initiative to protect our local environment and raise awareness about sustainable practices.",
        language: "en",
      },
      content: {
        text: `
          <div>
            <h2>Environmental Conservation Drive</h2>
            <p>A community initiative to protect our local environment and raise awareness about sustainable practices.</p>
            
            <h3>Event Activities:</h3>
            <ul>
              <li>Tree plantation drive</li>
              <li>Waste management workshop</li>
              <li>Environmental awareness sessions</li>
              <li>Community cleanup campaign</li>
            </ul>
          </div>
        `,
        language: "en",
      },
      featuredImage: "/images/hero6.jpg",
      date: "2024-04-22",
      time: {text: "8:00 AM - 4:00 PM", language: "en"},
      status: "upcoming",
      location: {text: "Various Locations in Quetta", language: "en"},
      language: "en",
      showOnHome: true,
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
      socialShare: {
        title: {text: "Environmental Conservation Drive - Protecting Our Future", language: "en"},
        description: {text: "Join our community initiative for environmental protection. Participate in tree plantation, waste management, and awareness sessions. Together for a greener Balochistan!", language: "en"},
        hashtags: ["EnvironmentalConservation", "GreenBalochistan", "CleanEnvironment", "Sustainability"],
        twitterHandle: "SECOPakistan",
        ogType: "event"
      },
    },
    {
      id: "6-ur",
      title: {text: "ماحولیاتی تحفظ مہم", language: "ur"},
      slug: "environmental-conservation-drive-ur",
      shortDescription: {text: "مقامی ماحول کے تحفظ اور آگاہی کے لیے کمیونٹی کی قیادت میں اقدام", language: "ur"},
      fullDescription: {
        text: "ہمارے مقامی ماحول کی حفاظت اور پائیدار طریقوں کے بارے میں آگاہی بڑھانے کے لیے کمیونٹی کا اقدام۔",
        language: "ur",
      },
      content: {
        text: `
          <div>
            <h2>ماحولیاتی تحفظ مہم</h2>
            <p>ہمارے مقامی ماحول کی حفاظت اور پائیدار طریقوں کے بارے میں آگاہی بڑھانے کے لیے کمیونٹی کا اقدام۔</p>
            
            <h3>پروگرام کی سرگرمیاں:</h3>
            <ul>
              <li>درخت لگانے کی مہم</li>
              <li>فضلہ انتظام ورکشاپ</li>
              <li>ماحولیاتی آگاہی کے سیشنز</li>
              <li>کمیونٹی صفائی مہم</li>
            </ul>
          </div>
        `,
        language: "ur",
      },
      featuredImage: "/images/hero6.jpg",
      date: "2024-04-22",
      time: {text: "صبح 8:00 - شام 4:00", language: "ur"},
      status: "upcoming",
      location: {text: "کوئٹہ کے مختلف مقامات", language: "ur"},
      language: "ur",
      showOnHome: true,
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
      socialShare: {
        title: {text: "ماحولیاتی تحفظ مہم - ہمارے مستقبل کی حفاظت", language: "ur"},
        description: {text: "ماحولیاتی تحفظ کے لیے ہماری کمیونٹی مہم میں شامل ہوں۔ درخت لگانے، فضلے کے انتظام، اور آگاہی کے سیشنز میں حصہ لیں۔ سرسبز بلوچستان کے لیے ایک ساتھ!", language: "ur"},
        hashtags: ["ماحولیاتی_تحفظ", "سرسبز_بلوچستان", "صاف_ماحول", "پائیداری"],
        twitterHandle: "SECOPakistan",
        ogType: "event"
      },
    },
  ],
};
