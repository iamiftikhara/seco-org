"use client";

import { useState } from "react";
import Link from "next/link";
import { FaExclamationTriangle, FaRedo, FaArrowLeft, FaHome } from "react-icons/fa";
import { theme } from "@/config/theme";

interface SinglePageErrorProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
  showBackToListing?: boolean;
  listingPath?: string;
  listingLabel?: string;
  language?: "en" | "ur";
  customIcon?: React.ReactNode;
}

export default function SinglePageError({
  title,
  message,
  onRetry,
  showBackToListing = false,
  listingPath = "/",
  listingLabel,
  language = "en",
  customIcon
}: SinglePageErrorProps) {
  const [isRetrying, setIsRetrying] = useState(false);

  const handleRetry = async () => {
    if (onRetry) {
      setIsRetrying(true);
      try {
        await onRetry();
      } finally {
        setIsRetrying(false);
      }
    } else {
      window.location.reload();
    }
  };

  const getFontFamily = () => (language === "ur" ? theme.fonts.ur.primary : theme.fonts.en.primary);
  const getDirection = () => (language === "ur" ? "rtl" : "ltr");
  const getTextAlign = () => (language === "ur" ? "text-right" : "text-left");

  const defaultTitle = language === "ur" ? "کچھ غلط ہوا" : "Something went wrong";
  const defaultMessage = language === "ur" 
    ? "ہم اس وقت اس صفحے کو لوڈ نہیں کر سکے۔ براہ کرم دوبارہ کوشش کریں۔"
    : "We couldn't load this page right now. Please try again.";
  
  const retryText = language === "ur" ? "دوبارہ کوشش کریں" : "Try Again";
  const retryingText = language === "ur" ? "کوشش کی جا رہی ہے..." : "Retrying...";
  const homeText = language === "ur" ? "ہوم پیج" : "Go Home";
  const backText = language === "ur" ? "فہرست میں واپس" : "Back to List";

  return (
    <div 
      className="min-h-screen flex items-center justify-center bg-gray-50"
      style={{ direction: getDirection() }}
    >
      <div 
        className="text-center max-w-md mx-auto p-8"
        style={{ fontFamily: getFontFamily() }}
      >
        {/* Animated Error Icon */}
        <div className="mb-8 relative">
          <div className="animate-bounce">
            {customIcon || (
              <FaExclamationTriangle 
                className="mx-auto text-red-500"
                style={{ fontSize: "4rem" }}
              />
            )}
          </div>
          {/* Pulse animation background */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-20 h-20 bg-red-100 rounded-full animate-ping opacity-25"></div>
          </div>
        </div>

        {/* Error Title */}
        <h1 
          className={`text-2xl font-bold text-gray-800 mb-4 ${getTextAlign()}`}
          style={{ fontFamily: getFontFamily() }}
        >
          {title || defaultTitle}
        </h1>

        {/* Error Message */}
        <p 
          className={`text-gray-600 mb-8 leading-relaxed ${getTextAlign()}`}
          style={{ fontFamily: getFontFamily() }}
        >
          {message || defaultMessage}
        </p>

        {/* Action Buttons */}
        <div className="space-y-4">
          {/* Retry Button */}
          <button
            onClick={handleRetry}
            disabled={isRetrying}
            className={`w-full px-6 py-3 rounded-lg transition-all duration-300 flex items-center justify-center gap-2 ${
              isRetrying 
                ? 'bg-gray-400 cursor-not-allowed' 
                : 'bg-blue-600 hover:bg-blue-700 hover:scale-105 active:scale-95'
            }`}
            style={{
              color: "white",
              fontFamily: getFontFamily(),
            }}
          >
            {isRetrying ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                <span>{retryingText}</span>
              </>
            ) : (
              <>
                <FaRedo className={`${language === "ur" ? "ml-2" : "mr-2"}`} />
                <span>{retryText}</span>
              </>
            )}
          </button>

          {/* Navigation Buttons */}
          <div className={`flex gap-3 ${language === "ur" ? "flex-row-reverse" : ""}`}>
            {/* Back to Listing Button */}
            {showBackToListing && (
              <Link
                href={listingPath}
                className="flex-1 px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-all duration-300 hover:scale-105 active:scale-95 flex items-center justify-center gap-2"
                style={{ fontFamily: getFontFamily() }}
              >
                <FaArrowLeft className={`${language === "ur" ? "ml-1" : "mr-1"}`} />
                <span>{listingLabel || backText}</span>
              </Link>
            )}

            {/* Home Button */}
            <Link
              href="/"
              className={`${showBackToListing ? 'flex-1' : 'w-full'} px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-all duration-300 hover:scale-105 active:scale-95 flex items-center justify-center gap-2`}
              style={{ fontFamily: getFontFamily() }}
            >
              <FaHome className={`${language === "ur" ? "ml-1" : "mr-1"}`} />
              <span>{homeText}</span>
            </Link>
          </div>
        </div>

        {/* Decorative Elements */}
        <div className="mt-8 flex justify-center space-x-2">
          <div className="w-2 h-2 bg-gray-300 rounded-full animate-pulse"></div>
          <div className="w-2 h-2 bg-gray-300 rounded-full animate-pulse" style={{ animationDelay: "0.2s" }}></div>
          <div className="w-2 h-2 bg-gray-300 rounded-full animate-pulse" style={{ animationDelay: "0.4s" }}></div>
        </div>
      </div>
    </div>
  );
}
