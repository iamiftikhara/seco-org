"use client";

import {useState, useEffect, useCallback} from "react";
import Image from "next/image";
import Link from "next/link";
import {ProgramDetail} from "@/types/programs";
import {theme} from "@/config/theme";
import Navbar from "@/app/components/Navbar";
import Footer from "@/app/components/Footer";
import DynamicError from "@/app/components/DynamicError";

export default function Programs() {
  const [currentLanguage, setCurrentLanguage] = useState<"en" | "ur">("en");
  const [programsData, setProgramsData] = useState<{ title: { en: { text: string }, ur: { text: string } }, description: { en: { text: string }, ur: { text: string } }, image: string } | null>(null);
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
          // Handle empty state as valid - show empty programs list
          setProgramsData(result.data?.programPage || null);
          setPrograms([]);
          setError(null);
          return;
        }
        throw new Error(result.error || 'Failed to fetch programs');
      }

      if (!result.data) {
        throw new Error('No programs data received');
      }

      // Set the data even if programsList is empty
      setProgramsData(result.data.programPage || null);
      setPrograms(result.data.programsList || []);
      setError(null);
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
        <DynamicError
          title={error.includes('No programs are currently available')
            ? (currentLanguage === "ur" ? "پروگرامز جلد آ رہے ہیں" : "Programs Coming Soon")
            : (currentLanguage === "ur" ? "پروگرامز لوڈ نہیں ہو سکے" : "Unable to Load Programs")
          }
          message={error}
          onRetry={fetchPrograms}
          showBackButton={false}
          language={currentLanguage}
          sectionName={currentLanguage === "ur" ? "پروگرامز" : "Programs"}
        />
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className={`${isMobile ? 'h-[calc(100vh-40rem)]' : 'h-[calc(100vh-15rem)]'} relative overflow-hidden`}>
        {programsData && (
          <Image
            src={programsData.image}
            alt={programsData.title[currentLanguage]?.text || "Our Programs"}
            fill
            className={`object-cover transition-transform duration-[20s] ${isImageLoaded ? "scale-110" : "scale-100"}`}
            priority
            onLoadingComplete={() => setIsImageLoaded(true)}
          />
        )}
        <div className="absolute inset-0 flex items-end pb-8 justify-center" style={{background: "linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5))"}}>
          <div
            className="text-center text-white"
            style={{ fontFamily: getFontFamily() }}
          >
            <h1
              className="text-5xl font-bold mb-4"
              style={{ fontFamily: getFontFamily() }}
            >
              {programsData && (
                programsData.title[currentLanguage]?.text || (currentLanguage === "ur" ? "ہمارے پروگرامز" : "Our Programs")
              )}
            </h1>
            <p
              className="text-xl max-w-3xl mx-auto px-4"
              style={{ fontFamily: getFontFamily() }}
            >
              {programsData && (
                programsData.description[currentLanguage]?.text || (currentLanguage === "ur" ? "ہمارے پروگرامز کے ذریعے ہم کمیونٹی کی بہتری کے لیے کام کرتے ہیں۔" : "Through our programs, we work towards community betterment and sustainable development.")
              )}
            </p>
            <div className="mt-6">
              <button onClick={() => setCurrentLanguage('en')} className={`mx-2 px-4 py-2 rounded cursor-pointer ${currentLanguage === 'en' ? `bg-white text-[${theme.colors.primary}]` : 'bg-transparent text-white border border-white'}`}>
                English
              </button>
              <button onClick={() => setCurrentLanguage('ur')} className={`mx-2 px-4 py-2 rounded cursor-pointer ${currentLanguage === 'ur' ? `bg-white text-[${theme.colors.primary}]` : 'bg-transparent text-white border border-white'}`}
                 style={{ fontFamily: theme.fonts.ur.primary }}>
                اردو
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className={`${isMobile ? 'py-8' : 'py-16'} min-h-screen bg-white`}>
        <div className="max-w-7xl mx-auto px-4">
          {/* Programs Grid Section */}
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
