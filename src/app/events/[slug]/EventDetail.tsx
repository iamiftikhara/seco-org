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
import {eventService} from "../utils/eventService";
import LoadingSpinner from "@/app/components/LoadingSpinner";
import styles from "../styles/EventContent.module.css";
import SocialShare from "@/app/components/SocialShare";

import type { EventItem } from '@/types/events';

export default function EventDetailClient() {
  const params = useParams();
  const [event, setEvent] = useState<EventItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedLanguage] = useState<"en" | "ur">("en");
  const [navigation, setNavigation] = useState<{prev: EventItem | null; next: EventItem | null}>({prev: null, next: null});

  // Update the useEffect to use the service
  useEffect(() => {
    const fetchEventData = async () => {
      try {
        const [eventResponse, navResponse] = await Promise.all([eventService.getEventBySlug(params.slug as string), eventService.getEventNavigation(params.slug as string)]);

        if (eventResponse.success) {
          setEvent(eventResponse.data || null);
        }
        if (navResponse.success) {
          setNavigation({
            prev: navResponse.data?.prev || null,
            next: navResponse.data?.next || null,
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

  return (
    <>
      <Navbar />
      <div className="min-h-screen" style={{backgroundColor: theme.colors.background.primary}}>
        {/* Hero Section */}
        <div className="relative h-[calc(100vh-20rem)] w-full overflow-hidden">
          <Image src={event.featuredImage} alt={event.title.text} fill className={`object-cover w-full ${event.status === "past" ? "grayscale" : ""}`} priority sizes="100vw" quality={100} />
          <div className="absolute inset-0" style={{backgroundColor: theme.colors.background.overlay}}></div>

          {/* Status Badge */}
          <div className={`absolute top-20 ${selectedLanguage === "ur" ? "left-4" : "right-4"} z-10 flex items-center gap-1.5 rounded-full`}>
            {event.status === "upcoming" && (
              <>
                <span
                  className="px-2 py-1 rounded-full text-xs font-medium"
                  style={{
                    backgroundColor: theme.colors.status.upcoming + "33",
                    color: theme.colors.status.upcoming,
                    fontFamily: event.title.language === "ur" ? theme.fonts.ur.primary : theme.fonts.en.primary,
                  }}
                >
                  {event.title.language === "en" ? "Upcoming" : "آنے والا"}
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
                  fontFamily: event.title.language === "ur" ? theme.fonts.ur.primary : theme.fonts.en.primary,
                }}
              >
                {event.title.language === "en" ? "Past" : "گزشتہ"}
              </span>
            )}
          </div>
        </div>

        {/* Content Section */}
        <div className="max-w-7xl mx-auto px-4 py-12" style={{direction: event.title.language === "ur" ? "rtl" : "ltr"}}>
          {/* Title with Status Badge */}
          <div className="flex items-center gap-4 mb-4">
            <h1
              className={`text-4xl font-bold ${event.title.language === "ur" ? "order-2" : "order-1"}`}
              style={{
                color: theme.colors.text.primary,
                fontFamily: event.title.language === "ur" ? theme.fonts.ur.primary : theme.fonts.en.primary,
                textAlign: event.title.language === "ur" ? "right" : "left",
              }}
            >
              {event.title.text}
            </h1>

            <div className={`flex items-center gap-1.5 ${selectedLanguage === "ur" ? "order-1" : "order-2"}`}>
              {event.status === "upcoming" && (
                <>
                  <span
                    className="px-2 py-1 rounded-full text-xs font-medium"
                    style={{
                      backgroundColor: theme.colors.status.upcoming,
                      color: theme.colors.text.light,
                      fontFamily: event.title.language === "ur" ? theme.fonts.ur.primary : theme.fonts.en.primary,
                    }}
                  >
                    {event.title.language === "en" ? "Upcoming" : "آنے والا"}
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
                    fontFamily: event.title.language === "ur" ? theme.fonts.ur.primary : theme.fonts.en.primary,
                  }}
                >
                  {event.title.language === "en" ? "Past" : "گزشتہ"}
                </span>
              )}
            </div>
          </div>
          {/* Description */}
          <p
            className="text-lg mb-6"
            style={{
              color: theme.colors.text.secondary,
              fontFamily: event.shortDescription.language === "ur" ? theme.fonts.ur.primary : theme.fonts.en.primary,
              textAlign: event.shortDescription.language === "ur" ? "right" : "left",
            }}
          >
            {event.shortDescription.text}
          </p>

          {/* Date, Time, and Location */}
          <div className={`flex flex-wrap items-center gap-4 mb-8 ${selectedLanguage === "ur" ? "flex-row-reverse" : ""}`}>
            <span
              className="px-4 py-2 rounded-full font-medium"
              style={{
                backgroundColor: theme.colors.secondary,
                color: theme.colors.primary,
                fontFamily: event.title.language === "ur" ? theme.fonts.ur.primary : theme.fonts.en.primary,
              }}
            >
              {new Date(event.date).toLocaleDateString(event.title.language === "en" ? "en-US" : "ur-PK", {
                day: "numeric",
                month: "long",
                year: "numeric",
              })}
            </span>
            {event.status === "upcoming" && event.time && (
              <span
                className="px-4 py-2 rounded-full font-medium"
                style={{
                  backgroundColor: theme.colors.status.upcoming,
                  color: theme.colors.text.light,
                  fontFamily: event.time.language === "ur" ? theme.fonts.ur.primary : theme.fonts.en.primary,
                }}
              >
                {event.time.text}
              </span>
            )}
            {event.location && (
              <span
                className="px-4 py-2 rounded-full font-medium"
                style={{
                  backgroundColor: theme.colors.primary,
                  color: theme.colors.text.light,
                  fontFamily: event.location.language === "ur" ? theme.fonts.ur.primary : theme.fonts.en.primary,
                }}
              >
                {event.location.text}
              </span>
            )}
          </div>

          {/* Content */}
          <div
            className={`prose max-w-none ${styles["events-content-parent"]}`}
            style={{
              color: theme.colors.text.secondary,
              fontFamily: event.content.language === "ur" ? theme.fonts.ur.primary : theme.fonts.en.primary,
              textAlign: event.content.language === "ur" ? "right" : "left",
            }}
            dangerouslySetInnerHTML={{
              __html: `<div style="
                --heading-font: ${event.content.language === "ur" ? theme.fonts.ur.primary : theme.fonts.en.primary};
                --heading-color: ${theme.colors.text.primary};
                --text-font: ${event.content.language === "ur" ? theme.fonts.ur.primary : theme.fonts.en.primary};
                --text-color: ${theme.colors.text.secondary};
              ">${event.content.text}</div>`,
            }}
          />

          {/* Add Social Share Component */}
          <div className="mt-8">
            <SocialShare 
              title={event.socialShare.title.text} 
              description={event.socialShare.description.text} 
              url={typeof window !== "undefined" ? window.location.href : ""} 
              image={event.featuredImage} 
              language={event.language} 
              hashtags={event.socialShare.hashtags} 
              twitterHandle={event.socialShare.twitterHandle} 
              ogType={event.socialShare.ogType} 
            />
          </div>

          {/* Navigation */}
          <div className="flex justify-between items-center border-t border-gray-200 pt-8 mt-12">
            {navigation.prev ? (
              <Link
                href={`/events/${navigation.prev.slug}`}
                className={`group flex items-center gap-2 px-4 py-2 rounded-lg transition-colors duration-300 ${navigation.prev.title.language === "ur" ? "" : ""}`}
                style={{
                  backgroundColor: theme.colors.background.secondary,
                  color: theme.colors.text.primary,
                  fontFamily: navigation.prev.title.language === "ur" ? theme.fonts.ur.primary : theme.fonts.en.primary,
                }}
              >
                <FaArrowLeft className={`${navigation.prev.title.language === "ur" ? "rotate-180" : ""} group-hover:-translate-x-1 transition-transform duration-300`} />
                <div className={navigation.prev.title.language === "ur" ? "text-right" : ""}>
                  <div className="text-sm opacity-75">{navigation.prev.title.language === "en" ? "Previous Event" : "پچھلا پروگرام"}</div>
                  <div className="font-medium">{navigation.prev.title.text}</div>
                </div>
              </Link>
            ) : (
              <div />
            )}

            {navigation.next && (
              <Link
                href={`/events/${navigation.next.slug}`}
                className={`group flex items-center gap-2 px-4 py-2 rounded-lg transition-colors duration-300 ${navigation.next.title.language === "ur" ? "" : ""}`}
                style={{
                  backgroundColor: theme.colors.background.secondary,
                  color: theme.colors.text.primary,
                  fontFamily: navigation.next.title.language === "ur" ? theme.fonts.ur.primary : theme.fonts.en.primary,
                }}
              >
                <div className={navigation.next.title.language === "ur" ? "text-right" : ""}>
                  <div className="text-sm opacity-75">{navigation.next.title.language === "en" ? "Next Event" : "اگلا پروگرام"}</div>
                  <div className="font-medium">{navigation.next.title.text}</div>
                </div>
                <FaArrowRight className={`${navigation.next.title.language === "ur" ? "rotate-180" : ""} group-hover:translate-x-1 transition-transform duration-300`} />
              </Link>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
