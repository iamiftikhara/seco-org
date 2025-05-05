'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Navigation, Pagination } from 'swiper/modules';
import { testimonialsData } from '@/data/testimonials';
import { theme } from '@/config/theme';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

export default function Testimonials() {
  const [currentLanguage, setCurrentLanguage] = useState('en');

  return (
    <section className="py-16" style={{ backgroundColor: theme.colors.primary }}>
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-12">
          <h2 
            className="text-3xl font-bold mb-6" 
            style={{ 
              color: theme.colors.secondary,
              fontFamily: currentLanguage === 'ur' ? theme.fonts.ur.primary : theme.fonts.en.primary 
            }}
          >
            {testimonialsData.title[currentLanguage as keyof typeof testimonialsData.title]}
          </h2>
          
          <div className="flex justify-center gap-4 mb-8">
            <button
              onClick={() => setCurrentLanguage('en')}
              className="px-4 py-2 rounded-full transition-all duration-300"
              style={{
                backgroundColor: currentLanguage === 'en' ? theme.colors.secondary : 'transparent',
                color: currentLanguage === 'en' ? theme.colors.primary : theme.colors.secondary,
                border: `2px solid ${theme.colors.secondary}`,
                fontFamily: theme.fonts.en.primary
              }}
            >
              English
            </button>
            <button
              onClick={() => setCurrentLanguage('ur')}
              className="px-4 py-2 rounded-full transition-all duration-300"
              style={{
                backgroundColor: currentLanguage === 'ur' ? theme.colors.secondary : 'transparent',
                color: currentLanguage === 'ur' ? theme.colors.primary : theme.colors.secondary,
                border: `2px solid ${theme.colors.secondary}`,
                fontFamily: theme.fonts.ur.primary
              }}
            >
              اردو
            </button>
          </div>

          <div className="w-20 h-1 mx-auto" style={{ backgroundColor: theme.colors.secondary }}></div>
        </div>

        <Swiper
          modules={[Autoplay, Navigation, Pagination]}
          pagination={{ clickable: true }}
          autoplay={{ delay: testimonialsData.config.autoplayDelay }}
          loop={true}
          spaceBetween={testimonialsData.config.spaceBetween}
          breakpoints={testimonialsData.config.breakpoints}
          className="testimonials-slider"
        >
          <div className="swiper-wrapper" style={{ height: 'auto' }}>
            {testimonialsData.items.map((testimonial, index) => (
              <SwiperSlide key={index} className="!h-auto">
                <div 
                  className="p-8 rounded-lg flex flex-col h-full" 
                  style={{ backgroundColor: theme.colors.background.secondary }}
                  dir={currentLanguage === 'ur' ? 'rtl' : 'ltr'}
                >
                  <div className={`flex items-center mb-6 ${currentLanguage === 'ur' ? 'flex-row-revers justify-start' : ''}`}>
                    <div className={`relative w-16 h-16 flex-shrink-0 ${currentLanguage === 'ur' ? 'ml-4' : 'mr-4'}`}>
                      <Image
                        src={testimonial.image}
                        alt={testimonial.author[currentLanguage as keyof typeof testimonial.author]}
                        fill
                        className="rounded-full object-cover"
                      />
                    </div>
                    <div className={`${currentLanguage === 'ur' ? 'text-right' : 'text-left'} flex-1`}>
                      <h4 
                        className="font-semibold" 
                        style={{ 
                          color: theme.colors.text.primary,
                          fontFamily: currentLanguage === 'ur' ? theme.fonts.ur.primary : theme.fonts.en.primary 
                        }}
                      >
                        {testimonial.author[currentLanguage as keyof typeof testimonial.author]}
                      </h4>
                      <p style={{ 
                        color: theme.colors.text.secondary,
                        fontFamily: currentLanguage === 'ur' ? theme.fonts.ur.primary : theme.fonts.en.primary 
                      }}>
                        {testimonial.role[currentLanguage as keyof typeof testimonial.role]}
                      </p>
                    </div>
                  </div>
                  <p 
                    className="italic flex-grow" 
                    style={{ 
                      color: theme.colors.text.secondary,
                      fontFamily: currentLanguage === 'ur' ? theme.fonts.ur.primary : theme.fonts.en.primary 
                    }}
                  >
                    &quot;{testimonial.quote[currentLanguage as keyof typeof testimonial.quote]}&quot;
                  </p>
                </div>
              </SwiperSlide>
            ))}
          </div>
        </Swiper>
      </div>
    </section>
  );
}