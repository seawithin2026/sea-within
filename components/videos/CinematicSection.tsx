'use client';

import { ReactNode } from 'react';

interface CinematicSectionProps {
  videoSrc: string;
  posterSrc?: string;
  overlayOpacity?: number;
  children?: ReactNode;
  className?: string;
  id?: string;
}

export default function CinematicSection({
  videoSrc,
  posterSrc,
  overlayOpacity = 0.18,
  children,
  className = '',
  id,
}: CinematicSectionProps) {
  return (
    <section
      id={id}
      className={`relative w-screen min-h-screen overflow-visible ${className}`}
    >
      {/* VIDEO */}
      <video
        src={videoSrc}
        autoPlay
        muted
        loop
        playsInline
        poster={posterSrc}
        className="absolute inset-0 w-full h-full object-cover"
      />

      {/* OVERLAY */}
      <div
        className="absolute inset-0 z-10 pointer-events-none"
        style={{
          background: `linear-gradient(
            to bottom,
            rgba(10,22,40,${overlayOpacity}) 0%,
            rgba(10,22,40,0.15) 40%,
            rgba(10,22,40,0.15) 60%,
            rgba(10,22,40,${overlayOpacity}) 100%
          )`,
        }}
      />

      {/* CONTENT */}
      <div className="relative z-20 w-full py-24 px-6 flex flex-col items-center">
        {children}
      </div>
    </section>
  );
}
