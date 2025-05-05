'use client';

import { useState } from 'react';
import Image from 'next/image';
import { partnersData } from '@/data/partners';
import { theme } from '@/config/theme';

export default function Partners() {
  const [currentLanguage] = useState('en');

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-12">
          <h2 
            className="text-3xl font-bold" 
            style={{ 
              color: theme.colors.text.primary,
              fontFamily: currentLanguage === 'ur' ? theme.fonts.ur.primary : theme.fonts.en.primary 
            }}
          >
            {partnersData.title[currentLanguage as keyof typeof partnersData.title]}
          </h2>
          <div className="w-20 h-1 mx-auto mt-4" style={{ backgroundColor: theme.colors.primary }}></div>
        </div>
        <div className="flex flex-wrap justify-center items-center gap-8">
          {partnersData.partners.map((partner, index) => (
            <div key={index} className="w-40 group flex flex-col items-center">
              <div className="h-20 relative w-full group-hover:scale-110 transition-all duration-300">
                <Image
                  src={partner.image}
                  alt={partner.name}
                  fill
                  style={{ objectFit: 'contain' }}
                />
              </div>
              <span 
                className="mt-2 opacity-0 group-hover:opacity-100 transition-all duration-300"
                style={{ 
                  color: theme.colors.text.primary,
                  fontFamily: currentLanguage === 'ur' ? theme.fonts.ur.primary : theme.fonts.en.primary 
                }}
              >
                {partner.name}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}