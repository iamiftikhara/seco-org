import type { Metadata } from 'next'
import './globals.css'

// console.log('Generating root layout metadata');

export const metadata: Metadata = {
  title: 'SECO - Supporting Communities',
  description: 'Supporting Communities Through Sustainable Development',
  icons: {
    icon: '/favicon.ico', // Points 
  },
  openGraph: {
    type: 'website',
    siteName: 'SECO',
    title: 'SECO - Supporting Communities',
    description: 'Supporting Communities Through Sustainable Development',
    images: [
      {
        url: '/images/log.png', // Make sure this image exists in your public folder
        width: 1200,
        height: 630,
        alt: 'SECO'
      }
    ]
  },
  twitter: {
    card: 'summary_large_image',
    title: 'SECO - Supporting Communities',
    description: 'Supporting Communities Through Sustainable Development',
    creator: '@SECO',
    images: ['/images/log.png'] // Make sure this image exists
  }
}

import { LoadingProvider } from './providers/LoadingProvider';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // console.log('Rendering RootLayout');
  return (
    <html lang="en">
      <body>
        <LoadingProvider>
          {children}
        </LoadingProvider>
      </body>
    </html>
  );
}
