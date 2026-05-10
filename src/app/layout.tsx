import type { Metadata, Viewport } from 'next';
import { GeistSans } from 'geist/font/sans';
import { GeistMono } from 'geist/font/mono';
import './globals.css';
import { Providers } from '@/providers';

export const metadata: Metadata = {
  title: 'Meetiqo \u2013 Smart Meetups. Real Connections.',
  description:
    'Discover, organize, and join AI-powered meetups. From tech conferences to creative workshops, find your community on Meetiqo.',
  keywords: ['meetups', 'events', 'community', 'networking', 'AI'],
  authors: [{ name: 'Meetiqo' }],
  openGraph: {
    title: 'Meetiqo \u2013 Smart Meetups. Real Connections.',
    description:
      'Discover, organize, and join AI-powered meetups. Find your community.',
    type: 'website',
    locale: 'en_US',
    images: [
      {
        url: '/og.png',
        width: 1200,
        height: 630,
        alt: 'Meetiqo',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Meetiqo \u2013 Smart Meetups. Real Connections.',
    description:
      'Discover, organize, and join AI-powered meetups. Find your community.',
    images: ['/og.png'],
  },
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'),
};

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: 'white' },
    { media: '(prefers-color-scheme: dark)', color: 'black' },
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning className={GeistSans.variable}>
      <body className={`${GeistSans.className} ${GeistMono.variable} antialiased`}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
