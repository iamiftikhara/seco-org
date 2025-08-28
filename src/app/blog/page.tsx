'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { theme } from '@/config/theme';
import Navbar from '@/app/components/Navbar';
import Footer from '@/app/components/Footer';
import LoadingSpinner from '@/app/components/LoadingSpinner';
import DynamicError from '@/app/components/DynamicError';

export default function BlogPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [currentLanguage, setCurrentLanguage] = useState<'en' | 'ur'>('en');
  const [isMobile, setIsMobile] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [blogPage, setBlogPage] = useState<{ heroImage: string; pageTitle: { en: string; ur: string }; pageDescription: { en: string; ur: string } } | null>(null);
  const [posts, setPosts] = useState<any[]>([]);
  
  const categories = Array.from(
    new Set(posts.map(post => post.category))
  );

  const filteredPosts = selectedCategory
    ? posts.filter(post => post.category === selectedCategory)
    : posts;

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const res = await fetch('/api/blogs');
        if (res.status === 204) {
          setBlogPage(null);
          setPosts([]);
          setError('No blog posts found');
          return;
        }
        const json = await res.json();
        if (!json.success) {
          if (json.isEmpty) {
            setBlogPage(json.data?.blogPage || null);
            setPosts([]);
            setError('No blog posts found');
            return;
          }
          throw new Error(json.error || 'Failed to fetch blogs');
        }
        setBlogPage(json.data.blogPage || null);
        setPosts(Array.isArray(json.data.blogsList) ? json.data.blogsList : []);
      } catch (e) {
        setError(e instanceof Error ? e.message : 'Failed to load blogs');
      } finally {
        setIsLoading(false);
      }
    };
    fetchBlogs();
  }, []);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const currentFontFamily = currentLanguage === 'ur' ? theme.fonts.ur.primary : theme.fonts.en.primary;
  const isRTL = currentLanguage === 'ur';

  return (
    <>
      <Navbar />
      {isLoading ? (
        <div className="min-h-[calc(100vh-160px)] flex items-center justify-center"><LoadingSpinner /></div>
      ) : error ? (
        <div className="min-h-[calc(100vh-160px)] flex items-center justify-center">
          <DynamicError
            title={
              posts.length === 0
                ? (currentLanguage === 'ur' ? 'بلاگز جلد آ رہے ہیں' : 'Blogs Coming Soon')
                : (currentLanguage === 'ur' ? 'بلاگز لوڈ نہیں ہو سکے' : 'Unable to Load Blogs')
            }
            message={error}
            onRetry={() => window.location.reload()}
            showBackButton={false}
            language={currentLanguage}
            sectionName={currentLanguage === 'ur' ? 'بلاگز' : 'Blogs'}
          />
        </div>
      ) : (
      <main className="min-h-[calc(100vh-160px)] bg-gray-50">
        {/* Hero Section */}
        <div className="relative h-[calc(100vh-20rem)] overflow-hidden">
          <Image
            src={blogPage?.heroImage || '/images/blog-hero.jpg'}
            alt="Blog Hero"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 to-black/30 flex items-center justify-center">
            <div className="text-center text-white">
              <h1 className="text-4xl md:text-5xl font-bold mb-4" style={{ fontFamily: currentFontFamily }}>
                {blogPage ? blogPage.pageTitle[currentLanguage] : 'Blogs'}
              </h1>
              <p className="text-lg md:text-xl max-w-2xl mx-auto px-4" style={{ fontFamily: currentFontFamily }}>
                {blogPage ? blogPage.pageDescription[currentLanguage] : ''}
              </p>
            </div>
          </div>
          {/* Language Switcher */}
          <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex gap-4 z-10">
            <button
              onClick={() => setCurrentLanguage('en')}
              className={`${isMobile ? 'px-3 py-1' : 'px-4 py-2'}  rounded-full transition-all duration-300`}
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
              className={`${isMobile ? 'px-3 py-1' : 'px-4 py-2'}  rounded-full transition-all duration-300`}
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

        {/* Categories */}
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="flex flex-wrap gap-3 justify-center mb-8">
            <button
              onClick={() => setSelectedCategory('')}
              className={`px-4 py-2 rounded-full transition-all duration-300 ${
                selectedCategory === '' 
                ? 'bg-primary text-white' 
                : 'bg-gray-100 hover:bg-gray-200'
              }`}
              style={{ 
                backgroundColor: selectedCategory === '' ? theme.colors.primary : undefined,
                color: selectedCategory === '' ? 'white' : theme.colors.text.primary 
              }}
            >
              All
            </button>
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-full transition-all duration-300`}
                style={{ 
                  backgroundColor: selectedCategory === category ? theme.colors.primary : '#f3f4f6',
                  color: selectedCategory === category ? 'white' : theme.colors.text.primary
                }}
              >
                {category}
              </button>
            ))}
          </div>

          {/* Blog Posts Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" dir={isRTL ? 'rtl' : 'ltr'}>
            {filteredPosts.map((post) => (
              <Link href={`/blog/${post.slug}`} key={post.id} className="group h-full">
                <div className="bg-white rounded-xl shadow-sm overflow-hidden transition-all duration-300 hover:shadow-md hover:-translate-y-1 h-full flex flex-col">
                  <div className="relative h-48">
                    <Image
                      src={post.image}
                      alt={post.title[currentLanguage]}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" 
                    style={{height: "102%"}} />
                  </div>
                  <div className="p-5 flex flex-col flex-grow">
                    <div className="flex items-center gap-3 mb-3">
                      <span 
                        className="text-xs px-3 py-1 rounded-full"
                        style={{ backgroundColor: theme.colors.secondary, color: theme.colors.primary }}
                      >
                        {post.category}
                      </span>
                      <span className="text-sm text-gray-500">{post.date}</span>
                    </div>
                    <h3 
                      className="text-xl font-semibold mb-2 group-hover:text-primary transition-colors duration-300"
                      style={{ color: theme.colors.text.primary, fontFamily: currentFontFamily }}
                    >
                      {post.title[currentLanguage]}
                    </h3>
                    <p className="text-gray-600 line-clamp-2 flex-grow" style={{ fontFamily: currentFontFamily }}>
                      {post.excerpt[currentLanguage]}
                    </p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </main>
      )}
      <Footer />
    </>
  );
}