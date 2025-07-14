"use client";

import {useEffect, useState} from "react";
import Link from "next/link";
import Image from "next/image";
import * as Icons from "react-icons/fa";
import Navbar from "@/app/components/Navbar";
import Footer from "@/app/components/Footer";
import LoadingSpinner from "@/app/components/LoadingSpinner";
import DynamicError from "@/app/components/DynamicError";
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
            // Handle empty state as valid - show empty services list
            setServicesList([]);
            if (result.data?.servicePage) {
              setServicePage(result.data.servicePage);
            }
            setError(null);
            return;
          }
          throw new Error(result.error || 'Failed to fetch services');
        }

        if (!result.data) {
          throw new Error('No services data received');
        }

        // Set the data even if servicesList is empty
        setServicesList(result.data.servicesList || []);
        if (result.data.servicePage) {
          setServicePage(result.data.servicePage);
        }
        setError(null);
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
        <DynamicError
          title={error.includes('No services are currently available')
            ? (language === "ur" ? "خدمات جلد آ رہی ہیں" : "Services Coming Soon")
            : (language === "ur" ? "خدمات لوڈ نہیں ہو سکیں" : "Unable to Load Services")
          }
          message={error}
          onRetry={() => window.location.reload()}
          showBackButton={false}
          language={language === "ur" ? "ur" : "en"}
          sectionName={language === "ur" ? "خدمات" : "Services"}
        />
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className={`${isMobile ? 'h-[calc(100vh-40rem)]' : 'h-[calc(100vh-9.7rem)]'} relative overflow-hidden`}>
        {servicePage && (
          <Image 
            src={servicePage.image} 
            alt={language === 'all' ? `${servicePage.title.en.text} / ${servicePage.title.ur.text}` : servicePage.title[language].text} 
            fill 
            className={`object-cover transition-transform duration-[20s] ${imageLoaded ? "scale-110" : "scale-100"}`}
            priority 
            onLoadingComplete={() => setImageLoaded(true)} 
          />
        )}
        <div className="absolute inset-0 flex items-end pb-8 justify-center" style={{background: "linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5))"}}>
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
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
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
