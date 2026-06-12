import type { Metadata } from 'next';
import { Cormorant_Garamond, Inter } from 'next/font/google';
import './globals.css';
import Navigation from '@/components/layout/Navigation';
import { AudioProvider } from './providers/AudioProvider';
import MuteButton from '@/components/MuteButton';

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

      <head>
        <link rel="preload" as="image" href="/images/jellyfish-bg.jpg" />
        <link rel="preload" as="image" href="/images/bloom-hero-flowers.jpg" />
      </head>

      <body className="bg-sanctuary-dark text-sea-100 antialiased">

        {/* GLOBAL BACKGROUND AUDIO */}
        <audio id="seaAudio" muted autoPlay playsInline>
          <source src="/audio/narration/season-1/ambient-main.mp3" type="audio/mpeg" />
        </audio>

        {/* FORCE AUTOPLAY ON PAGE LOAD */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              document.addEventListener("DOMContentLoaded", function () {
                const audio = document.getElementById("seaAudio");
                if (audio) {
                  audio.muted = true;
                  audio.play().catch(() => {});
                }
              });
            `,
          }}
        />

        <AudioProvider>
          <Navigation />

          {/* GLOBAL MUTE BUTTON */}
          <MuteButton />

          {children}
        </AudioProvider>
      </body>
    </html>
  );
}
