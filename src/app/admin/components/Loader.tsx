'use client';

import { theme } from '@/config/theme';

interface LoaderProps {
  isVisible: boolean;
}

export default function Loader({ isVisible }: LoaderProps) {
  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div 
        className="bg-white p-6 rounded-lg shadow-lg flex flex-col items-center gap-4"
        style={{ backgroundColor: theme.colors.background.primary }}
      >
        <div className="w-12 h-12 border-4 border-t-transparent rounded-full animate-spin"
          style={{ borderColor: `${theme.colors.primary} transparent transparent` }}
        />
        <p className="text-lg font-medium" style={{ color: theme.colors.text.primary }}>
          Saving changes...
        </p>
      </div>
    </div>
  );
}