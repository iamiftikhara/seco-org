'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import Navbar from '@/app/components/Navbar';
import Footer from '@/app/components/Footer';
import { theme } from '@/config/theme';
import LoadingSpinner from '@/app/components/LoadingSpinner';
import { Events, EventDetail } from '@/types/events';

const blinkingKeyframes = `
  @keyframes blink {
    0% { transform: scale(1); opacity: 1; }
    50% { transform: scale(1.2); opacity: 0.3; }
    100% { transform: scale(1); opacity: 1; }
  }
`;

export default function AllEvents() {
  const [eventsData, setEventsData] = useState<Events | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedLanguage, setSelectedLanguage] = useState<'en' | 'ur'>('en');
  const [selectedStatus, setSelectedStatus] = useState<'all' | 'upcoming' | 'past'>('all');
  const [isImageLoaded, setIsImageLoaded] = useState(false);

  useEffect(() => {
    const fetchEvents = async () => {
      setLoading(true);
      try {
        const response = await fetch(`/api/events?status=${selectedStatus}`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data: { success: boolean; data: Events } = await response.json();
        if (data.success) {
          setEventsData(data.data);
        } else {
          throw new Error('API returned unsuccessful response');
        }
      } catch (error) {
        console.error('Error fetching events:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchEvents();
  }, [selectedStatus]);

  if (loading || !eventsData) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center">
        <div className="flex flex-col items-center">
          <LoadingSpinner />
          <p className="text-gray-600 mt-4">Loading events...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <style jsx global>{blinkingKeyframes}</style>
      <Navbar />
      <div className="min-h-screen bg-white">
        {/* Hero Section */}
        <div className="relative h-[calc(100vh-20rem)] overflow-hidden">
          <Image
            src={eventsData.eventsPage.image}
            alt="Events"
            fill
            className={`object-cover transition-transform duration-[30s] ${isImageLoaded ? "scale-110" : "scale-100"}`} onLoadingComplete={() => setIsImageLoaded(true)}
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        </div>

        {/* Title Section */}
        <div className="max-w-7xl mx-auto px-4 py-12 text-center">
          <h1 className="text-4xl font-bold"
                style={{
                  color: theme.colors.text.primary,
                  fontFamily: selectedLanguage === 'ur' ? theme.fonts.ur.primary : theme.fonts.en.primary
                }}>
            {eventsData.eventsPage.title[selectedLanguage].text}
          </h1>
          <div className="w-20 h-1 mx-auto mb-6" style={{ backgroundColor: theme.colors.secondary }}></div>
          <p className="text-xl max-w-3xl mx-auto" style={{ color: theme.colors.text.secondary,
            fontFamily: selectedLanguage === 'ur' ? theme.fonts.ur.primary : theme.fonts.en.primary
           }}>
            {eventsData.eventsPage.description[selectedLanguage].text}
          </p>
        </div>

        {/* Filters */}
        <div className="max-w-7xl mx-auto px-4 mb-8">
          <div className="flex flex-col items-center gap-4">
            {/* Language Filter */}
            <div className="flex gap-2">
              <button
                onClick={() => setSelectedLanguage('en')}
                className="px-6 py-2.5 rounded-full text-lg"
                style={{ 
                  backgroundColor: selectedLanguage === 'en' ? theme.colors.primary : '#e5e7eb',
                  color: selectedLanguage === 'en' ? theme.colors.text.light : theme.colors.text.secondary,
                  fontFamily: theme.fonts.en.primary
                }}
              >
                English
              </button>
              <button
                onClick={() => setSelectedLanguage('ur')}
                className="px-6 py-2.5 rounded-full text-lg"
                style={{ 
                  backgroundColor: selectedLanguage === 'ur' ? theme.colors.primary : '#e5e7eb',
                  color: selectedLanguage === 'ur' ? theme.colors.text.light : theme.colors.text.secondary,
                  fontFamily: theme.fonts.ur.primary
                }}
              >
                اردو
              </button>
            </div>

            {/* Status Filter */}
            <div className="flex gap-2">
              {['all', 'upcoming', 'past'].map((status) => (
                <button
                  key={status}
                  onClick={() => setSelectedStatus(status as 'all' | 'upcoming' | 'past')}
                  className="px-4 py-2 rounded-full"
                  style={{ 
                    backgroundColor: selectedStatus === status ? theme.colors.primary : '#e5e7eb',
                    color: selectedStatus === status ? theme.colors.text.light : theme.colors.text.secondary,
                    fontFamily: selectedLanguage === 'ur' ? theme.fonts.ur.primary : theme.fonts.en.primary
                  }}
                >
                  {selectedLanguage === 'en' 
                    ? status === 'all' ? 'All Events' : status === 'upcoming' ? 'Upcoming' : 'Past Events'
                    : status === 'all' ? 'تمام پروگرامز' : status === 'upcoming' ? 'آنے والے' : 'گزشتہ پروگرامز'
                  }
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Events Grid */}
        <div className="max-w-7xl mx-auto px-4 pb-16">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {eventsData?.eventsList.map((event) => {
              const eventData = event[selectedLanguage as keyof typeof event] as {
                title: { text: string };
                shortDescription: { text: string };
                location: { text: string };
                time?: { text: string };
              };
              return (
              <Link href={`/events/${event.slug}`} key={event.id}>
                <div className="group relative overflow-hidden rounded-lg shadow-md h-[300px]">
                  {/* Event Status and Location Indicators */}
                  <div className="absolute top-2 right-2 z-10 flex flex-col gap-2 items-end">
                    <div className="flex items-center gap-1.5 rounded-full">
                      {event.status === 'upcoming' && (
                        <>
                          <span className="w-2 h-2 rounded-full animate-[blink_1.5s_ease-in-out_infinite]" 
                            style={{ backgroundColor: theme.colors.status.upcomingBlink }}></span>
                          <span className="px-2 py-1 rounded-full text-xs font-medium" 
                            style={{ 
                              backgroundColor: theme.colors.status.upcoming + '99',
                              color: theme.colors.text.light,
                              fontFamily: selectedLanguage === 'ur' ? theme.fonts.ur.primary : theme.fonts.en.primary
                            }}>
                            {selectedLanguage === 'en' ? 'Upcoming' : 'آنے والا'}
                          </span>
                        </>
                      )}
                      {event.status === 'past' && (
                        <span className="px-2 py-1 rounded-full text-xs font-medium bg-gray-200 text-gray-600"
                          style={{ fontFamily: selectedLanguage === 'ur' ? theme.fonts.ur.primary : theme.fonts.en.primary }}>
                          {selectedLanguage === 'en' ? 'Past' : 'گزشتہ'}
                        </span>
                      )}
                    </div>
                    {eventData?.location && (
                      <span className="px-2 py-1 rounded-full text-xs font-medium"
                        style={{
                          backgroundColor: theme.colors.primary,
                          color: theme.colors.text.light,
                          fontFamily: selectedLanguage === 'ur' ? theme.fonts.ur.primary : theme.fonts.en.primary
                        }}>
                        {eventData.location.text}
                      </span>
                    )}
                  </div>
                  
                  <div className="relative h-full">
                    <Image
                      src={event.featuredImage}
                      alt={eventData?.title?.text || 'Event'}
                      fill
                      className={`object-cover group-hover:scale-110 transition-transform duration-300 ${
                        event.status === 'past' ? 'grayscale' : ''
                      }`}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
                  </div>
                  <div className={`absolute bottom-0 p-4 text-white ${selectedLanguage === 'ur' ? 'text-right right-0 left-0' : ''}`}>
                    <div className="flex flex-wrap gap-2 mb-2" dir={selectedLanguage === 'ur' ? 'rtl' : 'ltr'}>
                      <span className="inline-block px-2 py-0.5 rounded-full text-xs font-medium"
                        style={{ 
                          backgroundColor: theme.colors.secondary,
                          color: theme.colors.primary,
                          fontFamily: selectedLanguage === 'ur' ? theme.fonts.ur.primary : theme.fonts.en.primary
                        }}>
                        {new Date(event.date).toLocaleDateString(selectedLanguage === 'en' ? 'en-US' : 'ur-PK', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric'
                        })}
                      </span>
                      {event.status === 'upcoming' && eventData?.time && (
                        <span className="inline-block px-2 py-0.5 rounded-full text-xs font-medium"
                          style={{
                            backgroundColor: theme.colors.secondary,
                            color: theme.colors.primary,
                            fontFamily: selectedLanguage === 'ur' ? theme.fonts.ur.primary : theme.fonts.en.primary
                          }}>
                          {eventData.time.text}
                        </span>
                      )}
                    </div>
                    <h3 className="text-lg font-semibold mb-1" dir={selectedLanguage === 'ur' ? 'rtl' : 'ltr'}
                      style={{ fontFamily: selectedLanguage === 'ur' ? theme.fonts.ur.primary : theme.fonts.en.primary }}>
                      {eventData?.title?.text}
                    </h3>
                    <p className="text-gray-200 text-sm line-clamp-2" dir={selectedLanguage === 'ur' ? 'rtl' : 'ltr'}
                      style={{ fontFamily: selectedLanguage === 'ur' ? theme.fonts.ur.primary : theme.fonts.en.primary }}>
                      {eventData?.shortDescription?.text}
                    </p>
                  </div>
                </div>
              </Link>
              );
            })}
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}