'use client';

import Link from 'next/link';
import { theme } from '@/config/theme';
import Navbar from '@/app/components/Navbar';
import Footer from '@/app/components/Footer';

export default function NotFound() {
  return (
    <>
      <Navbar />
      <div className="min-h-[calc(100vh-160px)] flex items-center justify-center bg-white">
        <div className="text-center px-4">
          {/* Animated 404 Icon */}
          <div className="mb-8 relative">
            <div className="text-9xl font-bold animate-bounce"
              style={{ color: theme.colors.primary }}>
              404
            </div>
            <div className="absolute -top-4 right-0 text-6xl animate-spin-slow"
              style={{ color: theme.colors.secondary }}>
              ⚠
            </div>
          </div>

          {/* Error Message */}
          <h1 className="text-4xl font-bold mb-4"
            style={{ color: theme.colors.text.primary }}>
            Page Not Found
          </h1>
          <p className="text-xl mb-8 max-w-md mx-auto"
            style={{ color: theme.colors.text.secondary }}>
            Oops! The page you're looking for seems to have wandered off.
          </p>

          {/* Return Home Button */}
          <Link 
            href="/"
            className="inline-flex items-center px-6 py-3 rounded-lg transition-colors duration-300"
            style={{ 
              backgroundColor: theme.colors.primary,
              color: theme.colors.text.light
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = theme.colors.primaryHover;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = theme.colors.primary;
            }}
          >
            Return Home
          </Link>
        </div>
      </div>
      <Footer />
    </>
  );
}