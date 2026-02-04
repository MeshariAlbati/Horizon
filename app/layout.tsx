import React from "react"
import type { Metadata, Viewport } from 'next'
import { Space_Grotesk, JetBrains_Mono } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import './globals.css'

const spaceGrotesk = Space_Grotesk({ 
  subsets: ["latin"],
  variable: '--font-sans'
});

const jetbrainsMono = JetBrains_Mono({ 
  subsets: ["latin"],
  variable: '--font-mono'
});

export const metadata: Metadata = {
  title: 'HORIZON | Smart Cities Exhibition',
  description: 'Where Smart Cities Meet the Future. An immersive digital experience exploring AI, IoT, sustainability, and the cities of tomorrow.',
  generator: 'v0.app',
  keywords: ['smart cities', 'AI', 'IoT', 'future', 'exhibition', 'technology', 'sustainability'],
  authors: [{ name: 'Horizon Exhibition' }],
  icons: {
    icon: [
      {
        url: '/icon-light-32x32.png',
        media: '(prefers-color-scheme: light)',
      },
      {
        url: '/icon-dark-32x32.png',
        media: '(prefers-color-scheme: dark)',
      },
      {
        url: '/icon.svg',
        type: 'image/svg+xml',
      },
    ],
    apple: '/apple-icon.png',
  },
}

export const viewport: Viewport = {
  themeColor: '#0a1628',
  width: 'device-width',
  initialScale: 1,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="scrollbar-hide">
      <body className={`${spaceGrotesk.variable} ${jetbrainsMono.variable} font-sans antialiased gradient-bg min-h-screen`}>
        {children}
        <Analytics />
      </body>
    </html>
  )
}
