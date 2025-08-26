'use client';

import { useCallback, useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { theme } from '@/config/theme';
import { blogData } from '@/data/blog';
import type { BlogPost } from '@/types/blog';

export default function Blog() {
  const [currentLanguage, setCurrentLanguage] = useState<'en' | 'ur'>('en');
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const currentFontFamily = currentLanguage === 'ur' ? theme.fonts.ur.primary : theme.fonts.en.primary;
  const currentDirection = currentLanguage === 'ur' ? 'rtl' : 'ltr';
  const isRTL = currentLanguage === 'ur';

  const loadBlogs = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const res = await fetch('/api/blogs?showOnHome=true&limit=4');
      const json = await res.json();
      if (!json.success) {
        throw new Error(json.error || 'Failed to fetch blogs');
      }
      setPosts(json.data.blogsList as BlogPost[]);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load blogs');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadBlogs();
  }, [loadBlogs]);

  const handleLanguageChange = () => {
    setCurrentLanguage(currentLanguage === 'en' ? 'ur' : 'en');
  };

  if (isLoading) {
    return (
      <section className="py-16 bg-gray-50">
        <div className="container max-w-7xl mx-auto px-4">
          <div className="animate-pulse mb-12 text-center">
            <div className="h-8 bg-gray-200 rounded w-48 mx-auto mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-32 mx-auto"></div>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="h-64 bg-gray-200 rounded-lg"></div>
            <div className="space-y-6">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="h-28 bg-gray-200 rounded-lg"></div>
              ))}
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="py-16 bg-gray-50">
        <div className="container max-w-7xl mx-auto px-4 text-center">
          <p className="text-red-600 mb-4">Error loading blogs: {error}</p>
          <button
            onClick={loadBlogs}
            className="px-4 py-2 rounded-lg"
            style={{ backgroundColor: theme.colors.primary, color: 'white', fontFamily: currentFontFamily }}
          >
            Try Again
          </button>
        </div>
      </section>
    );
  }

  if (!posts.length) {
    return null;
  }

  const featuredPost = posts[0];
  const otherPosts = posts.slice(1, 4);

  return (
    <section className="py-16 bg-gray-50" dir={currentDirection}>
      <div className="container max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center mb-12">
          <div className={isRTL ? 'text-right' : 'text-center'}>
            <h2 className="text-3xl font-bold" style={{ 
              color: theme.colors.text.primary,
              fontFamily: currentFontFamily
            }}>
              {blogData.blogPage.title[currentLanguage]}
            </h2>
            <div className={`w-20 h-1 mt-4 ${isRTL ? 'mr-0 ml-auto' : 'mx-auto'}`}
              style={{ backgroundColor: theme.colors.primary }}>
            </div>
          </div>
          <div className="flex gap-4 items-center">
            <button
              onClick={handleLanguageChange}
              className={`px-4 py-1 border rounded-lg transition-colors duration-300 cursor-pointer`}
              style={{
                backgroundColor: 'transparent',
                color: theme.colors.primary,
                borderColor: theme.colors.primary,
                fontFamily: currentLanguage === 'en' ? theme.fonts.ur.primary : theme.fonts.en.primary,
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = theme.colors.primary;
                e.currentTarget.style.color = 'white';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent';
                e.currentTarget.style.color = theme.colors.primary;
              }}
            >
              {currentLanguage === 'en' ? 'اردو' : 'English'}
            </button>
            <Link
              href="/blog"
              className="inline-flex items-center px-6 py-2 rounded-lg transition-colors duration-300 cursor-pointer"
              style={{ 
                backgroundColor: theme.colors.primary,
                color: 'white',
                fontFamily: currentFontFamily
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = theme.colors.primaryHover;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = theme.colors.primary;
              }}
            >
              {currentLanguage === 'en' ? 'View All Blogs' : 'تمام بلاگز دیکھیں'}
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Featured Post */}
          <div className={`bg-white rounded-lg shadow-md overflow-hidden transform transition-all duration-300 hover:shadow-xl hover:-translate-y-2 ${
            isRTL ? 'rtl' : 'ltr'
          }`}>
            <div className="relative h-64 overflow-hidden">
              <Image
                src={featuredPost.image}
                alt={featuredPost.title[currentLanguage]}
                fill
                className="object-cover transition-transform duration-300 hover:scale-110"
                priority
              />
            </div>
            <div className="p-8">
              <h3 style={{ 
                color: theme.colors.text.primary,
                fontFamily: currentFontFamily
              }} className="text-2xl font-semibold mb-4 transition-colors duration-300 hover:text-blue-600">
                {featuredPost.title[currentLanguage]}
              </h3>
              <p style={{
                fontFamily: currentFontFamily
              }} className="text-gray-600 mb-6">
                {featuredPost.excerpt[currentLanguage]}
              </p>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-500" style={{ fontFamily: theme.fonts.en.primary }}>
                  {featuredPost.date}
                </span>
                <Link
                  href={`/blog/${featuredPost.slug}`}
                  className="text-blue-600 hover:text-blue-800 transition-colors duration-300"
                  style={{
                    fontFamily: currentFontFamily
                  }}
                >
                  {currentLanguage === 'en' ? 'Read More' : 'مزید پڑھیں'}
                </Link>
              </div>
            </div>
          </div>

          {/* Other Posts */}
          <div className="space-y-6">
            {otherPosts.map((post) => (
              <div key={post.id} 
                className={`bg-white rounded-lg shadow-md overflow-hidden flex transform transition-all duration-300 hover:shadow-xl hover:-translate-y-1 hover:scale-[1.02] ${
                isRTL ? 'rtl' : 'ltr'
              }`}>
                <div className="relative w-1/3 overflow-hidden">
                  <Image
                    src={post.image}
                    alt={post.title[currentLanguage]}
                    fill
                    className="object-cover transition-transform duration-300 hover:scale-110"
                  />
                </div>
                <div className="w-2/3 p-4">
                  <h3 style={{ 
                    color: theme.colors.text.primary,
                    fontFamily: currentFontFamily
                  }} className="text-lg font-semibold mb-2 transition-colors duration-300 hover:text-blue-600">
                    {post.title[currentLanguage]}
                  </h3>
                  <p style={{
                    fontFamily: currentFontFamily
                  }} className="text-gray-600 text-sm mb-3 line-clamp-2">
                    {post.excerpt[currentLanguage]}
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-500" style={{ fontFamily: theme.fonts.en.primary }}>
                      {post.date}
                    </span>
                    <Link
                      href={`/blog/${post.slug}`}
                      className="text-sm text-blue-600 hover:text-blue-800 transition-colors duration-300"
                      style={{
                        fontFamily: currentFontFamily
                      }}
                    >
                      {currentLanguage === 'en' ? 'Read More' : 'مزید پڑھیں'}
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}