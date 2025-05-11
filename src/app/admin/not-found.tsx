'use client';

import Link from 'next/link';
import { theme } from '@/config/theme';
import { usePathname } from 'next/navigation';

export default function AdminNotFound() {
  const pathname = usePathname();
  
  return (
    <div className="flex h-screen" style={{ backgroundColor: theme.colors.background.primary }}>
      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <main className="flex-1 flex items-center justify-center p-6">
          <div className="text-center">
            {/* Animated 404 Icon */}
            <div className="mb-8 relative">
              <div 
                className="text-9xl font-bold animate-bounce"
                style={{ color: theme.colors.primary }}
              >
                404
              </div>
              <div 
                className="absolute -top-4 right-0 text-6xl animate-spin-slow"
                style={{ color: theme.colors.secondary }}
              >
                ⚠
              </div>
            </div>

            {/* Error Message */}
            <h1 
              className="text-4xl font-bold mb-4"
              style={{ color: theme.colors.text.primary }}
            >
              {`${pathname?.split('/').pop()?.replace(/-/g, ' ').replace(/^\w/, c => c.toUpperCase()) || 'Page'} Not Found`}
            </h1>
            <p 
              className="text-xl mb-8 max-w-md mx-auto"
              style={{ color: theme.colors.text.secondary }}
            >
              The requested admin page {pathname?.split('/').pop()?.replace(/-/g, ' ') || 'page'} doesn&apos;t exist.
            </p>

            {/* Return Button */}
            <Link 
              href="/admin/dashboard"
              className="inline-flex items-center px-6 py-3 rounded-lg transition-colors duration-300"
              style={{ 
                backgroundColor: theme.colors.primary,
                color: theme.colors.text.light
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = theme.colors.primaryHover;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = theme.colors.primary;
              }}
            >
              Return to Dashboard
            </Link>
          </div>
        </main>
      </div>
    </div>
  );
}