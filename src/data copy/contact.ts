import { ContactData } from '@/types/contact';

export const contactData: ContactData = {
  title: {
    en: "Get in Touch",
    ur: "رابطہ کریں"
  },
  subtitle: {
    en: "Have questions? We'd love to hear from you.",
    ur: "کوئی سوال ہے؟ ہم آپ سے سننا پسند کریں گے۔"
  },
  contactInfo: {
    phone: {
      label: {
        en: "Phone",
        ur: "فون"
      },
      value: "+1 234 567 890",
      url: "tel:+1234567890",
      icon: "FaPhone"
    },
    whatsapp: {
      label: {
        en: "WhatsApp",
        ur: "واٹس ایپ"
      },
      value: "+1 234 567 890",
      url: "https://wa.me/+1234567890",
      icon: "FaWhatsapp"
    },
    email: {
      label: {
        en: "Email",
        ur: "ای میل"
      },
      value: "contact@seco.org",
      url: "mailto:contact@seco.org",
      icon: "MdEmail"
    },
    address: {
      label: {
        en: "Address",
        ur: "پتہ"
      },
      value: {
        en: "123 Business Avenue, New York, NY 10001",
        ur: "123 بزنس ایونیو، نیویارک، این وائی 10001"
      },
      url: "https://maps.google.com/?q=123+Business+Avenue,+New+York,+NY+10001",
      icon: "FaMapMarkerAlt"
    }
  },
  form: {
    title: {
      en: "Send us a message",
      ur: "ہمیں پیغام بھیجیں"
    },
    name: {
      label: {
        en: "Name",
        ur: "نام"
      },
      placeholder: {
        en: "Enter your name",
        ur: "اپنا نام درج کریں"
      }
    },
    email: {
      label: {
        en: "Email",
        ur: "ای میل"
      },
      placeholder: {
        en: "Enter your email",
        ur: "اپنا ای میل درج کریں"
      }
    },
    message: {
      label: {
        en: "Message",
        ur: "پیغام"
      },
      placeholder: {
        en: "Write your message here...",
        ur: "اپنا پیغام یہاں لکھیں..."
      }
    },
    submitButton: {
      en: "Send Message",
      ur: "پیغام بھیجیں"
    },
    successMessage: {
      en: "Message sent successfully!",
      ur: "پیغام کامیابی سے بھیج دیا گیا۔"
    },
    errorMessage: {
      en: "Failed to send message. Please try again later.",
      ur: "پیغام بھیجنے میں ناکام۔ براہ کرم بعد میں دوبارہ کوشش کریں۔"
    },
    loadingMessage: {
      en: "Sending...",
      ur: "بھیج رہا ہے..."
    }
  },
  socialMedia: {
    title: {
      en: "Follow Us",
      ur: "ہمیں فالو کریں"
    },
    platforms: [
      {
        label: {
          en: "Facebook",
          ur: "فیس بک"
        },
        url: "https://facebook.com/seco",
        icon: "FaFacebook"
      },
      {
        label: {
          en: "Twitter",
          ur: "ٹویٹر"
        },
        url: "https://twitter.com/seco",
        icon: "FaTwitter"
      },
      {
        label: {
          en: "Instagram",
          ur: "انسٹاگرام"
        },
        url: "https://instagram.com/seco",
        icon: "FaInstagram"
      },
      {
        label: {
          en: "LinkedIn",
          ur: "لنکڈان"
        },
        url: "https://linkedin.com/company/seco",
        icon: "FaLinkedin"
      }
    ]
  },
  offices: {
    title: {
      en: "Our Offices",
      ur: "ہمارے دفاتر"
    },
    locations: [
      {
        title: {
          en: "District Office Pishin",
          ur: "ضلع دفتر پشین"
        },
        address: {
          en: "Near Deputy Commissioner Pishin Rest House, District Pishin",
          ur: "نزد ڈپٹی کمشنر پشین ریسٹ ہاؤس، ضلع پشین"
        },
        incharge: {
          name: {
            en: "Jamal ud din",
            ur: "جمال الدین"
          },
          designation: {
            en: "District Program Manager",
            ur: "ضلع پروگرام منیجر"
          }
        },
        contact: {
          phone: "(+92) 82-6440121",
          email: "jamaluddinpishin@gmail.com"
        },
        icons: {
          location: "FaMapMarkerAlt",
          person: "FaUser",
          phone: "FaPhone",
          email: "MdEmail"
        }
      }
    ]
  }
};