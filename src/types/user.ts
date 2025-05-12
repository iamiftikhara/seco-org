import { theme } from '@/config/theme';

// User status enum
export enum UserStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  SUSPENDED = 'suspended',
  PENDING = 'pending'
}

// User role enum
export enum UserRole {
  SUPER_ADMIN = 'super_admin',
  ADMIN = 'admin',
  MODERATOR = 'moderator',
  USER = 'user'
}

// Content types with language support
export interface ContentText {
  content: {
    text: string;
    language: 'en' | 'ur';  // Updated to match project's bilingual nature
  };
}

export interface ContentImage {
  src: string;
  alt: string;
  position: 'above' | 'full' | 'left' | 'right' | 'below';  // Added more position options
}

export interface ContentBlock {
  type: 'content-block';
  text: ContentText;
  image?: ContentImage;  // Made image optional
}

export interface Quote {
  type: 'quote';
  content: {
    text: string;
    language: 'en' | 'ur';  // Updated language support
  };
}

export type ContentItem = ContentBlock | Quote;

// Base permissions interface
export interface Permissions {
  read: boolean;
  write: boolean;
  update: boolean;
  delete: boolean;
}

// Module specific permissions
export interface ModulePermissions {
  users: Permissions;
  content?: Permissions;
  settings?: Permissions;
  reports?: Permissions;
  programs?: Permissions;  // Added programs module
  projects?: Permissions;  // Added projects module
  events?: Permissions;    // Added events module
  blog?: Permissions;      // Added blog module
}

// User profile interface
export interface UserProfile {
  avatar?: string;
  bio?: string;
  description?: string;
  phone?: string;
  address?: string;
  timezone?: string;
  language?: 'en' | 'ur';  // Simplified to match project's languages
  contact?: {
    email?: string;
    website?: string;
    social?: {
      linkedin?: string;
      twitter?: string;
      github?: string;
      facebook?: string;
    };
    workPhone?: string;
    mobile?: string;
    fax?: string;
  };
  company?: {
    name?: string;
    position?: string;
    department?: string;
    location?: string;     // Added location field
  };
  notifications?: {
    email: boolean;
    push: boolean;
    sms: boolean;
    whatsapp?: boolean;    // Added WhatsApp notification option
  };
  preferences?: {
    theme?: 'light' | 'dark' | 'system';
    emailFrequency?: 'daily' | 'weekly' | 'monthly' | 'never';
    twoFactorEnabled?: boolean;
    language?: 'en' | 'ur';  // Added language preference
  };
}

// Base user interface
export interface BaseUser {
  id: string;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  status: UserStatus;
  createdAt: Date;
  updatedAt: Date;
  lastLogin?: Date;
  isActive?: boolean;      // Made optional as it's not used in the data
}

// Admin user interface
export interface AdminUser extends BaseUser {
  role: UserRole;
  permissions: ModulePermissions;
  profile: UserProfile;
  content?: ContentItem[];
  password?: string;      // Added for authentication
}

// Regular user interface
export interface RegularUser extends BaseUser {
  role: UserRole.USER;
  profile: Omit<UserProfile, 'notifications'>;
  preferredLanguage: 'en' | 'ur';  // Added preferred language
}

// User session interface
export interface UserSession {
  userId: string;
  username: string;
  role: UserRole;
  permissions?: ModulePermissions;
  lastActivity: Date;
  expiresAt: Date;
  language: 'en' | 'ur';  // Added session language
}

// User creation interface
export interface CreateUserDTO {
  username: string;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  profile?: Partial<UserProfile>;
}

// User update interface
export interface UpdateUserDTO {
  email?: string;
  firstName?: string;
  lastName?: string;
  status?: UserStatus;
  role?: UserRole;
  permissions?: Partial<ModulePermissions>;
  profile?: Partial<UserProfile>;
}

// Password change interface
export interface ChangePasswordDTO {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

// User filter interface
export interface UserFilter {
  search?: string;
  role?: UserRole;
  status?: UserStatus;
  startDate?: Date;
  endDate?: Date;
  page?: number;
  limit?: number;
  sortBy?: keyof BaseUser;
  sortOrder?: 'asc' | 'desc';
}