
export const dynamic = "force-dynamic";
export const revalidate = 0;

import { Cormorant_Garamond, Inter } from 'next/font/google';
import './globals.css';
import Navigation from '@/components/layout/Navigation';

export const metadata = {
  metadataBase: new URL('https://www.seawithinyourself.com'),
  title: 'Sea Within | Cinematic Calm & Personal Growth',
  description:
    'Step into Sea Within, a cinematic space for mindful rituals, self-reflection, and personal growth. Slow down, unwind, and reconnect with yourself.',
  alternates: {
    canonical: '/',
  },
  robots: {
    index: true,
    follow: true,
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
    <html lang="en" className={`scroll-smooth ${cormorant.variable} ${inter.variable}`}>
      <head>
        <link rel="preload" as="image" href="/images/jellyfish-bg.jpg" />
        <link rel="preload" as="image" href="/images/bloom-hero-flowers.jpg" />
      </head>

      <body className="bg-sanctuary-dark text-sea-100 antialiased">
        {children}
      </body>
    </html>
  );
}
