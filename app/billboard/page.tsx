'use client';

import { useState, useEffect } from 'react';
import { Cormorant_Garamond, Playfair_Display } from 'next/font/google';
import Link from 'next/link';

// ============================================
// SEA WITHIN — THE SAND BILLBOARD (ENHANCED)
// Realistic waves. Textured sand. Sacred words.
// ============================================

const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600'],
  style: ['normal', 'italic'],
});

const playfair = Playfair_Display({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  style: ['normal', 'italic'],
});

interface WisdomMessage {
  id: string;
  content: string;
  author_name?: string;
  display_name?: string;
  created_at?: string;
}

const SANCTUARY_MESSAGES: WisdomMessage[] = [
  { id: 's1', content: 'The ocean does not hurry. Yet everything is accomplished.' },
  { id: 's2', content: 'Be still. The answers are already within you.' },
  { id: 's3', content: 'Every wave that reaches the shore once began as a whisper in the deep.' },
  { id: 's4', content: 'You are not a drop in the ocean. You are the entire ocean in a drop.' },
  { id: 's5', content: 'The wound is the place where the light enters you.' },
  { id: 's6', content: 'What you seek is also seeking you.' },
  { id: 's7', content: 'Let yourself be silently drawn by the strange pull of what you truly love.' },
];

export default function SandBillboard() {
  const [messages, setMessages] = useState<WisdomMessage[]>(SANCTUARY_MESSAGES);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [phase, setPhase] = useState<'entering' | 'visible' | 'exiting'>('entering');

  // Golden light particles
  const [particles] = useState(() =>
    Array.from({ length: 35 }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      delay: Math.random() * 20,
      duration: 10 + Math.random() * 15,
      size: 1.5 + Math.random() * 3.5,
      opacity: 0.15 + Math.random() * 0.35,
    }))
  );

  // Sand sparkle particles
  const [sparkles] = useState(() =>
    Array.from({ length: 50 }, (_, i) => ({
      id: i,
      left: 5 + Math.random() * 90,
      top: 55 + Math.random() * 40,
      delay: Math.random() * 8,
      duration: 2 + Math.random() * 4,
      size: 1 + Math.random() * 2,
    }))
  );

  // Foam bubbles along shoreline
  const [foamBubbles] = useState(() =>
    Array.from({ length: 25 }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      delay: Math.random() * 6,
      duration: 3 + Math.random() * 4,
      size: 2 + Math.random() * 5,
    }))
  );

  // Fetch real wisdom board messages
  useEffect(() => {
    async function fetchMessages() {
      try {
        const res = await fetch('/api/messages?type=wisdom');
        const data = await res.json();
        const msgs = data.messages || data.posts || [];
        if (msgs.length > 0) {
          const shuffled = [...msgs].sort(() => Math.random() - 0.5);
          setMessages(shuffled);
        }
      } catch {
        // Fallback to sanctuary messages
      }
    }
    fetchMessages();
  }, []);

  // Message cycling with wave-wash rhythm
  useEffect(() => {
    if (messages.length === 0) return;

    const revealTimer = setTimeout(() => setPhase('visible'), 800);

    const cycle = setInterval(() => {
      setPhase('exiting');
      setTimeout(() => {
        setCurrentIndex((prev) => (prev + 1) % messages.length);
        setPhase('entering');
      }, 2200);
      setTimeout(() => {
        setPhase('visible');
      }, 3200);
    }, 10000);

    return () => {
      clearTimeout(revealTimer);
      clearInterval(cycle);
    };
  }, [messages.length]);

  const currentMessage = messages[currentIndex];
  const author = currentMessage?.author_name || currentMessage?.display_name || '';

  return (
    <div className={`sand-billboard ${cormorant.className}`}>

      {/* ====== SKY / OCEAN BACKGROUND ====== */}
      <div className="sb-sky" />

      {/* ====== SUN ====== */}
      <div className="sb-sun" />
      <div className="sb-sun-reflection" />

      {/* ====== SAND AREA ====== */}
      <div className="sb-sand" />

      {/* ====== WET SAND ZONE ====== */}
      <div className="sb-wet-sand-zone" />

      {/* ====== SAND RIPPLES ====== */}
      <div className="sb-sand-ripple sb-ripple-1" />
      <div className="sb-sand-ripple sb-ripple-2" />
      <div className="sb-sand-ripple sb-ripple-3" />
      <div className="sb-sand-ripple sb-ripple-4" />

      {/* ====== SAND GRAIN TEXTURE ====== */}
      <div className="sb-grain" />
      <div className="sb-grain-fine" />

      {/* ====== SAND SPARKLES ====== */}
      {sparkles.map((s) => (
        <div
          key={`sparkle-${s.id}`}
          className="sb-sparkle"
          style={{
            left: `${s.left}%`,
            top: `${s.top}%`,
            width: `${s.size}px`,
            height: `${s.size}px`,
            animationDelay: `${s.delay}s`,
            animationDuration: `${s.duration}s`,
          }}
        />
      ))}

      {/* ====== VIGNETTE ====== */}
      <div className="sb-vignette" />

      {/* ====== GOLDEN PARTICLES ====== */}
      {particles.map((p) => (
        <div
          key={`particle-${p.id}`}
          className="sb-particle"
          style={{
            left: `${p.left}%`,
            width: `${p.size}px`,
            height: `${p.size}px`,
            opacity: p.opacity,
            animationDuration: `${p.duration}s`,
            animationDelay: `${p.delay}s`,
          }}
        />
      ))}

      {/* ====== WAVE LAYERS (5 ORGANIC) ====== */}

      {/* Deep ocean swell */}
      <svg className="sb-wave sb-wave-1" viewBox="0 0 1440 180" preserveAspectRatio="none">
        <path d="M0,90 C120,140 240,50 360,90 C480,130 540,60 720,100 C900,140 960,50 1080,80 C1200,110 1320,60 1440,90 L1440,180 L0,180 Z" />
      </svg>

      {/* Mid-ocean wave */}
      <svg className="sb-wave sb-wave-2" viewBox="0 0 1440 150" preserveAspectRatio="none">
        <path d="M0,75 C180,120 300,30 480,75 C660,120 720,40 900,80 C1020,110 1140,35 1260,70 C1350,95 1400,55 1440,75 L1440,150 L0,150 Z" />
      </svg>

      {/* Shore approach wave */}
      <svg className="sb-wave sb-wave-3" viewBox="0 0 1440 120" preserveAspectRatio="none">
        <path d="M0,60 C100,95 200,25 360,55 C520,85 580,30 720,65 C860,100 940,25 1080,55 C1180,80 1300,35 1440,60 L1440,120 L0,120 Z" />
      </svg>

      {/* Breaking wave with curl */}
      <svg className="sb-wave sb-wave-4" viewBox="0 0 1440 100" preserveAspectRatio="none">
        <path d="M0,50 C60,75 120,20 240,45 C360,70 420,25 540,50 C660,75 780,20 900,50 C1020,80 1080,30 1200,50 C1320,70 1380,35 1440,50 L1440,100 L0,100 Z" />
      </svg>

      {/* Thin shore wash */}
      <svg className="sb-wave sb-wave-5" viewBox="0 0 1440 60" preserveAspectRatio="none">
        <path d="M0,30 C180,50 360,10 540,30 C720,50 900,10 1080,30 C1200,45 1320,15 1440,30 L1440,60 L0,60 Z" />
      </svg>

      {/* ====== FOAM BUBBLES AT SHORELINE ====== */}
      {foamBubbles.map((b) => (
        <div
          key={`foam-${b.id}`}
          className="sb-foam-bubble"
          style={{
            left: `${b.left}%`,
            width: `${b.size}px`,
            height: `${b.size}px`,
            animationDelay: `${b.delay}s`,
            animationDuration: `${b.duration}s`,
          }}
        />
      ))}

      {/* ====== FOAM LINE ====== */}
      <div className="sb-foam-line" />
      <div className="sb-foam-line-2" />

      {/* ====== WAVE WASH OVERLAY ====== */}
      <div className={`sb-wave-wash ${phase === 'exiting' ? 'sb-wash-in' : ''} ${phase === 'entering' ? 'sb-wash-out' : ''}`} />

      {/* ====== TITLE ====== */}
      <div className="sb-title-area">
        <p className={`sb-brand ${playfair.className}`}>Sea Within</p>
        <h1 className={`sb-title ${playfair.className}`}>Written in the Sand</h1>
        <div className="sb-title-line" />
      </div>

      {/* ====== MESSAGE DISPLAY ====== */}
      <div className="sb-message-area">
        <div className="sb-wet-glow" />
        <div className={`sb-message-content sb-phase-${phase}`}>
          <p className="sb-message-text">
            &ldquo;{currentMessage?.content}&rdquo;
          </p>
          {author && (
            <p className={`sb-author ${playfair.className}`}>— {author}</p>
          )}
        </div>
      </div>

      {/* ====== BOTTOM CTA ====== */}
      <div className="sb-bottom">
        <Link href="/wisdom-board" className={`sb-cta ${playfair.className}`}>
          Write Your Truth in the Sand
        </Link>
        <p className={`sb-footer ${playfair.className}`}>
          Reflections from the Sea Within Community
        </p>
      </div>

      {/* ====== STYLES ====== */}
      <style>{`
        /* === CONTAINER === */
        .sand-billboard {
          position: relative;
          width: 100vw;
          height: 100vh;
          overflow: hidden;
          cursor: default;
          user-select: none;
        }

        /* === SKY / OCEAN === */
        .sb-sky {
          position: absolute;
          inset: 0;
          background: linear-gradient(
            180deg,
            #050d1a 0%,
            #0a1628 6%,
            #0e2035 12%,
            #132d42 20%,
            #1a3d4e 28%,
            #224f5a 36%,
            #2d6260 42%,
            #3a7565 48%
          );
          height: 55%;
        }

        /* === SAND ZONE === */
        .sb-sand {
          position: absolute;
          top: 48%;
          left: 0;
          right: 0;
          bottom: 0;
          background: linear-gradient(
            180deg,
            #8a7352 0%,
            #9b8260 5%,
            #a88e68 10%,
            #b69970 18%,
            #c2a478 28%,
            #cbad7e 40%,
            #d4b884 55%,
            #d8be88 70%,
            #dcc28c 85%,
            #dfc590 100%
          );
        }

        /* === WET SAND ZONE === */
        .sb-wet-sand-zone {
          position: absolute;
          top: 48%;
          left: 0;
          right: 0;
          height: 12%;
          background: linear-gradient(
            180deg,
            rgba(70, 65, 50, 0.5) 0%,
            rgba(90, 80, 58, 0.35) 30%,
            rgba(120, 100, 70, 0.15) 70%,
            transparent 100%
          );
          z-index: 3;
        }

        /* === SAND RIPPLES === */
        .sb-sand-ripple {
          position: absolute;
          left: 0;
          right: 0;
          height: 1px;
          z-index: 3;
          opacity: 0.12;
        }

        .sb-ripple-1 {
          top: 62%;
          background: linear-gradient(90deg, transparent 5%, rgba(180, 155, 110, 0.5) 20%, rgba(160, 135, 90, 0.3) 50%, rgba(180, 155, 110, 0.5) 80%, transparent 95%);
          animation: rippleShift 12s ease-in-out infinite;
        }

        .sb-ripple-2 {
          top: 68%;
          background: linear-gradient(90deg, transparent 10%, rgba(190, 165, 115, 0.4) 30%, rgba(170, 145, 100, 0.25) 55%, rgba(190, 165, 115, 0.4) 75%, transparent 90%);
          animation: rippleShift 15s ease-in-out infinite reverse;
        }

        .sb-ripple-3 {
          top: 75%;
          background: linear-gradient(90deg, transparent 8%, rgba(200, 175, 125, 0.35) 25%, rgba(180, 155, 105, 0.2) 60%, rgba(200, 175, 125, 0.35) 85%, transparent 92%);
          animation: rippleShift 18s ease-in-out infinite;
        }

        .sb-ripple-4 {
          top: 83%;
          background: linear-gradient(90deg, transparent 15%, rgba(195, 170, 120, 0.3) 35%, rgba(175, 150, 100, 0.18) 65%, rgba(195, 170, 120, 0.3) 80%, transparent 95%);
          animation: rippleShift 14s ease-in-out infinite reverse;
        }

        /* === SUN === */
        .sb-sun {
          position: absolute;
          top: 5%;
          left: 50%;
          transform: translateX(-50%);
          width: 180px;
          height: 180px;
          border-radius: 50%;
          background: radial-gradient(
            circle,
            rgba(255, 220, 150, 0.25) 0%,
            rgba(255, 200, 120, 0.12) 30%,
            rgba(255, 180, 90, 0.05) 60%,
            transparent 100%
          );
          z-index: 2;
          animation: sunPulse 8s ease-in-out infinite;
        }

        .sb-sun-reflection {
          position: absolute;
          top: 20%;
          left: 50%;
          transform: translateX(-50%);
          width: 120px;
          height: 400px;
          background: linear-gradient(
            180deg,
            rgba(255, 220, 150, 0.06) 0%,
            rgba(255, 200, 120, 0.04) 30%,
            rgba(255, 190, 100, 0.02) 60%,
            transparent 100%
          );
          z-index: 2;
          filter: blur(20px);
          animation: reflectionShimmer 6s ease-in-out infinite;
        }

        /* === GRAIN TEXTURES === */
        .sb-grain {
          position: absolute;
          top: 48%;
          left: 0;
          right: 0;
          bottom: 0;
          opacity: 0.08;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 512 512' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='1.2' numOctaves='6' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
          background-size: 256px 256px;
          pointer-events: none;
          z-index: 4;
        }

        .sb-grain-fine {
          position: absolute;
          top: 48%;
          left: 0;
          right: 0;
          bottom: 0;
          opacity: 0.04;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n2'%3E%3CfeTurbulence type='turbulence' baseFrequency='2.5' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n2)'/%3E%3C/svg%3E");
          background-size: 128px 128px;
          pointer-events: none;
          z-index: 4;
        }

        /* === SAND SPARKLES === */
        .sb-sparkle {
          position: absolute;
          border-radius: 50%;
          background: rgba(255, 245, 220, 0.9);
          box-shadow: 0 0 3px rgba(255, 230, 180, 0.6);
          animation: sparkleGlint ease-in-out infinite;
          pointer-events: none;
          z-index: 5;
        }

        /* === VIGNETTE === */
        .sb-vignette {
          position: absolute;
          inset: 0;
          background: radial-gradient(
            ellipse at 50% 50%,
            transparent 35%,
            rgba(5, 13, 26, 0.4) 100%
          );
          pointer-events: none;
          z-index: 15;
        }

        /* === PARTICLES === */
        .sb-particle {
          position: absolute;
          bottom: -20px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(255, 220, 150, 0.9), rgba(194, 154, 76, 0.2));
          animation: particleFloat linear infinite;
          pointer-events: none;
          z-index: 14;
        }

        /* === WAVES (5 ORGANIC LAYERS) === */
        .sb-wave {
          position: absolute;
          left: 0;
          width: 200%;
          pointer-events: none;
        }

        .sb-wave-1 {
          bottom: 48%;
          height: 140px;
          opacity: 0.15;
          z-index: 6;
          animation: waveRoll 18s ease-in-out infinite;
        }
        .sb-wave-1 path { fill: rgba(20, 60, 65, 0.5); }

        .sb-wave-2 {
          bottom: 46%;
          height: 120px;
          opacity: 0.2;
          z-index: 7;
          animation: waveRoll 13s ease-in-out infinite reverse;
        }
        .sb-wave-2 path { fill: rgba(30, 75, 70, 0.45); }

        .sb-wave-3 {
          bottom: 44%;
          height: 100px;
          opacity: 0.25;
          z-index: 8;
          animation: waveRoll 10s ease-in-out infinite;
        }
        .sb-wave-3 path { fill: rgba(50, 95, 80, 0.4); }

        .sb-wave-4 {
          bottom: 42%;
          height: 80px;
          opacity: 0.3;
          z-index: 9;
          animation: waveRoll 7s ease-in-out infinite reverse;
        }
        .sb-wave-4 path { fill: rgba(80, 110, 85, 0.35); }

        .sb-wave-5 {
          bottom: 41%;
          height: 50px;
          opacity: 0.35;
          z-index: 10;
          animation: waveRoll 5s ease-in-out infinite;
        }
        .sb-wave-5 path { fill: rgba(110, 120, 90, 0.3); }

        /* === FOAM BUBBLES === */
        .sb-foam-bubble {
          position: absolute;
          bottom: 50%;
          border-radius: 50%;
          background: radial-gradient(circle at 35% 35%, rgba(255, 255, 255, 0.25), rgba(255, 255, 255, 0.05));
          border: 0.5px solid rgba(255, 255, 255, 0.1);
          animation: foamBubbleFloat ease-in-out infinite;
          pointer-events: none;
          z-index: 11;
        }

        /* === FOAM LINES === */
        .sb-foam-line {
          position: absolute;
          bottom: 50%;
          left: 0;
          width: 100%;
          height: 2px;
          background: linear-gradient(
            90deg,
            transparent 0%,
            rgba(255, 255, 255, 0.03) 10%,
            rgba(255, 255, 255, 0.08) 25%,
            rgba(255, 255, 255, 0.14) 40%,
            rgba(255, 255, 255, 0.08) 55%,
            rgba(255, 255, 255, 0.12) 70%,
            rgba(255, 255, 255, 0.06) 85%,
            transparent 100%
          );
          z-index: 12;
          animation: foamSlide 8s ease-in-out infinite;
        }

        .sb-foam-line-2 {
          position: absolute;
          bottom: 49%;
          left: 0;
          width: 100%;
          height: 1px;
          background: linear-gradient(
            90deg,
            transparent 5%,
            rgba(255, 255, 255, 0.05) 20%,
            rgba(255, 255, 255, 0.1) 45%,
            rgba(255, 255, 255, 0.05) 70%,
            transparent 95%
          );
          z-index: 12;
          animation: foamSlide 6s ease-in-out infinite reverse;
        }

        /* === WAVE WASH OVERLAY === */
        .sb-wave-wash {
          position: absolute;
          bottom: 0;
          left: -5%;
          width: 110%;
          height: 0%;
          background: linear-gradient(
            0deg,
            rgba(35, 70, 68, 0.6) 0%,
            rgba(35, 70, 68, 0.3) 40%,
            rgba(35, 70, 68, 0.1) 70%,
            transparent 100%
          );
          z-index: 18;
          pointer-events: none;
          transition: height 2s ease-in-out;
        }

        .sb-wash-in {
          height: 75%;
          transition: height 2s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .sb-wash-out {
          height: 0%;
          transition: height 1.8s cubic-bezier(0.4, 0, 0.2, 1);
        }

        /* === TITLE === */
        .sb-title-area {
          position: absolute;
          top: 8%;
          left: 50%;
          transform: translateX(-50%);
          text-align: center;
          z-index: 20;
          animation: fadeInSlow 3s ease-out forwards;
        }

        .sb-brand {
          font-size: 0.6rem;
          letter-spacing: 0.4em;
          text-transform: uppercase;
          color: rgba(255, 220, 170, 0.25);
          margin: 0 0 10px 0;
        }

        .sb-title {
          font-style: italic;
          font-weight: 400;
          font-size: clamp(1.4rem, 3.5vw, 2.6rem);
          color: rgba(255, 220, 170, 0.2);
          letter-spacing: 0.08em;
          margin: 0;
          text-shadow: 0 0 30px rgba(255, 200, 120, 0.06);
        }

        .sb-title-line {
          width: 60px;
          height: 1px;
          margin: 16px auto 0;
          background: linear-gradient(90deg, transparent, rgba(255, 220, 170, 0.18), transparent);
        }

        /* === MESSAGE AREA === */
        .sb-message-area {
          position: absolute;
          top: 62%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: 88%;
          max-width: 780px;
          text-align: center;
          z-index: 20;
          padding: 50px 30px;
        }

        .sb-wet-glow {
          position: absolute;
          inset: -40px;
          border-radius: 50%;
          background: radial-gradient(
            ellipse,
            rgba(100, 85, 55, 0.2) 0%,
            rgba(100, 85, 55, 0.08) 40%,
            transparent 70%
          );
          filter: blur(25px);
          pointer-events: none;
        }

        /* === MESSAGE TEXT — CARVED IN SAND === */
        .sb-message-content {
          position: relative;
          transition: opacity 2s ease, transform 2s ease, filter 1.5s ease;
        }

        .sb-phase-entering {
          opacity: 0;
          transform: translateY(8px);
          filter: blur(2px);
        }

        .sb-phase-visible {
          opacity: 1;
          transform: translateY(0);
          filter: blur(0);
        }

        .sb-phase-exiting {
          opacity: 0;
          transform: translateY(-4px);
          filter: blur(3px);
          transition: opacity 1.8s ease-in, transform 1.8s ease-in, filter 1.5s ease-in;
        }

        .sb-message-text {
          font-family: inherit;
          font-style: italic;
          font-weight: 300;
          font-size: clamp(1.3rem, 3.8vw, 2.6rem);
          line-height: 1.7;
          margin: 0 0 28px 0;
          color: #5d4a2e;
          text-shadow:
            1px 2px 3px rgba(0, 0, 0, 0.3),
            -1px -1px 0px rgba(255, 240, 210, 0.12),
            0 0 15px rgba(180, 145, 80, 0.12),
            0 0 40px rgba(180, 145, 80, 0.05),
            2px 3px 8px rgba(60, 45, 20, 0.25),
            inset 0 0 0 rgba(255, 240, 210, 0.1);
          letter-spacing: 0.02em;
        }

        .sb-author {
          font-size: clamp(0.55rem, 1.2vw, 0.8rem);
          letter-spacing: 0.3em;
          text-transform: uppercase;
          color: rgba(93, 74, 46, 0.35);
          text-shadow: 0 1px 3px rgba(0, 0, 0, 0.15);
          margin: 0;
        }

        /* === BOTTOM CTA === */
        .sb-bottom {
          position: absolute;
          bottom: 3%;
          left: 50%;
          transform: translateX(-50%);
          text-align: center;
          z-index: 20;
        }

        .sb-cta {
          display: inline-block;
          font-size: clamp(0.55rem, 1.1vw, 0.7rem);
          letter-spacing: 0.3em;
          text-transform: uppercase;
          color: rgba(160, 135, 90, 0.5);
          text-decoration: none;
          padding: 8px 24px;
          border: 1px solid rgba(160, 135, 90, 0.18);
          border-radius: 30px;
          transition: all 0.6s ease;
          margin-bottom: 10px;
        }

        .sb-cta:hover {
          color: rgba(200, 175, 120, 0.75);
          border-color: rgba(200, 175, 120, 0.3);
          background: rgba(160, 135, 90, 0.06);
          text-shadow: 0 0 12px rgba(200, 175, 120, 0.12);
        }

        .sb-footer {
          font-size: 0.5rem;
          letter-spacing: 0.25em;
          color: rgba(140, 120, 85, 0.25);
          text-transform: uppercase;
          margin: 6px 0 0 0;
        }

        /* === KEYFRAMES === */
        @keyframes waveRoll {
          0% { transform: translateX(0); }
          50% { transform: translateX(-25%); }
          100% { transform: translateX(0); }
        }

        @keyframes particleFloat {
          0% { transform: translateY(0) translateX(0) scale(0); opacity: 0; }
          5% { transform: translateY(-5vh) translateX(3px) scale(1); opacity: 0.3; }
          50% { transform: translateY(-50vh) translateX(-8px) scale(0.8); }
          95% { opacity: 0.3; }
          100% { transform: translateY(-105vh) translateX(5px) scale(0.2); opacity: 0; }
        }

        @keyframes sparkleGlint {
          0%, 100% { opacity: 0; transform: scale(0.5); }
          50% { opacity: 0.8; transform: scale(1.2); }
        }

        @keyframes foamBubbleFloat {
          0% { transform: translateY(0) translateX(0) scale(1); opacity: 0; }
          20% { opacity: 0.6; transform: translateY(-5px) translateX(3px) scale(1); }
          80% { opacity: 0.3; transform: translateY(-15px) translateX(-5px) scale(0.7); }
          100% { transform: translateY(-25px) translateX(2px) scale(0.3); opacity: 0; }
        }

        @keyframes foamSlide {
          0%, 100% { transform: translateX(-3%); opacity: 0.4; }
          50% { transform: translateX(3%); opacity: 0.8; }
        }

        @keyframes rippleShift {
          0%, 100% { transform: translateX(-2px); opacity: 0.1; }
          50% { transform: translateX(2px); opacity: 0.16; }
        }

        @keyframes sunPulse {
          0%, 100% { opacity: 1; transform: translateX(-50%) scale(1); }
          50% { opacity: 0.7; transform: translateX(-50%) scale(1.05); }
        }

        @keyframes reflectionShimmer {
          0%, 100% { opacity: 1; transform: translateX(-50%) scaleX(1); }
          50% { opacity: 0.5; transform: translateX(-50%) scaleX(1.3); }
        }

        @keyframes fadeInSlow {
          0% { opacity: 0; transform: translateX(-50%) translateY(10px); }
          100% { opacity: 1; transform: translateX(-50%) translateY(0); }
        }

        /* === RESPONSIVE === */
        @media (max-width: 768px) {
          .sb-message-area {
            width: 92%;
            padding: 30px 20px;
            top: 65%;
          }
          .sb-title-area { top: 6%; }
          .sb-sun { width: 120px; height: 120px; }
          .sb-sun-reflection { width: 80px; height: 250px; }
        }

        @media (max-width: 480px) {
          .sb-message-area { padding: 20px 15px; top: 68%; }
          .sb-title-area { top: 5%; }
          .sb-bottom { bottom: 2%; }
          .sb-cta { padding: 6px 18px; }
        }
      `}</style>
    </div>
  );
}
