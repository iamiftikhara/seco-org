import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'SECO - Supporting Communities',
  description: 'Supporting Communities Through Sustainable Development',
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
