'use client';

export default function PageLoader() {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-white bg-opacity-80 backdrop-blur-sm">
      <div className="flex flex-col items-center">
        {/* Interactive Loader with Pulsing Animation */}
        <div className="relative flex items-center justify-center w-24 h-24">
          <div className="absolute w-20 h-20 rounded-full border-4 border-gray-700 animate-ping-slow"></div>
          <div className="absolute w-16 h-16 rounded-full border-4 border-gray-900 animate-pulse-slow"></div>
          <div className="absolute w-12 h-12 rounded-full bg-gray-800 flex items-center justify-center">
            <svg className="w-8 h-8 text-gray-100" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 3v1m0 16v1m9-9h1M3 12H2m15.325-4.675l.707-.707M5.968 18.032l-.707.707M18.032 5.968l.707-.707M5.293 5.293l-.707-.707"
              />
            </svg>
          </div>
        </div>
        {/* Animated Loading Text */}
        <p className="mt-4 text-gray-800 text-xl font-semibold animate-fade-in-out">
          Loading...
        </p>
      </div>
    </div>
  );
}