'use client';

import { usePathname } from 'next/navigation';
import { theme } from '@/config/theme';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { AdminSessionData, getAdminSession } from '@/app/admin/sharedData/adminSession';

export default function AdminHeader() {
  const pathname = usePathname();
  const [user, setUser] = useState<AdminSessionData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  // Generate breadcrumbs from pathname
  const breadcrumbs = pathname
    .split('/')
    .filter(Boolean)
    .map((part, index, array) => ({
      label: part.charAt(0).toUpperCase() + part.slice(1),
      href: '/' + array.slice(0, index + 1).join('/'),
      isLast: index === array.length - 1
    }));

  const refreshSession = () => {
    // Add 2-second delay before updating
    setTimeout(() => {
      const sessionData = getAdminSession();
      setUser(sessionData);
      setIsLoading(false);
    }, 1000);
  };

  // Check session on mount and listen for session changes
  useEffect(() => {
    // Initial check for existing session
    refreshSession();

    // Listen for session set event
    const handleSessionSet = () => {
      console.log('Session set event received');
      refreshSession();
    };

    window.addEventListener('adminSessionSet', handleSessionSet);

    // Cleanup
    return () => {
      window.removeEventListener('adminSessionSet', handleSessionSet);
    };
  }, []);

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
        {isLoading ? (
          <div className="text-sm" style={{ color: theme.colors.text.secondary }}>
            Loading...
          </div>
        ) : user ? (
          <div className="flex items-center">
            <div className="flex flex-col items-end mr-4">
              <Link href="/admin/profile" style={{ textDecoration: 'none' }}>
                <span 
                  className="text-sm font-medium"
                  style={{ color: theme.colors.text.primary }}
                >
                  {user.firstName} {user.lastName}
                </span>
              </Link>
              <Link href="/admin/profile" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '2px' }}>
                <span 
                  className="text-xs"
                  style={{ 
                    color: theme.colors.text.secondary,
                    textTransform: 'capitalize'
                  }}
                >
                  {user.role ? user.role.toLowerCase().replace('_', ' ') : ''}
                </span>
                <span 
                  className="text-xs"
                  style={{ 
                    color: theme.colors.primary,
                    marginLeft: '8px'
                  }}
                >
                  View Profile
                </span>
              </Link>
            </div>
          </div>
        ) : null}
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