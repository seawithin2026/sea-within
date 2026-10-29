
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
    'Sea Within is a cinematic sanctuary for self-discovery, personal growth, and inner peace. Return to yourself through mindful rituals in The Sanctuary, give yourself a moment to Bloom, find inspiration and reflection on The Wisdom Board, and connect and converse with like-minded souls in The Community.',

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
      'Sea Within is a cinematic sanctuary for self-discovery, personal growth, and inner peace. Return to yourself through mindful rituals in The Sanctuary, give yourself a moment to Bloom, find inspiration and reflection on The Wisdom Board, and connect and converse with like-minded souls in The Community.',
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
          {/* Pinterest website verification */}
  <meta
    name="p:domain_verify"
    content="713bf34004dc8b5e3c27e4c7359d624f"
  />
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
