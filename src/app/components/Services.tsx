'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import * as Icons from 'react-icons/fa';
import { theme } from '@/config/theme';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import UniversalError from './UniversalError';
import type { ServiceDetail, ServicePageContent } from '@/types/services';

function ServiceSkeleton() {
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

export default function Services() {
  const [language, setLanguage] = useState<'en' | 'ur'>('en');
  const [isLoading, setIsLoading] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const [servicesList, setServicesList] = useState<ServiceDetail[]>([]);
  const [servicePage, setServicePage] = useState<ServicePageContent | null>(null);
  const [error, setError] = useState<string | null>(null);

  const loadServices = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await fetch('/api/services');
      const result = await response.json();
      if (!result.success) {
        throw new Error(result.error || 'Failed to fetch services');
      }
      if (!result.data || !result.data.servicesList) {
        throw new Error('No services data received');
      }
      setServicesList(result.data.servicesList);
      if (result.data.servicePage) {
        setServicePage(result.data.servicePage);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load services');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    handleResize();
    window.addEventListener('resize', handleResize);
    loadServices();
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const displayServices = servicesList.slice(0, 4);

  // Helper for font family and direction
  const getFontFamily = () => language === 'ur' ? theme.fonts.ur.primary : theme.fonts.en.primary;
  const getDirection = () => language === 'ur' ? 'rtl' : 'ltr';
  const getTextAlign = () => language === 'ur' ? 'text-right' : 'text-left';
  const getFlexDirection = () => language === 'ur' ? 'flex-row-reverse' : '';

  if (isLoading) {
    return (
      <section className="py-16" style={{ backgroundColor: theme.colors.background.secondary }}>
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <div className="animate-pulse">
              <div className="h-8 w-48 bg-gray-200 rounded mx-auto mb-6"></div>
              <div className="h-64 bg-gray-200 rounded"></div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (error || !servicesList.length) {
    return (
      <section className="py-16" style={{ backgroundColor: theme.colors.background.secondary }}>
        <div className="max-w-7xl mx-auto px-4">
          <UniversalError
            error={error || 'Failed to load services'}
            onRetry={loadServices}
            sectionName="Services"
          />
        </div>
      </section>
    );
  }

  return (
    <section className="py-16" style={{ backgroundColor: theme.colors.background.secondary }}>
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-12">
          <h2 
            className="text-3xl font-bold"
            style={{ 
              color: theme.colors.text.primary,
              fontFamily: getFontFamily()
            }}
          >
            {servicePage?.title?.[language]?.text || ''}
          </h2>
          <div className="w-20 h-1 mx-auto mt-4" style={{ backgroundColor: theme.colors.primary }}></div>
          <p 
            className="mt-6 max-w-2xl mx-auto"
            style={{ 
              color: theme.colors.text.secondary,
              fontFamily: getFontFamily()
            }}
          >
            {servicePage?.description?.[language]?.text || ''}
          </p>
          <div className="mt-6">
            <button
              onClick={() => setLanguage('en')}
              className={`px-4 py-2 rounded transition-colors duration-300 mr-4`}
              style={{
                backgroundColor: language === 'en' ? theme.colors.primary : 'transparent',
                color: language === 'en' ? 'white' : theme.colors.text.primary,
                border: `1px solid ${theme.colors.primary}`,
                fontFamily: theme.fonts.en.primary
              }}
            >
              English
            </button>
            <button
              onClick={() => setLanguage('ur')}
              className={`px-4 py-2 rounded transition-colors duration-300`}
              style={{
                backgroundColor: language === 'ur' ? theme.colors.primary : 'transparent',
                color: language === 'ur' ? 'white' : theme.colors.text.primary,
                border: `1px solid ${theme.colors.primary}`,
                fontFamily: theme.fonts.ur.primary
              }}
            >
              اردو
            </button>
          </div>
        </div>

        {isMobile ? (
          <div>
            {isLoading ? (
              <Swiper
                modules={[Autoplay, Pagination]}
                autoplay={{ delay: 4000, disableOnInteraction: false }}
                pagination={{ clickable: true }}
                loop={true}
              >
                {[0, 1, 2, 3].map((i) => (
                  <SwiperSlide key={i}>
                    <ServiceSkeleton />
                  </SwiperSlide>
                ))}
              </Swiper>
            ) : (
              <Swiper
                modules={[Autoplay, Pagination]}
                autoplay={{ delay: 4000, disableOnInteraction: false }}
                pagination={{ clickable: true }}
                loop={true}
              >
                {displayServices.map((service) => {
                  const IconComponent = service.iconName ? Icons[service.iconName as keyof typeof Icons] : null;
                  return (
                    <SwiperSlide key={service.id}>
                      <Link 
                        href={`/services/${service.slug}`} 
                        className="block h-full"
                      >
                        <div 
                          className="bg-white rounded-lg shadow-lg overflow-hidden transition-transform hover:scale-105 cursor-pointer h-full flex flex-col"
                          style={{
                            direction: getDirection(),
                            fontFamily: getFontFamily(),
                          }}
                        >
                          <div className="relative h-48">
                            <Image
                              src={service.heroImage}
                              alt={service[language].title.text}
                              fill
                              className="object-cover"
                            />
                          </div>
                          <div 
                            className={`p-6 flex-1 ${getTextAlign()}`}
                          >
                            <div 
                              className={`flex items-center mb-4 ${getFlexDirection()}`}
                            >
                              {language === 'en' && IconComponent && (
                                <IconComponent 
                                  className="text-4xl mr-3 flex-shrink-0"
                                  style={{ color: theme.colors.primary }}
                                />
                              )}
                              <h3 
                                className="text-xl font-semibold flex-1"
                                style={{ 
                                  color: theme.colors.text.primary,
                                  fontFamily: getFontFamily()
                                }}
                              >
                                {service[language].title.text}
                              </h3>
                              {language === 'ur' && IconComponent && (
                                <IconComponent 
                                  className="text-4xl ml-3 flex-shrink-0"
                                  style={{ color: theme.colors.primary }}
                                />
                              )}
                            </div>
                            <p 
                              style={{ 
                                color: theme.colors.text.secondary,
                                fontFamily: getFontFamily()
                              }}
                            >
                              {service[language].shortDescription.text}
                            </p>
                          </div>
                        </div>
                      </Link>
                    </SwiperSlide>
                  );
                })}
              </Swiper>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {isLoading ? (
              <>
                <ServiceSkeleton />
                <ServiceSkeleton />
                <ServiceSkeleton />
                <ServiceSkeleton />
              </>
            ) : (
              displayServices.map((service) => {
                const IconComponent = service.iconName ? Icons[service.iconName as keyof typeof Icons] : null;
                return (
                  <Link 
                    href={`/services/${service.slug}`} 
                    key={service.id}
                    className="block h-full"
                  >
                    <div 
                      className="bg-white rounded-lg shadow-lg overflow-hidden transition-transform hover:scale-105 cursor-pointer h-full flex flex-col"
                      style={{
                        direction: getDirection(),
                        fontFamily: getFontFamily(),
                      }}
                    >
                      <div className="relative h-48">
                        <Image
                          src={service.heroImage}
                          alt={service[language].title.text}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div 
                        className={`p-6 flex-1 ${getTextAlign()}`}
                      >
                        <div 
                          className={`flex items-center mb-4 ${getFlexDirection()}`}
                        >
                          {language === 'en' && IconComponent && (
                            <IconComponent 
                              className="text-4xl mr-3 flex-shrink-0"
                              style={{ color: theme.colors.primary }}
                            />
                          )}
                          <h3 
                            className="text-xl font-semibold flex-1"
                            style={{ 
                              color: theme.colors.text.primary,
                              fontFamily: getFontFamily()
                            }}
                          >
                            {service[language].title.text}
                          </h3>
                          {language === 'ur' && IconComponent && (
                            <IconComponent 
                              className="text-4xl ml-3 flex-shrink-0"
                              style={{ color: theme.colors.primary }}
                            />
                          )}
                        </div>
                        <p 
                          style={{ 
                            color: theme.colors.text.secondary,
                            fontFamily: getFontFamily()
                          }}
                        >
                          {service[language].shortDescription.text}
                        </p>
                      </div>
                    </div>
                  </Link>
                );
              })
            )}
          </div>
        )}
      </div>
    </section>
  );
}