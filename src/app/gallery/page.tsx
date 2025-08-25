'use client';

import { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import { theme } from '@/config/theme';
import Navbar  from '@/app/components/Navbar';
import Footer  from '@/app/components/Footer';
import type { GalleryConfig } from '@/types/gallery';

export default function GalleryPage() {
  const [expandedSections, setExpandedSections] = useState<{ [key: string]: boolean }>({});
  const [isImageLoaded, setIsImageLoaded] = useState(false);
  const [selectedImage, setSelectedImage] = useState<{ section: number, image: number } | null>(null);
  const [isModalImageLoading, setIsModalImageLoading] = useState(true);
  const [gallery, setGallery] = useState<GalleryConfig | null>(null);
  const [lang, setLang] = useState<'en' | 'ur'>('en');
  const [isMobile, setIsMobile] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const fetchGallery = useCallback(async () => {
    try {
      const res = await fetch('/api/gallery');
      const json = await res.json();
      if (json.success) {
        setGallery(json.data as GalleryConfig);
      } else {
        console.error('Failed to fetch gallery:', json.error);
      }
    } catch (err) {
      console.error('Error fetching gallery:', err);
    }
  }, []);

  useEffect(() => {
    fetchGallery();
  }, [fetchGallery]);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    // Set initial value
    handleResize();

    // Add event listener
    window.addEventListener("resize", handleResize);

    // Cleanup
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const hero = gallery?.hero;
  const sections = gallery?.sections || [];
  const isRTL = lang === 'ur';

  // Build category and tag filters from all images
  const allImages = sections.flatMap(section => section.images);
  const allCategories = ['all', ...Array.from(new Set(allImages.map(img => img.category).filter(Boolean)))];
  const imageMatchesFilters = (img: { category: string; tags: string[] }) => {
    const categoryOk = selectedCategory === 'all' || img.category === selectedCategory;
    return categoryOk;
  };

  const handleImageClick = (sectionIndex: number, imageIndex: number) => {
    setSelectedImage({ section: sectionIndex, image: imageIndex });
  };

  const handleCloseModal = () => {
    setSelectedImage(null);
  };

  const handleNavigate = (direction: 'prev' | 'next') => {
    if (!selectedImage) return;
    
    const currentSection = sections[selectedImage.section];
    const imagesInSection = expandedSections[currentSection.title[lang]] 
      ? currentSection.images 
      : currentSection.images.slice(0, 10);
    
    let newImageIndex = direction === 'next'
      ? selectedImage.image + 1
      : selectedImage.image - 1;

    if (newImageIndex >= imagesInSection.length) {
      newImageIndex = 0;
    } else if (newImageIndex < 0) {
      newImageIndex = imagesInSection.length - 1;
    }

    setSelectedImage({ ...selectedImage, image: newImageIndex });
  };

  const toggleSection = (sectionTitle: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [sectionTitle]: !prev[sectionTitle]
    }));
  };

  const heroTitle = hero ? hero.title[lang] : '';
  const heroDescription = hero ? hero.description[lang] : '';

  return (
    <>
      <Navbar />
      <div className={`min-h-screen bg-white ${isRTL ? 'rtl' : 'ltr'}`}>
        {/* Hero Section */}
        <div className={`${isMobile ? 'h-[calc(100vh-35rem)]' : 'h-[calc(100vh-20rem)]'} relative overflow-hidden`}>
          {!isImageLoaded && (
            <div className="absolute inset-0 bg-gray-200 animate-pulse flex items-center justify-center">
              <div className="w-12 h-12 sm:w-16 sm:h-16 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
            </div>
          )}
          {hero?.image && (
            <Image
              src={hero.image}
              alt={heroTitle}
              fill
              className={`object-cover transition-transform duration-[30s] ${
                isImageLoaded ? 'scale-120 opacity-100' : 'scale-100 opacity-0'
              }`}
              onLoadingComplete={() => setIsImageLoaded(true)}
              priority
            />
          )}
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
            <div className="text-center text-white px-4 sm:px-6 lg:px-8">
              <h1 
                className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-2 sm:mb-4"
                style={{ fontFamily: lang === 'ur' ? theme.fonts.ur.primary : theme.fonts.en.primary }}
              >
                {heroTitle}
              </h1>
              <p 
                className="text-sm sm:text-base md:text-lg lg:text-xl max-w-xs sm:max-w-md md:max-w-lg lg:max-w-2xl mx-auto"
                style={{ fontFamily: lang === 'ur' ? theme.fonts.ur.primary : theme.fonts.en.primary }}
              >
                {heroDescription}
              </p>
            </div>
          </div>

          {/* Language Switcher */}
          <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex gap-4 z-10">
            <button
              onClick={() => setLang("en")}
              className={`${isMobile ? 'px-3 py-1' : 'px-4 py-2'} rounded-full transition-all duration-300`}
              style={{
                backgroundColor: lang === "en" ? theme.colors.primary : "rgba(21, 21, 21, 0.6)",
                color: lang === "en" ? theme.colors.secondary : "white",
                backdropFilter: "blur(4px)",
                border: `2px solid ${lang === "en" ? theme.colors.secondary : "transparent"}`,
                fontFamily: theme.fonts.en.primary,
              }}
            >
              English
            </button>
            <button
              onClick={() => setLang("ur")}
              className={`${isMobile ? 'px-3 py-1' : 'px-4 py-2'} rounded-full transition-all duration-300`}
              style={{
                backgroundColor: lang === "ur" ? theme.colors.primary : "rgba(21, 21, 21, 0.6)",
                color: lang === "ur" ? theme.colors.secondary : "white",
                backdropFilter: "blur(4px)",
                border: `2px solid ${lang === "ur" ? theme.colors.secondary : "transparent"}`,
                fontFamily: theme.fonts.ur.primary,
              }}
            >
              اردو
            </button>
          </div>
        </div>

        <div className="py-8 sm:py-12 md:py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Category Filter */}
            <div className={`mb-8 text-center`}>
              <div className="flex flex-wrap justify-center gap-2">
                {allCategories.map(cat => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className="px-4 py-2 rounded-full text-sm font-medium transition-colors duration-300"
                    style={{
                      backgroundColor: selectedCategory === cat ? theme.colors.secondary : theme.colors.background.secondary,
                      color: selectedCategory === cat ? theme.colors.primary : theme.colors.text.secondary
                    }}
                  >
                    {cat.charAt(0).toUpperCase() + cat.slice(1)}
                  </button>
                ))}
              </div>
            </div>

            {sections.map((section, sectionIndex) => (
              (() => {
                const visibleImages = section.images.filter(imageMatchesFilters);
                if (visibleImages.length === 0) return null;
                const slicedImages = visibleImages.slice(0, expandedSections[section.title[lang]] ? undefined : 10);
                return (
              <div key={section.title[lang]} className="mb-8 sm:mb-12 md:mb-16">
                <div className={`text-left mb-6 sm:mb-8 ${isRTL ? 'text-right direction-rtl' : ''}`}>
                  <h2 
                    className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900"
                    style={{ fontFamily: lang === 'ur' ? theme.fonts.ur.primary : theme.fonts.en.primary }}
                  >
                    {section.title[lang]}
                  </h2>
                  <div className="w-16 sm:w-20 h-1 bg-yellow-500 mt-2 sm:mt-4"></div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4">
                  {slicedImages
                    .map((image, imageIndex) => (
                      <div 
                        key={imageIndex}
                        className="relative h-32 sm:h-40 md:h-48 overflow-hidden rounded-lg group cursor-pointer"
                        onClick={() => handleImageClick(sectionIndex, imageIndex)}
                      >
                        <Image
                          src={image.src}
                          alt={image.alt}
                          fill
                          style={{ objectFit: 'cover' }}
                          className="hover:scale-110 transition-transform duration-300"
                        />
                        <div className="absolute inset-0 bg-opacity-0 group-hover:bg-opacity-60 transition-opacity duration-300 flex items-end justify-start p-2 sm:p-4">
                          <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                            <div className="flex flex-wrap gap-1">
                              {image.tags.map((tag) => (
                                <span 
                                  key={tag}
                                  className="text-xs px-1 py-0.5 sm:px-2 sm:py-1 rounded-full"
                                  style={{
                                    backgroundColor: theme.colors.secondary,
                                    color: theme.colors.primary,
                                    fontFamily: lang === 'ur' ? theme.fonts.ur.primary : theme.fonts.en.primary,
                                  }}
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

                {visibleImages.length > 10 && (
                  <div className="text-center mt-6 sm:mt-8">
                    <button
                      onClick={() => toggleSection(section.title[lang])}
                      className="px-4 py-2 sm:px-6 sm:py-2 rounded-lg transition-colors duration-300 text-sm sm:text-base"
                      style={{ 
                        backgroundColor: theme.colors.primary,
                        color: 'white',
                        fontFamily: lang === 'ur' ? theme.fonts.ur.primary : theme.fonts.en.primary,
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = theme.colors.primaryHover;
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = theme.colors.primary;
                      }}
                    >
                      {expandedSections[section.title[lang]] ? 'Show Less' : 'Load More'}
                    </button>
                  </div>
                )}
              </div>
                );
              })()
            ))}
          </div>
        </div>
      </div>

      {/* Image Modal */}
      {selectedImage !== null && (
        <div className="fixed inset-0 bg-black bg-opacity-75 z-50 flex items-center justify-center p-2 sm:p-4">
          <div className="relative max-w-[90vw] sm:max-w-[80vw] md:max-w-[50vw] max-h-[90vh] sm:max-h-[80vh] md:max-h-[80vh] w-fit h-fit">
            <div className="relative">
              {isModalImageLoading && (
                <div className="absolute inset-0 bg-gray-200 bg-opacity-20 rounded-lg flex items-center justify-center">
                  <div className="w-12 h-12 sm:w-16 sm:h-16 border-4 border-secondary border-t-transparent rounded-full animate-spin"></div>
                </div>
              )}
              <Image
                src={sections[selectedImage.section].images[selectedImage.image].src}
                alt={sections[selectedImage.section].images[selectedImage.image].alt}
                width={1200}
                height={800}
                style={{ 
                  objectFit: 'contain',
                  maxHeight: '90vh',
                  width: 'auto',
                  height: 'auto'
                }}
                className={`rounded-lg transition-opacity duration-300 ${
                  isModalImageLoading ? 'opacity-0' : 'opacity-100'
                }`}
                onLoadingComplete={() => setIsModalImageLoading(false)}
                onLoadStart={() => setIsModalImageLoading(true)}
              />
              <button
                className="absolute -top-2 -right-2 sm:-top-4 sm:-right-4 z-10 text-white rounded-full p-1 sm:p-2 hover:bg-opacity-75"
                onClick={handleCloseModal}
                style={{ backgroundColor: theme.colors.secondary }}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 sm:h-6 sm:w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>

              {/* Navigation Buttons */}
              <button
                className={`absolute top-1/2 transform -translate-y-1/2 text-white rounded-full p-1 sm:p-2 hover:bg-opacity-75 ${isRTL ? 'right-1 sm:right-2' : 'left-1 sm:left-2'}`}
                onClick={() => handleNavigate('prev')}
                style={{ backgroundColor: theme.colors.secondary }}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 sm:h-6 sm:w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              
              <button
                className={`absolute top-1/2 transform -translate-y-1/2 text-white rounded-full p-1 sm:p-2 hover:bg-opacity-75 ${isRTL ? 'left-1 sm:left-2' : 'right-1 sm:right-2'}`}
                onClick={() => handleNavigate('next')}
                style={{ backgroundColor: theme.colors.secondary }}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 sm:h-6 sm:w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      )}
      <Footer />
    </>
  );
}