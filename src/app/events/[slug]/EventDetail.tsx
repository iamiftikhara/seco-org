"use client";

import {useState, useEffect} from "react";
import {useParams} from "next/navigation";
import Image from "next/image";
import Navbar from "@/app/components/Navbar";
import Footer from "@/app/components/Footer";
import {theme} from "@/config/theme";
import Link from "next/link";
import {FaArrowLeft, FaArrowRight} from "react-icons/fa";
// import {events} from "@/data/events";
import LoadingSpinner from "@/app/components/LoadingSpinner";
import styles from "../styles/EventContent.module.css";
import SocialShare from "@/app/components/SocialShare";
import Script from 'next/script';

import type { EventDetail } from '@/types/events';

export default function EventDetailClient() {
  const params = useParams();
  const [event, setEvent] = useState<EventDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedLanguage, setSelectedLanguage] = useState<"en" | "ur">("en");
  const [navigation, setNavigation] = useState<{prev: EventDetail | null; next: EventDetail | null}>({prev: null, next: null});
  const [isMobile, setIsMobile] = useState(false);

  // Universal variables for font family and direction
  const currentFontFamily = selectedLanguage === 'ur' ? theme.fonts.ur.primary : theme.fonts.en.primary;
  const currentDirection = selectedLanguage === 'ur' ? 'rtl' : 'ltr';
  const isRTL = selectedLanguage === 'ur';

  // Mobile detection
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);

    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    const fetchEventData = async () => {
      try {
        const response = await fetch(`/api/events/${params.slug}`);
        const data = await response.json();

        if (data.success) {
          setEvent(data.data.event);
          setNavigation({
            prev: data.data.navigation.prev,
            next: data.data.navigation.next,
          });
        }
      } catch (error) {
        console.error("Error fetching event data:", error);
      }
      setLoading(false);
    };

    if (params.slug) {
      fetchEventData();
    }
  }, [params.slug]);

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center">
        <div className="flex flex-col items-center">
          <LoadingSpinner />
          <p className="text-gray-600 mt-4">Loading event...</p>
        </div>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center">
        <p className="text-xl text-gray-600">Event not found</p>
      </div>
    );
  }

  // Update content images extraction to match new structure
  // const contentImages =
  //   event?.content?.text?.match(/<img[^>]+src="([^">]+)"/g)?.map((img: string) => {
  //     const src = img.match(/src="([^">]+)"/)?.[1];
  //     return src;
  //   }) || [];


  const eventData = event[selectedLanguage as keyof typeof event] as any;

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Event",
    url: `/events/${event.slug}`,
    name: eventData?.title?.text || event.en?.title?.text,
    description: eventData?.shortDescription?.text || event.en?.shortDescription?.text,
    image: event.featuredImage,
    startDate: event.date,
    endDate: event.date,
    location: {
      "@type": "Place",
      name: eventData?.location?.text || event.en?.location?.text || "SECO",
      address: {
        "@type": "PostalAddress",
        addressLocality: eventData?.location?.text || event.en?.location?.text || "Quetta, Balochistan, PK",
        addressRegion: "Balochistan",
        addressCountry: "PK"
      }
    },
    organizer: {
      "@type": "Organization",
      name: "SECO",
      url: "https://seco-org.vercel.app"
    },
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "PKR",
      availability: event.status,
      validFrom: event.date
    }
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
      <div className="min-h-screen" style={{backgroundColor: theme.colors.background.primary}}>
        {/* Hero Section */}
        <div className={`relative w-full overflow-hidden ${isMobile ? 'h-[50vh]' : 'h-[calc(100vh-20rem)]'}`}>
          <Image src={event.featuredImage} alt={eventData?.title?.text || 'Event'} fill className={`object-cover w-full ${event.status === "past" ? "grayscale" : ""}`} priority sizes="100vw" quality={100} />
          <div className="absolute inset-0" style={{backgroundColor: theme.colors.background.overlay}}></div>

          {/* Status Badge */}
          <div className={`absolute ${isMobile ? 'top-4' : 'top-20'} ${isRTL ? "left-4" : "right-4"} z-10 flex items-center gap-1.5 rounded-full`}>
            {event.status === "upcoming" && (
              <>
                <span
                  className={`px-2 py-1 rounded-full font-medium ${isMobile ? 'text-xs' : 'text-sm'}`}
                  style={{
                    backgroundColor: theme.colors.status.upcoming + "33",
                    color: theme.colors.status.upcoming,
                    fontFamily: currentFontFamily,
                  }}
                >
                  {selectedLanguage === "en" ? "Upcoming" : "آنے والا"}
                </span>
                <span className="w-2 h-2 rounded-full animate-[blink_1.5s_ease-in-out_infinite]" style={{backgroundColor: theme.colors.status.upcomingBlink}}></span>
              </>
            )}
            {event.status === "past" && (
              <span
                className={`px-2 py-1 rounded-full font-medium ${isMobile ? 'text-xs' : 'text-sm'}`}
                style={{
                  backgroundColor: theme.colors.status.past + "33",
                  color: theme.colors.status.past,
                  fontFamily: currentFontFamily,
                }}
              >
                {selectedLanguage === "en" ? "Past" : "گزشتہ"}
              </span>
            )}
          </div>
        </div>

        {/* Language Toggle */}
        <div className={`max-w-7xl mx-auto px-4 ${isMobile ? 'pt-4' : 'pt-8'}`}>
          <div className="flex justify-center mb-6">
            <div className={`flex gap-2 p-1 rounded-lg ${isMobile ? 'w-full max-w-xs' : ''}`} style={{ backgroundColor: theme.colors.background.secondary }}>
              <button
                onClick={() => setSelectedLanguage('en')}
                className={`${isMobile ? 'flex-1 px-3 py-2 text-sm' : 'px-4 py-2'} rounded-md transition-colors duration-200 ${
                  selectedLanguage === 'en' ? 'text-white' : ''
                }`}
                style={{
                  backgroundColor: selectedLanguage === 'en' ? theme.colors.primary : 'transparent',
                  color: selectedLanguage === 'en' ? 'white' : theme.colors.text.primary,
                  fontFamily: theme.fonts.en.primary
                }}
              >
                English
              </button>
              <button
                onClick={() => setSelectedLanguage('ur')}
                className={`${isMobile ? 'flex-1 px-3 py-2 text-sm' : 'px-4 py-2'} rounded-md transition-colors duration-200 ${
                  selectedLanguage === 'ur' ? 'text-white' : ''
                }`}
                style={{
                  backgroundColor: selectedLanguage === 'ur' ? theme.colors.primary : 'transparent',
                  color: selectedLanguage === 'ur' ? 'white' : theme.colors.text.primary,
                  fontFamily: theme.fonts.ur.primary
                }}
              >
                اردو
              </button>
            </div>
          </div>
        </div>

        {/* Content Section */}
        <div className={`max-w-7xl mx-auto px-4 ${isMobile ? 'py-6' : 'py-12'}`} style={{direction: currentDirection}}>
          {/* Title with Status Badge */}
          <div className={`${isMobile ? 'flex-col items-start gap-2' : 'flex items-center gap-4'} mb-4`}>
            <h1
              className={`${isMobile ? 'text-2xl' : 'text-4xl'} font-bold ${isMobile ? 'mb-2' : ''} ${isRTL && !isMobile ? "order-2" : "order-1"}`}
              style={{
                color: theme.colors.text.primary,
                fontFamily: currentFontFamily,
                textAlign: isRTL ? "right" : "left",
              }}
            >
              {eventData?.title?.text}
            </h1>

            <div className={`flex items-center gap-1.5 ${isRTL && !isMobile ? "order-1" : "order-2"}`}>
              {event.status === "upcoming" && (
                <>
                  <span
                    className="px-2 py-1 rounded-full text-xs font-medium"
                    style={{
                      backgroundColor: theme.colors.status.upcoming,
                      color: theme.colors.text.light,
                      fontFamily: currentFontFamily,
                    }}
                  >
                    {selectedLanguage === "en" ? "Upcoming" : "آنے والا"}
                  </span>
                  <span className="w-2 h-2 rounded-full animate-[blink_1.5s_ease-in-out_infinite]" style={{backgroundColor: theme.colors.status.upcomingBlink}}></span>
                </>
              )}
              {event.status === "past" && (
                <span
                  className="px-2 py-1 rounded-full text-xs font-medium"
                  style={{
                    backgroundColor: theme.colors.status.past + "33",
                    color: theme.colors.status.past,
                    fontFamily: currentFontFamily,
                  }}
                >
                  {selectedLanguage === "en" ? "Past" : "گزشتہ"}
                </span>
              )}
            </div>
          </div>
          {/* Description */}
          <p
            className={`${isMobile ? 'text-base' : 'text-lg'} mb-6`}
            style={{
              color: theme.colors.text.secondary,
              fontFamily: currentFontFamily,
              textAlign: isRTL ? "right" : "left",
            }}
          >
            {eventData?.shortDescription?.text}
          </p>

          {/* Date, Time, and Location */}
          <div className={`flex flex-wrap items-center ${isMobile ? 'gap-2 mb-6' : 'gap-4 mb-8'}`}>
            <span
              className={`${isMobile ? 'px-3 py-1.5 text-sm' : 'px-4 py-2'} rounded-full font-medium`}
              style={{
                backgroundColor: theme.colors.secondary,
                color: theme.colors.primary,
                fontFamily: currentFontFamily,
              }}
            >
              {new Date(event.date).toLocaleDateString(selectedLanguage === "en" ? "en-US" : "ur-PK", {
                day: "numeric",
                month: isMobile ? "short" : "long",
                year: "numeric",
              })}
            </span>
            {event.status === "upcoming" && eventData?.time && (
              <span
                className={`${isMobile ? 'px-3 py-1.5 text-sm' : 'px-4 py-2'} rounded-full font-medium`}
                style={{
                  backgroundColor: theme.colors.status.upcoming,
                  color: theme.colors.text.light,
                  fontFamily: currentFontFamily,
                }}
              >
                {eventData.time.text}
              </span>
            )}
            {eventData?.location && (
              <span
                className={`${isMobile ? 'px-3 py-1.5 text-sm' : 'px-4 py-2'} rounded-full font-medium`}
                style={{
                  backgroundColor: theme.colors.primary,
                  color: theme.colors.text.light,
                  fontFamily: currentFontFamily,
                }}
              >
                {eventData.location.text}
              </span>
            )}
          </div>

          {/* Content */}
          <div
            className={`prose max-w-none ${styles["events-content-parent"]} ${isMobile ? 'prose-sm' : ''}`}
            style={{
              color: theme.colors.text.secondary,
              fontFamily: currentFontFamily,
              textAlign: isRTL ? "right" : "left",
            }}
            dangerouslySetInnerHTML={{
              __html: `<div style="
                --heading-font: ${currentFontFamily};
                --heading-color: ${theme.colors.text.primary};
                --text-font: ${currentFontFamily};
                --text-color: ${theme.colors.text.secondary};
              ">${eventData?.content?.text || eventData?.fullDescription?.text || ''}</div>`,
            }}
          />

          {/* Outcome Section (for past events) */}
          {event.status === "past" && eventData?.outcome && (
            <div className={`${isMobile ? 'mt-6 p-4' : 'mt-8 p-6'} rounded-lg`} style={{ backgroundColor: theme.colors.background.secondary }}>
              <h3
                className={`${isMobile ? 'text-lg' : 'text-xl'} font-semibold mb-4`}
                style={{
                  color: theme.colors.text.primary,
                  fontFamily: currentFontFamily,
                  textAlign: isRTL ? "right" : "left"
                }}
              >
                {selectedLanguage === "en" ? "Event Outcome" : "پروگرام کا نتیجہ"}
              </h3>
              <p
                className={isMobile ? 'text-sm' : ''}
                style={{
                  color: theme.colors.text.secondary,
                  fontFamily: currentFontFamily,
                  textAlign: isRTL ? "right" : "left"
                }}
              >
                {eventData.outcome.text}
              </p>
            </div>
          )}

          {/* Add Social Share Component */}
          <div className="mt-8">
            <SocialShare
              title={event.socialShare.title.text}
              description={event.socialShare.description.text}
              url={typeof window !== "undefined" ? window.location.href : ""}
              image={event.featuredImage}
              language={selectedLanguage}
              hashtags={event.socialShare.hashtags}
              twitterHandle={event.socialShare.twitterHandle}
              ogType={event.socialShare.ogType}
            />
          </div>

          {/* Navigation */}
          <div className={`${isMobile ? 'space-y-3' : 'flex justify-between items-center'} border-t border-gray-200 ${isMobile ? 'pt-6 mt-8' : 'pt-8 mt-12'}`}>
            {navigation.prev ? (
              <Link
                href={`/events/${navigation.prev.slug}`}
                className={`group flex items-center ${isMobile ? 'justify-between px-4 py-3 w-full' : 'gap-2 px-4 py-2'} rounded-lg transition-colors duration-300`}
                style={{
                  backgroundColor: theme.colors.background.secondary,
                  color: theme.colors.text.primary,
                  fontFamily: currentFontFamily,
                }}
              >
                {isMobile ? (
                  <>
                    <div className="flex items-center gap-3">
                      <FaArrowLeft className={`${isRTL ? "rotate-180" : ""} group-hover:-translate-x-1 transition-transform duration-300 text-lg`} style={{ color: theme.colors.primary }} />
                      <div className={isRTL ? "text-right" : ""}>
                        <div className="text-xs opacity-75">{selectedLanguage === "en" ? "Previous Event" : "پچھلا پروگرام"}</div>
                        <div className="font-medium text-sm">{(navigation.prev[selectedLanguage as 'en' | 'ur'] as any)?.title?.text}</div>
                      </div>
                    </div>
                  </>
                ) : (
                  <>
                    <FaArrowLeft className={`${isRTL ? "rotate-180" : ""} group-hover:-translate-x-1 transition-transform duration-300`} />
                    <div className={isRTL ? "text-right" : ""}>
                      <div className="text-sm opacity-75">{selectedLanguage === "en" ? "Previous Event" : "پچھلا پروگرام"}</div>
                      <div className="font-medium">{(navigation.prev[selectedLanguage as 'en' | 'ur'] as any)?.title?.text}</div>
                    </div>
                  </>
                )}
              </Link>
            ) : (
              !isMobile && <div />
            )}

            {navigation.next && (
              <Link
                href={`/events/${navigation.next.slug}`}
                className={`group flex items-center ${isMobile ? 'justify-between px-4 py-3 w-full' : 'gap-2 px-4 py-2'} rounded-lg transition-colors duration-300`}
                style={{
                  backgroundColor: theme.colors.background.secondary,
                  color: theme.colors.text.primary,
                  fontFamily: currentFontFamily,
                }}
              >
                {isMobile ? (
                  <>
                    <div className="flex items-center gap-3 flex-1 me-2">
                      <div className={`${isRTL ? "text-left" : "text-right"} flex-1`}>
                        <div className="text-xs opacity-75">{selectedLanguage === "en" ? "Next Event" : "اگلا پروگرام"}</div>
                        <div className="font-medium text-sm">{(navigation.next[selectedLanguage as 'en' | 'ur'] as any)?.title?.text}</div>
                      </div>
                    </div>
                    <FaArrowRight className={`${isRTL ? "rotate-180" : ""} group-hover:translate-x-1 transition-transform duration-300 text-lg`} style={{ color: theme.colors.primary }} />
                  </>
                ) : (
                  <>
                    <div className={isRTL ? "text-right" : ""}>
                      <div className="text-sm opacity-75">{selectedLanguage === "en" ? "Next Event" : "اگلا پروگرام"}</div>
                      <div className="font-medium">{(navigation.next[selectedLanguage as 'en' | 'ur'] as any)?.title?.text}</div>
                    </div>
                    <FaArrowRight className={`${isRTL ? "rotate-180" : ""} group-hover:translate-x-1 transition-transform duration-300`} />
                  </>
                )}
              </Link>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
