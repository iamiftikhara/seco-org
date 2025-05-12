'use client';

import { usePathname } from 'next/navigation';
import { theme } from '@/config/theme';
import { useEffect, useState } from 'react';
import { UserRole } from '@/types/user';

interface AdminSessionData {
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
}

export default function AdminHeader() {
  const pathname = usePathname();
  const [user, setUser] = useState<AdminSessionData | null>(null);
  
  useEffect(() => {
    const adminSession = sessionStorage.getItem('adminSession');
    if (adminSession) {
      try {
        const sessionData = JSON.parse(adminSession);
        setUser(sessionData);
      } catch (error) {
        console.error('Error parsing admin session:', error);
      }
    }
  }, []);

  // Generate breadcrumbs from pathname
  const breadcrumbs = pathname
    .split('/')
    .filter(Boolean)
    .map((part, index, array) => ({
      label: part.charAt(0).toUpperCase() + part.slice(1),
      href: '/' + array.slice(0, index + 1).join('/'),
      isLast: index === array.length - 1
    }));

  return (
    <header 
      className="h-16 shadow-sm flex items-center justify-between px-6"
      style={{ backgroundColor: theme.colors.background.naturalGray }}
    >
      <div className="flex flex-col">
        <h2 
          className="text-lg font-semibold"
          style={{ color: theme.colors.text.primary }}
        >
          {breadcrumbs[breadcrumbs.length - 1]?.label || 'Dashboard'}
        </h2>
        <div className="flex items-center text-sm mt-1">
          {breadcrumbs.map((crumb, index) => (
            <div key={crumb.href} className="flex items-center">
              {index > 0 && (
                <span 
                  className="mx-2"
                  style={{ color: theme.colors.text.secondary }}
                >
                  /
                </span>
              )}
              <span
                style={{ 
                  color: crumb.isLast 
                    ? theme.colors.primary 
                    : theme.colors.text.secondary
                }}
              >
                {crumb.label}
              </span>
            </div>
          ))}
        </div>
      </div>
      <div className="flex items-center gap-4">
        {user && (
          <div className="flex items-center">
            <div className="flex flex-col items-end mr-4">
              <span 
                className="text-sm font-medium"
                style={{ color: theme.colors.text.primary }}
              >
                {user.firstName} {user.lastName}
              </span>
              <span 
                className="text-xs"
                style={{ 
                  color: theme.colors.text.secondary,
                  textTransform: 'capitalize'
                }}
              >
                {user.role ? user.role.toLowerCase().replace('_', ' ') : ''}
                {user.permissions?.users && (
                  <span 
                    className="ml-2 px-2 py-0.5 rounded-full text-xs"
                    style={{ 
                      backgroundColor: theme.colors.status.success + '20',
                      color: theme.colors.status.success
                    }}
                  >
                    {Object.entries(user.permissions.users)
                      .filter(([_, value]) => value)
                      .map(([key]) => key)
                      .join(', ')}
                  </span>
                )}
              </span>
            </div>
          </div>
        )}
        <button 
          className="px-4 py-2 text-sm rounded transition-colors duration-200"
          style={{
            backgroundColor: theme.colors.primary,
            color: "white",
            fontFamily : theme.fonts.en.primary,
            cursor: "pointer",
          }}
          onClick={() => {
            sessionStorage.removeItem('isAdminLoggedIn');
            sessionStorage.removeItem('adminSession');
            window.location.href = '/admin/login';
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = theme.colors.primaryHover;
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = theme.colors.primary;
          }}
        >
          Logout
        </button>
      </div>
    </header>
  );
}