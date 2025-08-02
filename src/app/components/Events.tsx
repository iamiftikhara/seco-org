'use client';

import { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Navigation, Pagination } from 'swiper/modules';
import { theme } from '@/config/theme';
import type { EventDetail } from '@/types/events';

import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

const blinkingKeyframes = `
  @keyframes blink {
    0% { transform: scale(1); opacity: 1; }
    50% { transform: scale(1.2); opacity: 0.3; }
    100% { transform: scale(1); opacity: 1; }
  }

  .rtl-slider.swiper {
    direction: rtl;
  }

  .rtl-slider .swiper-wrapper {
    display: flex;
    justify-content: flex-end;
  }

  .rtl-slider .swiper-button-next,
  .rtl-slider .swiper-button-prev {
    transform: scaleX(-1);
  }
`;

export default function Events() {
  const [currentLanguage, setCurrentLanguage] = useState('en');
  const [homeEvents, setHomeEvents] = useState<EventDetail[]>([]);
  const [eventsPageData, setEventsPageData] = useState<{ eventsPage: { image: string; title: { en: { text: string }; ur: { text: string } }; description: { en: { text: string }; ur: { text: string } } } } | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Universal variables for font family and direction
  const currentFontFamily = currentLanguage === 'ur' ? theme.fonts.ur.primary : theme.fonts.en.primary;
  const currentDirection = currentLanguage === 'ur' ? 'rtl' : 'ltr';
  const isRTL = currentLanguage === 'ur';

  const loadEvents = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await fetch('/api/events?showOnHome=true');
      const result = await response.json();

      if (!result.success) {
        throw new Error(result.error || 'Failed to fetch events');
      }

      if (!result.data) {
        throw new Error('No events data received');
      }

      setHomeEvents(result.data.eventsList || []);
      setEventsPageData(result.data.eventsPage);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load events');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadEvents();
  }, [loadEvents]);

  const handleLanguageChange = () => {
    setCurrentLanguage(currentLanguage === 'en' ? 'ur' : 'en');
  };

  if (isLoading) {
    return (
      <section className="py-16" style={{ backgroundColor: theme.colors.background.primary }}>
        <div className="max-w-7xl mx-auto px-4 text-center">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-300 rounded w-48 mx-auto mb-4"></div>
            <div className="h-4 bg-gray-300 rounded w-32 mx-auto mb-8"></div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-80 bg-gray-300 rounded-lg"></div>
              ))}
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="py-16" style={{ backgroundColor: theme.colors.background.primary }}>
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-red-600 mb-4">Error loading events: {error}</p>
          <button
            onClick={loadEvents}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Try Again
          </button>
        </div>
      </section>
    );
  }

  if (!homeEvents.length) {
    return null;
  }

  return (
    <section
      className="py-16"
      style={{ backgroundColor: theme.colors.background.secondary }}
      dir={currentDirection}
    >
      <style jsx global>{blinkingKeyframes}</style>
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between mb-12">
          <div className={`${isRTL ? 'text-right' : 'text-center'}`}>
            <h2
              className="text-3xl font-bold"
              style={{
                color: theme.colors.text.primary,
                fontFamily: currentFontFamily
              }}
            >
              {currentLanguage === 'en' ? 'Our Events' : 'ہماری تقریبات'}
            </h2>
            <div className={`w-20 h-1 mt-4 ${isRTL ? 'mr-0 ml-auto' : 'mx-auto'}`}
              style={{ backgroundColor: theme.colors.primary }}
            ></div>
          </div>
          <div className="flex gap-4 items-center">
            <button
              onClick={handleLanguageChange}
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
              {currentLanguage === 'en' ? 'اردو' : 'English'}
            </button>
            <Link
              href="/events"
              className={`px-6 py-2 rounded-lg transition-colors duration-300 cursor-pointer inline-flex items-center`}
              style={{
                backgroundColor: theme.colors.primary,
                color: "white",
                fontFamily: currentFontFamily,
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = theme.colors.primaryHover;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = theme.colors.primary;
              }}
            >
              {currentLanguage === 'en' ? 'View All Events' : 'تمام تقریبات دیکھیں'}

            </Link>
          </div>
        </div>

        <Swiper
          modules={[Autoplay, Navigation, Pagination]}
          autoplay={{
            delay: 2000,
            disableOnInteraction: false,
            pauseOnMouseEnter: true,
            stopOnLastSlide: false,
          }}
          loop={true}
          slidesPerGroup={1}
          spaceBetween={24}
          slidesPerView={1}
          speed={1000}
          navigation={false}
          breakpoints={{
            640: { slidesPerView: Math.min(2, homeEvents.length) },
            1024: { slidesPerView: Math.min(3, homeEvents.length) },
            1280: { slidesPerView: Math.min(4, homeEvents.length) }
          }}
          className={`events-swiper ${isRTL ? 'rtl-slider' : ''}`}
        >
          {homeEvents.map((event, index) => {
            const eventData = event[currentLanguage as 'en' | 'ur'];
            return (
              <SwiperSlide key={`${event.id}-${index}`}>
                <Link href={`/events/${event.slug}`}>
                  <div className="group relative overflow-hidden rounded-lg shadow-md h-[320px]">
                    {event.status === 'upcoming' && (
                      <div className="absolute top-2 right-2 z-10 flex items-center gap-1.5 rounded-full">
                        <span
                          className="w-2 h-2 rounded-full inline-block"
                          style={{
                            backgroundColor: theme.colors.status.upcoming,
                            animation: 'blink 1s ease-in-out infinite',
                            transformOrigin: 'center'
                          }}
                        />
                        <span
                          className="text-xs px-1.5 py-0.5 rounded-full font-medium"
                          style={{
                            backgroundColor: theme.colors.status.upcoming,
                            color: theme.colors.text.light,
                            fontFamily: currentFontFamily
                          }}>
                          {currentLanguage === 'en' ? 'Upcoming' : 'آنے والا'}
                        </span>
                      </div>
                    )}
                  <div className="relative h-full">
                    <Image
                      src={event.featuredImage}
                      alt={eventData?.title?.text || 'Event'}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                    <div
                      className="absolute inset-0"
                      style={{
                        background: `linear-gradient(to top,
                          rgba(0,0,0,0.9) 0%,
                          rgba(0,0,0,0.8) 20%,
                          rgba(0,0,0,0.4) 40%,
                          rgba(0,0,0,0.2) 60%,
                          rgba(0,0,0,0.1) 80%,
                          rgba(0,0,0,0) 100%)`
                      }}
                    ></div>
                  </div>
                  <div className="absolute bottom-0 p-4" style={{ color: theme.colors.text.light }}>
                    <span className="inline-block px-2 py-1 rounded-full text-xs font-medium mb-2"
                      style={{
                        backgroundColor: theme.colors.secondary,
                        color: theme.colors.primary,
                        fontFamily: currentFontFamily
                      }}>
                      {new Date(event.date).toLocaleDateString(currentLanguage === 'en' ? 'en-US' : 'ur-PK', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric'
                      })}
                      {event.status === 'upcoming' && eventData?.time && ` • ${eventData.time.text}`}
                    </span>
                    <h3 className="text-lg font-semibold mb-1" style={{
                      fontFamily: currentFontFamily
                    }}>{eventData?.title?.text}</h3>
                    <p className="text-sm line-clamp-2" style={{
                      color: theme.colors.text.light,
                      fontFamily: currentFontFamily
                    }}>{eventData?.shortDescription?.text}</p>
                  </div>
                </div>
              </Link>
            </SwiperSlide>
            );
          })}
        </Swiper>
      </div>
    </section>
  );
}