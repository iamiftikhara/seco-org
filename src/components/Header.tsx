import Link from 'next/link';
import { useState } from 'react';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="bg-white shadow-md">
      <nav className="container mx-auto px-4 py-3">
        <div className="flex justify-between items-center">
          <Link href="/" className="flex items-center">
            <img src="/logo.png" alt="Logo" className="h-12" />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex space-x-8">
            <Link href="/" className="text-gray-700 hover:text-blue-600">Home</Link>
            <Link href="/about" className="text-gray-700 hover:text-blue-600">About</Link>
            <Link href="/programs" className="text-gray-700 hover:text-blue-600">Programs</Link>
            <Link href="/news" className="text-gray-700 hover:text-blue-600">News</Link>
            <Link href="/contact" className="text-gray-700 hover:text-blue-600">Contact</Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden mt-4">
            <Link href="/" className="block py-2 text-gray-700 hover:text-blue-600">Home</Link>
            <Link href="/about" className="block py-2 text-gray-700 hover:text-blue-600">About</Link>
            <Link href="/programs" className="block py-2 text-gray-700 hover:text-blue-600">Programs</Link>
            <Link href="/news" className="block py-2 text-gray-700 hover:text-blue-600">News</Link>
            <Link href="/contact" className="block py-2 text-gray-700 hover:text-blue-600">Contact</Link>
          </div>
        )}
      </nav>
    </header>
  );
}