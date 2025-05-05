"use client";

import {useState, useEffect} from "react";
import Image from "next/image";
import Link from "next/link";
import {Program, ProgramItem} from "@/types/programs";
import {programs} from "@/data/programs";
import {theme} from "@/config/theme";

export default function ProgramsShowcase() {
  const [currentLanguage, setCurrentLanguage] = useState<"en" | "ur">("en");
  const [filteredPrograms, setFilteredPrograms] = useState<ProgramItem[]>([]);

  useEffect(() => {
    const filtered = programs.programsList.filter((program) => program.showOnHomepage && program.language === currentLanguage).slice(0, 4);
    setFilteredPrograms(filtered);
  }, [currentLanguage]);

  const translations = programs.HomePage[currentLanguage];

  return (
    <section className="py-16 bg-white" style={{backgroundColor: theme.colors.background.primary}} dir={currentLanguage === "ur" ? "rtl" : "ltr"}>
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center mb-12">
          <div>
            <h2 className={`text-3xl font-bold text-[${theme.colors.text.primary}] ${currentLanguage === "ur" ? `font-[${theme.fonts.ur.primary}]` : `font-[${theme.fonts.en.primary}]`}`} style={{color: theme.colors.text.primary}}>
              {translations.title}
            </h2>
            <div className={`w-20 h-1 bg-[${theme.colors.primary}] mt-4`}></div>
          </div>
          <div className="flex gap-4 items-center">
            <button
              onClick={() => setCurrentLanguage(currentLanguage === "en" ? "ur" : "en")}
              className={`px-4 py-1 border rounded-lg transition-colors duration-300 cursor-pointer`}
              style={{
                backgroundColor: "transparent",
                color: theme.colors.primary,
                borderColor: theme.colors.primary,
                fontFamily: currentLanguage === "en" ? theme.fonts.ur.primary : theme.fonts.en.primary,
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
              {translations.switchLanguage}
            </button>
            <Link
              href="/programs"
              className={`px-6 py-2 rounded-lg transition-colors duration-300 cursor-pointer`}
              style={{
                backgroundColor: theme.colors.primary,
                color: "white",
                fontFamily: currentLanguage === "ur" ? theme.fonts.ur.primary : theme.fonts.en.primary,
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = theme.colors.primaryHover;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = theme.colors.primary;
              }}
            >
              {translations.viewAll}
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredPrograms.map((program) => (
            <Link href={`/programs/${program.slug}`} key={program.id}>
              <div className="group relative overflow-hidden rounded-lg shadow-lg h-[400px]">
                <div className="relative h-full">
                  <Image src={program.featuredImage} alt={program.title.text} fill className="object-cover group-hover:scale-110 transition-transform duration-300" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
                </div>
                <div className="absolute bottom-0 p-6 text-white">
                  <span
                    className={`inline-block bg-[${theme.colors.secondary}] text-[${theme.colors.primary}] px-3 py-1 rounded-full text-sm font-medium mb-3`}
                    style={{
                      fontFamily: currentLanguage === "ur" ? theme.fonts.ur.primary : theme.fonts.en.primary,
                    }}
                  >
                    {program.category.text}
                  </span>
                  <h3
                    className={`text-xl font-semibold mb-2 text-[${theme.colors.text.light}]`}
                    style={{
                      fontFamily: currentLanguage === "ur" ? theme.fonts.ur.primary : theme.fonts.en.primary,
                    }}
                  >
                    {program.title.text}
                  </h3>
                  <p
                    className={`text-sm mb-4 line-clamp-2 text-[${theme.colors.text.light}]`}
                    style={{
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
                            className={`text-xl font-bold text-[${theme.colors.secondary}]`}
                            style={{
                              fontFamily: currentLanguage === "ur" ? theme.fonts.ur.primary : theme.fonts.en.primary,
                            }}
                          >
                            {stat.value}
                            {stat.suffix || ""}
                          </div>
                          <div
                            className={`text-xs opacity-80 text-[${theme.colors.text.light}]`}
                            style={{
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
    </section>
  );
}
