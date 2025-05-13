import { theme } from "@/config/theme";
import { UserStatus, UserRole, ModulePermissions, UserProfile, AdminUser as TypedAdminUser } from '@/types/user';

export interface AdminUser extends TypedAdminUser {
  password: string;
}

export const adminUsers: AdminUser[] = [
  {
    id: "1",
    username: "admin",
    password: "$2b$10$X/k1IOsS26dqjDe9PES/9.Byv/DtBL70kqhxoLVEOCEduPqKL030S",  // hash for "admin123" with higher cost factor
    firstName: "Admin",
    lastName: "User",
    email: theme.organization.contact.email,
    role: UserRole.SUPER_ADMIN,  // Changed from string to enum
    status: UserStatus.ACTIVE,   // Changed from string to enum
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
    profile: {
      avatar: theme.organization.logo.default,
      contact: {
        email: "admin@seco.org",
        website: "https://seco.org",
        social: {
          linkedin: "https://linkedin.com/company/seco-pakistan",
          twitter: "https://twitter.com/SECOPakistan",
          github: "https://github.com/seco-pakistan",
          facebook: "https://facebook.com/SECOPakistan"
        },
        workPhone: "+92-123-4567890",
        mobile: "+92-321-1234567",
        fax: "+92-123-4567891"
      },
      preferences: {
        theme: 'light',
        twoFactorEnabled: false,
        emailFrequency: 'daily'
      }
    },
    permissions: {
      users: {
        read: true,
        write: true,
        update: true,
        delete: true
      }
    },
    createdAt: new Date("2024-01-01"),
    updatedAt: new Date("2024-01-01")
  }
];
