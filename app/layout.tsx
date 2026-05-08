import type { Metadata } from 'next';
import { Cormorant_Garamond, Inter } from 'next/font/google';
import './globals.css';
import Navigation from '@/components/layout/Navigation'
import { AudioProvider } from './providers/AudioProvider';

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

export const metadata: Metadata = {
  title: 'Sea Within — Come Home to Yourself',
  description:
    'A movement for the ones who are ready to feel again. To breathe deeper. To live truer. To come home to the part of themselves they left behind.',
  keywords: ['wellness', 'sanctuary', 'mindfulness', 'community', 'awakening', 'sea within'],
  openGraph: {
    title: 'Sea Within — Come Home to Yourself',
    description: 'A movement for the ones who are ready to feel again.',
    url: 'https://seawithinyourself.com',
    siteName: 'Sea Within',
    type: 'website',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`scroll-smooth ${cormorant.variable} ${inter.variable}`}>
      <body className="bg-sanctuary-dark text-sea-100 antialiased">
        <AudioProvider>
          <Navigation />
          {children}
        </AudioProvider>
      </body>
    </html>
  );
}

