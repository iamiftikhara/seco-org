export interface TextContent {
  text: string;
  language: 'en' | 'ur';
}

export interface BlogSection {
  type: 'content-block';
  text: {
    content: TextContent;
  };
  image?: {
    src: string;
    alt: string;
    position: 'left' | 'right' | 'full' | 'above' | 'below';
  };
}

export interface ContentSection {
  type: 'quote';
  content: TextContent;
}

export type Section = BlogSection | ContentSection;

interface SocialShare {
  title: TextContent;
  description: TextContent;
  hashtags: string[];
  twitterHandle: string;
  ogType: string;
}

export interface BlogPost {
  id: string;
  title: TextContent;
  excerpt: TextContent;
  content: Section[];
  author: string;
  date: string;
  image: string;
  category: string;
  showOnHome: boolean;
  slug: string;
  socialShare: SocialShare;
}

export const blogData = {
  pageTitle: { text: "Insights & Stories", language: "en" },
  pageDescription: { 
    text: "Explore our collection of stories, updates, and insights about our community initiatives and the impact we're making together.",
    language: "en"
  },
  heroImage: "/images/blog-hero.jpg",
  title: { text: "Latest News & Updates", language: "en" },
  description: { 
    text: "Stay informed about our latest activities and community impact",
    language: "en"
  },
  posts: [
    {
      id: "1",
      title: {
        text: "Supporting Local Youth Education in Our Neighborhood",
        language: "en"
      },
      excerpt: {
        text: "How our programs are making a difference in young lives through education and mentorship.",
        language: "en"
      },
      content: [
        {
          type: 'content-block',
          text: {
            content: {
              text: 'Our youth education initiative has reached new heights this year, touching the lives of over 200 students in our local community...',
              language: "en"
            }
          },
          image: {
            src: '/images/youth-education-1.jpg',
            alt: 'Students participating in after-school program',
            position: 'right'
          }
        },
        {
          type: 'quote',
          content: {
            text: 'Education is the most powerful weapon which you can use to change the world.',
            language: "en"
          }
        }
      ],
      author: "Jamaluddin",
      date: "2024-01-15",
      image: "/images/education.jpg",
      category: "Education",
      showOnHome: true,
      slug: "supporting-local-youth-education",
      socialShare: {
        title: {
          text: "Youth Education Success: Making a Difference in Our Community - SECO Pakistan",
          language: "en"
        },
        description: {
          text: "Discover how our youth education programs are transforming lives through mentorship and innovative learning approaches. Join us in building a brighter future!",
          language: "en"
        },
        hashtags: ["YouthEducation", "CommunityDevelopment", "Education", "SECOPakistan"],
        twitterHandle: "SECOPakistan",
        ogType: "article"
      }
    },
    {
      id: "2",
      title: {
        text: "Building Sustainable Communities Together",
        language: "en"
      },
      excerpt: {
        text: "Exploring innovative approaches to create environmentally conscious and socially connected neighborhoods.",
        language: "en"
      },
      content: [
        {
          type: 'content-block',
          text: {
            content: {
              text: 'In our pursuit of sustainable community development, we have implemented several groundbreaking initiatives that combine environmental consciousness with social connectivity...',
              language: "en"
            }
          },
          image: {
            src: '/images/Basic-TN-scaled.jpg',
            alt: 'Community garden project',
            position: 'above'
          }
        },
        {
          type: 'content-block',
          text: {
            content: {
              text: 'Our community gardens have become focal points for neighborhood interaction, education, and sustainable food production...',
              language: "en"
            }
          },
          image: {
            src: '/images/agriculture-hero.jpg',
            alt: 'Community members working in garden',
            position: 'full'
          }
        },
        {
          type: 'quote',
          content: {
            text: 'The future of our planet depends on the actions we take today in our communities.',
            language: "en"
          }
        }
      ],
      author: "Jamaluddin",
      date: "2024-01-10",
      image: "/images/old-man.jpg",
      category: "Sustainability",
      showOnHome: true,
      slug: "building-sustainable-communities",
      socialShare: {
        title: {
          text: "Building Sustainable Communities: A Green Future Together - SECO Pakistan",
          language: "en"
        },
        description: {
          text: "Learn about our groundbreaking initiatives combining environmental consciousness with community development. Join our mission for sustainable neighborhoods!",
          language: "en"
        },
        hashtags: ["SustainableCommunities", "GreenFuture", "CommunityGardens", "SECOPakistan"],
        twitterHandle: "SECOPakistan",
        ogType: "article"
      }
    },
    {
      id: "3",
      title: {
        text: "تعلیمی ترقی: ہمارے نوجوانوں کی کامیابی کی کہانی",
        language: "ur"
      },
      excerpt: {
        text: "ہمارے تعلیمی پروگرام کیسے نوجوان طلباء کی زندگیوں میں مثبت تبدیلی لا رہے ہیں",
        language: "ur"
      },
      content: [
        {
          type: 'content-block',
          text: {
            content: {
              text: "ہمارا تعلیمی پروگرام اس سال نئی بلندیوں کو چھو رہا ہے۔ ہمارے بعد از اسکول پروگراموں کے ذریعے، ہم نے ایک ایسا ماحول تخلیق کیا ہے جہاں سیکھنے کا عمل روایتی کلاس روم سے آگے بڑھتا ہے۔ طلباء نے بنیادی مضامین میں نمایاں بہتری دکھائی ہے، خاص طور پر ریاضی اور انگریزی میں۔ ہمارے پروگرام کی کامیابی خاص طور پر اس بات سے ظاہر ہوتی ہے کہ یہ مختلف پس منظر کے طلباء کے لیے تعلیمی خلا کو پر کرنے میں مدد گار ثابت ہوا ہے۔",
              language: "ur"
            }
          },
          image: {
            src: '/images/youth-education-2.webp',
            alt: 'طلباء تعلیمی سرگرمیوں میں مصروف',
            position: 'left'
          }
        },
        {
          type: 'quote',
          content: {
            text: "تعلیم وہ طاقتور ہتھیار ہے جس سے آپ دنیا کو بدل سکتے ہیں",
            language: "ur"
          }
        }
      ],
      author: "Jamaluddin",
      date: "2024-01-20",
      image: "/images/education-urdu.jpg",
      category: "Education",
      showOnHome: true,
      slug: "urdu-education-success-story",
      socialShare: {
        title: {
          text: "تعلیمی کامیابی: ہمارے نوجوانوں کی ترقی کی داستان - سیکو پاکستان",
          language: "ur"
        },
        description: {
          text: "جانیں کہ ہمارے تعلیمی پروگرام کیسے نوجوان طلباء کی زندگیوں میں مثبت تبدیلی لا رہے ہیں۔ روشن مستقبل کی تعمیر میں ہمارے ساتھ شامل ہوں!",
          language: "ur"
        },
        hashtags: ["نوجوان_تعلیم", "کمیونٹی_ترقی", "تعلیم", "سیکو_پاکستان"],
        twitterHandle: "SECOPakistan",
        ogType: "article"
      }
    },
    {
      id: "4",
      title: {
        text: "Empowering Women Through Digital Skills Training",
        language: "en"
      },
      excerpt: {
        text: "Our innovative program is bridging the digital divide and creating new opportunities for women in technology.",
        language: "en"
      },
      content: [
        {
          type: 'content-block',
          text: {
            content: {
              text: 'Our digital skills training program has successfully empowered over 100 women this year, providing them with essential technology skills and career opportunities. Through hands-on workshops, mentorship sessions, and real-world projects, participants have gained confidence and expertise in various digital domains...',
              language: "en"
            }
          },
          image: {
            src: '/images/women-tech.jpg',
            alt: 'Women participating in digital skills workshop',
            position: 'above'
          }
        },
        {
          type: 'content-block',
          text: {
            content: {
              text: 'The program focuses on practical skills including web development, digital marketing, and data analytics. Many graduates have already secured positions in leading tech companies or started their own digital ventures...',
              language: "en"
            }
          },
          image: {
            src: '/images/women-coding.jpg',
            alt: 'Women coding together',
            position: 'right'
          }
        },
        {
          type: 'quote',
          content: {
            text: 'Technology is a powerful tool for change, and when women are empowered with digital skills, entire communities prosper.',
            language: "en"
          }
        }
      ],
      author: "Jamaluddin",
      date: "2024-01-25",
      image: "/images/women-empowerment.jpg",
      category: "Technology",
      showOnHome: true,
      slug: "women-digital-skills-training",
      socialShare: {
        title: {
          text: "Digital Skills Training: Empowering Women in Technology - SECO Pakistan",
          language: "en"
        },
        description: {
          text: "Discover how our digital skills program is creating new opportunities for women in technology. Join us in bridging the digital divide!",
          language: "en"
        },
        hashtags: ["WomenInTech", "DigitalSkills", "WomenEmpowerment", "SECOPakistan"],
        twitterHandle: "SECOPakistan",
        ogType: "article"
      }
    }
  ]
};