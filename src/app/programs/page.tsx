"use client";

import {useState, useEffect} from "react";
import Image from "next/image";
import Link from "next/link";
import {ProgramItem} from "@/types/programs";
import {programs} from "@/data/programs";
import {theme} from "@/config/theme";
import Navbar from "@/app/components/Navbar";
import Footer from "@/app/components/Footer";

export default function Programs() {
  const [currentLanguage, setCurrentLanguage] = useState<"en" | "ur">("en");
  const [filteredPrograms, setFilteredPrograms] = useState<ProgramItem[]>([]);
  const [isImageLoaded, setIsImageLoaded] = useState(false);


  const [selectedCategory] = useState<string>("all");

  useEffect(() => {
    const filtered = programs.programsList.filter((program) => {
      const languageMatch = program.language === currentLanguage;
      const categoryMatch = selectedCategory === "all" || program.category.text === selectedCategory;
      return languageMatch && categoryMatch;
    });
    setFilteredPrograms(filtered);
  }, [currentLanguage, selectedCategory]);

  // Get unique categories for current language
  // const categories = Array.from(new Set(programs.programsList.filter((program) => program.language === currentLanguage).map((program) => program.category.text)));

  return (
    <>
      <Navbar />
      <div className="min-h-screen" style={{backgroundColor: theme.colors.background.primary}}>
        {/* Hero Section */}
        <div className="relative h-[calc(100vh-20rem)] overflow-hidden">
          <Image src={programs.programsPage.hero.image} alt={programs.programsPage.hero.alt} fill className={`object-cover transition-transform duration-[30s] ${isImageLoaded ? "scale-110" : "scale-100"}`} onLoadingComplete={() => setIsImageLoaded(true)} priority />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        </div>

        {/* Title Section */}
        <div className="max-w-7xl mx-auto px-4 py-12 text-center">
          <h1
            style={{
              color: theme.colors.text.primary,
              fontFamily: currentLanguage === "ur" ? theme.fonts.ur.primary : theme.fonts.en.primary,
            }}
            className="text-4xl font-bold mb-4"
          >
            {programs.programsPage[currentLanguage].title}
          </h1>
          <div style={{backgroundColor: theme.colors.secondary}} className="w-20 h-1 mx-auto mb-6"></div>
          <p
            style={{
              color: theme.colors.text.secondary,
              fontFamily: currentLanguage === "ur" ? theme.fonts.ur.primary : theme.fonts.en.primary,
            }}
            className="text-xl max-w-3xl mx-auto"
            dir={currentLanguage === "ur" ? "rtl" : "ltr"}
          >
            {programs.programsPage[currentLanguage].description}
          </p>
          <div className="flex justify-center gap-4 mt-6">
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
            {filteredPrograms.map((program) => (
              <Link href={`/programs/${program.slug}`} key={program.id}>
                <div className="group relative overflow-hidden rounded-lg shadow-lg h-[400px]">
                  <div className="relative h-full">
                    <Image src={program.featuredImage} alt={program.title.text} fill className="object-cover group-hover:scale-110 transition-transform duration-300" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
                  </div>
                  <div className="absolute bottom-0 p-6 text-white">
                    <span
                      className="inline-block px-3 py-1 rounded-full text-sm font-medium mb-3"
                      style={{
                        backgroundColor: theme.colors.secondary,
                        color: theme.colors.primary,
                        fontFamily: currentLanguage === "ur" ? theme.fonts.ur.primary : theme.fonts.en.primary,
                      }}
                    >
                      {program.category.text}
                    </span>
                    <h3
                      className="text-xl font-semibold mb-2"
                      style={{
                        color: theme.colors.text.light,
                        fontFamily: currentLanguage === "ur" ? theme.fonts.ur.primary : theme.fonts.en.primary,
                      }}
                    >
                      {program.title.text}
                    </h3>
                    <p
                      className="text-sm mb-4 line-clamp-2"
                      style={{
                        color: theme.colors.text.light,
                        fontFamily: currentLanguage === "ur" ? theme.fonts.ur.primary : theme.fonts.en.primary,
                      }}
                    >
                      {program.shortDescription.text}
                    </p>
                    {program.impact && program.impact.length > 0 && (
                      <div className="flex gap-4">
                        {program.impact.slice(0, 2).map((stat, index) => (
                          <div key={index} className="text-center">
                            <div
                              className="text-xl font-bold"
                              style={{
                                color: theme.colors.secondary,
                                fontFamily: currentLanguage === "ur" ? theme.fonts.ur.primary : theme.fonts.en.primary,
                              }}
                            >
                              {stat.value}
                              {stat.suffix || ""}
                            </div>
                            <div
                              className="text-xs opacity-80"
                              style={{
                                color: theme.colors.text.light,
                                fontFamily: currentLanguage === "ur" ? theme.fonts.ur.primary : theme.fonts.en.primary,
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
