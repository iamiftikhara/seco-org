"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { FaExclamationTriangle, FaRedo, FaArrowLeft } from "react-icons/fa";
import { theme } from "@/config/theme";

interface DynamicErrorProps {
  title?: string;
  message: string;
  onRetry?: () => void;
  showBackButton?: boolean;
  backUrl?: string;
  backLabel?: string;
  language?: "en" | "ur";
  sectionName?: string;
}

export default function DynamicError({
  title,
  message,
  onRetry,
  showBackButton = false,
  backUrl,
  backLabel,
  language = "en",
  sectionName = "Content"
}: DynamicErrorProps) {
  const [isAnimating, setIsAnimating] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Mobile detection
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleRetry = () => {
    if (onRetry) {
      setIsAnimating(true);
      setTimeout(() => {
        setIsAnimating(false);
        onRetry();
      }, 1000);
    }
  };

  // Helper functions for language support
  const getFontFamily = () => (language === "ur" ? theme.fonts.ur.primary : theme.fonts.en.primary);
  const getDirection = () => (language === "ur" ? "rtl" : "ltr");
  const getTextAlign = () => (language === "ur" ? "text-right" : "text-left");

  // Dynamic content based on language
  const getTitle = () => {
    if (title) return title;
    return language === "ur" ? "خرابی ہوئی" : "Something Went Wrong";
  };

  const getRetryText = () => language === "ur" ? "دوبارہ کوشش کریں" : "Try Again";
  
  const getBackText = () => {
    if (backLabel) return backLabel;
    return language === "ur" 
      ? `${sectionName} کی فہرست میں واپس` 
      : `Back to ${sectionName} List`;
  };

  const getDefaultBackUrl = () => {
    if (backUrl) return backUrl;
    const section = sectionName.toLowerCase();
    return `/${section === "content" ? "" : section}`;
  };

  return (
    <div 
      className="min-h-screen flex items-center justify-center bg-gray-50 w-full"
      style={{ direction: getDirection() }}
    >
      <div 
        className={`text-center max-w-md mx-auto ${isMobile ? 'p-6' : 'p-8'}`}
        style={{ fontFamily: getFontFamily() }}
      >
        {/* Animated Error Icon */}
        <div className="mb-8 relative">
          <div className="relative inline-block">
            <FaExclamationTriangle 
              className={`mx-auto text-red-500 transition-all duration-500 ${
                isAnimating ? 'animate-bounce scale-110' : 'animate-pulse'
              }`}
              style={{ fontSize: isMobile ? '4rem' : '5rem' }}
            />
            {/* Animated rings around icon */}
            <div className="absolute inset-0 rounded-full border-2 border-red-200 animate-ping opacity-20"></div>
            <div className="absolute inset-2 rounded-full border-2 border-red-300 animate-ping opacity-30 animation-delay-200"></div>
          </div>
        </div>

        {/* Error Title */}
        <h1
          className="font-bold text-gray-800 mb-4 text-center"
          style={{
            fontSize: isMobile ? '1.5rem' : '2rem',
            fontFamily: getFontFamily()
          }}
        >
          {getTitle()}
        </h1>

        {/* Error Message */}
        <p
          className="text-gray-600 mb-8 leading-relaxed text-center"
          style={{
            fontSize: isMobile ? '0.875rem' : '1rem',
            fontFamily: getFontFamily()
          }}
        >
          {message}
        </p>

        {/* Action Buttons */}
        <div className={`space-y-4 flex flex-col ${isMobile ? 'w-full' : ''}`}>
          {/* Retry Button */}
          {onRetry && (
            <button
              onClick={handleRetry}
              disabled={isAnimating}
              className={`flex items-center justify-center gap-3 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed ${
                isMobile ? 'w-full' : 'min-w-[200px]'
              }`}
              style={{ fontFamily: getFontFamily() }}
            >
              <FaRedo
                className={`transition-transform duration-300 ${
                  isAnimating ? 'animate-spin' : ''
                }`}
              />
              <span>{getRetryText()}</span>
            </button>
          )}

          {/* Back to Listing Button */}
          {showBackButton && (
            <Link
              href={getDefaultBackUrl()}
              className={`flex items-center justify-center gap-3 px-6 py-3 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-all duration-300 ${
                isMobile ? 'w-full' : 'min-w-[200px]'
              }`}
              style={{ fontFamily: getFontFamily() }}
            >
              <FaArrowLeft className={language === "ur" ? "rotate-180" : ""} />
              <span>{getBackText()}</span>
            </Link>
          )}

          {/* Home Button (only when no back button) */}
          {!showBackButton && (
            <Link
              href="/"
              className={`flex items-center justify-center gap-3 px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg hover:border-gray-400 hover:bg-gray-50 transition-all duration-300 ${
                isMobile ? 'w-full' : 'min-w-[200px]'
              }`}
              style={{ fontFamily: getFontFamily() }}
            >
              <span>{language === "ur" ? "ہوم پیج" : "Go to Homepage"}</span>
            </Link>
          )}
        </div>

        {/* Additional Help Text */}
        <p
          className="text-gray-500 text-sm mt-6 text-center"
          style={{ fontFamily: getFontFamily() }}
        >
          {language === "ur"
            ? "اگر مسئلہ برقرار رہے تو براہ کرم ایڈمنسٹریٹر سے رابطہ کریں۔"
            : "If the problem persists, please contact the administrator."
          }
        </p>
      </div>

      {/* Custom CSS for animation delays */}
      <style jsx>{`
        .animation-delay-200 {
          animation-delay: 200ms;
        }
      `}</style>
    </div>
  );
}
