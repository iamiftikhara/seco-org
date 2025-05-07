import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'SECO - Supporting Communities',
  description: 'Supporting Communities Through Sustainable Development',
  openGraph: {
    type: 'website',
    siteName: 'SECO',
    title: 'SECO - Supporting Communities',
    description: 'Supporting Communities Through Sustainable Development',
    images: [
      {
        url: '/images/og-default.jpg', // Make sure this image exists in your public folder
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
    images: ['/images/og-default.jpg'] // Make sure this image exists
  }
}

import { LoadingProvider } from './providers/LoadingProvider';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
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
