'use client';

import { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { theme } from '@/config/theme';
import type { GalleryConfig } from '@/types/gallery';
import UniversalError from './UniversalError';

function GallerySkeleton() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 animate-pulse">
      {Array.from({ length: 8 }).map((_, i) => (
        <div key={i} className="relative h-48 bg-gray-200 rounded-lg" />
      ))}
    </div>
  );
}

export default function Gallery() {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedImage, setSelectedImage] = useState<number | null>(null);
  const [gallery, setGallery] = useState<GalleryConfig | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchGallery = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const res = await fetch('/api/gallery?homepage=true');
      const json = await res.json();
      if (!json.success) {
        throw new Error(json.error || 'Failed to fetch gallery');
      }
      setGallery(json.data as GalleryConfig);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load gallery');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchGallery();
  }, [fetchGallery]);

  // Get all images that should be shown on home page
  const homeImages = (gallery?.sections || []).flatMap(section => 
    section.images.filter(img => img.showOnHome)
  );

  const allCategories = ['all', ...new Set(homeImages.map(img => img.category).filter(Boolean))] as string[];
  
  const filteredImages = selectedCategory === 'all' 
    ? homeImages 
    : homeImages.filter(img => img.category === selectedCategory);

  const handleImageClick = (index: number) => {
    setSelectedImage(index);
  };

  const handleCloseModal = () => {
    setSelectedImage(null);
  };

  const handleNavigate = (direction: 'prev' | 'next') => {
    if (selectedImage === null) return;
    
    const newIndex = direction === 'next' 
      ? (selectedImage + 1) % filteredImages.length
      : (selectedImage - 1 + filteredImages.length) % filteredImages.length;
    
    setSelectedImage(newIndex);
  };

  if (isLoading) {
    return (
      <section className="py-16" style={{ backgroundColor: '#ffffff' }}>
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <div className="animate-pulse">
              <div className="h-8 w-48 bg-gray-200 rounded mx-auto mb-6"></div>
              <div className="h-6 w-32 bg-gray-200 rounded mx-auto mb-8"></div>
            </div>
          </div>
          <GallerySkeleton />
        </div>
      </section>
    );
  }

  if (error || !gallery) {
    return (
      <section className="py-16" style={{ backgroundColor: '#ffffff' }}>
        <div className="max-w-7xl mx-auto px-4">
          <UniversalError
            error={error || 'Failed to load gallery'}
            onRetry={fetchGallery}
            sectionName="Gallery"
          />
        </div>
      </section>
    );
  }

  return (
    <section 
      className="py-16" 
      style={{ backgroundColor: '#ffffff' }}
    >
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center mb-12">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-900">Gallery</h2>
            <div className="w-20 h-1 mt-4 mb-8"
            style={{ backgroundColor: theme.colors.primary }}></div>
          </div>
          <Link 
            href="/gallery"
            className="inline-flex items-center px-6 py-2 rounded-lg transition-colors duration-300 cursor-pointer"
            style={{ 
              backgroundColor: theme.colors.primary,
              color: 'white',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = theme.colors.primaryHover;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = theme.colors.primary;
            }}
          >
            View All Images
          </Link>
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap justify-center gap-2 mb-8">
          {allCategories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors duration-300`}
              style={{ 
                backgroundColor: selectedCategory === cat ? theme.colors.secondary : theme.colors.background.secondary,
                color: selectedCategory === cat ? theme.colors.primary : theme.colors.text.secondary
              }}
            >
              {cat.charAt(0).toUpperCase() + cat.slice(1)}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {filteredImages.map((image, index) => (
            <div 
              key={index} 
              className="relative h-48 overflow-hidden rounded-lg group cursor-pointer"
              onClick={() => handleImageClick(index)}
            >
              <Image
                src={image.src}
                alt={image.alt}
                fill
                style={{ objectFit: 'cover' }}
                className="hover:scale-110 transition-transform duration-300"
              />
              <div className="absolute inset-0  bg-opacity-0 group-hover:bg-opacity-60 transition-opacity duration-300 flex items-end justify-start p-4">
                <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="flex flex-wrap gap-1">
                    {image.tags.map((tag) => (
                      <span 
                        key={tag}
                        className="text-xs bg-yellow-500 text-white px-2 py-1 rounded-full"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Image Modal */}
        {selectedImage !== null && (
          <div className="fixed inset-0 bg-black bg-opacity-75 z-50 flex items-center justify-center p-4">
            <div className="relative max-w-[70vw] max-h-[70vh] w-fit h-fit">
              <div className="relative">
                <Image
                  src={filteredImages[selectedImage].src}
                  alt={filteredImages[selectedImage].alt}
                  width={1200}
                  height={800}
                  style={{ 
                    objectFit: 'contain',
                    maxHeight: '70vh',
                    width: 'auto',
                    height: 'auto'
                  }}
                  className="rounded-lg"
                />
                <button
                  className="absolute -top-4 -right-4 z-10 text-white rounded-full p-2 hover:bg-opacity-75"
                  onClick={handleCloseModal}
                  style={{ backgroundColor: theme.colors.secondary }}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>

                {/* Navigation Buttons */}
                <button
                  className="absolute left-2 top-1/2 transform -translate-y-1/2 text-white rounded-full p-2 hover:bg-opacity-75"
                  onClick={() => handleNavigate('prev')}
                  style={{ backgroundColor: theme.colors.secondary }}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                
                <button
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 text-white rounded-full p-2 hover:bg-opacity-75"
                  onClick={() => handleNavigate('next')}
                  style={{ backgroundColor: theme.colors.secondary }}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}