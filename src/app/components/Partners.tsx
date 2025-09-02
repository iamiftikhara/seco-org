'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { partnersData } from '@/data/partners';
import { theme } from '@/config/theme';
import { Partner } from '@/types/partners';

export default function Partners() {
  const [currentLanguage] = useState('en');
  const [partners, setPartners] = useState<Partner[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPartners = async () => {
    try {
      const response = await fetch('/api/partners?showOnHome=true');
      if (!response.ok) {
        throw new Error('Failed to fetch partners');
      }
      const data = await response.json();
      if (data.success && data.data) {
        setPartners(data.data.partnersList);
      } else {
        throw new Error(data.error || 'Failed to fetch partners');
      }
    } catch (err) {
      console.error('Error fetching partners:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch partners');
      // Fallback to static data if API fails
      setPartners(partnersData.partnersList);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPartners();
  }, []);

  if (loading) {
    return (
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="animate-pulse mb-12 text-center">
            <div className="h-8 bg-gray-200 rounded w-48 mx-auto mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-32 mx-auto"></div>
          </div>
          <div className="flex flex-wrap justify-center items-center gap-8">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="w-40 flex flex-col items-center">
                <div className="h-20 w-full bg-gray-200 rounded-lg mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-24"></div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (!partners.length) {
    return null;
  }

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
            {partnersData.partnerPage.title[currentLanguage as keyof typeof partnersData.partnerPage.title].text}
          </h2>
          <div className="w-20 h-1 mx-auto mt-4" style={{ backgroundColor: theme.colors.primary }}></div>
        </div>
        
        {error && (
          <div className="text-center mb-8">
            <p className="text-red-600 mb-4">Error loading partners: {error}</p>
            <button
              onClick={() => {
                setLoading(true);
                setError(null);
                fetchPartners();
              }}
              className="px-4 py-2 rounded-lg"
              style={{ 
                backgroundColor: theme.colors.primary, 
                color: 'white', 
                fontFamily: currentLanguage === 'ur' ? theme.fonts.ur.primary : theme.fonts.en.primary 
              }}
            >
              Try Again
            </button>
          </div>
        )}
        
        <div className="flex flex-wrap justify-center items-center gap-8">
          {partners.map((partner, index) => (
            <div key={partner.id || index} className="w-40 group flex flex-col items-center">
              <div className="h-20 relative w-full group-hover:scale-110 transition-all duration-300">
                <Image
                  src={partner.image}
                  alt={partner.altText}
                  fill
                  style={{ objectFit: 'contain' }}
                />
              </div>
              <span 
                className="mt-2 opacity-0 group-hover:opacity-100 transition-all duration-300 text-center text-sm"
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