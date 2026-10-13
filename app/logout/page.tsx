'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { supabase } from '@/lib/supabase/client';

export default function LogoutPage() {
  const [veil, setVeil] = useState(false);

  useEffect(() => {
    // Slow down the video playback
    const vid = document.querySelector("video");
    if (vid) vid.playbackRate = 0.6;

    // ⭐ Start veil first (calm transition)
    const veilTimer = setTimeout(() => {
      setVeil(true);
    }, 2200);

    // ⭐ Redirect softly (no sign-out yet)
    const redirectTimer = setTimeout(() => {
      window.scrollTo(0, 0);
      window.location.href = '/signed-out';
    }, 3600);

    return () => {
      clearTimeout(veilTimer);
      clearTimeout(redirectTimer);
    };
  }, []);

  return (
    <div className="fixed inset-0 w-full h-full overflow-hidden bg-black">
      {/* BACKGROUND VIDEO */}
      <video
        src="/videos/gold-portal.mp4"
        autoPlay
        muted
        playsInline
        className="absolute inset-0 w-full h-full object-cover"
      />

      {/* OVERLAY GRADIENT FOR DEPTH */}
      <div className="absolute inset-0 bg-black/40" />

      {/* CINEMATIC TEXT */}
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-6">
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9 }}
          className="text-white font-display text-2xl md:text-3xl tracking-wide mb-4"
        >
          Your space is protected.
        </motion.p>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, delay: 0.3 }}
          className="text-white/80 font-whisper text-lg md:text-xl"
        >
          Return when you are ready.
        </motion.p>

        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 1.2, delay: 0.5, ease: 'easeOut' }}
          className="mt-6 h-[2px] w-40 bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent origin-center"
        />
      </div>

      {/* ✨ MAGICAL VEIL FADE-OUT */}
      {veil && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.9, ease: 'easeOut' }}
          className="absolute inset-0 bg-black/80 backdrop-blur-xl"
        />
      )}
    </div>
  );
}
