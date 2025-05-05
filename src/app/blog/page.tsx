'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { theme } from '@/config/theme';
import { blogData } from '@/data/blog';
import Navbar from '@/app/components/Navbar';
import Footer from '@/app/components/Footer';

export default function BlogPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  
  const categories = Array.from(
    new Set(blogData.posts.map(post => post.category))
  );

  const filteredPosts = selectedCategory
    ? blogData.posts.filter(post => post.category === selectedCategory)
    : blogData.posts;

  return (
    <>
      <Navbar />
      <main className="min-h-[calc(100vh-160px)] bg-gray-50">
        {/* Hero Section */}
        <div className="relative h-[calc(100vh-20rem)] overflow-hidden">
          <Image
            src={blogData.heroImage}
            alt="Blog Hero"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 to-black/30 flex items-center justify-center">
            <div className="text-center text-white">
              <h1 className="text-4xl md:text-5xl font-bold mb-4">{blogData.pageTitle.text}</h1>
              <p className="text-lg md:text-xl max-w-2xl mx-auto px-4">{blogData.pageDescription.text}</p>
            </div>
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPosts.map((post) => (
              <Link href={`/blog/${post.slug}`} key={post.id} className="group h-full">
                <div className="bg-white rounded-xl shadow-sm overflow-hidden transition-all duration-300 hover:shadow-md hover:-translate-y-1 h-full flex flex-col">
                  <div className="relative h-48">
                    <Image
                      src={post.image}
                      alt={post.title.text}
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
                      style={{ color: theme.colors.text.primary }}
                    >
                      {post.title.text}
                    </h3>
                    <p className="text-gray-600 line-clamp-2 flex-grow">{post.excerpt.text}</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}