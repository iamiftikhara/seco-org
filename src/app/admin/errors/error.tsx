'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { theme } from '@/config/theme';
import { usePathname } from 'next/navigation';

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function AdminError({ error, reset }: ErrorProps) {
  const pathname = usePathname();
  
  useEffect(() => {
    // Log the error to an error reporting service
    console.error('Admin Error:', error);
  }, [error]);

  return (
    <div className="flex h-screen" style={{ backgroundColor: theme.colors.background.primary }}>
      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <main className="flex-1 flex items-center justify-center p-6">
          <div className="text-center">
            {/* Animated Error Icon */}
            <div className="mb-8 relative">
              <div 
                className="text-9xl font-bold animate-bounce"
                style={{ color: theme.colors.status.error }}
              >
                !
              </div>
            </div>

            {/* Error Message */}
            <h1 
              className="text-4xl font-bold mb-4"
              style={{ color: theme.colors.text.primary }}
            >
              {`Error in ${pathname?.split('/').pop()?.replace(/-/g, ' ').replace(/^\w/, c => c.toUpperCase()) || 'Page'}`}
            </h1>
            <p 
              className="text-xl mb-8 max-w-md mx-auto"
              style={{ color: theme.colors.text.secondary }}
            >
              {error.message || 'An unexpected error occurred'}
            </p>

            {/* Action Buttons */}
            <div className="flex gap-4 justify-center">
              <button
                onClick={reset}
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
                Try Again
              </button>

              <Link 
                href="/admin/dashboard"
                className="inline-flex items-center px-6 py-3 rounded-lg transition-colors duration-300"
                style={{ 
                  backgroundColor: theme.colors.secondary,
                  color: theme.colors.text.light
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = theme.colors.secondaryHover;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = theme.colors.secondary;
                }}
              >
                Return to Dashboard
              </Link>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
} 