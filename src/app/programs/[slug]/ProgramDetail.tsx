"use client";

import {useEffect, useState} from "react";
import {useParams} from "next/navigation";
import Image from "next/image";
import {FaRegClock, FaMapMarkerAlt, FaArrowLeft, FaArrowRight} from "react-icons/fa";
import {ProgramItem} from "@/types/programs";
import {programService} from "@/app/programs/utils/programService";
import {theme} from "@/config/theme";
import Navbar from "@/app/components/Navbar";
import Footer from "@/app/components/Footer";
import CountUp from "react-countup";
import Link from "next/link";
import SocialShare from "@/app/components/SocialShare";
import Head from "next/head";

export default function ProgramDetail() {
  const params = useParams();
  const [program, setProgram] = useState<ProgramItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [isImageLoaded, setIsImageLoaded] = useState(false);
  const [currentLanguage, setCurrentLanguage] = useState<"en" | "ur">("en");
  const [navigation, setNavigation] = useState<{prev: ProgramItem | null; next: ProgramItem | null}>({prev: null, next: null});

  useEffect(() => {
    const fetchProgramData = async () => {
      try {
        const [programResponse, navResponse] = await Promise.all([programService.getProgramBySlug(params.slug as string), programService.getProgramNavigation(params.slug as string, currentLanguage)]);

        if (programResponse.success && programResponse.data) {
          setProgram(programResponse.data);
          setCurrentLanguage(programResponse.data.language || "en");
        }
        if (navResponse.success) {
          setNavigation(navResponse.data);
        }
      } catch (error) {
        console.error("Error fetching program data:", error);
      }
      setLoading(false);
    };

    if (params.slug) {
      fetchProgramData();
    }
  }, [params.slug, currentLanguage]);

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  if (!program) {
    return <div className="min-h-screen flex items-center justify-center">Program not found</div>;
  }

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Project",
    "name": program.title.text,
    "description": program.shortDescription.text,
    "image": program.featuredImage,
    "url": typeof window !== "undefined" ? window.location.href : "",
    "provider": {
      "@type": "Organization",
      "name": "SECO",
      "url": typeof window !== "undefined" ? window.location.origin : ""
    },
    "areaServed": program.coverage.text,
    "duration": program.duration.text,
    "category": program.category.text,
    "partner": program.partners?.map(partner => ({
      "@type": "Organization",
      "name": partner.name.text,
      "image": partner.logo
    }))
  };

  return (
    <>
      <Head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(jsonLd)
          }}
        />
      </Head>
      <Navbar />
      <div
        className="min-h-screen bg-white"
        dir={currentLanguage === "ur" ? "rtl" : "ltr"}
        style={{
          fontFamily: currentLanguage === "ur" ? theme.fonts.ur.primary : theme.fonts.en.primary,
        }}
      >
        <div className="relative h-[calc(100vh-20rem)] overflow-hidden">
          <Image src={program.featuredImage} alt={program.title.text} fill className={`object-cover transition-transform duration-[20s] ${isImageLoaded ? "scale-110" : "scale-100"}`} onLoadingComplete={() => setIsImageLoaded(true)} priority />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-8 text-white max-w-7xl mx-auto">
            <span className="inline-block bg-[#FFD700] text-[#4B0082] px-4 py-2 rounded-full text-sm font-medium mb-3">{program.category.text}</span>
            <h1 className="text-4xl font-bold mb-3">{program.title.text}</h1>
            <p className="text-lg text-gray-200 max-w-2xl">{program.shortDescription.text}</p>
          </div>
        </div>

        <div className="bg-gradient-to-r from-[#4B0082] to-[#6B238E] text-white py-12">
          <div className="max-w-7xl mx-auto px-4">
            <h2 className="text-2xl font-bold text-center mb-2">{currentLanguage === "ur" ? "پروگرام کا اثر" : "Program Impact"}</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
              {[...program.impact, ...program.iconStats].map((stat, index) => {
                const numericValue = parseInt(stat.value?.replace(/[^0-9]/g, "") || "0");
                // Type guard to check if it's an impact stat
                const isImpactStat = "suffix" in stat;

                return (
                  <div key={index} className="text-center p-4 backdrop-blur-sm bg-white/5 rounded-lg">
                    <div className="text-2xl font-bold text-[#FFD700] mb-1">
                      <CountUp end={numericValue} duration={5} separator="," />
                      {isImpactStat ? stat.suffix : ""}
                    </div>
                    <div className="text-xs text-gray-200">{stat.label.text}</div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 py-16">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            <div className="lg:col-span-2">
              <h2 className="text-3xl font-bold text-gray-900 mb-6">{currentLanguage === "ur" ? "پروگرام کے بارے میں" : "About the Program"}</h2>
              <div className="prose max-w-none">
                <p className="text-gray-600 leading-relaxed whitespace-pre-line">{program.fullDescription.text}</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-12">
                <div className="bg-gray-50 p-6 rounded-xl">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{currentLanguage === "ur" ? "دورانیہ" : "Duration"}</h3>
                  <div className="flex items-center text-gray-600">
                    <FaRegClock className={`text-[#4B0082] ${currentLanguage === "ur" ? "ml-2" : "mr-2"}`} />
                    <span>{program.duration.text}</span>
                  </div>
                </div>
                <div className="bg-gray-50 p-6 rounded-xl">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{currentLanguage === "ur" ? "علاقہ جات" : "Coverage"}</h3>
                  <div className="flex items-start text-gray-600">
                    <FaMapMarkerAlt className={`text-[#4B0082] mt-1 ${currentLanguage === "ur" ? "ml-2" : "mr-2"}`} />
                    <span>{program.coverage.text}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="lg:col-span-1">
              <div className="bg-gray-50 p-8 rounded-xl">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">{currentLanguage === "ur" ? "ہمارے پارٹنرز" : "Our Partners"}</h2>
                <div className="space-y-6">
                  {program.partners?.map((partner, index) => (
                    <div key={index} className={`flex items-center ${currentLanguage === "ur" ? "space-x-reverse" : ""} space-x-4`}>
                      <div className="relative w-16 h-16">
                        <Image src={partner.logo} alt={partner.name.text} fill className="object-contain" />
                      </div>
                      <span className="text-gray-700 font-medium">{partner.name.text}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Add Social Share Component */}
        <div className="mt-8">
          <SocialShare title={program.socialShare.title.text} description={program.socialShare.description.text} url={typeof window !== "undefined" ? window.location.href : ""} image={program.featuredImage} language={program.language} hashtags={program.socialShare.hashtags} twitterHandle={program.socialShare.twitterHandle} ogType={program.socialShare.ogType} />
        </div>

        {/* Navigation Section */}
        <div className="max-w-7xl mx-auto px-4 py-12">
          <div className="flex justify-between items-center border-t border-gray-200 pt-8">
            {navigation.prev ? (
              <Link href={`/programs/${navigation.prev.slug}`} className="group flex items-center gap-2 px-4 py-2 rounded-lg transition-colors duration-300 bg-gray-50 hover:bg-gray-100">
                {currentLanguage === "ur" ? (
                  <>
                    <div>
                      <div className="text-sm text-gray-500">پچھلا پروگرام</div>
                      <div className="font-medium text-gray-900">{navigation.prev.title.text}</div>
                    </div>
                    <FaArrowRight className="group-hover:translate-x-1 transition-transform duration-300 text-[#4B0082]" />
                  </>
                ) : (
                  <>
                    <FaArrowLeft className="group-hover:-translate-x-1 transition-transform duration-300 text-[#4B0082]" />
                    <div>
                      <div className="text-sm text-gray-500">Previous Program</div>
                      <div className="font-medium text-gray-900">{navigation.prev.title.text}</div>
                    </div>
                  </>
                )}
              </Link>
            ) : (
              <div />
            )}

            {navigation.next ? (
              <Link href={`/programs/${navigation.next.slug}`} className="group flex items-center gap-2 px-4 py-2 rounded-lg transition-colors duration-300 bg-gray-50 hover:bg-gray-100">
                {currentLanguage === "ur" ? (
                  <>
                    <FaArrowLeft className="group-hover:-translate-x-1 transition-transform duration-300 text-[#4B0082]" />
                    <div>
                      <div className="text-sm text-gray-500">اگلا پروگرام</div>
                      <div className="font-medium text-gray-900">{navigation.next.title.text}</div>
                    </div>
                  </>
                ) : (
                  <>
                    <div>
                      <div className="text-sm text-gray-500">Next Program</div>
                      <div className="font-medium text-gray-900">{navigation.next.title.text}</div>
                    </div>
                    <FaArrowRight className="group-hover:translate-x-1 transition-transform duration-300 text-[#4B0082]" />
                  </>
                )}
              </Link>
            ) : (
              <div />
            )}
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
