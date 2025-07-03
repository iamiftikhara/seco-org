"use client";

import {useState, useEffect} from "react";
import Image from "next/image";
import {Swiper, SwiperSlide} from "swiper/react";
import {Autoplay, Navigation, Pagination} from "swiper/modules";
import {FaNewspaper, FaBullhorn} from "react-icons/fa";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import {theme} from "@/config/theme";
import {useLoading} from "@/app/providers/LoadingProvider";
import type {HeroData} from "@/types/hero";

export default function Hero() {
  const [currentLanguage, setCurrentLanguage] = useState("en");
  const [isMobile, setIsMobile] = useState(false);
  const {setIsLoading: setGlobalLoading, setError: setGlobalError} = useLoading(); // Get setError

  const [heroData, setHeroData] = useState<HeroData | null>(null);

  const fetchHeroData = async () => {
    try {
      const response = await fetch("/api/hero");

      const data = await response.json();
      console.log("Fetched data:", data);
      if (data.success) {
        setHeroData(data.data); // Assuming you want the first hero item
      } else {
        console.error("Failed to fetch hero data:", data.error);
        setGlobalError(true); // Set error state on failure
      }
    } catch (error) {
      console.error("Error fetching hero data:", error);
      setGlobalError(true); // Set error state on error
    } finally {
      setGlobalLoading(false);
    }
  };

  useEffect(() => {
    fetchHeroData();
  }, []);

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

  const getIcon = (iconName: string) => {
    return iconName === "newspaper" ? <FaNewspaper className={currentLanguage === "en" ? "mr-3" : "ml-3"} /> : <FaBullhorn className={currentLanguage === "en" ? "mr-3" : "ml-3"} />;
  };

  if (!heroData) {
    return <div>Loading...</div>;
  }

  return (
    <div className={`${isMobile ? `h-[calc(100vh-22rem)] top-[calc(40vh-15rem)] ${isMobile}` : 'min-h-screen'} relative flex flex-col`}>
      <div className={`${isMobile ? 'h-[calc(100vh-35rem)]' : 'h-[calc(100vh-9.7rem)]'}  relative`}>
        <Swiper
          modules={[Autoplay, Navigation, Pagination]}
          pagination={{clickable: true}}
          autoplay={{
            delay: heroData.config.slider.autoplayDelay,
            disableOnInteraction: false,
            pauseOnMouseEnter: heroData.config.slider.pauseOnHover,
          }}
          speed={heroData.config.slider.transitionSpeed}
          loop={true}
          className="w-full h-full"
          allowTouchMove={false}
        >
          {heroData.slides.map((slide, index) => (
            <SwiperSlide key={index}>
              <div className="relative w-full h-full">
                <Image
                  src={isMobile ? slide.mobileImage : slide.image}
                  alt={slide.title[currentLanguage as keyof typeof slide.title]}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 100vw, 100vw"
                  style={{
                    objectFit: "cover",
                    objectPosition: "center",
                    backgroundColor: "#000",
                  }}
                  priority={index === 0}
                  quality={90}
                />
                {/* Language Switcher */}
                <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex gap-4 z-10">
                  <button
                    onClick={() => setCurrentLanguage("en")}
                    className="px-4 py-2 rounded-full transition-all duration-300"
                    style={{
                      backgroundColor: currentLanguage === "en" ? theme.colors.primary : "rgba(21, 21, 21, 0.6)",
                      color: currentLanguage === "en" ? theme.colors.secondary : "white",
                      backdropFilter: "blur(4px)",
                      border: `2px solid ${currentLanguage === "en" ? theme.colors.secondary : "transparent"}`,
                      fontFamily: theme.fonts.en.primary,
                    }}
                  >
                    English
                  </button>
                  <button
                    onClick={() => setCurrentLanguage("ur")}
                    className="px-4 py-2 rounded-full transition-all duration-300"
                    style={{
                      backgroundColor: currentLanguage === "ur" ? theme.colors.primary : "rgba(21, 21, 21, 0.6)",
                      color: currentLanguage === "ur" ? theme.colors.secondary : "white",
                      backdropFilter: "blur(4px)",
                      border: `2px solid ${currentLanguage === "ur" ? theme.colors.secondary : "transparent"}`,
                      fontFamily: theme.fonts.ur.primary,
                      fontSize: `${isMobile ? '1rem' : ''}`
                    }}
                  >
                    اردو
                  </button>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      <div className="relative">
        <div className="bg-white py-3 md:pb-7  relative">
          <Swiper
            modules={[Autoplay]}
            autoplay={{
              delay: heroData.config.slider.autoplayDelay,
              disableOnInteraction: false,
              pauseOnMouseEnter: heroData.config.slider.pauseOnHover,
            }}
            speed={heroData.config.slider.transitionSpeed}
            loop={true}
            className="max-w-4xl mx-auto"
            allowTouchMove={false}
          >
            {heroData.slides.map((slide, index) => (
              <SwiperSlide key={index}>
                <div className="text-center px-4">
                  <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-1 md:mb-2" style={{color: theme.colors.text.primary, fontFamily: currentLanguage === "ur" ? theme.fonts.ur.primary : theme.fonts.en.primary}}>
                    {slide.title[currentLanguage as keyof typeof slide.title]}
                  </h1>
                  <p className="text-xl" style={{color: theme.colors.text.secondary, fontFamily: currentLanguage === "ur" ? theme.fonts.ur.primary : theme.fonts.en.primary}}>
                    {slide.subtitle[currentLanguage as keyof typeof slide.subtitle]}
                  </p>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>

          <div className="absolute mt-1 md:mt-2 left-1/2 transform -translate-x-1/2">
            <div
              className="w-0 h-0 border-l-[12px] md:border-l-[20px] border-l-transparent 
                border-r-[12px] md:border-r-[20px] border-r-transparent 
                border-t-[12px] md:border-t-[20px] animate-bounce"
              style={{borderTopColor: theme.colors.secondary}}
            />
          </div>
        </div>

        <div className="overflow-hidden" style={{backgroundColor: theme.colors.primary}}>
          <div className="marquee-container">
            <div
              className="marquee"
              style={{
                animationDuration: `${heroData.config.marquee.speed}s`,
              }}
            >
              {Array(heroData.config.marquee.repetitions)
                .fill(heroData.announcements)
                .flat()
                .map((announcement, index) => (
                  <span
                    key={index}
                    className={`
                      whitespace-nowrap flex items-center
                      text-sm md:text-base lg:text-lg
                      leading-[24px] md:leading-[32px] lg:leading-[40px]
                    `}
                    style={{color: theme.colors.secondary, fontFamily: announcement.language === "ur" ? theme.fonts.ur.primary : theme.fonts.en.primary}}
                    dir={announcement.language === "ur" ? "rtl" : "ltr"}
                  >
                    {announcement.language === "ur" ? (
                      <>
                        {announcement.text}
                        {getIcon(announcement.icon)}
                      </>
                    ) : (
                      <>
                        {getIcon(announcement.icon)}
                        {announcement.text}
                      </>
                    )}
                  </span>
                ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
