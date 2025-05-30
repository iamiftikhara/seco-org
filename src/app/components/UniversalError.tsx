'use client';

import { useState } from 'react';
import { theme } from '@/config/theme';

interface UniversalErrorProps {
  error: string;
  onRetry: () => Promise<void>;
  sectionName?: string;
  className?: string;
}

export default function UniversalError({ 
  error, 
  onRetry, 
  sectionName = 'section',
  className = ''
}: UniversalErrorProps) {
  const [isRetrying, setIsRetrying] = useState(false);

  const handleRetry = async () => {
    try {
      setIsRetrying(true);
      await onRetry();
    } catch (err) {
      console.error('Error retrying:', err);
    } finally {
      setIsRetrying(false);
    }
  };

  return (
    <div 
      className={`flex flex-col items-center justify-center p-8 rounded-lg ${className}`}
      style={{ backgroundColor: theme.colors.background.secondary }}
    >
      <div className="text-center mb-6">
        <svg 
          className="w-16 h-16 mx-auto mb-4" 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
          style={{ color: theme.colors.status.error }}
        >
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth={2} 
            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" 
          />
        </svg>
        <h3 
          className="text-xl font-semibold mb-2"
          style={{ color: theme.colors.text.primary }}
        >
          {`Error Loading ${sectionName}`}
        </h3>
        <p 
          className="text-sm mb-4"
          style={{ color: theme.colors.text.secondary }}
        >
          {error}
        </p>
      </div>
      
      <button
        onClick={handleRetry}
        disabled={isRetrying}
        className={`
          px-6 py-2 rounded-full transition-all duration-300
          flex items-center gap-2
          ${isRetrying ? 'opacity-50 cursor-not-allowed' : 'hover:opacity-90'}
        `}
        style={{
          backgroundColor: theme.colors.secondary,
          color: theme.colors.primary
        }}
      >
        {isRetrying ? (
          <>
            <svg 
              className="animate-spin h-5 w-5" 
              xmlns="http://www.w3.org/2000/svg" 
              fill="none" 
              viewBox="0 0 24 24"
            >
              <circle 
                className="opacity-25" 
                cx="12" 
                cy="12" 
                r="10" 
                stroke="currentColor" 
                strokeWidth="4"
              />
              <path 
                className="opacity-75" 
                fill="currentColor" 
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
            Retrying...
          </>
        ) : (
          <>
            <svg 
              className="w-5 h-5" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" 
              />
            </svg>
            Retry
          </>
        )}
      </button>
    </div>
  );
} 