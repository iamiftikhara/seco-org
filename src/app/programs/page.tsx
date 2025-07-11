"use client";

import {useState, useEffect, useCallback} from "react";
import Image from "next/image";
import Link from "next/link";
import {ProgramDetail} from "@/types/programs";
import {theme} from "@/config/theme";
import Navbar from "@/app/components/Navbar";
import Footer from "@/app/components/Footer";

export default function Programs() {
  const [currentLanguage, setCurrentLanguage] = useState<"en" | "ur">("en");
  const [programsData, setProgramsData] = useState<any>(null);
  const [programs, setPrograms] = useState<ProgramDetail[]>([]);
  const [isImageLoaded, setIsImageLoaded] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isMobile, setIsMobile] = useState(false);

  // Mobile detection useEffect
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    // Set initial value
    handleResize();

    // Add event listener
    window.addEventListener("resize", handleResize);

    // Cleanup
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const fetchPrograms = useCallback(async () => {
    try {
      const response = await fetch('/api/programs');
      const result = await response.json();

      if (!result.success) {
        // Check if it's an empty state
        if (result.isEmpty) {
          setError(result.message || 'No programs are currently available. Please check back later.');
          return;
        }
        throw new Error(result.error || 'Failed to fetch programs');
      }
      if (!result.data || !result.data.programsList) {
        throw new Error('No programs data received');
      }

      setProgramsData(result.data.programPage);
      setPrograms(result.data.programsList);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPrograms();
  }, [fetchPrograms]);

  // Universal helpers for font, direction, and alignment
  const getFontFamily = () => (currentLanguage === "ur" ? theme.fonts.ur.primary : theme.fonts.en.primary);
  const getDirection = () => (currentLanguage === "ur" ? "rtl" : "ltr");
  const getTextAlign = () => (currentLanguage === "ur" ? "text-right" : "text-left");

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4 mx-auto"></div>
            <p className="text-xl text-gray-600">Loading programs...</p>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  if (error) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="text-center max-w-md mx-auto p-8">
            <div className="mb-6">
              <svg
                className="mx-auto h-16 w-16 text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1}
                  d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-4m-5 0H3m2 0h4M9 7h6m-6 4h6m-6 4h6"
                />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-gray-800 mb-4">
              {error.includes('No programs are currently available') ? 'Programs Coming Soon' : 'Unable to Load Programs'}
            </h1>
            <p className="text-gray-600 mb-6 leading-relaxed">{error}</p>
            <div className="space-y-3">
              <button
                onClick={() => window.location.reload()}
                className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Refresh Page
              </button>
              <Link
                href="/"
                className="block w-full px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors"
              >
                Go to Homepage
              </Link>
            </div>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen" style={{backgroundColor: theme.colors.background.primary}}>
        {/* Hero Section */}
        <div
          className="relative overflow-hidden"
          style={{ height: isMobile ? 'calc(100vh - 400px)' : 'calc(100vh - 20rem)' }}
        >
          <Image
            src={programsData?.image || "/images/programs-hero2.jpg"}
            alt="Our Programs"
            fill
            className={`object-cover transition-transform duration-[30s] ${isImageLoaded ? "scale-110" : "scale-100"}`}
            onLoadingComplete={() => setIsImageLoaded(true)}
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        </div>

        {/* Title Section */}
        <div
          className="max-w-7xl mx-auto"
          style={{
            padding: isMobile ? '2rem 1rem' : '3rem 1rem',
            direction: getDirection()
          }}
        >
          <h1
            style={{
              color: theme.colors.text.primary,
              fontFamily: getFontFamily(),
              fontSize: isMobile ? '2rem' : '2.5rem'
            }}
            className={`font-bold mb-4 ${getTextAlign()}`}
          >
            {programsData?.title?.[currentLanguage]?.text || (currentLanguage === "ur" ? "ہمارے پروگرامز" : "Our Programs")}
          </h1>
          <div
            style={{backgroundColor: theme.colors.secondary}}
            className={`w-20 h-1 mb-6 ${currentLanguage === "ur" ? "mr-0 ml-auto" : "ml-0 mr-auto"}`}
          ></div>
          <p
            style={{
              color: theme.colors.text.secondary,
              fontFamily: getFontFamily(),
              fontSize: isMobile ? '1rem' : '1.125rem'
            }}
            className={`max-w-3xl ${getTextAlign()} ${currentLanguage === "ur" ? "mr-0 ml-auto" : "ml-0 mr-auto"}`}
          >
            {programsData?.description?.[currentLanguage]?.text || ""}
          </p>
        </div>

        {/* Language buttons outside of direction container */}
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-center gap-4 mb-8" style={{ direction: 'ltr' }}>
            <button
              onClick={() => setCurrentLanguage("en")}
              className="px-4 py-1 rounded-lg transition-colors duration-300 cursor-pointer"
              style={{
                backgroundColor: currentLanguage === "en" ? theme.colors.primary : "transparent",
                color: currentLanguage === "en" ? "white" : theme.colors.primary,
                border: `1px solid ${theme.colors.primary}`,
                fontFamily: theme.fonts.en.primary,
              }}
            >
              English
            </button>
            <button
              onClick={() => setCurrentLanguage("ur")}
              className="px-4 py-1 rounded-lg transition-colors duration-300 cursor-pointer"
              style={{
                backgroundColor: currentLanguage === "ur" ? theme.colors.primary : "transparent",
                color: currentLanguage === "ur" ? "white" : theme.colors.primary,
                border: `1px solid ${theme.colors.primary}`,
                fontFamily: theme.fonts.ur.primary,
              }}
            >
              اردو
            </button>
          </div>
        </div>

        {/* Programs Grid Section */}
        <div className="max-w-7xl mx-auto px-4 pb-16">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6" dir={currentLanguage === "ur" ? "rtl" : "ltr"}>
            {programs.map((program) => (
              <Link href={`/programs/${program.slug}`} key={program.id}>
                <div className="group relative overflow-hidden rounded-lg shadow-lg h-[400px]">
                  <div className="relative h-full">
                    <Image
                      src={program.featuredImage}
                      alt={program[currentLanguage].title.text}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
                  </div>
                  <div
                    className="absolute bottom-0 p-6 text-white"
                    style={{ textAlign: currentLanguage === "ur" ? "right" : "left" }}
                  >
                    <span
                      className="inline-block px-3 py-1 rounded-full text-sm font-medium mb-3"
                      style={{
                        backgroundColor: theme.colors.secondary,
                        color: theme.colors.primary,
                        fontFamily: getFontFamily(),
                      }}
                    >
                      {program[currentLanguage].category.text}
                    </span>
                    <h3
                      className="text-xl font-semibold mb-2"
                      style={{
                        color: theme.colors.text.light,
                        fontFamily: getFontFamily(),
                      }}
                    >
                      {program[currentLanguage].title.text}
                    </h3>
                    <p
                      className="text-sm mb-4 line-clamp-2"
                      style={{
                        color: theme.colors.text.light,
                        fontFamily: getFontFamily(),
                      }}
                    >
                      {program[currentLanguage].shortDescription.text}
                    </p>
                    {program[currentLanguage]?.impact && program[currentLanguage].impact.length > 0 && (
                      <div className="flex gap-4">
                        {program[currentLanguage].impact.slice(0, 2).map((stat, index) => (
                          <div key={index} className="text-center">
                            <div
                              className="text-xl font-bold"
                              style={{
                                color: theme.colors.secondary,
                                fontFamily: getFontFamily(),
                              }}
                            >
                              {stat.value}
                              {stat.suffix || ""}
                            </div>
                            <div
                              className="text-xs opacity-80"
                              style={{
                                color: theme.colors.text.light,
                                fontFamily: getFontFamily(),
                              }}
                            >
                              {stat.label.text}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
