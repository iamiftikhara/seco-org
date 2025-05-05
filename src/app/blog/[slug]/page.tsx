"use client";

import {useEffect, useState} from "react";
import Image from "next/image";
import Link from "next/link";
import {notFound} from "next/navigation";
import {theme} from "@/config/theme";
import {blogData} from "@/data/blog";
import Navbar from "@/app/components/Navbar";
import Footer from "@/app/components/Footer";
import LoadingSpinner from "@/app/components/LoadingSpinner";
import {FaArrowLeft, FaArrowRight, FaUser} from "react-icons/fa";
import SocialShare from "@/app/components/SocialShare";
import type { BlogPost } from '@/types/blog';  // Changed to type-only import

const ContentBlock = ({
  section,
}: {
  section: {
    type: string;
    image?: {
      position: "above" | "below" | "left" | "right" | "full";
      src: string;
      alt: string;
    };
    text?: {
      content: {
        language: string;
        text: string;
      };
    };
    content?: {
      language: string;
      text: string;
    };
  };
}) => {
  switch (section.type) {
    case "content-block":
      return (
        <div className="mb-8">
          {section.image?.position === "above" && section.image && (
            <div className="relative w-full h-[500px] mb-8">
              <Image src={section.image.src} alt={section.image.alt} fill className="object-cover rounded-lg" sizes="100vw" />
            </div>
          )}

          <div className={`flex ${section.image?.position === "full" || section.image?.position === "above" || section.image?.position === "below" ? "flex-col" : "items-start gap-8"}`}>
            {section.image?.position === "left" && section.image && (
              <div className="relative w-1/2 h-[400px] flex-shrink-0">
                <Image src={section.image.src} alt={section.image.alt} fill className="object-cover rounded-lg" sizes="50vw" />
              </div>
            )}

            <div className={section.image?.position === "full" || !section.image ? "w-full" : section.image.position === "above" || section.image.position === "below" ? "w-full" : "w-1/2"}>
              <p
                className="text-lg text-gray-600"
                style={{
                  fontFamily: section.text?.content?.language === "ur" ? theme.fonts.ur.primary : theme.fonts.en.primary,
                }}
              >
                {section.text?.content.text}
              </p>
            </div>

            {section.image?.position === "right" && section.image && (
              <div className="relative w-1/2 h-[400px] flex-shrink-0">
                <Image src={section.image.src} alt={section.image.alt} fill className="object-cover rounded-lg" sizes="50vw" />
              </div>
            )}
          </div>

          {section.image?.position === "below" && section.image && (
            <div className="relative w-full h-[500px] mt-8">
              <Image src={section.image.src} alt={section.image.alt} fill className="object-cover rounded-lg" sizes="100vw" />
            </div>
          )}

          {section.image?.position === "full" && section.image && (
            <div className="relative w-full h-[600px] mt-8">
              <Image src={section.image.src} alt={section.image.alt} fill className="object-cover rounded-lg" sizes="100vw" />
            </div>
          )}
        </div>
      );
    case "quote":
      return (
        <blockquote
          className={`text-xl italic pl-6 my-8 ${section.content?.language === "ur" ? "text-right border-r-4 pr-6 border-l-0" : "border-l-4 pl-6"}`}
          style={{
            borderColor: theme.colors.primary,
            color: theme.colors.text.secondary,
            fontFamily: section.content?.language === "ur" ? theme.fonts.ur.primary : theme.fonts.en.primary,
          }}
        >
          {section.content?.text}
        </blockquote>
      );
    default:
      return null;
  }
};

export default function BlogPost({params}: {params: {slug: string}}) {
  const [post, setPost] = useState<BlogPost | null>(null);
  const [isLoading, setIsLoading] = useState(true);
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
        const currentIndex = blogData.posts.findIndex((p) => p.slug === resolvedParams.slug);

        if (currentIndex === -1) {
          setPost(null);
          setNavigation({prev: null, next: null});
          return;
        }

        const foundPost = blogData.posts[currentIndex];
        setPost(foundPost as BlogPost);

        setNavigation({
          prev: currentIndex > 0 ? (blogData.posts[currentIndex - 1] as BlogPost) : null,
          next: currentIndex < blogData.posts.length - 1 ? (blogData.posts[currentIndex + 1] as BlogPost) : null,
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

  const isUrdu = post?.title.language === "ur";

  return (
    <>
      <Navbar />
      <div className="min-h-screen" style={{backgroundColor: theme.colors.background.primary}}>
        <div className="relative h-[calc(100vh-20rem)] overflow-hidden">
          <Image src={post.image} alt={post.title.text} fill className="object-cover" priority />
          <div className="absolute inset-0 bg-black/30"></div>
        </div>

        {/* Post Header Section */}
        <div className="max-w-6xl mx-auto px-4 mt-12">
          <h1
            className={`text-4xl md:text-5xl font-bold mb-6 ${isUrdu ? "text-right" : ""}`}
            style={{
              color: theme.colors.text.primary,
              fontFamily: isUrdu ? theme.fonts.ur.primary : theme.fonts.en.primary,
            }}
          >
            {post.title.text}
          </h1>
          <div className={`flex items-center gap-4 mb-12 ${isUrdu ? "flex-row-reverse justify-start" : ""}`}>
            <div className="flex items-center gap-2">
              <Link href={`/authors/${post.author.toLowerCase().replace(/\s+/g, "-")}`} className={`flex items-center gap-2 group ${isUrdu ? "flex-row-reverse" : ""}`}>
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
        <div className="max-w-6xl mx-auto px-4">
          <div className="prose prose-lg max-w-none">
            <p
              className={`text-xl text-gray-600 mb-8 ${post.excerpt.language === "ur" ? "text-right" : ""}`}
              style={{
                fontFamily: post.excerpt.language === "ur" ? theme.fonts.ur.primary : theme.fonts.en.primary,
              }}
            >
              {post.excerpt.text}
            </p>
            <div className={`mt-8 ${isUrdu ? "text-right" : ""}`}>
              {post.content.map((section, index) => (
                <div key={index} className={section.type === "content-block" ? (section.text?.content.language === "ur" ? "text-right" : "") : section.content?.language === "ur" ? "text-right" : ""}>
                  <ContentBlock section={section} />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Add Social Share Component */}
        <div className="mt-8">
          <SocialShare title={post.socialShare.title.text} description={post.socialShare.description.text} url={typeof window !== "undefined" ? window.location.href : ""} image={post.image} language={post.title.language} hashtags={post.socialShare.hashtags} twitterHandle={post.socialShare.twitterHandle} ogType={post.socialShare.ogType} />
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
                  <div className="font-medium">{navigation.prev.title.text}</div>
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
                  <div className="font-medium">{navigation.next.title.text}</div>
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
