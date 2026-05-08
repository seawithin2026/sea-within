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
  overlayOpacity = 0.3,
  children,
  className = '',
  id,
}: CinematicSectionProps) {
  return (
    <section id={id} className={`relative w-screen h-screen overflow-hidden ${className}`}>
      <video
        src={videoSrc}
        autoPlay
        muted
        loop
        playsInline
        poster={posterSrc}
        className="absolute top-1/2 left-1/2 min-w-full min-h-full -translate-x-1/2 -translate-y-1/2 object-cover"
      />

      <div
        className="absolute inset-0 z-10"
        style={{
          background: `linear-gradient(to bottom, rgba(10,22,40,${overlayOpacity}) 0%, rgba(10,22,40,0.1) 40%, rgba(10,22,40,0.1) 60%, rgba(10,22,40,${overlayOpacity + 0.2}) 100%)`,
        }}
      />

      <div className="relative z-20 h-full flex items-center justify-center">
        {children}
      </div>
    </section>
  );
}
