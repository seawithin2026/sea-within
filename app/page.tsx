'use client';
// rebuild

import Navigation from '@/components/layout/Navigation';
import CinematicSection from '@/components/videos/CinematicSection';
import ElementSection from '@/components/videos/ElementSection';
import ScrollReveal from '@/components/ui/ScrollReveal';
import BreathingCircle from '@/components/ui/BreathingCircle';
import { useEffect } from 'react';

// ============================================
// SEA WITHIN — Cinematic Homepage
// ============================================

export default function HomePage() {
  useEffect(() => {
    const audio = document.getElementById('seaAudio') as HTMLAudioElement;
    if (!audio) return;

    const enableAudio = () => {
      audio.muted = false;
      audio.volume = 0.4;
      audio.play();
      window.removeEventListener('scroll', enableAudio);
    };

    window.addEventListener('scroll', enableAudio);
  }, []);

  // DIRECT STRIPE CHECKOUT FUNCTION
  const handleJoin = async () => {
    const res = await fetch('/api/checkout', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ plan: 'monthly' }),
    });

    const data = await res.json();
    if (data.url) {
      window.location.href = data.url;
    }
  };

  return (
    <main className="relative">
      

      {/* =============================================
          SECTION 1 — OCEAN SURFACE
      ============================================= */}
      <CinematicSection
        id="surface"
        videoSrc="/videos/ocean-surface.mp4"
        overlayOpacity={0.18}
        className="flex items-center justify-center"
      >
        <div className="flex flex-col items-center justify-center text-center px-6">
          <ScrollReveal delay={1000} duration={2000}>
            <div className="animate-[breathPulse_10s_ease-in-out_infinite]">
              <BreathingCircle size={100} />
            </div>
          </ScrollReveal>

          <ScrollReveal delay={2000} duration={2000}>
            <p className="font-whisper text-lg md:text-xl text-white/45 tracking-[6px] mt-12">
              breathe
            </p>
          </ScrollReveal>
        </div>
      </CinematicSection>

      {/* =============================================
          SECTION 2 — THE DESCENT
      ============================================= */}
      <CinematicSection
        id="descent"
        videoSrc="/videos/the-descent.mp4"
        overlayOpacity={0.18}
        className="flex items-center justify-center"
      >
        <div className="text-center px-6 max-w-4xl">
          <ScrollReveal delay={200}>
            <p className="font-whisper text-sm tracking-[8px] uppercase text-sea-500/80 mb-8">
              the descent
            </p>
          </ScrollReveal>
          <ScrollReveal delay={500}>
            <h2 className="font-display text-3xl md:text-5xl lg:text-6xl font-light text-sea-100 leading-relaxed">
              Beneath the noise,
              <br />
              <span className="text-golden-400">beneath the surface,</span>
              <br />
              there is a place that remembers you.
            </h2>
          </ScrollReveal>
          <ScrollReveal delay={800}>
            <div className="mt-16 flex justify-center">
              <div className="w-px h-24 bg-gradient-to-b from-transparent via-golden-400/30 to-transparent" />
            </div>
          </ScrollReveal>
        </div>
      </CinematicSection>

      {/* =============================================
          SECTION 3 — ELEMENTAL JOURNEY
      ============================================= */}
     
      <ElementSection
        element="earth"
        videoSrc="/videos/element-earth.mp4"
        whisperText="Feel the ground beneath you."
        subText="The foundation of everything you are begins here."
      />

      <ElementSection
        element="air"
        videoSrc="/videos/element-air.mp4"
        whisperText="Let the breath move through you. Let it carry what no longer serves."
        subText="Every exhale is a release. Every inhale, a return."
      />

      <ElementSection
        element="fire"
        videoSrc="/videos/element-fire.mp4"
        whisperText="The fire within you has never gone out. It's been waiting."
        subText="Your passion, your truth, your aliveness — still burning."
      />

      <ElementSection
        element="water"
        videoSrc="/videos/element-water.mp4"
        whisperText="Let the waves wash over you."
        subText="Water knows how to find its way home. So do you."
      />

      <ElementSection
        element="universe"
        videoSrc="/videos/element-universe.mp4"
        whisperText="You are not separate from the universe; you are its living expression, vast, complex, and breathtakingly beautiful."
        subText="Everything you've been searching for has been inside you all along."
      />

      {/* =============================================
          SECTION 4 — INTERWOVEN
      ============================================= */}
      <CinematicSection
        id="interwoven"
        videoSrc="/videos/interwoven-humanity.mp4"
        overlayOpacity={0.18}
      >
        <div className="text-center px-6 max-w-4xl">
          <ScrollReveal delay={300}>
            <p className="font-whisper text-sm tracking-[8px] uppercase text-golden-400/90 mb-8">
              interwoven
            </p>
          </ScrollReveal>
          <ScrollReveal delay={600}>
            <h2 className="font-display text-3xl md:text-5xl lg:text-6xl font-light text-sea-300 leading-relaxed">
              Nature and humanity
              <br />
              were never separate.
              <br />
              <span className="text-golden-400">They are one breath.</span>
            </h2>
          </ScrollReveal>
        </div>
      </CinematicSection>

      {/* =============================================
          SECTION 5 — HUMANITY
      ============================================= */}
      <CinematicSection
        id="humanity"
        videoSrc="/videos/humanity-joy.mp4"
        overlayOpacity={0.18}
      >
        <div className="text-center px-6 max-w-3xl">
          <ScrollReveal delay={400}>
            <h2 className="font-display text-3xl md:text-5xl font-light text-sea-100 leading-relaxed">
              This is what it looks like
              <br />
              <span className="text-golden-400">to come alive again.</span>
            </h2>
          </ScrollReveal>
          <ScrollReveal delay={700}>
            <p className="font-body text-base md:text-lg text-white/40 mt-8 leading-relaxed">
              The laughter that rises without permission.
              The tears that finally fall.
              The moment your body remembers it is safe.
            </p>
          </ScrollReveal>
        </div>
      </CinematicSection>

      {/* =============================================
          SECTION 6 — THE DOORWAY
      ============================================= */}
      <CinematicSection
        id="doorway"
        videoSrc="/videos/the-doorway.mp4"
        overlayOpacity={0.18}
      >
        <div className="text-center px-6 max-w-3xl">
          <ScrollReveal delay={300}>
            <p className="font-whisper text-sm tracking-[8px] uppercase text-golden-500/90 mb-10">
              the doorway
            </p>
          </ScrollReveal>
          <ScrollReveal delay={600}>
            <h2 className="font-display text-3xl md:text-5xl lg:text-6xl font-light text-golden-400 leading-relaxed golden-glow">
              There is a door
              <br />
              beneath the surface.
              <br />
              It has always been yours.
            </h2>
          </ScrollReveal>

      
          <ScrollReveal delay={1000}>
            <div className="mt-12">
              <a
                href="/reveal"
                className="btn-golden text-lg py-4 px-10 inline-block"
              >
                Step Inside
              </a>
            </div>
          </ScrollReveal>
        </div>
      </CinematicSection>

      {/* =============================================
          SECTION 7 — THE INVITATION
      ============================================= */}
      <CinematicSection
        id="invitation"
        videoSrc="/videos/the-invitation.mp4"
        overlayOpacity={0.55}
        className="!h-auto !min-h-screen !overflow-visible"
      >
        <div className="text-center px-6 max-w-3xl">

          <ScrollReveal delay={200}>
            <p className="font-whisper text-sm tracking-[8px] uppercase text-sea-300/70 mb-12">
              the invitation
            </p>
          </ScrollReveal>

          <ScrollReveal delay={500}>
            <h2 className="font-display text-2xl md:text-4xl font-light text-sea-200/100 leading-[1.8] md:leading-[2]">
              Sea Within is a movement for the ones who are ready to feel again —
            </h2>
          </ScrollReveal>

          <ScrollReveal delay={700}>
            <p className="font-display text-xl md:text-3xl font-light text-sea-500/100 leading-[1.8] md:leading-[2] mt-4">
              to breathe deeper, to live truer, to come home to the part of themselves they left behind.
            </p>
          </ScrollReveal>

          <ScrollReveal delay={900}>
            <p className="font-display text-xl md:text-3xl font-light text-sea-500/100 leading-[1.8] md:leading-[2] mt-4">
              For those who feel the pull of a deeper life beneath the noise —
              a self they are finally ready to return to.
            </p>
          </ScrollReveal>

          <ScrollReveal delay={1100}>
            <p className="font-display text-xl md:text-2xl font-light text-golden-500/100 leading-[1.8] mt-10">
              If you are here, it is not by accident.
            </p>
          </ScrollReveal>

          <ScrollReveal delay={1300}>
            <p className="font-display text-2xl md:text-3xl font-light text-golden-500/100 leading-[1.8] mt-4 golden-glow">
              Something in you is waking up.
            </p>
          </ScrollReveal>

          <ScrollReveal delay={1500}>
            <p className="font-display text-3xl md:text-4xl font-light text-sea-200/100 leading-[1.8] mt-8">
              It is time.
            </p>
          </ScrollReveal>

          <ScrollReveal delay={1700}>
            <p className="font-display text-xl md:text-2xl font-light text-white/80 leading-[1.8] mt-4">
              Step inside — your journey inward begins the moment you say yes.
            </p>
          </ScrollReveal>

   
          <ScrollReveal delay={2000}>
            <div className="mt-16">
              <a
                href="/reveal"
                className="btn-golden text-lg py-4 px-10 inline-block"
              >
                Join the Movement
              </a>
            </div>
          </ScrollReveal>
        </div>
      </CinematicSection>

      {/* =============================================
          FOOTER — UPDATED WITH LEGAL LINKS
      ============================================= */}
      <footer className="relative bg-sanctuary-dark border-t border-white/5 py-20">
        <div className="max-w-7xl mx-auto px-6 md:px-12 text-center">

          {/* Brand */}
          <p className="font-display text-xl tracking-[4px] text-golden-400/60">
            SEA WITHIN
          </p>
          <p className="font-whisper text-sm text-white/20 tracking-[3px] mt-3">
            come home to yourself
          </p>

          {/* Navigation */}
          <div className="flex justify-center flex-wrap gap-8 mt-10">
            <a href="/sanctuary" className="font-body text-[11px] tracking-[2px] uppercase text-white/30 hover:text-golden-400 transition-colors">
              Sanctuary
            </a>
            <a href="/bloom" className="font-body text-[11px] tracking-[2px] uppercase text-white/30 hover:text-golden-400 transition-colors">
              Bloom
            </a>
            <a href="/wisdom-board" className="font-body text-[11px] tracking-[2px] uppercase text-white/30 hover:text-golden-400 transition-colors">
              Wisdom Board
            </a>
            <a href="/community" className="font-body text-[11px] tracking-[2px] uppercase text-white/30 hover:text-golden-400 transition-colors">
              Community
            </a>
            <a href="/join" className="font-body text-[11px] tracking-[2px] uppercase text-white/30 hover:text-golden-400 transition-colors">
              Join
            </a>
          </div>

     {/* Legal */}
<div className="flex justify-center flex-wrap gap-8 mt-10">
  <a
    href="/legal"
    className="font-body text-[11px] tracking-[2px] uppercase text-white/20 hover:text-golden-400 transition-colors"
  >
    Legal
  </a>
</div>

          {/* Copyright */}
          <p className="font-body text-[11px] text-white/15 mt-12">
            &copy; {new Date().getFullYear()} Sea Within. All rights reserved.
          </p>
        </div>
      </footer>
    </main>
  );
}
