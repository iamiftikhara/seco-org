"use client";

import {useEffect, useState} from "react";
import Link from "next/link";
import Image from "next/image";
import * as Icons from "react-icons/fa";
import {ServiceDetail} from "@/types/services";
import {serviceUtils} from "@/utils/services";
import Navbar from "@/app/components/Navbar";
import Footer from "@/app/components/Footer";
import LoadingSpinner from "@/app/components/LoadingSpinner";
import {services} from "@/data/services";
import {theme} from "@/config/theme";

export default function ServicesPage() {
  const [loading, setLoading] = useState(true);
  const [language, setLanguage] = useState<"en" | "ur" | "all">("en");
  const [imageLoaded, setImageLoaded] = useState(false);

  // Remove the servicesList state and useEffect since we're using the static data
  const filteredServices = language === "all" ? services.servicesList : services.servicesList.filter((service) => service.language === language);

  // Remove loading state management
  useEffect(() => {
    setLoading(false);
  }, []);

  return (
    <>
      <Navbar />
      <div className="relative h-[calc(100vh-20rem)] overflow-hidden">
        <Image src={services.servicePage.image} alt={language === "all" ? `${services.servicePage.title.en.text} / ${services.servicePage.title.ur.text}` : services.servicePage.title[language].text} fill className={`object-cover transition-transform duration-700 duration-[20s] ${imageLoaded ? "scale-110" : "scale-100"}`} priority onLoadingComplete={() => setImageLoaded(true)} />
        <div className="absolute inset-0 flex items-center justify-center" style={{background: "linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5))"}}>
          <div
            className="text-center text-white"
            style={{
              fontFamily: language === "ur" ? theme.fonts.ur.primary : theme.fonts.en.primary,
            }}
          >
            <h1
              className="text-5xl font-bold mb-4"
              style={{
                fontFamily: theme.fonts.ur.primary,
              }}
            >
              {language === "all" ? `${services.servicePage.title.en.text} / ${services.servicePage.title.ur.text}` : services.servicePage.title[language].text}
            </h1>
            <p
              className="text-xl max-w-3xl mx-auto px-4"
              style={{
                fontFamily: language === "ur" ? theme.fonts.ur.primary : theme.fonts.en.primary,
              }}
            >
              {language === "all" ? `${services.servicePage.description.en.text} / ${services.servicePage.description.ur.text}` : services.servicePage.description[language].text}
            </p>
            <div className="mt-6">
              <button onClick={() => setLanguage("all")} className={`mx-2 px-4 py-2 hidden rounded cursor-pointer ${theme.fonts.en.primary} ${language === "all" ? `bg-white text-[${theme.colors.primary}]` : "bg-transparent text-white border border-white"}`}
                style={{
                  fontFamily: theme.fonts.ur.primary,
                }}>
                All / سب
              </button>
              <button onClick={() => setLanguage("en")} className={`mx-2 px-4 py-2 rounded cursor-pointer ${language === "en" ? `bg-white text-[${theme.colors.primary}]` : "bg-transparent text-white border border-white"}`}>
                English
              </button>
              <button onClick={() => setLanguage("ur")} className={`mx-2 px-4 py-2 rounded cursor-pointer ${language === "ur" ? `bg-white text-[${theme.colors.primary}]` : "bg-transparent text-white border border-white"}`}
                 style={{
                  fontFamily: theme.fonts.ur.primary,
                }}>
                اردو
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="min-h-screen bg-white py-16">
        <div className="max-w-7xl mx-auto px-4">
          {loading ? (
            <div className="flex justify-center items-center min-h-[400px]">
              <LoadingSpinner />
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredServices.map((service) => {
                const IconComponent = service.iconName ? Icons[service.iconName as keyof typeof Icons] : null;
                return (
                  <Link 
                    href={`/services/${service.slug}`} 
                    key={service.id} 
                    className="group bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300"
                    style={{
                      fontFamily: service.language === "ur" ? theme.fonts.ur.primary : theme.fonts.en.primary
                    }}
                  >
                    <div className="relative h-48">
                      <Image src={service.heroImage} alt={service.title.text} fill className="object-cover group-hover:scale-105 transition-transform duration-300" />
                    </div>
                    <div className="p-6">
                      <div className={`flex items-center mb-4 ${service.language === "ur" ? "flex-row-reverse justify-start" : ""}`}>
                        {IconComponent && <IconComponent className={`text-3xl text-[${theme.colors.primary}] ${service.language === "ur" ? "ml-3" : "mr-3"}`} />}
                        <h2 
                          className={`text-xl font-semibold text-gray-900 group-hover:text-[${theme.colors.primary}] transition-colors duration-300 ${service.language === "ur" ? "text-right" : "text-left"}`}
                          style={{
                            fontFamily: service.language === "ur" ? theme.fonts.ur.primary : theme.fonts.en.primary
                          }}
                        >
                          {service.title.text}
                        </h2>
                      </div>
                      <p 
                        className={`text-gray-600 ${service.language === "ur" ? "text-right" : "text-left"}`}
                        style={{
                          fontFamily: service.language === "ur" ? theme.fonts.ur.primary : theme.fonts.en.primary
                        }}
                      >
                        {service.shortDescription.text}
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
