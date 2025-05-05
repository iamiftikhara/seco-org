'use client';

export default function LoadingSpinner() {
  return (
    <div className="flex items-center justify-center">
      <div className="w-12 h-12 border-4 border-[#4B0082] border-t-transparent rounded-full animate-spin"></div>
    </div>
  );
}