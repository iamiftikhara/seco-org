"use client";

import {useEffect, useState} from "react";
import Image from "next/image";
import Link from "next/link";
import {notFound} from "next/navigation";
import {theme} from "@/config/theme";
import { use } from 'react';
import Navbar from "@/app/components/Navbar";
import Footer from "@/app/components/Footer";
import LoadingSpinner from "@/app/components/LoadingSpinner";
import {FaArrowLeft, FaArrowRight, FaUser} from "react-icons/fa";
import SocialShare from "@/app/components/SocialShare";
import type { BlogPost } from '@/types/blog';  // Changed to type-only import
import Script from 'next/script';


const ContentBlock = ({
  section,
  currentLanguage,
  currentFontFamily,
}: {
  section: {
    type: string;
    image?: {
      position: "above" | "below" | "left" | "right" | "full";
      src: string;
      alt: { en: string; ur: string };
    };
    text?: { en: string; ur: string };
    content?: { en: string; ur: string };
  };
  currentLanguage: 'en' | 'ur';
  currentFontFamily: string;
}) => {
  switch (section.type) {
    case "content-block":
      return (
        <div className="mb-8">
          {section.image?.position === "above" && section.image && (
            <div className="relative w-full h-[500px] mb-8">
              <Image src={section.image.src} alt={section.image.alt[currentLanguage]} fill className="object-cover rounded-lg" sizes="100vw" />
            </div>
          )}

          <div className={`flex ${section.image?.position === "full" || section.image?.position === "above" || section.image?.position === "below" ? "flex-col" : "items-start gap-8"}`}>
            {section.image?.position === "left" && section.image && (
              <div className="relative w-1/2 h-[400px] flex-shrink-0">
                <Image src={section.image.src} alt={section.image.alt[currentLanguage]} fill className="object-cover rounded-lg" sizes="50vw" />
              </div>
            )}

            <div className={section.image?.position === "full" || !section.image ? "w-full" : section.image.position === "above" || section.image.position === "below" ? "w-full" : "w-1/2"}>
              <p
                className="text-lg text-gray-600"
                style={{
                  fontFamily: currentFontFamily,
                }}
              >
                {section.text?.[currentLanguage]}
              </p>
            </div>

            {section.image?.position === "right" && section.image && (
              <div className="relative w-1/2 h-[400px] flex-shrink-0">
                <Image src={section.image.src} alt={section.image.alt[currentLanguage]} fill className="object-cover rounded-lg" sizes="50vw" />
              </div>
            )}
          </div>

          {section.image?.position === "below" && section.image && (
            <div className="relative w-full h-[500px] mt-8">
              <Image src={section.image.src} alt={section.image.alt[currentLanguage]} fill className="object-cover rounded-lg" sizes="100vw" />
            </div>
          )}

          {section.image?.position === "full" && section.image && (
            <div className="relative w-full h-[600px] mt-8">
              <Image src={section.image.src} alt={section.image.alt[currentLanguage]} fill className="object-cover rounded-lg" sizes="100vw" />
            </div>
          )}
        </div>
      );
    case "quote":
      return (
        <blockquote
          className={`text-xl italic my-8 ${currentLanguage === 'ur' ? 'text-right border-r-4 pr-6' : 'border-l-4 pl-6'}`}
          style={{
            borderColor: theme.colors.primary,
            color: theme.colors.text.secondary,
            fontFamily: currentFontFamily,
          }}
        >
          {section.content?.[currentLanguage]}
        </blockquote>
      );
    default:
      return null;
  }
};

export default function BlogPost({ params }: { params: Promise<{ slug: string }> }) {
  const [post, setPost] = useState<BlogPost | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [currentLanguage, setCurrentLanguage] = useState<'en' | 'ur'>('en');
  const [isMobile, setIsMobile] = useState(false);
  const [navigation, setNavigation] = useState<{
    prev: BlogPost | null;
    next: BlogPost | null;
  }>({
    prev: null,
    next: null,
  });

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const resolvedParams = await params;
        const res = await fetch(`/api/blogs/${resolvedParams.slug}`);
        const json = await res.json();
        if (!json.success) {
          setPost(null);
          setNavigation({ prev: null, next: null });
          return;
        }
        setPost(json.data as BlogPost);

        // Fetch list for prev/next
        const listRes = await fetch('/api/blogs');
        const listJson = await listRes.json();
        const list: BlogPost[] = listJson?.data?.blogsList || [];
        const currentIndex = list.findIndex((p) => p.slug === resolvedParams.slug);
        setNavigation({
          prev: currentIndex > 0 ? list[currentIndex - 1] : null,
          next: currentIndex >= 0 && currentIndex < list.length - 1 ? list[currentIndex + 1] : null,
        });
      } catch (error) {
        console.error("Error fetching post:", error);
        setPost(null);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPost();
  }, [params]);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  if (isLoading) {
    return (
      <>
        <Navbar />
        <div className="min-h-[calc(100vh-160px)] flex items-center justify-center">
          <LoadingSpinner />
        </div>
        <Footer />
      </>
    );
  }

  if (!post) {
    notFound();
  }

  const isUrdu = currentLanguage === 'ur';
  const currentFontFamily = isUrdu ? theme.fonts.ur.primary : theme.fonts.en.primary;


  const structuredData = post ? {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "url": typeof window !== "undefined" ? window.location.href : "",
    "headline": post.socialShare.title[currentLanguage],
    "description": post.socialShare.description[currentLanguage],
    "image": post.image,
    "datePublished": post.date,
    "dateModified": post.date || post.date,
    "author": {
      "@type": "Person",
      "name": post.author
    },
    "publisher": {
      "@type": "Organization",
      "name": "SECO",
      "url": typeof window !== "undefined" ? window.location.origin : "",
      "logo": {
        "@type": "ImageObject",
        "url": `${typeof window !== "undefined" ? window.location.origin : ""}/images/logo.png`
      }
    },
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": typeof window !== "undefined" ? window.location.href : ""
    },
    "keywords": post.socialShare.hashtags.join(", "),
    "articleBody": post.content
      .filter(section => section.type === "content-block")
      .map(section => section.text?.[currentLanguage])
      .join(" "),
    "inLanguage": currentLanguage,
    "articleSection": post.category
  } : null;
  

  return (
    <>
    <Script
        id="structured-data"
        type="application/ld+json"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(structuredData),
        }}
      />
      <Navbar />
      <div className="min-h-screen" style={{backgroundColor: theme.colors.background.primary}}>
        <div className="relative h-[calc(100vh-20rem)] overflow-hidden">
          <Image src={post.image} alt={post.title[currentLanguage]} fill className="object-cover" priority />
          <div className="absolute inset-0 bg-black/30"></div>
           {/* Language Switcher */}
          <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex gap-4 z-10">
            <button
              onClick={() => setCurrentLanguage('en')}
              className={`${isMobile ? 'px-3 py-1' : 'px-4 py-2'} rounded-full transition-all duration-300`}
              style={{
                backgroundColor: currentLanguage === 'en' ? theme.colors.primary : 'rgba(21, 21, 21, 0.6)',
                color: currentLanguage === 'en' ? theme.colors.secondary : 'white',
                backdropFilter: 'blur(4px)',
                border: `2px solid ${currentLanguage === 'en' ? theme.colors.secondary : 'transparent'}`,
                fontFamily: theme.fonts.en.primary,
              }}
            >
              English
            </button>
            <button
              onClick={() => setCurrentLanguage('ur')}
              className={`${isMobile ? 'px-3 py-1' : 'px-4 py-2'} rounded-full transition-all duration-300`}
              style={{
                backgroundColor: currentLanguage === 'ur' ? theme.colors.primary : 'rgba(21, 21, 21, 0.6)',
                color: currentLanguage === 'ur' ? theme.colors.secondary : 'white',
                backdropFilter: 'blur(4px)',
                border: `2px solid ${currentLanguage === 'ur' ? theme.colors.secondary : 'transparent'}`,
                fontFamily: theme.fonts.ur.primary,
              }}
            >
              اردو
            </button>
          </div>
        </div>

        {/* Post Header Section */}
        <div className="max-w-6xl mx-auto px-4 mt-12" dir={isUrdu ? 'rtl' : 'ltr'}>
          <h1
            className={`text-4xl md:text-5xl font-bold mb-6 ${isUrdu ? "text-right" : ""}`}
            style={{
              color: theme.colors.text.primary,
              fontFamily: currentFontFamily,
            }}
          >
            {post.title[currentLanguage]}
          </h1>
         
          <div className={`flex items-center gap-4 mb-12 ${isUrdu ? " justify-start" : ""}`}>
            <div className="flex items-center gap-2">
              <Link href={`/authors/${post.author.toLowerCase().replace(/\s+/g, "-")}`} className={`flex items-center gap-2 group ${isUrdu ? "" : ""}`}>
                <FaUser className="text-gray-400 group-hover:text-blue-600 transition-colors duration-300" />
                <span className="text-lg text-gray-600 group-hover:text-blue-600 hover:underline transition-all duration-300">{post.author}</span>
              </Link>
            </div>
            <span className="text-lg text-gray-600">{post.date}</span>
            <span
              className="inline-block px-4 py-2 rounded-full"
              style={{
                backgroundColor: theme.colors.secondary,
                color: theme.colors.primary,
              }}
            >
              {post.category}
            </span>
          </div>
        </div>

        {/* Content Section */}
        <div className="max-w-6xl mx-auto px-4" dir={isUrdu ? 'rtl' : 'ltr'}>
          <div className="prose prose-lg max-w-none">
            <p
              className={`text-xl text-gray-600 mb-8`}
              style={{
                fontFamily: currentFontFamily,
              }}
            >
              {post.excerpt[currentLanguage]}
            </p>
            <div className={`mt-8 ${isUrdu ? "text-right" : ""}`}>
              {post.content.map((section, index) => (
                <div key={index}>
                  <ContentBlock section={section} currentLanguage={currentLanguage} currentFontFamily={currentFontFamily} />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Add Social Share Component */}
        <div className="mt-8">
          <SocialShare title={post.socialShare.title[currentLanguage]} description={post.socialShare.description[currentLanguage]} url={typeof window !== "undefined" ? window.location.href : ""} image={post.image} language={currentLanguage} hashtags={post.socialShare.hashtags} twitterHandle={post.socialShare.twitterHandle} ogType={post.socialShare.ogType} />
        </div>

        {/* Navigation Section */}
        <div className="max-w-7xl mx-auto px-4 py-12">
          <div className="flex justify-between items-center border-t border-gray-200 pt-8">
            {navigation.prev ? (
              <Link
                href={`/blog/${navigation.prev.slug}`}
                className="group flex items-center gap-2 px-4 py-2 rounded-lg transition-colors duration-300"
                style={{
                  backgroundColor: theme.colors.background.secondary,
                  color: theme.colors.text.primary,
                }}
              >
                <FaArrowLeft className="group-hover:-translate-x-1 transition-transform duration-300" />
                <div>
                  <div className="text-sm opacity-75">Previous Blog</div>
                  <div className="font-medium">{navigation.prev.title[currentLanguage]}</div>
                </div>
              </Link>
            ) : (
              <div />
            )}

            {navigation.next ? (
              <Link
                href={`/blog/${navigation.next.slug}`}
                className="group flex items-center gap-2 px-4 py-2 rounded-lg text-right transition-colors duration-300"
                style={{
                  backgroundColor: theme.colors.background.secondary,
                  color: theme.colors.text.primary,
                }}
              >
                <div>
                  <div className="text-sm opacity-75">Next Blog</div>
                  <div className="font-medium">{navigation.next.title[currentLanguage]}</div>
                </div>
                <FaArrowRight className="group-hover:translate-x-1 transition-transform duration-300" />
              </Link>
            ) : (
              <div />
            )}
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
