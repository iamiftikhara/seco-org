'use client';

import Image from 'next/image';
import Link from 'next/link';
import { theme } from '@/config/theme';
import { blogData } from '@/data/blog';

export default function Blog() {
  const featuredPost = blogData.posts[0];
  const otherPosts = blogData.posts.slice(1, 4);

  return (
    <section className="py-16 bg-gray-50">
      <div className="container max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center mb-12">
          <div>
            <h2 className="text-3xl font-bold" style={{ 
              color: theme.colors.text.primary,
              fontFamily: blogData.title.language === 'ur' ? theme.fonts.ur.primary : theme.fonts.en.primary
            }}>
              {blogData.title.text}
            </h2>
            <div className="w-20 h-1 mt-4"
              style={{ backgroundColor: theme.colors.primary }}>
            </div>
          </div>
          
          <Link
            href="/blog"
            className="inline-flex items-center px-6 py-2 rounded-lg transition-colors duration-300 cursor-pointer"
            style={{ 
              backgroundColor: theme.colors.primary,
              color: 'white',
              fontFamily: theme.fonts.en.primary
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = theme.colors.primaryHover;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = theme.colors.primary;
            }}
          >
            View All Blogs
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Featured Post */}
          <div className={`bg-white rounded-lg shadow-md overflow-hidden transform transition-all duration-300 hover:shadow-xl hover:-translate-y-2 ${
            featuredPost.title.language === 'ur' ? 'rtl' : 'ltr'
          }`}>
            <div className="relative h-64 overflow-hidden">
              <Image
                src={featuredPost.image}
                alt={featuredPost.title.text}
                fill
                className="object-cover transition-transform duration-300 hover:scale-110"
                priority
              />
            </div>
            <div className="p-8">
              <h3 style={{ 
                color: theme.colors.text.primary,
                fontFamily: featuredPost.title.language === 'ur' ? theme.fonts.ur.primary : theme.fonts.en.primary
              }} className="text-2xl font-semibold mb-4 transition-colors duration-300 hover:text-blue-600">
                {featuredPost.title.text}
              </h3>
              <p style={{
                fontFamily: featuredPost.excerpt.language === 'ur' ? theme.fonts.ur.primary : theme.fonts.en.primary
              }} className="text-gray-600 mb-6">
                {featuredPost.excerpt.text}
              </p>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-500" style={{ fontFamily: theme.fonts.en.primary }}>
                  {featuredPost.date}
                </span>
                <Link
                  href={`/blog/${featuredPost.slug}`}
                  className="text-blue-600 hover:text-blue-800 transition-colors duration-300"
                  style={{
                    fontFamily: featuredPost.title.language === 'ur' ? theme.fonts.ur.primary : theme.fonts.en.primary
                  }}
                >
                  {featuredPost.title.language === 'ur' ? 'مزید پڑھیں' : 'Read More'}
                </Link>
              </div>
            </div>
          </div>

          {/* Other Posts */}
          <div className="space-y-6">
            {otherPosts.map((post) => (
              <div key={post.id} 
                className={`bg-white rounded-lg shadow-md overflow-hidden flex transform transition-all duration-300 hover:shadow-xl hover:-translate-y-1 hover:scale-[1.02] ${
                post.title.language === 'ur' ? 'rtl' : 'ltr'
              }`}>
                <div className="relative w-1/3 overflow-hidden">
                  <Image
                    src={post.image}
                    alt={post.title.text}
                    fill
                    className="object-cover transition-transform duration-300 hover:scale-110"
                  />
                </div>
                <div className="w-2/3 p-4">
                  <h3 style={{ 
                    color: theme.colors.text.primary,
                    fontFamily: post.title.language === 'ur' ? theme.fonts.ur.primary : theme.fonts.en.primary
                  }} className="text-lg font-semibold mb-2 transition-colors duration-300 hover:text-blue-600">
                    {post.title.text}
                  </h3>
                  <p style={{
                    fontFamily: post.excerpt.language === 'ur' ? theme.fonts.ur.primary : theme.fonts.en.primary
                  }} className="text-gray-600 text-sm mb-3 line-clamp-2">
                    {post.excerpt.text}
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-500" style={{ fontFamily: theme.fonts.en.primary }}>
                      {post.date}
                    </span>
                    <Link
                      href={`/blog/${post.slug}`}
                      className="text-sm text-blue-600 hover:text-blue-800 transition-colors duration-300"
                      style={{
                        fontFamily: post.title.language === 'ur' ? theme.fonts.ur.primary : theme.fonts.en.primary
                      }}
                    >
                      {post.title.language === 'ur' ? 'مزید پڑھیں' : 'Read More'}
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