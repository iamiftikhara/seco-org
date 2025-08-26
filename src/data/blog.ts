export const blogData = {
  blogPage: {
    heroImage: "/images/blog-hero.jpg",
    title: { en: "Latest News & Updates", ur: "تازہ ترین خبریں اور اپڈیٹس" },
    description: { en: "Stay informed about our latest activities and community impact", ur: "ہمارے تازہ ترین کاموں اور کمیونٹی پر اثرات کے بارے میں باخبر رہیں" },
    pageTitle: { en: "Insights & Stories", ur: "دانش اور کہانیاں" },
    pageDescription: { en: "Explore our collection of stories, updates, and insights about our community initiatives and the impact we're making together.", ur: "ہماری کمیونٹی کی کوششوں اور ان کے اثرات کے بارے میں کہانیوں، اپڈیٹس اور بصیرتوں کا مجموعہ دریافت کریں۔" }
  },
  posts: [
    {
      id: "1",
      slug: "supporting-local-youth-education",
      author: "Jamaluddin",
      date: "2024-01-15",
      image: "/images/education.jpg",
      category: "Education",
      showOnHome: true,
      socialShare: {
        title: { en: "Youth Education Success: Making a Difference in Our Community - SECO Pakistan", ur: "نوجوانوں کی تعلیم میں کامیابی: ہماری کمیونٹی میں تبدیلی - سیکو پاکستان" },
        description: { en: "Discover how our youth education programs are transforming lives through mentorship and innovative learning approaches. Join us in building a brighter future!", ur: "جانیے کہ ہمارے نوجوانوں کی تعلیم کے پروگرام مینٹورشپ اور جدید تعلیمی طریقوں کے ذریعے زندگیوں میں کیسے تبدیلی لا رہے ہیں۔ بہتر مستقبل کی تعمیر میں ہمارا ساتھ دیں!" },
        hashtags: ["YouthEducation", "CommunityDevelopment", "Education", "SECOPakistan"],
        twitterHandle: "SECOPakistan",
        ogType: "article"
      },
      title: { en: "Supporting Local Youth Education in Our Neighborhood", ur: "ہمارے محلے میں نوجوانوں کی تعلیم کی حمایت" },
      excerpt: { en: "How our programs are making a difference in young lives through education and mentorship.", ur: "ہمارے پروگرام تعلیم اور رہنمائی کے ذریعے نوجوانوں کی زندگیوں میں کیسے تبدیلی لا رہے ہیں" },
      content: [
        {
          type: 'content-block',
          text: { en: 'Our youth education initiative has reached new heights this year, touching the lives of over 200 students in our local community...', ur: 'اس سال ہماری نوجوانوں کی تعلیم کی پیش رفت نے نئی بلندیوں کو چھوا ہے، ہماری مقامی کمیونٹی کے 200 سے زائد طلباء کی زندگیوں کو چھوتے ہوئے...' },
          image: { src: '/images/youth-education-1.jpg', alt: { en: 'Students participating in after-school program', ur: 'طلباء بعد از اسکول پروگرام میں حصہ لیتے ہوئے' }, position: 'right' }
        },
        { type: 'quote', content: { en: 'Education is the most powerful weapon which you can use to change the world.', ur: 'تعلیم سب سے طاقتور ہتھیار ہے جس سے آپ دنیا کو بدل سکتے ہیں' } }
      ]
    },
    {
      id: "2",
      slug: "building-sustainable-communities",
      author: "Jamaluddin",
      date: "2024-01-10",
      image: "/images/old-man.jpg",
      category: "Sustainability",
      showOnHome: true,
      socialShare: {
        title: { en: "Building Sustainable Communities: A Green Future Together - SECO Pakistan", ur: "پائیدار کمیونٹیز کی تعمیر: ایک سبز مستقبل ساتھ مل کر - سیکو پاکستان" },
        description: { en: "Learn about our groundbreaking initiatives combining environmental consciousness with community development. Join our mission for sustainable neighborhoods!", ur: "ہمارے انقلابی اقدامات کے بارے میں جانیں جو ماحول دوست شعور کو کمیونٹی ڈویلپمنٹ کے ساتھ جوڑتے ہیں۔ پائیدار محلوں کے مشن میں شامل ہوں!" },
        hashtags: ["SustainableCommunities", "GreenFuture", "CommunityGardens", "SECOPakistan"],
        twitterHandle: "SECOPakistan",
        ogType: "article"
      },
      title: { en: "Building Sustainable Communities Together", ur: "پائیدار کمیونٹیز کی تعمیر مل کر" },
      excerpt: { en: "Exploring innovative approaches to create environmentally conscious and socially connected neighborhoods.", ur: "ماحول دوست اور سماجی طور پر منسلک محلوں کی تشکیل کے لیے جدید طریقوں کی تلاش" },
      content: [
        { type: 'content-block', text: { en: 'In our pursuit of sustainable community development, we have implemented several groundbreaking initiatives that combine environmental consciousness with social connectivity...', ur: 'ہماری پائیدار کمیونٹی ڈویلپمنٹ کی کوششوں میں، ہم نے کئی انقلابی اقدامات نافذ کیے ہیں جو ماحولیاتی شعور کو سماجی رابطہ کے ساتھ جوڑتے ہیں...' }, image: { src: '/images/Basic-TN-scaled.jpg', alt: { en: 'Community garden project', ur: 'کمیونٹی گارڈن پراجیکٹ' }, position: 'above' } },
        { type: 'content-block', text: { en: 'Our community gardens have become focal points for neighborhood interaction, education, and sustainable food production...', ur: 'ہمارے کمیونٹی گارڈن محلے کی باہمی گفتگو، تعلیم اور پائیدار خوراک کی پیداوار کے مراکز بن چکے ہیں...' }, image: { src: '/images/agriculture-hero.jpg', alt: { en: 'Community members working in garden', ur: 'کمیونٹی ممبران باغ میں کام کرتے ہوئے' }, position: 'full' } },
        { type: 'quote', content: { en: 'The future of our planet depends on the actions we take today in our communities.', ur: 'ہماری زمین کا مستقبل ان اقدامات پر منحصر ہے جو ہم آج اپنی کمیونٹیز میں کرتے ہیں۔' } }
      ]
    },
    {
      id: "3",
      slug: "urdu-education-success-story",
      author: "Jamaluddin",
      date: "2024-01-20",
      image: "/images/education-urdu.jpg",
      category: "Education",
      showOnHome: true,
      socialShare: {
        title: { en: "Education Success: Youth Progress Story - SECO Pakistan", ur: "تعلیمی کامیابی: ہمارے نوجوانوں کی ترقی کی داستان - سیکو پاکستان" },
        description: { en: "Learn how our education programs are positively transforming young lives.", ur: "جانیں کہ ہمارے تعلیمی پروگرام کیسے نوجوان طلباء کی زندگیوں میں مثبت تبدیلی لا رہے ہیں۔" },
        hashtags: ["نوجوان_تعلیم", "کمیونٹی_ترقی", "تعلیم", "سیکو_پاکستان"],
        twitterHandle: "SECOPakistan",
        ogType: "article"
      },
      title: { en: "Educational Progress: Youth Success Story", ur: "تعلیمی ترقی: ہمارے نوجوانوں کی کامیابی کی کہانی" },
      excerpt: { en: "How our programs are creating positive change in students' lives", ur: "ہمارے تعلیمی پروگرام کیسے نوجوان طلباء کی زندگیوں میں مثبت تبدیلی لا رہے ہیں" },
      content: [
        { type: 'content-block', text: { en: 'Our education program is reaching new heights this year, creating learning environments beyond traditional classrooms...', ur: 'ہمارا تعلیمی پروگرام اس سال نئی بلندیوں کو چھو رہا ہے۔ ہمارے بعد از اسکول پروگراموں کے ذریعے، ہم نے ایک ایسا ماحول تخلیق کیا ہے جہاں سیکھنے کا عمل روایتی کلاس روم سے آگے بڑھتا ہے۔' }, image: { src: '/images/youth-education-2.webp', alt: { en: 'Students engaged in educational activities', ur: 'طلباء تعلیمی سرگرمیوں میں مصروف' }, position: 'left' } },
        { type: 'quote', content: { en: 'Education is the most powerful weapon to change the world.', ur: "تعلیم وہ طاقتور ہتھیار ہے جس سے آپ دنیا کو بدل سکتے ہیں" } }
      ]
    },
    {
      id: "4",
      slug: "women-digital-skills-training",
      author: "Jamaluddin",
      date: "2024-01-25",
      image: "/images/women-empowerment.jpg",
      category: "Technology",
      showOnHome: true,
      socialShare: {
        title: { en: "Digital Skills Training: Empowering Women in Technology - SECO Pakistan", ur: "ڈیجیٹل اسکلز ٹریننگ: خواتین کو ٹیکنالوجی میں بااختیار بنانا - سیکو پاکستان" },
        description: { en: "Discover how our digital skills program is creating new opportunities for women in technology. Join us in bridging the digital divide!", ur: "جانیں کہ ہمارا ڈیجیٹل اسکلز پروگرام ٹیکنالوجی میں خواتین کے لیے نئے مواقع کیسے پیدا کر رہا ہے۔ ڈیجیٹل تقسیم کو ختم کرنے میں ہمارا ساتھ دیں!" },
        hashtags: ["WomenInTech", "DigitalSkills", "WomenEmpowerment", "SECOPakistan"],
        twitterHandle: "SECOPakistan",
        ogType: "article"
      },
      title: { en: "Empowering Women Through Digital Skills Training", ur: "ڈیجیٹل اسکلز ٹریننگ کے ذریعے خواتین کو بااختیار بنانا" },
      excerpt: { en: "Our innovative program is bridging the digital divide and creating new opportunities for women in technology.", ur: "ہمارا جدید پروگرام ڈیجیٹل تقسیم کو ختم کر رہا ہے اور خواتین کے لیے نئے مواقع پیدا کر رہا ہے" },
      content: [
        { type: 'content-block', text: { en: 'Our digital skills training program has successfully empowered over 100 women this year, providing them with essential technology skills and career opportunities. Through hands-on workshops, mentorship sessions, and real-world projects, participants have gained confidence and expertise in various digital domains...', ur: 'ہمارے ڈیجیٹل اسکلز ٹریننگ پروگرام نے اس سال 100 سے زائد خواتین کو بااختیار بنایا ہے، انہیں ضروری ٹیکنالوجی مہارتیں اور کیریئر کے مواقع فراہم کیے ہیں...' }, image: { src: '/images/women-tech.jpg', alt: { en: 'Women participating in digital skills workshop', ur: 'خواتین ڈیجیٹل اسکلز ورکشاپ میں حصہ لیتے ہوئے' }, position: 'above' } },
        { type: 'content-block', text: { en: 'The program focuses on practical skills including web development, digital marketing, and data analytics. Many graduates have already secured positions in leading tech companies or started their own digital ventures...', ur: 'پروگرام میں عملی مہارتوں پر توجہ دی جاتی ہے جن میں ویب ڈویلپمنٹ، ڈیجیٹل مارکیٹنگ اور ڈیٹا اینالیٹکس شامل ہیں...' }, image: { src: '/images/women-coding.jpg', alt: { en: 'Women coding together', ur: 'خواتین مل کر کوڈنگ کرتی ہوئی' }, position: 'right' } },
        { type: 'quote', content: { en: 'Technology is a powerful tool for change, and when women are empowered with digital skills, entire communities prosper.', ur: 'ٹیکنالوجی تبدیلی کا ایک طاقتور ذریعہ ہے، اور جب خواتین ڈیجیٹل مہارتوں سے بااختیار ہوتی ہیں تو پوری کمیونٹیز ترقی کرتی ہیں۔' } }
      ]
    }
  ]
};