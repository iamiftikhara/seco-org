/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import {useEffect, useState, useCallback} from "react";
import {useParams} from "next/navigation";
import Image from "next/image";
import {FaRegClock, FaMapMarkerAlt, FaArrowLeft, FaArrowRight} from "react-icons/fa";
import * as FaIcons from "react-icons/fa";
import * as FaIconsSolid from "react-icons/fa6";
import {ProgramDetail} from "@/types/programs";
import {theme} from "@/config/theme";
import Navbar from "@/app/components/Navbar";
import Footer from "@/app/components/Footer";
import CountUp from "react-countup";
import Link from "next/link";
import SocialShare from "@/app/components/SocialShare";
import Script from 'next/script';
import UniversalError from "@/app/components/UniversalError";
import LoadingSpinner from "@/app/components/LoadingSpinner";
import DynamicError from "@/app/components/DynamicError";


export default function ProgramDetailPage() {
  const params = useParams();
  const [program, setProgram] = useState<ProgramDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isImageLoaded, setIsImageLoaded] = useState(false);
  const [currentLanguage, setCurrentLanguage] = useState<"en" | "ur">("en");
  const [isMobile, setIsMobile] = useState(false);
  const [navigation, setNavigation] = useState<{prev: ProgramDetail | null; next: ProgramDetail | null}>({prev: null, next: null});

  // Mobile detection
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

  const fetchProgram = useCallback(async () => {
    if (params.slug) {
      try {
        setLoading(true);
        setError(null);

        // Fetch program data and all programs for navigation
        const [programResponse, allProgramsResponse] = await Promise.all([
          fetch(`/api/programs/${params.slug}`),
          fetch('/api/programs')
        ]);

        const programResult = await programResponse.json();
        const allProgramsResult = await allProgramsResponse.json();

        if (!programResult.success) {
          throw new Error(programResult.error || 'Failed to fetch program');
        }

        setProgram(programResult.data);

        // Set up navigation if all programs were fetched successfully
        if (allProgramsResult.success && allProgramsResult.data?.programsList) {
          const allPrograms = allProgramsResult.data.programsList;
          const currentIndex = allPrograms.findIndex((p: ProgramDetail) => p.slug === params.slug);

          if (currentIndex !== -1) {
            const prevProgram = currentIndex > 0 ? allPrograms[currentIndex - 1] : null;
            const nextProgram = currentIndex < allPrograms.length - 1 ? allPrograms[currentIndex + 1] : null;

            setNavigation({
              prev: prevProgram,
              next: nextProgram
            });
          }
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load program');
      } finally {
        setLoading(false);
      }
    }
  }, [params.slug]);

  useEffect(() => {
    fetchProgram();
  }, [fetchProgram]);

  // Universal helpers for font, direction, and alignment
  const getFontFamily = () => (currentLanguage === "ur" ? theme.fonts.ur.primary : theme.fonts.en.primary);

  // Helper function to get React icon component from icon name
  const getIconComponent = (iconName: string) => {
    if (!iconName) return null;

    // Icon name mappings for common icons that might have different names
    const iconMappings: { [key: string]: string } = {
      'FaHandHoldingWater': 'FaHandHoldingDroplet',
      'FaWater': 'FaTint',
      'FaHandHoldingUsd': 'FaHandHoldingDollar',
    };

    // Use mapping if available
    const mappedIconName = iconMappings[iconName] || iconName;

    // If iconName already starts with "Fa", use it directly (e.g., "FaUsers")
    if (mappedIconName.startsWith('Fa')) {
      // Try FA5 first
      let IconComponent = (FaIcons as any)[mappedIconName];
      if (IconComponent) return IconComponent;

      // Try FA6 if not found in FA5
      IconComponent = (FaIconsSolid as any)[mappedIconName];
      if (IconComponent) return IconComponent;

      return null;
    }

    // Otherwise, convert from FontAwesome class name (e.g., "fa-users" -> "FaUsers")
    const iconKey = mappedIconName
      .replace(/^fa-/, '') // Remove fa- prefix
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join('');

    // Try FA5 first
    let IconComponent = (FaIcons as any)[`Fa${iconKey}`];
    if (IconComponent) return IconComponent;

    // Try FA6 if not found in FA5
    IconComponent = (FaIconsSolid as any)[`Fa${iconKey}`];
    return IconComponent || null;
  };
  const getDirection = () => (currentLanguage === "ur" ? "rtl" : "ltr");
  const getTextAlign = () => (currentLanguage === "ur" ? "right" : "left");

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-white">
        <LoadingSpinner />
        <p className="text-gray-600 mt-4">Loading program details...</p>
      </div>
    );
  }

  if (error) {
    return (
      <>
        <Navbar />
        <DynamicError
          title={currentLanguage === "ur" ? "خرابی ہوئی" : "Something Went Wrong"}
          message={error}
          onRetry={fetchProgram}
          showBackButton={true}
          backUrl="/programs"
          backLabel={currentLanguage === "ur" ? "پروگرامز کی فہرست میں واپس" : "Back to Programs"}
          language={currentLanguage}
          sectionName={currentLanguage === "ur" ? "پروگرامز" : "Programs"}
        />
        <Footer />
      </>
    );
  }

  if (!program) {
    return (
      <>
        <Navbar />
        <DynamicError
          title={currentLanguage === "ur" ? "پروگرام نہیں ملا" : "Program Not Found"}
          message={currentLanguage === "ur" ? "آپ جو پروگرام تلاش کر رہے ہیں وہ موجود نہیں یا ہٹا دیا گیا ہے۔" : "The program you're looking for doesn't exist or has been removed."}
          showBackButton={true}
          backUrl="/programs"
          backLabel={currentLanguage === "ur" ? "پروگرامز کی فہرست میں واپس" : "Back to Programs"}
          language={currentLanguage}
          sectionName={currentLanguage === "ur" ? "پروگرامز" : "Programs"}
        />
        <Footer />
      </>
    );
  }

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Project",
    "name": program[currentLanguage].title.text,
    "description": program[currentLanguage].shortDescription.text,
    "image": program.featuredImage,
    "url": typeof window !== "undefined" ? window.location.href : "",
    "provider": {
      "@type": "Organization",
      "name": "SECO",
      "url": typeof window !== "undefined" ? window.location.origin : ""
    },
    "areaServed": program[currentLanguage].coverage.text,
    "duration": program[currentLanguage].duration.text,
    "category": program[currentLanguage].category.text,
    "partner": program[currentLanguage]?.partners?.map(partner => ({
      "@type": "Organization",
      "name": partner.name.text,
      "image": partner.logo
    }))
  };

  return (
    <>
      <Script
        id="structured-data"
        type="application/ld+json"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(structuredData),
        }}
      />
      <Navbar />
      <div
        className="min-h-screen bg-white"
        style={{
          direction: getDirection(),
          fontFamily: getFontFamily(),
        }}
      >
        {/* Hero Section */}
        <div
          className="relative overflow-hidden"
          style={{ height: isMobile ? 'calc(100vh - 35rem)' : 'calc(100vh - 15rem)' }}
        >
          <Image
            src={program.featuredImage}
            alt={program[currentLanguage].title.text}
            fill
            className={`object-cover transition-transform duration-[20s] ${isImageLoaded ? "scale-110" : "scale-100"}`}
            onLoadingComplete={() => setIsImageLoaded(true)}
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
          <div
            className={`absolute bottom-0 left-0 right-0 p-8 text-white max-w-7xl mx-auto ${isMobile ? "pb-4" : ""} ${currentLanguage === "ur" ? "text-right" : "text-left"}`}
          >
            <span
              className={`inline-block bg-[#FFD700] text-[#4B0082] rounded-full font-medium mb-3 ${isMobile ? 'px-2 py-1 text-xs' : 'px-4 py-2 text-sm'}`}
              style={{ fontFamily: getFontFamily() }}
            >
              {program[currentLanguage].category.text}
            </span>
            <h1
              className="text-4xl font-bold mb-3"
              style={{ fontFamily: getFontFamily() }}
            >
              {program[currentLanguage].title.text}
            </h1>
            <p
              className="text-lg text-gray-200 max-w-2xl mb-6"
              style={{ fontFamily: getFontFamily() }}
            >
              {program[currentLanguage].shortDescription.text}
            </p>

            {/* Language Toggle Buttons in Hero */}
            <div className="flex justify-center gap-4 mt-2" style={{ direction: 'ltr' }}>
              <button
                onClick={() => setCurrentLanguage("en")}
                className="px-4 py-2 rounded-lg transition-colors duration-300 cursor-pointer backdrop-blur-sm"
                style={{
                  backgroundColor: currentLanguage === "en" ? theme.colors.primary : "rgba(255, 255, 255, 0.2)",
                  color: currentLanguage === "en" ? "white" : "white",
                  border: `1px solid ${currentLanguage === "en" ? theme.colors.primary : "rgba(255, 255, 255, 0.3)"}`,
                  fontFamily: theme.fonts.en.primary,
                }}
              >
                English
              </button>
              <button
                onClick={() => setCurrentLanguage("ur")}
                className="px-4 py-2 rounded-lg transition-colors duration-300 cursor-pointer backdrop-blur-sm"
                style={{
                  backgroundColor: currentLanguage === "ur" ? theme.colors.primary : "rgba(255, 255, 255, 0.2)",
                  color: currentLanguage === "ur" ? "white" : "white",
                  border: `1px solid ${currentLanguage === "ur" ? theme.colors.primary : "rgba(255, 255, 255, 0.3)"}`,
                  fontFamily: theme.fonts.ur.primary,
                }}
              >
                اردو
              </button>
            </div>
          </div>
        </div>

        {/* Impact and Icon Stats Section - Only show if data exists */}
        {((program[currentLanguage]?.impact && program[currentLanguage].impact.length > 0) ||
          (program[currentLanguage]?.iconStats && program[currentLanguage].iconStats.length > 0)) && (
          <div className="bg-gradient-to-r from-[#4B0082] to-[#6B238E] text-white py-12">
            <div className="max-w-7xl mx-auto px-4">
              <h2 className="text-2xl font-bold text-center mb-4">{currentLanguage === "ur" ? "پروگرام کا اثر" : "Program Impact"}</h2>

              {/* Impact Stats Row */}
              {program[currentLanguage]?.impact && program[currentLanguage].impact.length > 0 && (
                <div className="mb-8">
                  <div className="w-full">
                    <div className="grid gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 w-full">
                      {program[currentLanguage].impact.map((stat, index) => {
                        const numericValue = parseInt(stat.value?.replace(/[^0-9]/g, "") || "0");
                        const IconComponent = getIconComponent(stat.iconName);

                        return (
                          <div key={`impact-${index}`} className="text-center p-4 backdrop-blur-sm bg-white/5 rounded-lg w-full">
                            {/* Icon with Value - Horizontal Layout */}
                            <div className={`flex items-center justify-center gap-3 mb-3 ${currentLanguage === "ur" ? "flex-row-reverse" : "flex-row"}`}>
                              {IconComponent ? (
                                <IconComponent className="text-2xl text-[#FFD700]" />
                              ) : (
                                <span className="text-2xl">📈</span>
                              )}
                              <div className="text-2xl font-bold text-[#FFD700]">
                                <CountUp end={numericValue} duration={5} separator="," />
                                {stat.suffix || ""}
                              </div>
                            </div>
                            <div
                              className="text-base text-gray-200"
                              style={{ fontFamily: getFontFamily() }}
                            >
                              {stat.label.text}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}

              {/* Icon Stats Row */}
              {program[currentLanguage]?.iconStats && program[currentLanguage].iconStats.length > 0 && (
                <div className="mb-4">
                  <div className="w-full">
                    <div className="grid gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 w-full">
                      {program[currentLanguage].iconStats.map((stat, index) => {
                        const numericValue = parseInt(stat.value?.replace(/[^0-9]/g, "") || "0");
                        const IconComponent = getIconComponent(stat.iconName);

                        return (
                          <div key={`icon-${index}`} className="text-center p-4 backdrop-blur-sm bg-white/5 rounded-lg w-full">
                            {/* Icon with Value - Horizontal Layout */}
                            <div className={`flex items-center justify-center gap-3 mb-3 ${currentLanguage === "ur" ? "flex-row-reverse" : "flex-row"}`}>
                              {IconComponent ? (
                                <IconComponent className="text-2xl text-[#FFD700]" />
                              ) : (
                                <span className="text-2xl">📊</span>
                              )}
                              <div className="text-2xl font-bold text-[#FFD700]">
                                <CountUp end={numericValue} duration={5} separator="," />
                                {(stat as any).suffix || ""}
                              </div>
                            </div>
                            <div
                              className="text-base text-gray-200"
                              style={{ fontFamily: getFontFamily() }}
                            >
                              {stat.label.text}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        <div className={`max-w-7xl mx-auto px-4 ${isMobile ? 'py-6' : 'py-16'}`}>
          <div className={`grid grid-cols-1 gap-12 ${program[currentLanguage]?.partners && program[currentLanguage].partners.length > 0 ? 'lg:grid-cols-3' : 'lg:grid-cols-1'}`}>
            <div className={program[currentLanguage]?.partners && program[currentLanguage].partners.length > 0 ? "lg:col-span-2" : ""}>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">{currentLanguage === "ur" ? "پروگرام کے بارے میں" : "About the Program"}</h2>
              <div className="prose max-w-none">
                <p
                  className={`text-gray-600 leading-relaxed whitespace-pre-line ${currentLanguage === "ur" ? "text-right" : "text-left"}`}
                  style={{ fontFamily: getFontFamily() }}
                >
                  {program[currentLanguage].fullDescription.text}
                </p>
              </div>

              {/* Duration and Coverage - Only show if data exists */}
              {(program[currentLanguage].duration?.text || program[currentLanguage].coverage?.text) && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-12">
                  {/* Duration - Only show if exists */}
                  {program[currentLanguage].duration?.text && (
                    <div className="bg-gray-50 p-6 rounded-xl">
                      <h3 className="text-xl font-bold text-gray-900 mb-2">{currentLanguage === "ur" ? "دورانیہ" : "Duration"}</h3>
                      <div className="flex items-center text-gray-600">
                        <FaRegClock className={`text-[#4B0082] ${currentLanguage === "ur" ? "ml-2" : "mr-2"}`} />
                        <span style={{ fontFamily: getFontFamily() }}>{program[currentLanguage].duration.text}</span>
                      </div>
                    </div>
                  )}

                  {/* Coverage - Only show if exists */}
                  {program[currentLanguage].coverage?.text && (
                    <div className="bg-gray-50 p-6 rounded-xl">
                      <h3 className="text-xl font-bold text-gray-900 mb-2">{currentLanguage === "ur" ? "علاقہ جات" : "Coverage"}</h3>
                      <div className="flex items-start text-gray-600">
                        <FaMapMarkerAlt className={`text-[#4B0082] mt-1 ${currentLanguage === "ur" ? "ml-2" : "mr-2"}`} />
                        <span style={{ fontFamily: getFontFamily() }}>{program[currentLanguage].coverage.text}</span>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Partners Section - Only show if partners exist */}
            {program[currentLanguage]?.partners && program[currentLanguage].partners.length > 0 && (
              <div className="lg:col-span-1">
                <div className="bg-gray-50 p-8 rounded-xl">
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">{currentLanguage === "ur" ? "ہمارے پارٹنرز" : "Our Partners"}</h2>
                  <div className="space-y-6">
                    {program[currentLanguage].partners.map((partner, index) => (
                      <div key={index} className={`flex items-center ${currentLanguage === "ur" ? "space-x-reverse" : ""} space-x-4`}>
                        <div className="relative w-16 h-16">
                          <Image src={partner.logo} alt={partner.name.text} fill className="object-contain" />
                        </div>
                        <span
                          className="text-gray-700 font-medium"
                          style={{ fontFamily: getFontFamily() }}
                        >
                          {partner.name.text}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Add Social Share Component */}
        <div className={`${isMobile ? 'mt-1' : 'mt-8'}`}>
          <SocialShare
            title={program[currentLanguage].title.text}
            description={program[currentLanguage].shortDescription.text}
            url={typeof window !== "undefined" ? window.location.href : ""}
            image={program.featuredImage}
            language={currentLanguage}
            hashtags={program.socialShare?.hashtags}
            twitterHandle={program.socialShare?.twitterHandle}
            ogType={program.socialShare?.ogType}
          />
        </div>

        {/* Navigation Section */}
        <div
          className="max-w-7xl mx-auto border-t border-gray-200"
          style={{
            padding: isMobile ? '1rem' : '2rem 1rem',
            paddingTop: isMobile ? '1.5rem' : '2rem'
          }}
        >
          <div className={`flex ${isMobile ? 'flex-col gap-4' : 'flex-row'} justify-between items-stretch ${isMobile ? '' : 'items-center'}`}>
            {navigation.prev ? (
              <Link
                href={`/programs/${navigation.prev.slug}`}
                className="group flex items-center rounded-lg transition-colors duration-300"
                style={{
                  backgroundColor: theme.colors.background.secondary,
                  color: theme.colors.text.primary,
                  fontFamily: getFontFamily(),
                  padding: isMobile ? '0.75rem' : '1rem',
                  gap: isMobile ? '0.5rem' : '0.75rem',
                  width: isMobile ? '100%' : 'auto'
                }}
              >
                <FaArrowLeft
                  className="group-hover:-translate-x-1 transition-transform duration-300 flex-shrink-0"
                  style={{ fontSize: isMobile ? '0.875rem' : '1rem' }}
                />
                <div className={isMobile ? 'min-w-0 flex-1' : ''}>
                  <div
                    className="opacity-75"
                    style={{ fontSize: isMobile ? '0.75rem' : '0.875rem' }}
                  >
                    {currentLanguage === "ur" ? "پچھلا پروگرام" : "Previous Program"}
                  </div>
                  <div
                    className={`font-medium ${isMobile ? 'truncate' : ''}`}
                    style={{ fontSize: isMobile ? '0.875rem' : '1rem' }}
                  >
                    {navigation.prev[currentLanguage].title.text}
                  </div>
                </div>
              </Link>
            ) : (
              <div style={{ width: isMobile ? '100%' : 'auto' }} />
            )}

            {navigation.next ? (
              <Link
                href={`/programs/${navigation.next.slug}`}
                className="group flex items-center rounded-lg transition-colors duration-300"
                style={{
                  backgroundColor: theme.colors.background.secondary,
                  color: theme.colors.text.primary,
                  fontFamily: getFontFamily(),
                  padding: isMobile ? '0.75rem' : '1rem',
                  gap: isMobile ? '0.5rem' : '0.75rem',
                  width: isMobile ? '100%' : 'auto'
                }}
              >
                <div className={`${isMobile ? 'min-w-0 flex-1 text-right' : 'text-left'}`}>
                  <div
                    className="opacity-75"
                    style={{ fontSize: isMobile ? '0.75rem' : '0.875rem' }}
                  >
                    {currentLanguage === "ur" ? "اگلا پروگرام" : "Next Program"}
                  </div>
                  <div
                    className={`font-medium ${isMobile ? 'truncate' : ''}`}
                    style={{ fontSize: isMobile ? '0.875rem' : '1rem' }}
                  >
                    {navigation.next[currentLanguage].title.text}
                  </div>
                </div>
                <FaArrowRight
                  className="group-hover:translate-x-1 transition-transform duration-300 flex-shrink-0"
                  style={{ fontSize: isMobile ? '0.875rem' : '1rem' }}
                />
              </Link>
            ) : (
              <div style={{ width: isMobile ? '100%' : 'auto' }} />
            )}
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
