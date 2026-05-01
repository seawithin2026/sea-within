'use client';

import { useRef, useEffect, useState } from 'react';
import { motion, useInView } from 'framer-motion';

interface VideoSectionProps {
  videoSrc: string;
  posterSrc?: string;
  overlayOpacity?: number;
  children?: React.ReactNode;
  className?: string;
  id?: string;
}

export default function VideoSection({
  videoSrc,
  posterSrc,
  overlayOpacity = 0.4,
  children,
  className = '',
  id,
}: VideoSectionProps) {
  const ref = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const isInView = useInView(ref, { amount: 0.3 });
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    if (videoRef.current) {
      if (isInView) {
        videoRef.current.play().catch(() => {});
      } else {
        videoRef.current.pause();
      }
    }
  }, [isInView]);

  return (
    <div ref={ref} id={id} className={`video-section ${className}`}>
      <video
        ref={videoRef}
        src={videoSrc}
        poster={posterSrc}
        muted
        loop
        playsInline
        preload="metadata"
        onLoadedData={() => setIsLoaded(true)}
        className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ${
          isLoaded ? 'opacity-100' : 'opacity-0'
        }`}
      />

      {/* Ocean-depth overlay */}
      <div
        className="absolute inset-0"
        style={{
          background: `linear-gradient(180deg, 
            rgba(10, 22, 40, ${overlayOpacity}) 0%, 
            rgba(15, 35, 64, ${overlayOpacity * 0.3}) 40%, 
            rgba(10, 22, 40, ${overlayOpacity * 0.6}) 70%,
            rgba(10, 22, 40, ${overlayOpacity * 0.9}) 100%)`,
        }}
      />

      {/* Content */}
      {children && (
        <div className="absolute inset-0 flex items-center justify-center z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
            transition={{ duration: 1.5, ease: 'easeOut' }}
            className="text-center px-6 max-w-4xl"
          >
            {children}
          </motion.div>
        </div>
      )}
    </div>
  );
}
