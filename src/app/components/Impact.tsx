'use client';

import { useState, useEffect } from 'react';
import CountUp from 'react-countup';
import { ImpactData, ImpactStat } from '@/types/impact';
import { theme } from '@/config/theme';
import {
  FaMapMarked,
  FaProjectDiagram,
  FaCheckCircle,
  FaUsers,
  FaHeart,
  FaHandsHelping,
  FaGraduationCap,
  FaHome,
  FaMedkit,
  FaWater,
  FaLeaf,
  FaChild
} from 'react-icons/fa';
import { IconType } from 'react-icons';

// Language configuration object using theme fonts
const languageConfig = {
  en: {
    direction: 'ltr' as const,
    textAlign: 'center' as const,
    fontFamily: theme.fonts.en.primary,
    label: theme.organization.languages.labels.en
  },
  ur: {
    direction: 'rtl' as const,
    textAlign: 'center' as const,
    fontFamily: theme.fonts.ur.primary,
    label: theme.organization.languages.labels.ur
  }
};

// Icon mapping function
const getIconComponent = (iconName: string) => {
  const iconMap: { [key: string]: IconType } = {
    FaMapMarked,
    FaProjectDiagram,
    FaCheckCircle,
    FaUsers,
    FaHeart,
    FaHandsHelping,
    FaGraduationCap,
    FaHome,
    FaMedkit,
    FaWater,
    FaLeaf,
    FaChild
  };

  return iconMap[iconName] || FaUsers; // Default to FaUsers if icon not found
};

export default function Impact() {
  const [impactData, setImpactData] = useState<ImpactData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [language, setLanguage] = useState<'en' | 'ur'>('en');
  const [isMobile, setIsMobile] = useState(false);

  // Get current language configuration
  const currentLangConfig = languageConfig[language];

  // Mobile detection effect
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    // Check on mount
    checkMobile();

    // Add resize listener
    window.addEventListener('resize', checkMobile);

    // Cleanup
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    const fetchImpactData = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch('/api/impact?homepage=true', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (response.ok) {
          const result = await response.json();
          console.log('Impact API Response:', result); // Debug log

          if (result.success) {
            if (result.data) {
              setImpactData(result.data);
            } else {
              // No data available, don't show error, just don't render
              setImpactData(null);
            }
          } else {
            console.error('API returned unsuccessful response:', result);
            setError('Failed to load impact data');
          }
        } else {
          console.error('API request failed with status:', response.status);
          setError(`Failed to fetch data: ${response.status}`);
        }
      } catch (error) {
        console.error('Error fetching impact data:', error);
        setError('Network error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchImpactData();
  }, []);

  if (loading) {
    return (
      <section className="relative">
        <div className={`${isMobile ? 'h-[50vh]' : 'h-[75vh]'} flex items-center justify-center px-4`}>
          <div className={`animate-spin rounded-full ${isMobile ? 'h-16 w-16' : 'h-32 w-32'} border-b-2 border-[#FFD700]`}></div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="relative">
        <div className={`${isMobile ? 'h-[50vh]' : 'h-[75vh]'} flex items-center justify-center px-4`}>
          <div className="text-center max-w-md mx-auto">
            <h2 className={`${isMobile ? 'text-lg' : 'text-2xl'} font-bold text-gray-900 ${isMobile ? 'mb-3' : 'mb-4'}`}>
              Error Loading Impact Data
            </h2>
            <p className={`${isMobile ? 'text-sm' : 'text-base'} text-gray-600 mb-4`}>{error}</p>
            <button
              onClick={() => window.location.reload()}
              className={`${isMobile ? 'px-4 py-2 text-sm' : 'px-6 py-3 text-base'} bg-[#FFD700] text-gray-900 rounded-lg hover:bg-yellow-400 transition-colors font-medium`}
            >
              Retry
            </button>
          </div>
        </div>
      </section>
    );
  }

  if (!impactData || !impactData.stats || impactData.stats.length === 0) {
    return null; // Don't render if no data or stats
  }

  return (
    <section className="relative">
      {/* Background Image with Overlay */}
      <div className={`${isMobile ? 'h-[50vh]' : 'h-[60vh]'} relative`}>
        <div
          className={`absolute inset-0 bg-cover bg-center ${isMobile ? 'bg-scroll' : 'bg-fixed'}`}
          style={{
            backgroundImage: `url(${impactData.backgroundImage || '/images/impact-bg.jpg'})`
          }}
        >
          <div className="absolute inset-0 bg-black/40"></div>
        </div>

        {/* Title Section - Centered */}
        <div className="relative h-full flex items-center justify-center px-4">
          <div
            className={`text-center ${isMobile ? 'mt-[-21rem]' : 'mt-[-4rem]'} max-w-4xl mx-auto`}
            style={{
              fontFamily: currentLangConfig.fontFamily
            }}
          >
            <h2
              className={`${isMobile ? 'text-2xl' : 'text-4xl md:text-5xl'} font-bold text-white ${isMobile ? 'mb-3' : 'mb-4'} leading-tight`}
              style={{
                textAlign: 'center', // Always center-aligned
                fontFamily: currentLangConfig.fontFamily
              }}
            >
              {impactData.title[language]?.text || impactData.title.en?.text || 'We Can Make A Difference'}
            </h2>
            <div className={`${isMobile ? 'w-16' : 'w-24'} h-1 bg-[#FFD700] mx-auto ${isMobile ? 'mb-4' : 'mb-6'}`}></div>

            {/* Language Toggle Buttons */}
            <div className={`flex justify-center ${isMobile ? 'gap-2' : 'gap-3'}`}>
              {Object.entries(languageConfig).map(([langKey, config]) => (
                <button
                  key={langKey}
                  onClick={() => setLanguage(langKey as 'en' | 'ur')}
                  className={`${isMobile ? 'px-3 py-2 text-sm' : 'px-4 py-2 text-base'} rounded-lg font-medium transition-all duration-300 ${
                    language === langKey
                      ? 'bg-[#FFD700] text-gray-900 shadow-lg'
                      : 'bg-white/20 text-white hover:bg-white/30 backdrop-blur-sm'
                  }`}
                  style={{ fontFamily: config.fontFamily }}
                >
                  {config.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Plain background section */}
      <div className={`bg-gray-50 ${isMobile ? 'h-[15vh]' : 'h-[20vh]'}`}></div>

      {/* Stats Grid - Overlapping both sections */}
      <div className={`absolute left-0 right-0 ${isMobile ? 'top-[15vh]' : 'top-[48vh]'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className={`grid ${isMobile ? 'grid-cols-2 gap-4' : 'grid-cols-2 lg:grid-cols-4 gap-6'}`}>
            {impactData.stats
              .filter((stat: ImpactStat) => stat.showOnHomepage) // Only show homepage stats
              .sort((a: ImpactStat, b: ImpactStat) => a.order - b.order) // Sort by order
              .map((stat: ImpactStat) => {
                const IconComponent = getIconComponent(stat.iconName);
                const statValue = parseInt(stat.value) || 0; // Ensure it's a number

                return (
                  <div
                    key={stat.id}
                    className={`bg-white rounded-lg ${isMobile ? 'p-4' : 'p-6'} text-center transform hover:-translate-y-2 transition-all duration-300 shadow-xl`}
                    style={{
                      direction: currentLangConfig.direction,
                      fontFamily: currentLangConfig.fontFamily
                    }}
                  >
                    <div className={`flex justify-center ${isMobile ? 'mb-3' : 'mb-4'}`}>
                      <IconComponent className={`${isMobile ? 'w-8 h-8' : 'w-12 h-12'} text-[#FFD700]`} />
                    </div>
                    <div
                      className={`${isMobile ? 'text-2xl' : 'text-4xl'} font-bold text-gray-900 mb-2`}
                      style={{
                        textAlign: 'center', // Keep numbers centered
                        fontFamily: theme.fonts.en.primary // Use theme font for numbers
                      }}
                    >
                      <CountUp
                        end={statValue}
                        duration={2.5}
                        separator=","
                      />
                      {stat.suffix && (
                        <span
                          className={`${isMobile ? 'text-lg' : 'text-2xl'} ${language === 'ur' ? 'mr-1' : 'ml-1'}`}
                          style={{ fontFamily: currentLangConfig.fontFamily }}
                        >
                          {stat.suffix}
                        </span>
                      )}
                    </div>
                    <div
                      className={`${isMobile ? 'text-sm' : 'text-base'} text-gray-600 font-medium leading-tight`}
                      style={{
                        textAlign: 'center', // Always center-aligned
                        fontFamily: currentLangConfig.fontFamily
                      }}
                    >
                      {stat.label[language]?.text || stat.label.en?.text || 'No label'}
                    </div>
                  </div>
                );
              })}
          </div>
        </div>
      </div>
    </section>
  );
}