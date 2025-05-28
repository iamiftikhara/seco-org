'use client';

import { theme } from '@/config/theme';

type PageErrorProps = {
  message?: string;
  onRetry?: () => void;
};

export default function PageError({ message = 'Something went wrong. Please try again later.', onRetry }: PageErrorProps) {
  const handleRefresh = () => {
    window.location.reload();
  };

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-white bg-opacity-90">
      <div className="animate-bounce text-red-500 mb-4">
        {/* You can replace this with an actual SVG icon or a component from an icon library */}
        <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      </div>
      <h2 className="text-2xl font-bold mb-4" style={{ color: theme.colors.primary }}>Error</h2>
      <p className="text-lg mb-6 text-center" style={{ color: theme.colors.primary }}>{message}</p>
      <div className="flex space-x-4">
        {onRetry && (
          <button
            onClick={onRetry}
            className="px-6 py-3 rounded-lg text-white font-semibold transition-colors duration-300"
            style={{ backgroundColor: theme.colors.primary}}
            onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = theme.colors.primaryHover;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = theme.colors.primary;
              }}
          >
            Retry
          </button>
        )}
        <button
          onClick={handleRefresh}
          className="px-6 py-3 rounded-lg text-white font-semibold transition-colors duration-300"
          style={{ backgroundColor: theme.colors.primary}}
            onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = theme.colors.primaryHover;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = theme.colors.primary;
              }}
        >
          Refresh Page
        </button>
      </div>
    </div>
  );
}