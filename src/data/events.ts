import {Events} from "@/types/events";

export const events: Events = {
  eventsPage: {
    image: "/images/gallery11.jpeg",
    title: {
      en: { text: "All Events" },
      ur: { text: "تمام پروگرامز" }
    },
    description: {
      en: { text: "Explore all our events and activities making an impact in our communities" },
      ur: { text: "ہماری کمیونٹیز میں اثر انداز ہونے والے تمام پروگرامز اور سرگرمیاں دیکھیں" }
    }
  },
  eventsList: [
    {
      id: "1",
      slug: "annual-stakeholders-meeting-2023",
      featuredImage: "/images/gallery5.jpg",
      date: "2023-12-15",
      status: "past",
      showOnHome: true,
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
      socialShare: {
        title: { text: "Annual Stakeholders Meeting 2023 - SECO Pakistan" },
        description: { text: "Join us for our annual stakeholders meeting where we review achievements and plan future initiatives for community development in Balochistan." },
        hashtags: ["SECOPakistan", "CommunityDevelopment", "Balochistan", "Stakeholders2023"],
        twitterHandle: "SECOPakistan",
        ogType: "event"
      },
      en: {
        title: { text: "Annual Stakeholders Meeting 2023" },
        shortDescription: { text: "Review of achievements and future planning" },
        fullDescription: { text: "The annual stakeholders meeting concluded successfully with significant achievements and important decisions for future initiatives." },
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
          `
        },
        location: { text: "SECO Main Office, Quetta" },
        outcome: { text: "Successfully concluded with new initiatives approved for 2024. Over 100 stakeholders participated and approved the strategic plan for 2024." }
      },
      ur: {
        title: { text: "سالانہ اسٹیک ہولڈرز میٹنگ 2023" },
        shortDescription: { text: "کامیابیوں کا جائزہ اور مستقبل کی منصوبہ بندی" },
        fullDescription: { text: "سالانہ اسٹیک ہولڈرز میٹنگ اہم کامیابیوں اور مستقبل کے اقدامات کے لیے اہم فیصلوں کے ساتھ کامیابی سے اختتام پذیر ہوئی۔" },
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
          `
        },
        location: { text: "سیکو مرکزی دفتر، کوئٹہ" },
        outcome: { text: "2024 کے لیے نئے اقدامات کی منظوری کے ساتھ کامیابی سے اختتام۔ 100 سے زیادہ اسٹیک ہولڈرز نے شرکت کی اور 2024 کے حکمت عملی منصوبے کی منظوری دی۔" }
      }
    },
    {
      id: "2",
      slug: "agricultural-workshop-2023",
      featuredImage: "/images/project1.jpeg",
      date: "2023-11-20",
      status: "past",
      showOnHome: true,
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
      socialShare: {
        title: { text: "Agricultural Workshop 2023 - Sustainable Farming Practices" },
        description: { text: "Learn sustainable farming practices and modern agricultural techniques. Join our workshop for hands-on training and networking with agricultural experts." },
        hashtags: ["SustainableAgriculture", "FarmerTraining", "ModernFarming", "Balochistan"],
        twitterHandle: "SECOPakistan",
        ogType: "event"
      },
      en: {
        title: { text: "Agricultural Workshop 2023" },
        shortDescription: { text: "Sustainable farming practices training" },
        fullDescription: { text: "The workshop provided hands-on training in sustainable farming practices and modern agricultural techniques." },
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
          `
        },
        location: { text: "Agricultural Training Center, Quetta" },
        outcome: { text: "Successfully trained 50 local farmers in modern agricultural techniques. Distributed farming equipment to participants." }
      },
      ur: {
        title: { text: "زرعی ورکشاپ 2023" },
        shortDescription: { text: "پائیدار زراعت کی مشقوں کی تربیت" },
        fullDescription: { text: "ورکشاپ نے پائیدار زراعت کی مشقوں اور جدید زرعی تکنیکوں میں عملی تربیت فراہم کی۔" },
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
          `
        },
        location: { text: "زرعی تربیتی مرکز، کوئٹہ" },
        outcome: { text: "50 مقامی کسانوں کو جدید زرعی تکنیکوں میں کامیابی سے تربیت دی گئی۔ شرکاء کو زرعی آلات تقسیم کیے گئے۔" }
      }
    },
    {
      id: "3",
      slug: "youth-leadership-summit-2024",
      featuredImage: "/images/community-hero.jpeg",
      date: "2024-02-15",
      status: "upcoming",
      showOnHome: true,
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
      socialShare: {
        title: { text: "Youth Leadership Summit 2024 - Shaping Future Leaders" },
        description: { text: "Join young leaders from across Balochistan for an inspiring summit focused on community development and leadership skills. Be part of shaping our future!" },
        hashtags: ["YouthLeadership", "FutureLeaders", "BalochistanYouth", "CommunityDevelopment"],
        twitterHandle: "SECOPakistan",
        ogType: "event"
      },
      en: {
        title: { text: "Youth Leadership Summit 2024" },
        shortDescription: { text: "Empowering young leaders for community development" },
        fullDescription: { text: "Join us for an inspiring gathering of young leaders from across Balochistan to shape the future of community development." },
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
          `
        },
        location: { text: "Balochistan University" },
        time: { text: "9:00 AM - 5:00 PM" }
      },
      ur: {
        title: { text: "نوجوان قیادت کی کانفرنس 2024" },
        shortDescription: { text: "کمیونٹی کی ترقی کے لیے نوجوان رہنماؤں کو بااختیار بنانا" },
        fullDescription: { text: "کمیونٹی کی ترقی کے مستقبل کو شکل دینے کے لیے بلوچستان بھر سے نوجوان رہنماؤں کے متاثر کن اجتماع میں شامل ہوں۔" },
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
          `
        },
        location: { text: "بلوچستان یونیورسٹی" },
        time: { text: "صبح 9:00 - شام 5:00" }
      }
    },

    {
      id: "4",
      slug: "community-innovation-forum-2024",
      featuredImage: "/images/gallery7.jpeg",
      date: "2024-03-20",
      status: "upcoming",
      showOnHome: true,
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
      socialShare: {
        title: { text: "Community Innovation Forum 2024 - Tech Solutions for Development" },
        description: { text: "Discover innovative technological solutions for community development. Join us to explore smart community solutions and digital literacy initiatives!" },
        hashtags: ["CommunityInnovation", "TechForGood", "SmartCommunities", "DigitalLiteracy"],
        twitterHandle: "SECOPakistan",
        ogType: "event"
      },
      en: {
        title: { text: "Community Innovation Forum 2024" },
        shortDescription: { text: "Technology and innovation for community development" },
        fullDescription: { text: "Explore the latest technological innovations and their applications in community development." },
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
          `
        },
        location: { text: "SECO Innovation Hub, Quetta" },
        time: { text: "10:00 AM - 4:00 PM" }
      },
      ur: {
        title: { text: "کمیونٹی جدت فورم 2024" },
        shortDescription: { text: "کمیونٹی کی ترقی کے لیے ٹیکنالوجی اور جدت" },
        fullDescription: { text: "کمیونٹی کی ترقی میں جدید ترین ٹیکنالوجی جدت اور ان کے استعمال کو دریافت کریں۔" },
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
          `
        },
        location: { text: "سیکو انوویشن ہب، کوئٹہ" },
        time: { text: "صبح 10:00 - شام 4:00" }
      }
    },
    {
      id: "5",
      slug: "women-empowerment-workshop",
      featuredImage: "/images/gallery12.jpeg",
      date: "2024-04-10",
      status: "upcoming",
      showOnHome: false,
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
      socialShare: {
        title: { text: "Women Empowerment Workshop - Skills for Success" },
        description: { text: "Join our intensive workshop for women entrepreneurs. Learn business skills, digital marketing, and financial management. Empower yourself for success!" },
        hashtags: ["WomenEmpowerment", "SkillDevelopment", "WomenEntrepreneurs", "DigitalSkills"],
        twitterHandle: "SECOPakistan",
        ogType: "event"
      },
      en: {
        title: { text: "Women Empowerment Workshop" },
        shortDescription: { text: "Skill development and entrepreneurship training for women in rural communities" },
        fullDescription: { text: "Join us for an intensive workshop focused on empowering women through skill development and entrepreneurship training." },
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
          `
        },
        location: { text: "SECO Community Center, Quetta" },
        time: { text: "10:00 AM - 3:00 PM" }
      },
      ur: {
        title: { text: "خواتین کی ترقی کی ورکشاپ" },
        shortDescription: { text: "دیہی کمیونٹیز میں خواتین کے لیے مہارت کی ترقی اور کاروباری تربیت" },
        fullDescription: { text: "مہارت کی ترقی اور کاروباری تربیت کے ذریعے خواتین کو بااختیار بنانے پر مرکوز گہری ورکشاپ میں شامل ہوں۔" },
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
          `
        },
        location: { text: "سیکو کمیونٹی سنٹر، کوئٹہ" },
        time: { text: "صبح 10:00 - دوپہر 3:00" }
      }
    },
    {
      id: "6",
      slug: "environmental-conservation-drive",
      featuredImage: "/images/hero6.jpg",
      date: "2024-04-22",
      status: "upcoming",
      showOnHome: true,
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
      socialShare: {
        title: { text: "Environmental Conservation Drive - Protecting Our Future" },
        description: { text: "Join our community initiative for environmental protection. Participate in tree plantation, waste management, and awareness sessions. Together for a greener Balochistan!" },
        hashtags: ["EnvironmentalConservation", "GreenBalochistan", "CleanEnvironment", "Sustainability"],
        twitterHandle: "SECOPakistan",
        ogType: "event"
      },
      en: {
        title: { text: "Environmental Conservation Drive" },
        shortDescription: { text: "Community-led initiative for local environmental protection and awareness" },
        fullDescription: { text: "A community initiative to protect our local environment and raise awareness about sustainable practices." },
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
          `
        },
        location: { text: "Various Locations in Quetta" },
        time: { text: "8:00 AM - 4:00 PM" }
      },
      ur: {
        title: { text: "ماحولیاتی تحفظ مہم" },
        shortDescription: { text: "مقامی ماحول کے تحفظ اور آگاہی کے لیے کمیونٹی کی قیادت میں اقدام" },
        fullDescription: { text: "ہمارے مقامی ماحول کی حفاظت اور پائیدار طریقوں کے بارے میں آگاہی بڑھانے کے لیے کمیونٹی کا اقدام۔" },
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
          `
        },
        location: { text: "کوئٹہ کے مختلف مقامات" },
        time: { text: "صبح 8:00 - شام 4:00" }
      }
    }
  ],
};
