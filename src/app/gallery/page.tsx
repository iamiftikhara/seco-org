'use client';

import { useState } from 'react';
import Image from 'next/image';
import { theme } from '@/config/theme';
import { galleryData } from '@/data/gallery';
import Navbar  from '@/app/components/Navbar';
import Footer  from '@/app/components/Footer';

export default function GalleryPage() {
  const [expandedSections, setExpandedSections] = useState<{ [key: string]: boolean }>({});
  const [isImageLoaded, setIsImageLoaded] = useState(false);
  const [selectedImage, setSelectedImage] = useState<{ section: number, image: number } | null>(null);
  const [isModalImageLoading, setIsModalImageLoading] = useState(true);
  const { hero, sections } = galleryData;

  const handleImageClick = (sectionIndex: number, imageIndex: number) => {
    setSelectedImage({ section: sectionIndex, image: imageIndex });
  };

  const handleCloseModal = () => {
    setSelectedImage(null);
  };

  const handleNavigate = (direction: 'prev' | 'next') => {
    if (!selectedImage) return;
    
    const currentSection = sections[selectedImage.section];
    const imagesInSection = expandedSections[currentSection.title] 
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

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-white">
        {/* Hero Section */}
        <div className="relative h-[calc(100vh-20rem)] overflow-hidden">
          {!isImageLoaded && (
            <div className="absolute inset-0 bg-gray-200 animate-pulse flex items-center justify-center">
              <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
            </div>
          )}
          <Image
            src={hero.image}
            alt={hero.title}
            fill
            className={`object-cover transition-transform duration-[30s] ${
              isImageLoaded ? 'scale-120 opacity-100' : 'scale-100 opacity-0'
            }`}
            onLoadingComplete={() => setIsImageLoaded(true)}
            priority
          />
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
            <div className="text-center text-white">
              <h1 className="text-5xl font-bold mb-4">{hero.title}</h1>
              <p className="text-xl max-w-2xl mx-auto">{hero.description}</p>
            </div>
          </div>
        </div>

        <div className="py-16">
          <div className="max-w-7xl mx-auto px-4">
            {sections.map((section, sectionIndex) => (
              <div key={section.title} className="mb-16">
                <div className="text-left mb-8">
                  <h2 className="text-3xl font-bold text-gray-900">{section.title}</h2>
                  <div className="w-20 h-1 bg-yellow-500 mt-4"></div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                  {section.images
                    .slice(0, expandedSections[section.title] ? undefined : 10)
                    .map((image, imageIndex) => (
                      <div 
                        key={imageIndex}
                        className="relative h-48 overflow-hidden rounded-lg group cursor-pointer"
                        onClick={() => handleImageClick(sectionIndex, imageIndex)}
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
                                  className="text-xs px-2 py-1 rounded-full"
                                  style={{
                                    backgroundColor: theme.colors.secondary,
                                    color: theme.colors.primary
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

                {section.images.length > 10 && (
                  <div className="text-center mt-8">
                    <button
                      onClick={() => toggleSection(section.title)}
                      className="px-6 py-2 rounded-lg transition-colors duration-300"
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
                      {expandedSections[section.title] ? 'Show Less' : 'Load More'}
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Image Modal */}
      {selectedImage !== null && (
        <div className="fixed inset-0 bg-black bg-opacity-75 z-50 flex items-center justify-center p-4">
          <div className="relative max-w-[70vw] max-h-[70vh] w-fit h-fit">
            <div className="relative">
              {isModalImageLoading && (
                <div className="absolute inset-0 bg-gray-200 bg-opacity-20 rounded-lg flex items-center justify-center">
                  <div className="w-16 h-16 border-4 border-secondary border-t-transparent rounded-full animate-spin"></div>
                </div>
              )}
              <Image
                src={sections[selectedImage.section].images[selectedImage.image].src}
                alt={sections[selectedImage.section].images[selectedImage.image].alt}
                width={1200}
                height={800}
                style={{ 
                  objectFit: 'contain',
                  maxHeight: '70vh',
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
      <Footer />
    </>
  );
}