"use client";

import {useState, useEffect, useCallback} from "react";
import Image from "next/image";
import Link from "next/link";
import {ProgramDetail} from "@/types/programs";
import {theme} from "@/config/theme";
import UniversalError from './UniversalError';

function ProgramSkeleton() {
  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden animate-pulse">
      <div className="relative h-48 bg-gray-200"></div>
      <div className="p-6 text-center">
        <div className="w-12 h-12 mx-auto mb-4 bg-gray-200 rounded-full"></div>
        <div className="h-6 w-3/4 mx-auto bg-gray-200 rounded mb-3"></div>
        <div className="h-4 w-full bg-gray-200 rounded"></div>
      </div>
    </div>
  );
}

export default function ProgramsShowcase() {
  const [language, setLanguage] = useState<"en" | "ur">("en");
  const [isLoading, setIsLoading] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const [programsList, setProgramsList] = useState<ProgramDetail[]>([]);
  const [programPage, setProgramPage] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const loadPrograms = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await fetch('/api/programs?showOnHome=true');
      const result = await response.json();
      if (!result.success) {
        throw new Error(result.error || 'Failed to fetch programs');
      }
      if (!result.data || !result.data.programsList) {
        throw new Error('No programs data received');
      }
      setProgramsList(result.data.programsList);
      if (result.data.programPage) {
        setProgramPage(result.data.programPage);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load programs');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    handleResize();
    window.addEventListener('resize', handleResize);
    loadPrograms();
    return () => window.removeEventListener('resize', handleResize);
  }, [loadPrograms]);

  const displayPrograms = programsList.slice(0, 4);

  // Helper for font family and direction
  const getFontFamily = () => language === 'ur' ? theme.fonts.ur.primary : theme.fonts.en.primary;
  const getDirection = () => language === 'ur' ? 'rtl' : 'ltr';
  const getTextAlign = () => language === 'ur' ? 'text-right' : 'text-left';

  if (isLoading) {
    return (
      <section className="py-16" style={{ backgroundColor: theme.colors.background.primary }}>
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <div className="animate-pulse">
              <div className="h-8 w-64 bg-gray-200 rounded mx-auto mb-4"></div>
              <div className="w-20 h-1 bg-gray-200 mx-auto"></div>
            </div>
          </div>
          <div className={`grid gap-6 ${isMobile ? 'grid-cols-1' : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4'}`}>
            {[...Array(4)].map((_, index) => (
              <ProgramSkeleton key={index} />
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <UniversalError
        error={error}
        onRetry={loadPrograms}
        sectionName="Programs"
      />
    );
  }

  return (
    <section className="py-16 bg-white" style={{backgroundColor: theme.colors.background.primary, direction: getDirection()}}>
      <div className="max-w-7xl mx-auto px-4">
        <div className={`flex justify-between items-center mb-12`}>
          {/* Title Section - will be on right when Urdu, left when English */}
          <div className={getTextAlign()}>
            <h2
              className="text-3xl font-bold mb-4"
              style={{
                color: theme.colors.text.primary,
                fontFamily: getFontFamily()
              }}
            >
              {language === "ur" ? "ہمارے پروگرامز" : "Our Programs"}
            </h2>
            <div
              className={`w-20 h-1 ${language === 'ur' ? 'ml-auto mr-0' : 'ml-0 mr-auto'}`}
              style={{ backgroundColor: theme.colors.primary }}
            ></div>
          </div>

          {/* Buttons Section - will be on left when Urdu, right when English */}
          <div className={`flex gap-4 items-center`}>
            <button
              onClick={() => setLanguage(language === "en" ? "ur" : "en")}
              className="px-4 py-1 border rounded-lg transition-colors duration-300 cursor-pointer"
              style={{
                backgroundColor: "transparent",
                color: theme.colors.primary,
                borderColor: theme.colors.primary,
                fontFamily: language === "en" ? theme.fonts.ur.primary : theme.fonts.en.primary,
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = theme.colors.primary;
                e.currentTarget.style.color = "white";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = "transparent";
                e.currentTarget.style.color = theme.colors.primary;
              }}
            >
              {language === "en" ? "اردو" : "English"}
            </button>
            <Link
              href="/programs"
              className="px-6 py-2 rounded-lg transition-colors duration-300 cursor-pointer"
              style={{
                backgroundColor: theme.colors.primary,
                color: "white",
                fontFamily: getFontFamily(),
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = theme.colors.secondary;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = theme.colors.primary;
              }}
            >
              {language === "ur" ? "تمام پروگرامز دیکھیں" : "View All Programs"}
            </Link>
          </div>
        </div>

        <div className={`grid gap-6 ${isMobile ? 'grid-cols-1' : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4'}`}>
          {displayPrograms.map((program) => (
            <Link href={`/programs/${program.slug}`} key={program.id}>
              <div className="group relative overflow-hidden rounded-lg shadow-lg h-[400px]">
                <div className="relative h-full">
                  <Image
                    src={program.featuredImage}
                    alt={program[language].title.text}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
                </div>
                <div
                  className="absolute bottom-0 p-6 text-white"
                  style={{ textAlign: language === "ur" ? "right" : "left" }}
                >
                  <span
                    className="inline-block px-3 py-1 rounded-full text-sm font-medium mb-3"
                    style={{
                      backgroundColor: theme.colors.secondary,
                      color: theme.colors.primary,
                      fontFamily: getFontFamily(),
                    }}
                  >
                    {program[language].category.text}
                  </span>
                  <h3
                    className="text-xl font-semibold mb-2"
                    style={{
                      color: theme.colors.text.light,
                      fontFamily: getFontFamily(),
                    }}
                  >
                    {program[language].title.text}
                  </h3>
                  <p
                    className="text-sm mb-4 line-clamp-2"
                    style={{
                      color: theme.colors.text.light,
                      fontFamily: getFontFamily(),
                    }}
                  >
                    {program[language].shortDescription.text}
                  </p>
                  {program[language]?.impact && program[language].impact.length > 0 && (
                    <div className="flex gap-4">
                      {program[language].impact.slice(0, 2).map((stat, index) => (
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
    </section>
  );
}
