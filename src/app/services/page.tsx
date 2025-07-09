"use client";

import {useEffect, useState} from "react";
import Link from "next/link";
import Image from "next/image";
import * as Icons from "react-icons/fa";
import Navbar from "@/app/components/Navbar";
import Footer from "@/app/components/Footer";
import LoadingSpinner from "@/app/components/LoadingSpinner";
import {theme} from "@/config/theme";
import type { ServiceDetail, ServicePageContent } from '@/types/services';

export default function ServicesPage() {
  const [loading, setLoading] = useState(true);
  const [language, setLanguage] = useState<'en' | 'ur' | 'all'>('en');
  const [imageLoaded, setImageLoaded] = useState(false);
  const [servicesList, setServicesList] = useState<ServiceDetail[]>([]);
  const [servicePage, setServicePage] = useState<ServicePageContent | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch('/api/services');
        const result = await response.json();
        if (!result.success) {
          // Check if it's an empty state
          if (result.isEmpty) {
            setError(result.message || 'No services are currently available. Please check back later.');
            return;
          }
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
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Universal helpers for font, direction, and alignment
  const getFontFamily = () => language === 'ur' ? theme.fonts.ur.primary : theme.fonts.en.primary;
  const getDirection = () => language === 'ur' ? 'rtl' : 'ltr';
  const getTextAlign = () => language === 'ur' ? 'text-right' : 'text-left';
  const getFlexDirection = () => language === 'ur' ? 'flex-row-reverse justify-start' : '';

  // Filtered services for language
  const filteredServices = language === 'all'
    ? servicesList
    : servicesList.filter((service) => !!service[language]);

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4 mx-auto"></div>
            <p className="text-xl text-gray-600">Loading services...</p>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  if (error) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="text-center max-w-md mx-auto p-8">
            <div className="mb-6">
              <svg
                className="mx-auto h-16 w-16 text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1}
                  d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-4m-5 0H3m2 0h4M9 7h6m-6 4h6m-6 4h6"
                />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-gray-800 mb-4">
              {error.includes('No services are currently available') ? 'Services Coming Soon' : 'Unable to Load Services'}
            </h1>
            <p className="text-gray-600 mb-6 leading-relaxed">{error}</p>
            <div className="space-y-3">
              <button
                onClick={() => window.location.reload()}
                className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Refresh Page
              </button>
              <a
                href="/"
                className="block w-full px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors"
              >
                Go to Homepage
              </a>
            </div>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className={`${isMobile ? 'h-[calc(100vh-35rem)]' : 'h-[calc(100vh-9.7rem)]'} relative overflow-hidden`}>
        {servicePage && (
          <Image 
            src={servicePage.image} 
            alt={language === 'all' ? `${servicePage.title.en.text} / ${servicePage.title.ur.text}` : servicePage.title[language].text} 
            fill 
            className={`object-cover transition-transform duration-700 duration-[20s] ${imageLoaded ? "scale-110" : "scale-100"}`} 
            priority 
            onLoadingComplete={() => setImageLoaded(true)} 
          />
        )}
        <div className="absolute inset-0 flex items-center justify-center" style={{background: "linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5))"}}>
          <div
            className="text-center text-white"
            style={{ fontFamily: getFontFamily() }}
          >
            <h1
              className="text-5xl font-bold mb-4"
              style={{ fontFamily: theme.fonts.ur.primary }}
            >
              {servicePage && (
                language === 'all'
                  ? `${servicePage.title.en.text} / ${servicePage.title.ur.text}`
                  : servicePage.title[language].text
              )}
            </h1>
            <p
              className="text-xl max-w-3xl mx-auto px-4"
              style={{ fontFamily: getFontFamily() }}
            >
              {servicePage && (
                language === 'all'
                  ? `${servicePage.description.en.text} / ${servicePage.description.ur.text}`
                  : servicePage.description[language].text
              )}
            </p>
            <div className="mt-6">
              <button onClick={() => setLanguage('all')} className={`mx-2 px-4 py-2 hidden rounded cursor-pointer ${theme.fonts.en.primary} ${language === 'all' ? `bg-white text-[${theme.colors.primary}]` : 'bg-transparent text-white border border-white'}`}
                style={{ fontFamily: theme.fonts.ur.primary }}>
                All / سب
              </button>
              <button onClick={() => setLanguage('en')} className={`mx-2 px-4 py-2 rounded cursor-pointer ${language === 'en' ? `bg-white text-[${theme.colors.primary}]` : 'bg-transparent text-white border border-white'}`}>
                English
              </button>
              <button onClick={() => setLanguage('ur')} className={`mx-2 px-4 py-2 rounded cursor-pointer ${language === 'ur' ? `bg-white text-[${theme.colors.primary}]` : 'bg-transparent text-white border border-white'}`}
                 style={{ fontFamily: theme.fonts.ur.primary }}>
                اردو
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className={`${isMobile ? 'py-8' : 'py-16'} min-h-screen bg-white`}>
        <div className="max-w-7xl mx-auto px-4">
          {loading ? (
            <div className="flex justify-center items-center min-h-[400px]">
              <LoadingSpinner />
            </div>
          ) : error ? (
            <div className="flex justify-center items-center min-h-[400px] text-red-500">
              {error}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredServices.map((service) => {
                const IconComponent = service.iconName ? Icons[service.iconName as keyof typeof Icons] : null;
                return (
                  <Link 
                    href={`/services/${service.slug}`} 
                    key={service.id} 
                    className="group bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300"
                    style={{ fontFamily: getFontFamily() }}
                  >
                    <div className="relative h-48">
                      <Image 
                        src={service.heroImage} 
                        alt={service[language === 'all' ? 'en' : language].title.text} 
                        fill 
                        className="object-cover group-hover:scale-105 transition-transform duration-300" 
                      />
                    </div>
                    <div className="p-6">
                      <div className={`flex items-center mb-4 ${getFlexDirection()}`}>
                        {IconComponent && <IconComponent className={`text-3xl text-[${theme.colors.primary}] ${language === 'ur' ? 'ml-3' : 'mr-3'}`} />}
                        <h2 
                          className={`text-xl font-semibold text-gray-900 group-hover:text-[${theme.colors.primary}] transition-colors duration-300 ${getTextAlign()}`}
                          style={{ fontFamily: getFontFamily() }}
                        >
                          {language === 'all'
                            ? `${service.en.title.text} / ${service.ur.title.text}`
                            : service[language].title.text}
                        </h2>
                      </div>
                      <p 
                        className={`text-gray-600 ${getTextAlign()}`}
                        style={{ fontFamily: getFontFamily() }}
                      >
                        {language === 'all'
                          ? `${service.en.shortDescription.text} / ${service.ur.shortDescription.text}`
                          : service[language].shortDescription.text}
                      </p>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
}
