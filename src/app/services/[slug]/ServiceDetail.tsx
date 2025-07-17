"use client";

import {useEffect, useState} from "react";
import Image from "next/image";
import {useParams} from "next/navigation";
import * as Icons from "react-icons/fa";
import {theme} from "@/config/theme";
import Script from "next/script";

import type {ServiceDetail} from "@/types/services";
import Navbar from "@/app/components/Navbar";
import Footer from "@/app/components/Footer";
import LoadingSpinner from "@/app/components/LoadingSpinner";
import DynamicError from "@/app/components/DynamicError";
import Link from "next/link";
import {FaArrowLeft, FaArrowRight} from "react-icons/fa";
import SocialShare from "@/app/components/SocialShare";

interface CountUpNumberProps {
  end: string | number;
  suffix?: string;
  duration?: number;
}

function CountUpNumber({end, suffix = "", duration = 5000}: CountUpNumberProps) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let startTime: number;
    const startValue = 0;
    const endValue = typeof end === "string" ? parseInt(end) : end;

    const animation = (currentTime: number) => {
      if (!startTime) startTime = currentTime;
      const progress = Math.min((currentTime - startTime) / duration, 1);
      const currentCount = Math.floor(progress * (endValue - startValue) + startValue);

      setCount(currentCount);

      if (progress < 1) {
        requestAnimationFrame(animation);
      }
    };

    requestAnimationFrame(animation);
  }, [end, duration]);

  return (
    <span>
      {count}
      {suffix}
    </span>
  );
}

export default function ServiceDetail() {
  const params = useParams();
  const [service, setService] = useState<ServiceDetail | null>(null);
  const [servicesList, setServicesList] = useState<ServiceDetail[]>([]);
  const [loading, setLoading] = useState(true);
  const [isImageLoaded, setIsImageLoaded] = useState(false);
  const [language, setLanguage] = useState<"en" | "ur" | "all">("en");
  const [navigation, setNavigation] = useState<{prev: ServiceDetail | null; next: ServiceDetail | null}>({prev: null, next: null});
  const [error, setError] = useState<string | null>(null);
  const [isMobile, setIsMobile] = useState(false);

  const IconComponent = service?.iconName ? Icons[service.iconName as keyof typeof Icons] : null;

  // Universal helpers for font, direction, and alignment
  const getFontFamily = () => (language === "ur" ? theme.fonts.ur.primary : theme.fonts.en.primary);
  const getDirection = () => (language === "ur" ? "rtl" : "ltr");
  const getTextAlign = () => (language === "ur" ? "text-right" : "text-left");
  const getFlexDirection = () => (language === "ur" ? "flex-row-reverse" : "");

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

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {

        // Fetch individual service and all services for navigation in parallel
        const [serviceResponse, allServicesResponse] = await Promise.all([fetch(`/api/services/${params.slug}`), fetch("/api/services")]);


       

        const serviceResult = await serviceResponse.json();

        if (!serviceResult.success) {
          throw new Error(serviceResult.error || "Service not found.");
        }

        if (!serviceResult.data) {
          throw new Error("No service data received");
        }

        console.log("Service found:", serviceResult.data.slug);
        setService(serviceResult.data);

        // Set up navigation if all services were fetched successfully
        if (allServicesResponse.ok) {
          const allServicesResult = await allServicesResponse.json();
          if (allServicesResult.success && allServicesResult.data?.servicesList) {
            setServicesList(allServicesResult.data.servicesList);

            const currentIndex = allServicesResult.data.servicesList.findIndex((s: ServiceDetail) => s.slug === params.slug);
            if (currentIndex !== -1) {
              setNavigation({
                prev: currentIndex > 0 ? allServicesResult.data.servicesList[currentIndex - 1] : null,
                next: currentIndex < allServicesResult.data.servicesList.length - 1 ? allServicesResult.data.servicesList[currentIndex + 1] : null,
              });
            }
          }
        }
      } catch (err) {
        console.error("Error fetching service data:", err);
        setError(err instanceof Error ? err.message : "Failed to load service");
      } finally {
        setLoading(false);
      }
    };
    if (params.slug) {
      fetchData();
    }
  }, [params.slug]);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-white">
        <LoadingSpinner />
        <p className="text-gray-600 mt-4">Loading service details...</p>
      </div>
    );
  }

  // Structured data for SEO (use selected language)
  const structuredData = service
    ? {
        "@context": "https://schema.org",
        "@type": "Service",
        name: language === "all" ? `${service.en.title.text} / ${service.ur.title.text}` : service[language].title.text,
        description: language === "all" ? `${service.en.shortDescription.text} / ${service.ur.shortDescription.text}` : service[language].shortDescription.text,
        provider: {
          "@type": "Organization",
          name: "SECO",
          url: typeof window !== "undefined" ? window.location.origin : "",
        },
        image: service.heroImage,
        url: typeof window !== "undefined" ? window.location.href : "",
        areaServed: {
          "@type": "Country",
          name: "Pakistan",
        },
        hasOfferCatalog: {
          "@type": "OfferCatalog",
          name: language === "all" ? `${service.en.title.text} / ${service.ur.title.text}` : service[language].title.text,
          itemListElement: (language === "all" ? [...(service.en.keyFeatures || []), ...(service.ur.keyFeatures || [])] : service[language].keyFeatures || []).map((feature) => ({
            "@type": "Offer",
            itemOffered: {
              "@type": "Service",
              name: feature.title.text,
              description: feature.description?.text,
            },
          })),
        },
        serviceOutput: (language === "all" ? [...(service.en.impact || []), ...(service.ur.impact || [])] : service[language].impact || []).map((item) => ({
          "@type": "Thing",
          name: item.label.text,
          value: item.value + (item.suffix || ""),
          identifier: item.iconName,
        })),
        additionalType: "NonprofitService",
        serviceType: language === "all" ? `${service.en.title.text} / ${service.ur.title.text}` : service[language].title.text,
        category: service.socialShare.hashtags.join(", "),
        availableLanguage: language === "all" ? ["English", "Urdu"] : [language === "en" ? "English" : "Urdu"],
        sameAs: [`https://twitter.com/${service.socialShare.twitterHandle.replace("@", "")}`],
        mainEntityOfPage: {
          "@type": "WebPage",
          "@id": typeof window !== "undefined" ? window.location.href : "",
          name: language === "all" ? `${service.en.title.text} / ${service.ur.title.text}` : service[language].title.text,
          description: language === "all" ? `${service.en.fullDescription.text} / ${service.ur.fullDescription.text}` : service[language].fullDescription.text,
        },
      }
    : null;

  if (error) {
    return (
      <>
        <Navbar />
        <DynamicError
          title={language === "ur" ? "خرابی ہوئی" : "Something Went Wrong"}
          message={error}
          onRetry={() => window.location.reload()}
          showBackButton={true}
          backUrl="/services"
          backLabel={language === "ur" ? "خدمات کی فہرست میں واپس" : "Back to Services"}
          language={language === "ur" ? "ur" : "en"}
          sectionName={language === "ur" ? "خدمات" : "Services"}
        />
        <Footer />
      </>
    );
  }

  if (!service) {
    return (
      <>
        <Navbar />
        <DynamicError
          title={language === "ur" ? "سروس نہیں ملی" : "Service Not Found"}
          message={language === "ur" ? "آپ جو سروس تلاش کر رہے ہیں وہ موجود نہیں یا ہٹا دیا گیا ہے۔" : "The service you're looking for doesn't exist or has been removed."}
          showBackButton={true}
          backUrl="/services"
          backLabel={language === "ur" ? "خدمات کی فہرست میں واپس" : "Back to Services"}
          language={language === "ur" ? "ur" : "en"}
          sectionName={language === "ur" ? "خدمات" : "Services"}
        />
        <Footer />
      </>
    );
  }

  return (
    <>
      {structuredData && <Script id="structured-data" type="application/ld+json" strategy="afterInteractive" dangerouslySetInnerHTML={{__html: JSON.stringify(structuredData)}} />}
      <Navbar />
        <div className="min-h-screen" style={{backgroundColor: theme.colors.background.primary}}>
          <div className="relative overflow-hidden" style={{height: isMobile ? "calc(100vh - 40rem)" : "calc(100vh - 15rem)"}}>
            <Image src={service.heroImage} alt={language === "all" ? `${service.en.title.text} / ${service.ur.title.text}` : service[language].title.text} fill className={`object-cover transition-transform duration-[30s] ${isImageLoaded ? "scale-110" : "scale-100"}`} onLoadingComplete={() => setIsImageLoaded(true)} priority />
          </div>

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-10 relative z-10">
            <div className="bg-white rounded-lg shadow-xl text-center" style={{padding: isMobile ? "1rem" : "2rem"}}>
              <div className={`flex ${isMobile ? "flex-col gap-3" : "flex-row"} items-center justify-center ${getFlexDirection()}`}>
                {IconComponent && <IconComponent className={isMobile ? "text-3xl" : "text-5xl mx-3"} style={{color: theme.colors.primary}} />}
                <h1
                  className={`font-bold ${isMobile ? "text-2xl text-center" : "text-4xl"}`}
                  style={{
                    color: theme.colors.text.primary,
                    fontFamily: getFontFamily(),
                  }}
                >
                  {language === "all" ? `${service.en.title.text} / ${service.ur.title.text}` : service[language].title.text}
                </h1>
              </div>
              <p
                className="text-lg mt-4 max-w-3xl mx-auto"
                style={{
                  color: theme.colors.text.secondary,
                  fontFamily: getFontFamily(),
                }}
              >
                {language === "all" ? `${service.en.shortDescription.text} / ${service.ur.shortDescription.text}` : service[language].shortDescription.text}
              </p>

              {/* Language Toggle Buttons */}
              <div className="mt-6 flex justify-center">
                <div className="flex gap-2">
                  <button
                    onClick={() => setLanguage("en")}
                    className={`px-4 py-2 rounded transition-colors duration-300 mr-4`}
                    style={{
                      backgroundColor: language === "en" ? theme.colors.primary : "transparent",
                      color: language === "en" ? "white" : theme.colors.text.primary,
                      border: `1px solid ${theme.colors.primary}`,
                      fontFamily: theme.fonts.en.primary,
                    }}
                  >
                    English
                  </button>
                  <button
                    onClick={() => setLanguage("ur")}
                    className={`px-4 py-2 rounded transition-colors duration-300`}
                    style={{
                      backgroundColor: language === "ur" ? theme.colors.primary : "transparent",
                      color: language === "ur" ? "white" : theme.colors.text.primary,
                      border: `1px solid ${theme.colors.primary}`,
                      fontFamily: theme.fonts.ur.primary,
                    }}
                  >
                    اردو
                  </button>
                </div>
              </div>
            </div>

            {/* Impact Section - Only show if impact data exists */}
            {((language === "all" && ((service.en.impact && service.en.impact.length > 0) || (service.ur.impact && service.ur.impact.length > 0))) || (language !== "all" && service[language].impact && service[language].impact.length > 0)) && (
              <div className="mt-12">
                <h2
                  className={`text-2xl font-bold mb-6 ${getTextAlign()}`}
                  style={{
                    color: theme.colors.text.primary,
                    fontFamily: getFontFamily(),
                  }}
                >
                  {language === "all" ? `${service.en.impactTitle.text} / ${service.ur.impactTitle.text}` : service[language].impactTitle.text}
                </h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
                  {(language === "all" ? [...(service.en.impact || []), ...(service.ur.impact || [])] : service[language].impact || []).map((item, index) => {
                    const ImpactIcon = Icons[item.iconName as keyof typeof Icons];
                    return (
                      <div
                        key={index}
                        className="text-center p-6 bg-white rounded-lg shadow-md transform hover:scale-105 transition-transform"
                        style={{
                          fontFamily: getFontFamily(),
                        }}
                      >
                        {ImpactIcon && <ImpactIcon className="text-4xl mx-auto mb-4" style={{color: theme.colors.primary}} />}
                        <h3 className="text-3xl font-bold" style={{color: theme.colors.primary}}>
                          <CountUpNumber end={item.value} suffix={item.suffix} />
                        </h3>
                        <p className="mt-2" style={{color: theme.colors.text.secondary, fontFamily: getFontFamily()}}>
                          {item.label.text}
                        </p>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Key Features Section - Only show if key features data exists */}
            {((language === "all" && ((service.en.keyFeatures && service.en.keyFeatures.length > 0) || (service.ur.keyFeatures && service.ur.keyFeatures.length > 0))) || (language !== "all" && service[language].keyFeatures && service[language].keyFeatures.length > 0)) && (
              <div className="mb-12">
                <h2
                  className={`text-2xl font-bold mb-6 ${getTextAlign()}`}
                  style={{
                    color: theme.colors.text.primary,
                    fontFamily: getFontFamily(),
                  }}
                >
                  {language === "all" ? `${service.en.keyFeaturesTitle.text} / ${service.ur.keyFeaturesTitle.text}` : service[language].keyFeaturesTitle.text}
                </h2>
                <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {(language === "all" ? [...(service.en.keyFeatures || []), ...(service.ur.keyFeatures || [])] : service[language].keyFeatures || []).map((feature) => (
                    <li key={feature.id} className={`flex items-center ${getFlexDirection()} ${getTextAlign()}`} style={{color: theme.colors.text.secondary}}>
                      <span className="w-2 h-2 rounded-full mx-3" style={{backgroundColor: theme.colors.primary}}></span>
                      <div>
                        <h3
                          className="font-semibold"
                          style={{
                            color: theme.colors.text.primary,
                            fontFamily: getFontFamily(),
                          }}
                        >
                          {feature.title.text}
                        </h3>
                        {feature.description && (
                          <p className="text-sm mt-1" style={{fontFamily: getFontFamily()}}>
                            {feature.description.text}
                          </p>
                        )}
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div className="bg-gray-50 p-8 rounded-lg">
              <h2
                className={`text-2xl font-bold mb-6 ${getTextAlign()}`}
                style={{
                  color: theme.colors.text.primary,
                  fontFamily: getFontFamily(),
                }}
              >
                {language === "all" ? `${service.en.overviewTitle.text} / ${service.ur.overviewTitle.text}` : service[language].overviewTitle.text}
              </h2>
              <p
                className={`text-lg leading-relaxed ${getTextAlign()}`}
                style={{
                  color: theme.colors.text.secondary,
                  fontFamily: getFontFamily(),
                }}
              >
                {language === "all" ? `${service.en.fullDescription.text} / ${service.ur.fullDescription.text}` : service[language].fullDescription.text}
              </p>
            </div>
          </div>

          {/* Add Social Share Component */}
          <div className="mt-8">
            <SocialShare
              title={service.socialShare?.title?.text || (language === "all" ? `${service.en.title.text} / ${service.ur.title.text}` : service[language].title.text)}
              description={service.socialShare?.description?.text || (language === "all" ? `${service.en.shortDescription.text} / ${service.ur.shortDescription.text}` : service[language].shortDescription.text)}
              url={typeof window !== "undefined" ? window.location.href : ""}
              image={service.heroImage}
              language={language === "all" ? "en" : language}
              hashtags={service.socialShare?.hashtags || []}
              twitterHandle={service.socialShare?.twitterHandle || ""}
              ogType={service.socialShare?.ogType || "article"}
            />
          </div>

          {/* Navigation Section */}
          <div
            className="max-w-7xl mx-auto border-t border-gray-200"
            style={{
              padding: isMobile ? "1rem" : "2rem 1rem",
              paddingTop: isMobile ? "1.5rem" : "2rem",
            }}
          >
            <div className={`flex ${isMobile ? "flex-col gap-4" : "flex-row"} justify-between items-stretch ${isMobile ? "" : "items-center"}`}>
              {navigation.prev ? (
                <Link
                  href={`/services/${navigation.prev.slug}`}
                  className="group flex items-center rounded-lg transition-colors duration-300"
                  style={{
                    backgroundColor: theme.colors.background.secondary,
                    color: theme.colors.text.primary,
                    fontFamily: getFontFamily(),
                    padding: isMobile ? "0.75rem" : "1rem",
                    gap: isMobile ? "0.5rem" : "0.75rem",
                    width: isMobile ? "100%" : "auto",
                  }}
                >
                  <FaArrowLeft className="group-hover:-translate-x-1 transition-transform duration-300 flex-shrink-0" style={{fontSize: isMobile ? "0.875rem" : "1rem"}} />
                  <div className={isMobile ? "min-w-0 flex-1" : ""}>
                    <div className="opacity-75" style={{fontSize: isMobile ? "0.75rem" : "0.875rem"}}>
                      Previous Service
                    </div>
                    <div className={`font-medium ${isMobile ? "truncate" : ""}`} style={{fontSize: isMobile ? "0.875rem" : "1rem"}}>
                      {language === "all" ? `${navigation.prev.en.title.text} / ${navigation.prev.ur.title.text}` : navigation.prev[language].title.text}
                    </div>
                  </div>
                </Link>
              ) : (
                <div style={{width: isMobile ? "100%" : "auto"}} />
              )}

              {navigation.next ? (
                <Link
                  href={`/services/${navigation.next.slug}`}
                  className="group flex items-center rounded-lg transition-colors duration-300"
                  style={{
                    backgroundColor: theme.colors.background.secondary,
                    color: theme.colors.text.primary,
                    fontFamily: getFontFamily(),
                    padding: isMobile ? "0.75rem" : "1rem",
                    gap: isMobile ? "0.5rem" : "0.75rem",
                    width: isMobile ? "100%" : "auto",
                  }}
                >
                  <div className={`${isMobile ? "min-w-0 flex-1 text-right" : "text-left"}`}>
                    <div className="opacity-75" style={{fontSize: isMobile ? "0.75rem" : "0.875rem"}}>
                      Next Service
                    </div>
                    <div className={`font-medium ${isMobile ? "truncate" : ""}`} style={{fontSize: isMobile ? "0.875rem" : "1rem"}}>
                      {language === "all" ? `${navigation.next.en.title.text} / ${navigation.next.ur.title.text}` : navigation.next[language].title.text}
                    </div>
                  </div>
                  <FaArrowRight className="group-hover:translate-x-1 transition-transform duration-300 flex-shrink-0" style={{fontSize: isMobile ? "0.875rem" : "1rem"}} />
                </Link>
              ) : (
                <div style={{width: isMobile ? "100%" : "auto"}} />
              )}
            </div>
          </div>
        </div>
      <Footer />
    </>
  );
}
