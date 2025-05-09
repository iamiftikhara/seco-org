"use client";

import {useEffect, useState} from "react";
import Image from "next/image";
import {useParams} from "next/navigation";
import * as Icons from "react-icons/fa";
import { theme } from '@/config/theme';
import Script from 'next/script';

import type {ServiceDetail} from "@/types/services";
import {services} from "@/data/services";
import Navbar from "@/app/components/Navbar";
import Footer from "@/app/components/Footer";
import PageLoader from "@/app/components/PageLoader";
import LoadingSpinner from "@/app/components/LoadingSpinner";
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
  const [pageLoading, setPageLoading] = useState(true);
  const [dataLoading, setDataLoading] = useState(true);
  const [isImageLoaded, setIsImageLoaded] = useState(false);
  const [navigation, setNavigation] = useState<{prev: ServiceDetail | null; next: ServiceDetail | null}>({
    prev: null,
    next: null,
  });

  const IconComponent = service?.iconName ? Icons[service.iconName as keyof typeof Icons] : null;

  useEffect(() => {
    setPageLoading(false);
  }, []);

  useEffect(() => {
    const fetchServiceDetail = async () => {
      setDataLoading(true);
      try {
        // Update to use servicesList array
        const service = services.servicesList.find((s) => s.slug === params.slug);
        if (service) {
          setService(service);
          const currentIndex = services.servicesList.findIndex((s) => s.slug === params.slug);
          setNavigation({
            prev: currentIndex > 0 ? services.servicesList[currentIndex - 1] : null,
            next: currentIndex < services.servicesList.length - 1 ? services.servicesList[currentIndex + 1] : null,
          });
        }
      } catch (error) {
        console.error("Error:", error);
      }
      setDataLoading(false);
    };

    if (params.slug) {
      fetchServiceDetail();
    }
  }, [params.slug]);

  if (pageLoading) {
    return <PageLoader />;
  }



  const structuredData = service ? {
    "@context": "https://schema.org",
    "@type": "Service",
    "name": service.title.text,
    "description": service.shortDescription.text,
    "provider": {
      "@type": "Organization",
      "name": "SECO",
      "url": typeof window !== "undefined" ? window.location.origin : ""
    },
    "image": service.heroImage,
    "url": typeof window !== "undefined" ? window.location.href : "",
    "areaServed": {
      "@type": "Country",
      "name": "Pakistan"
    },
    "hasOfferCatalog": {
      "@type": "OfferCatalog",
      "name": service.title.text,
      "itemListElement": service.keyFeatures.map((feature) => ({
        "@type": "Offer",
        "itemOffered": {
          "@type": "Service",
          "name": feature.title.text,
          "description": feature.description?.text
        }
      }))
    },
    "serviceOutput": service.impact.map((item) => ({
      "@type": "Thing",
      "name": item.label.text,
      "value": item.value + (item.suffix || ""),
      "identifier": item.iconName
    })),
    "additionalType": "NonprofitService",
    "serviceType": service.title.text,
    "category": service.socialShare.hashtags.join(", "),
    "availableLanguage": [
      service.language === "en" ? "English" : "Urdu"
    ],
    "sameAs": [
      `https://twitter.com/${service.socialShare.twitterHandle.replace("@", "")}`
    ],
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": typeof window !== "undefined" ? window.location.href : "",
      "name": service.title.text,
      "description": service.fullDescription.text
    }
  } : null;

  return (
    <>
    {structuredData && (
      <Script
        id="structured-data"
        type="application/ld+json"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
    )}
      <Navbar />
      {dataLoading ? (
        <div className="min-h-screen flex flex-col items-center justify-center bg-white">
          <LoadingSpinner />
          <p className="text-gray-600 mt-4">Loading service details...</p>
        </div>
      ) : !service ? (
        <div className="min-h-screen flex flex-col items-center justify-center">
          <p className="text-xl text-gray-600">Service not found</p>
        </div>
      ) : (
        <div className="min-h-screen" style={{backgroundColor: theme.colors.background.primary}}>
          <div className="relative h-[calc(100vh-20rem)] overflow-hidden">
            <Image 
              src={service.heroImage} 
              alt={service.title.text} 
              fill 
              className={`object-cover transition-transform duration-[30s] ${isImageLoaded ? "scale-110" : "scale-100"}`} 
              onLoadingComplete={() => setIsImageLoaded(true)} 
              priority 
            />
          </div>

          <div className="max-w-7xl mx-auto px-4 -mt-10 relative z-10">
            <div className="bg-white rounded-lg shadow-xl p-8 text-center">
              <div className={`flex items-center justify-center ${service.language === 'ur' ? 'flex-row-reverse' : ''}`}>
                {IconComponent && <IconComponent className="text-5xl mx-3" style={{ color: theme.colors.primary }} />}
                <h1 
                  className="text-4xl font-bold"
                  style={{ 
                    color: theme.colors.text.primary,
                    fontFamily: service.language === 'ur' ? theme.fonts.ur.primary : theme.fonts.en.primary
                  }}
                >
                  {service.title.text}
                </h1>
              </div>
              <p 
                className="text-lg mt-4 max-w-3xl mx-auto"
                style={{ 
                  color: theme.colors.text.secondary,
                  fontFamily: service.language === 'ur' ? theme.fonts.ur.primary : theme.fonts.en.primary
                }}
              >
                {service.shortDescription.text}
              </p>
            </div>

            <div className="mt-12">
              <h2 
                className={`text-2xl font-bold mb-6 ${service.language === 'ur' ? 'text-right' : 'text-left'}`}
                style={{ 
                  color: theme.colors.text.primary,
                  fontFamily: service.language === 'ur' ? theme.fonts.ur.primary : theme.fonts.en.primary
                }}
              >
                {service.impactTitle.text}
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
                {service.impact.map((item, index) => {
                  const ImpactIcon = Icons[item.iconName as keyof typeof Icons];
                  return (
                    <div 
                      key={index} 
                      className="text-center p-6 bg-white rounded-lg shadow-md transform hover:scale-105 transition-transform"
                      style={{
                        fontFamily: item.label.language === 'ur' ? theme.fonts.ur.primary : theme.fonts.en.primary
                      }}
                    >
                      {ImpactIcon && <ImpactIcon className="text-4xl mx-auto mb-4" style={{ color: theme.colors.primary }} />}
                      <h3 className="text-3xl font-bold" style={{ color: theme.colors.primary }}>
                        <CountUpNumber end={item.value} suffix={item.suffix} />
                      </h3>
                      <p 
                        className="mt-2"
                        style={{ color: theme.colors.text.secondary,
                        fontFamily: item.label.language === 'ur' ? theme.fonts.ur.primary : theme.fonts.en.primary

                         }}
                      >
                        {item.label.text}
                      </p>
                    </div>
                  );
                })}
              </div>

              <h2 
                className={`text-2xl font-bold mb-6 ${service.language === 'ur' ? 'text-right' : 'text-left'}`}
                style={{ 
                  color: theme.colors.text.primary,
                  fontFamily: service.language === 'ur' ? theme.fonts.ur.secondary : theme.fonts.en.secondary
                }}
              >
                {service.keyFeaturesTitle.text}
              </h2>
              <ul className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-12">
                {service.keyFeatures.map((feature) => (
                  <li 
                    key={feature.id} 
                    className={`flex items-center ${service.language === 'ur' ? 'flex-row-reverse text-right' : ''}`}
                    style={{ color: theme.colors.text.secondary }}
                  >
                    <span className="w-2 h-2 rounded-full mx-3" style={{ backgroundColor: theme.colors.primary }}></span>
                    <div>
                      <h3 
                        className="font-semibold"
                        style={{ 
                          color: theme.colors.text.primary,
                          fontFamily: feature.title.language === 'ur' ? theme.fonts.ur.primary : theme.fonts.en.primary
                        }}
                      >
                        {feature.title.text}
                      </h3>
                      {feature.description && (
                        <p 
                          className="text-sm mt-1"
                          style={{ 
                            fontFamily: feature.description.language === 'ur' ? theme.fonts.ur.primary : theme.fonts.en.primary
                          }}
                        >
                          {feature.description.text}
                        </p>
                      )}
                    </div>
                  </li>
                ))}
              </ul>

              <div className="bg-gray-50 p-8 rounded-lg">
                <h2 
                  className={`text-2xl font-bold mb-6 ${service.language === 'ur' ? 'text-right' : 'text-left'}`}
                  style={{ 
                    color: theme.colors.text.primary,
                    fontFamily: service.language === 'ur' ? theme.fonts.ur.secondary : theme.fonts.en.secondary
                  }}
                >
                  {service.overviewTitle.text}
                </h2>
                <p 
                  className={`text-lg leading-relaxed ${service.language === 'ur'? 'text-right' : 'text-left'}`}
                  style={{ 
                    color: theme.colors.text.secondary,
                    fontFamily: service.language === 'ur' ? theme.fonts.ur.primary : theme.fonts.en.primary
                  }}
                >
                  {service.fullDescription.text}
                </p>
              </div>
            </div>

            {/* Add Social Share Component */}
            <div className="mt-8">
              <SocialShare
                title={service.socialShare.title.text}
                description={service.socialShare.description.text}
                url={typeof window !== 'undefined' ? window.location.href : ''}
                image={service.heroImage}
                language={service.language}
                hashtags={service.socialShare.hashtags}
                twitterHandle={service.socialShare.twitterHandle}
                ogType={service.socialShare.ogType}
              />
            </div>

            {/* Navigation Section */}
            <div className="max-w-7xl mx-auto py-12">
              <div className="flex justify-between items-center border-t border-gray-200 pt-8">
                {navigation.prev ? (
                  <Link
                    href={`/services/${navigation.prev.slug}`}
                    className="group flex items-center gap-2 px-4 py-2 rounded-lg transition-colors duration-300"
                    style={{
                      backgroundColor: theme.colors.background.secondary,
                      color: theme.colors.text.primary,
                      fontFamily: navigation.prev.language === 'ur' ? theme.fonts.ur.primary : theme.fonts.en.primary
                    }}
                  >
                    <FaArrowLeft className="group-hover:-translate-x-1 transition-transform duration-300" />
                    <div>
                      <div className="text-sm opacity-75">Previous Service</div>
                      <div className="font-medium">{navigation.prev.title.text}</div>
                    </div>
                  </Link>
                ) : (
                  <div />
                )}

                {navigation.next ? (
                  <Link
                    href={`/services/${navigation.next.slug}`}
                    className="group flex items-center gap-2 px-4 py-2 rounded-lg text-right transition-colors duration-300"
                    style={{
                      backgroundColor: theme.colors.background.secondary,
                      color: theme.colors.text.primary,
                      fontFamily: navigation.next.language === 'ur' ? theme.fonts.ur.primary : theme.fonts.en.primary
                    }}
                  >
                    <div>
                      <div className="text-sm opacity-75">Next Service</div>
                      <div className="font-medium">{navigation.next.title.text}</div>
                    </div>
                    <FaArrowRight className="group-hover:translate-x-1 transition-transform duration-300" />
                  </Link>
                ) : (
                  <div />
                )}
              </div>
            </div>
          </div>
        </div>
      )}
      <Footer />
    </>
  );
}
