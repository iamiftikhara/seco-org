'use client';

export default function PageLoader() {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-white bg-opacity-80">
      <div className="flex flex-col items-center">
        <div className="w-16 h-16 border-4 border-[#4B0082] border-t-transparent rounded-full animate-spin"></div>
        <p className="mt-4 text-[#4B0082] text-lg font-semibold">Loading...</p>
      </div>
    </div>
  );
}