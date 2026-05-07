'use client';

import { useState, useEffect } from 'react';
import { Cormorant_Garamond, Playfair_Display } from 'next/font/google';
import Link from 'next/link';

// ============================================
// SEA WITHIN — THE SAND BILLBOARD
// A living shoreline where community wisdom
// appears as words written in the sand.
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

    // Initial reveal after page loads
    const revealTimer = setTimeout(() => setPhase('visible'), 800);

    // Cycle every 10 seconds
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
  const author =
    currentMessage?.author_name ||
    currentMessage?.display_name ||
    '';

  return (
    <div className={`sand-billboard ${cormorant.className}`}>
      {/* ====== BACKGROUND LAYERS ====== */}

      {/* Base ocean-to-sand gradient */}
      <div className="sb-bg" />

      {/* Sun glow */}
      <div className="sb-sun" />

      {/* Sand grain texture overlay */}
      <div className="sb-grain" />

      {/* Vignette */}
      <div className="sb-vignette" />

      {/* ====== GOLDEN PARTICLES ====== */}
      {particles.map((p) => (
        <div
          key={p.id}
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

      {/* ====== TITLE ====== */}
      <div className="sb-title-area">
        <p className={`sb-brand ${playfair.className}`}>Sea Within</p>
        <h1 className={`sb-title ${playfair.className}`}>
          Written in the Sand
        </h1>
        <div className="sb-title-line" />
      </div>

      {/* ====== MESSAGE DISPLAY ====== */}
      <div className="sb-message-area">
        {/* Wet sand glow behind text */}
        <div className="sb-wet-sand" />

        <div className={`sb-message-content sb-phase-${phase}`}>
          <p className="sb-message-text">
            &ldquo;{currentMessage?.content}&rdquo;
          </p>

          {author && (
            <p className={`sb-author ${playfair.className}`}>
              — {author}
            </p>
          )}
        </div>
      </div>

      {/* ====== WAVE LAYERS ====== */}
      <svg className="sb-wave sb-wave-1" viewBox="0 0 1440 120" preserveAspectRatio="none">
        <path d="M0,60 C240,120 480,0 720,60 C960,120 1200,0 1440,60 L1440,120 L0,120 Z" />
      </svg>

      <svg className="sb-wave sb-wave-2" viewBox="0 0 1440 100" preserveAspectRatio="none">
        <path d="M0,50 C360,100 720,0 1080,50 C1260,75 1350,25 1440,50 L1440,100 L0,100 Z" />
      </svg>

      <svg className="sb-wave sb-wave-3" viewBox="0 0 1440 80" preserveAspectRatio="none">
        <path d="M0,40 C180,80 360,0 540,40 C720,80 900,0 1080,40 C1260,80 1440,20 1440,40 L1440,80 L0,80 Z" />
      </svg>

      {/* Foam shimmer line */}
      <div className="sb-foam" />

      {/* ====== WAVE WASH OVERLAY ====== */}
      <div className={`sb-wave-wash ${phase === 'exiting' ? 'sb-wash-in' : ''} ${phase === 'entering' ? 'sb-wash-out' : ''}`} />

      {/* ====== BOTTOM CTA ====== */}
      <div className="sb-bottom">
        <Link href="/wisdom" className={`sb-cta ${playfair.className}`}>
          Write Your Truth in the Sand
        </Link>
        <p className={`sb-footer ${playfair.className}`}>
          Reflections from the Sea Within Community
        </p>
      </div>

      {/* ====== STYLES ====== */}
      <style>{`
        /* === RESET & CONTAINER === */
        .sand-billboard {
          position: relative;
          width: 100vw;
          height: 100vh;
          overflow: hidden;
          cursor: default;
          user-select: none;
        }

        /* === BACKGROUND === */
        .sb-bg {
          position: absolute;
          inset: 0;
          background: linear-gradient(
            180deg,
            #070d1a 0%,
            #0b1a2e 8%,
            #0f2a3f 16%,
            #163545 24%,
            #1f4a50 32%,
            #2d5a52 38%,
            #4a6e58 44%,
            #7a6e4a 52%,
            #9b8458 58%,
            #b09060 64%,
            #bfa068 70%,
            #c9a96e 76%,
            #d2b478 82%,
            #d8bc80 88%,
            #dcc088 94%,
            #dfc48c 100%
          );
        }

        /* === SUN GLOW === */
        .sb-sun {
          position: absolute;
          top: -5%;
          left: 50%;
          transform: translateX(-50%);
          width: 800px;
          height: 800px;
          border-radius: 50%;
          background: radial-gradient(
            circle,
            rgba(255, 210, 120, 0.12) 0%,
            rgba(255, 190, 90, 0.07) 25%,
            rgba(255, 170, 60, 0.03) 50%,
            transparent 75%
          );
          pointer-events: none;
          animation: sunPulse 8s ease-in-out infinite;
        }

        /* === GRAIN TEXTURE === */
        .sb-grain {
          position: absolute;
          inset: 0;
          opacity: 0.03;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E");
          background-size: 256px 256px;
          pointer-events: none;
        }

        /* === VIGNETTE === */
        .sb-vignette {
          position: absolute;
          inset: 0;
          background: radial-gradient(
            ellipse at 50% 50%,
            transparent 40%,
            rgba(7, 13, 26, 0.35) 100%
          );
          pointer-events: none;
          z-index: 15;
        }

        /* === PARTICLES === */
        .sb-particle {
          position: absolute;
          bottom: -20px;
          border-radius: 50%;
          background: radial-gradient(
            circle,
            rgba(255, 220, 150, 0.9),
            rgba(194, 154, 76, 0.2)
          );
          animation: particleFloat linear infinite;
          pointer-events: none;
          will-change: transform, opacity;
          z-index: 4;
        }

        /* === TITLE === */
        .sb-title-area {
          position: absolute;
          top: 10%;
          left: 50%;
          transform: translateX(-50%);
          text-align: center;
          z-index: 20;
          animation: fadeInSlow 3s ease-out forwards;
        }

        .sb-brand {
          font-size: 0.65rem;
          letter-spacing: 0.4em;
          text-transform: uppercase;
          color: rgba(255, 220, 170, 0.3);
          margin: 0 0 10px 0;
        }

        .sb-title {
          font-style: italic;
          font-weight: 400;
          font-size: clamp(1.4rem, 3.5vw, 2.6rem);
          color: rgba(255, 220, 170, 0.22);
          letter-spacing: 0.08em;
          margin: 0;
          text-shadow: 0 0 30px rgba(255, 200, 120, 0.08);
        }

        .sb-title-line {
          width: 60px;
          height: 1px;
          margin: 16px auto 0;
          background: linear-gradient(
            90deg,
            transparent,
            rgba(255, 220, 170, 0.2),
            transparent
          );
        }

        /* === MESSAGE AREA === */
        .sb-message-area {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: 88%;
          max-width: 780px;
          text-align: center;
          z-index: 20;
          padding: 50px 30px;
        }

        .sb-wet-sand {
          position: absolute;
          inset: -30px;
          border-radius: 50%;
          background: radial-gradient(
            ellipse,
            rgba(120, 95, 60, 0.18) 0%,
            rgba(120, 95, 60, 0.08) 40%,
            transparent 70%
          );
          filter: blur(30px);
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
          color: #6d5838;
          text-shadow:
            1px 2px 4px rgba(0, 0, 0, 0.25),
            -1px -1px 1px rgba(255, 240, 210, 0.18),
            0 0 20px rgba(194, 154, 76, 0.15),
            0 0 40px rgba(194, 154, 76, 0.06),
            2px 3px 6px rgba(80, 60, 30, 0.2);
          letter-spacing: 0.02em;
        }

        .sb-author {
          font-size: clamp(0.6rem, 1.3vw, 0.85rem);
          letter-spacing: 0.3em;
          text-transform: uppercase;
          color: rgba(109, 88, 56, 0.4);
          text-shadow: 0 1px 3px rgba(0, 0, 0, 0.15);
          margin: 0;
        }

        /* === WAVES === */
        .sb-wave {
          position: absolute;
          left: 0;
          width: 200%;
          pointer-events: none;
        }

        .sb-wave-1 {
          bottom: 10%;
          height: 100px;
          opacity: 0.1;
          z-index: 5;
          animation: waveSlide 14s linear infinite;
        }
        .sb-wave-1 path {
          fill: rgba(30, 70, 70, 0.5);
        }

        .sb-wave-2 {
          bottom: 6%;
          height: 80px;
          opacity: 0.15;
          z-index: 6;
          animation: waveSlide 9s linear infinite;
        }
        .sb-wave-2 path {
          fill: rgba(60, 100, 85, 0.4);
        }

        .sb-wave-3 {
          bottom: 3%;
          height: 60px;
          opacity: 0.2;
          z-index: 7;
          animation: waveSlide 6s linear infinite reverse;
        }
        .sb-wave-3 path {
          fill: rgba(160, 140, 100, 0.3);
        }

        /* === FOAM SHIMMER === */
        .sb-foam {
          position: absolute;
          bottom: 14%;
          left: 0;
          width: 100%;
          height: 1.5px;
          background: linear-gradient(
            90deg,
            transparent 0%,
            rgba(255, 255, 255, 0.06) 15%,
            rgba(255, 255, 255, 0.1) 35%,
            rgba(255, 255, 255, 0.14) 50%,
            rgba(255, 255, 255, 0.1) 65%,
            rgba(255, 255, 255, 0.06) 85%,
            transparent 100%
          );
          z-index: 8;
          animation: foamGlow 5s ease-in-out infinite;
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
            rgba(42, 75, 72, 0.6) 0%,
            rgba(42, 75, 72, 0.3) 40%,
            rgba(42, 75, 72, 0.1) 70%,
            transparent 100%
          );
          z-index: 18;
          pointer-events: none;
          transition: height 2s ease-in-out;
          border-radius: 0 0 0 0;
        }

        .sb-wash-in {
          height: 75%;
          transition: height 2s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .sb-wash-out {
          height: 0%;
          transition: height 1.8s cubic-bezier(0.4, 0, 0.2, 1);
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
          font-size: clamp(0.6rem, 1.2vw, 0.75rem);
          letter-spacing: 0.3em;
          text-transform: uppercase;
          color: rgba(180, 150, 100, 0.45);
          text-decoration: none;
          padding: 8px 24px;
          border: 1px solid rgba(180, 150, 100, 0.15);
          border-radius: 30px;
          transition: all 0.6s ease;
          margin-bottom: 10px;
        }

        .sb-cta:hover {
          color: rgba(220, 190, 130, 0.7);
          border-color: rgba(220, 190, 130, 0.3);
          background: rgba(180, 150, 100, 0.06);
          text-shadow: 0 0 15px rgba(220, 190, 130, 0.15);
        }

        .sb-footer {
          font-size: 0.55rem;
          letter-spacing: 0.25em;
          color: rgba(160, 135, 95, 0.25);
          text-transform: uppercase;
          margin: 6px 0 0 0;
        }

        /* === KEYFRAMES === */
        @keyframes particleFloat {
          0% {
            transform: translateY(0) translateX(0) scale(0);
            opacity: 0;
          }
          5% {
            transform: translateY(-5vh) translateX(3px) scale(1);
            opacity: var(--particle-opacity, 0.3);
          }
          50% {
            transform: translateY(-50vh) translateX(-8px) scale(0.8);
          }
          95% {
            opacity: var(--particle-opacity, 0.3);
          }
          100% {
            transform: translateY(-105vh) translateX(5px) scale(0.2);
            opacity: 0;
          }
        }

        @keyframes waveSlide {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }

        @keyframes foamGlow {
          0%, 100% { opacity: 0.3; }
          50% { opacity: 0.9; }
        }

        @keyframes sunPulse {
          0%, 100% { opacity: 1; transform: translateX(-50%) scale(1); }
          50% { opacity: 0.7; transform: translateX(-50%) scale(1.05); }
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
          }

          .sb-title-area {
            top: 8%;
          }

          .sb-sun {
            width: 400px;
            height: 400px;
          }

          .sb-wave-1 { bottom: 8%; height: 70px; }
          .sb-wave-2 { bottom: 5%; height: 55px; }
          .sb-wave-3 { bottom: 2%; height: 40px; }
          .sb-foam { bottom: 11%; }
        }

        @media (max-width: 480px) {
          .sb-message-area {
            padding: 20px 15px;
          }

          .sb-title-area {
            top: 6%;
          }

          .sb-bottom {
            bottom: 2%;
          }

          .sb-cta {
            padding: 6px 18px;
          }
        }
      `}</style>
    </div>
  );
}
