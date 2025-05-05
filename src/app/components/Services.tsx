'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import * as Icons from 'react-icons/fa';
import { ServiceDetail } from '@/types/services';
import { theme } from '@/config/theme';
import { services } from '@/data/services';

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

  useEffect(() => {
    setTimeout(() => setIsLoading(false), 1000);
  }, []);

  // Filter services by language and showOnHomepage flag
  const displayServices = services.servicesList
    .filter(service => service.language === language && service.showOnHomepage)
    .slice(0, 4);

  return (
    <section className="py-16" style={{ backgroundColor: theme.colors.background.secondary }}>
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-12">
          <h2 
            className="text-3xl font-bold"
            style={{ 
              color: theme.colors.text.primary,
              fontFamily: language === 'ur' ? theme.fonts.ur.primary : theme.fonts.en.primary
            }}
          >
            {services.servicePage.title[language].text}
          </h2>
          <div className="w-20 h-1 mx-auto mt-4" style={{ backgroundColor: theme.colors.primary }}></div>
          <p 
            className="mt-6 max-w-2xl mx-auto"
            style={{ 
              color: theme.colors.text.secondary,
              fontFamily: language === 'ur' ? theme.fonts.ur.primary : theme.fonts.en.primary
            }}
          >
            {services.servicePage.description[language].text}
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
              const isUrdu = service.language === 'ur';
              
              return (
                <Link 
                  href={`/services/${service.slug}`} 
                  key={service.id}
                  className="block h-full"
                >
                  <div 
                    className="bg-white rounded-lg shadow-lg overflow-hidden transition-transform hover:scale-105 cursor-pointer h-full flex flex-col"
                    style={{
                      direction: isUrdu ? 'rtl' : 'ltr',
                      fontFamily: isUrdu ? theme.fonts.ur.primary : theme.fonts.en.primary,
                    }}
                  >
                    <div className="relative h-48">
                      <Image
                        src={service.heroImage}
                        alt={service.title.text}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div 
                      className={`p-6 flex-1 ${isUrdu ? 'text-right' : 'text-left'}`}
                    >
                      <div 
                        className={`flex items-center mb-4 ${
                          isUrdu ? 'flex-row-reverse' : ''
                        }`}
                      >
                        {!isUrdu && IconComponent && (
                          <IconComponent 
                            className="text-4xl mr-3 flex-shrink-0"
                            style={{ color: theme.colors.primary }}
                          />
                        )}
                        <h3 
                          className="text-xl font-semibold flex-1"
                          style={{ 
                            color: theme.colors.text.primary,
                            fontFamily: isUrdu ? theme.fonts.ur.primary : theme.fonts.en.primary
                          }}
                        >
                          {service.title.text}
                        </h3>
                        {isUrdu && IconComponent && (
                          <IconComponent 
                            className="text-4xl ml-3 flex-shrink-0"
                            style={{ color: theme.colors.primary }}
                          />
                        )}
                      </div>
                      <p 
                        style={{ 
                          color: theme.colors.text.secondary,
                          fontFamily: isUrdu ? theme.fonts.ur.primary : theme.fonts.en.primary
                        }}
                      >
                        {service.shortDescription.text}
                      </p>
                    </div>
                  </div>
                </Link>
              );
            })
          )}
        </div>
      </div>
    </section>
  );
}