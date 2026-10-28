
export const dynamic = "force-dynamic";
export const revalidate = 0;

import { Cormorant_Garamond, Inter } from 'next/font/google';
import './globals.css';
import Navigation from '@/components/layout/Navigation';

export const metadata = {
  metadataBase: new URL('https://www.seawithinyourself.com'),

  applicationName: 'Sea Within',

  title: 'Sea Within | Cinematic Calm & Personal Growth',

  description:
    'Explore Sea Within, a cinematic sanctuary for calm and personal growth. Discover mindful rituals, atmospheric videos, and quiet moments to unwind and reconnect with yourself.',

  alternates: {
    canonical: '/',
  },

  robots: {
    index: true,
    follow: true,
  },

  openGraph: {
    type: 'website',
    url: 'https://www.seawithinyourself.com/',
    siteName: 'Sea Within',
    title: 'Sea Within | Cinematic Calm & Personal Growth',
    description:
      'Explore Sea Within, a cinematic sanctuary for calm and personal growth. Discover mindful rituals, atmospheric videos, and quiet moments to unwind and reconnect with yourself.',
  },
};

const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['300'],
  style: ['normal', 'italic'],
  display: 'swap',
  variable: '--font-display',
});

const inter = Inter({
  subsets: ['latin'],
  weight: ['300'],
  display: 'swap',
  variable: '--font-body',
});

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`scroll-smooth ${cormorant.variable} ${inter.variable}`}
    >
      <head>
        <link rel="preload" as="image" href="/images/jellyfish-bg.jpg" />
        <link
          rel="preload"
          as="image"
          href="/images/bloom-hero-flowers.jpg"
        />

        {/* Help Google identify the Sea Within website */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebSite",
              "name": "Sea Within",
              "alternateName": "seawithinyourself.com",
              "url": "https://www.seawithinyourself.com/"
            }),
          }}
        />
      </head>

      <body className="bg-sanctuary-dark text-sea-100 antialiased">
        {children}
      </body>
    </html>
  );
}
