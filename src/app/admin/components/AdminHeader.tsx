'use client';

import { usePathname } from 'next/navigation';
import { theme } from '@/config/theme';

export default function AdminHeader() {
  const pathname = usePathname();
  
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
    </header>
  );
}