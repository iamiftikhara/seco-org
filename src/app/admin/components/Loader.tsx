'use client';

import { theme } from '@/config/theme';

interface LoaderProps {
  isVisible: boolean;
  text: string;
}

export default function Loader({ isVisible, text }: LoaderProps) {
  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div 
        className="bg-white p-6 rounded-lg shadow-lg flex flex-col items-center gap-4 w-96 h-50 justify-center"
        style={{ backgroundColor: theme.colors.background.primary }}
      >
        {/* Replaced the div spinner with a simple SVG circle */}
        <svg className="animate-spin h-12 w-12 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        <p className="text-lg font-medium" style={{ color: theme.colors.text.primary }}>
          {text || 'Loading...'}
        </p>
      </div>
    </div>
  );
}