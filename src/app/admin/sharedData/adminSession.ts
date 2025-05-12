import { UserRole } from '@/types/user';

export interface AdminSessionData {
  userId: string;
  username: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  permissions?: {
    users: {
      read: boolean;
      write: boolean;
      update: boolean;
      delete: boolean;
    };
  };
  lastActivity: string;
  language?: string;
  email: string;
}

// Helper function to get session data
export const getAdminSession = (): AdminSessionData | null => {
  if (typeof window !== 'undefined') {
    const adminSession = sessionStorage.getItem('adminSession');
    if (adminSession) {
      try {
        return JSON.parse(adminSession);
      } catch (error) {
        console.error("Error parsing admin session:", error);
      }
    }
  }
  return null;
};

// Helper function to check user permissions
export const checkPermission = (
  action: 'read' | 'write' | 'update' | 'delete',
  resource: 'users'
): boolean => {
  const session = getAdminSession();
  if (!session || !session.permissions) return false;
  return session.permissions[resource]?.[action] || false;
}; 