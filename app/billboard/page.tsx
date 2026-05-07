'use client';

import React, { useEffect, useMemo, useState } from 'react';

type WisdomMessage = {
  id: string;
  content: string;
  created_at?: string;
  author_name?: string | null;
};

const MAX_LOTUSES = 30;

function clampLotuses(messages: WisdomMessage[]): WisdomMessage[] {
  if (!messages) return [];
  if (messages.length <= MAX_LOTUSES) return messages;
  return [...messages]
    .sort((a, b) => {
      const da = a.created_at ? new Date(a.created_at).getTime() : 0;
      const db = b.created_at ? new Date(b.created_at).getTime() : 0;
      return db - da;
    })
    .slice(0, MAX_LOTUSES);
}

function getLotusPosition(index: number, total: number) {
  const rows = 3;
  const row = index % rows;
  const col = Math.floor(index / rows);

  const colFraction = total > 1 ? col / Math.max(1, Math.ceil(total / rows)) : 0.5;
  const baseX = 10 + colFraction * 70;
  const baseY = 40 + row * 18;

  const jitterX = (Math.random() - 0.5) * 6;
  const jitterY = (Math.random() - 0.5) * 4;

  return {
    left: `${baseX + jitterX}%`,
    top: `${baseY + jitterY}%`,
  };
}

type LotusProps = {
  message: WisdomMessage;
  index: number;
  total: number;
  onSelect: (m: WisdomMessage) => void;
};

const Lotus: React.FC<LotusProps> = ({ message, index, total, onSelect }) => {
  const position = useMemo(() => getLotusPosition(index, total), [index, total]);
  const driftDuration = 38 + Math.random() * 22;
  const floatDelay = Math.random() * 8;

  return (
    <button
      type="button"
      onClick={() => onSelect(message)}
      className="absolute -translate-x-1/2 -translate-y-1/2 focus:outline-none"
      style={{
        ...position,
        animation: `lotus-drift ${driftDuration}s ease-in-out infinite alternate`,
        animationDelay: `${floatDelay}s`,
      }}
    >
      <div className="relative w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28">
        <div className="absolute inset-0 rounded-full bg-gradient-radial from-amber-300/35 via-amber-200/10 to-transparent blur-2xl opacity-80 pointer-events-none" />
        <div className="relative flex items-center justify-center w-full h-full">
          {/* your lotus SVG unchanged */}
          <svg
            viewBox="0 0 120 120"
            className="w-full h-full drop-shadow-[0_0_18px_rgba(251,191,36,0.45)]"
          >
            <defs>
              <radialGradient id="lotusCenterGlow" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#FDE68A" stopOpacity="0.95" />
                <stop offset="45%" stopColor="#FBBF24" stopOpacity="0.75" />
                <stop offset="100%" stopColor="#F59E0B" stopOpacity="0" />
              </radialGradient>
              <linearGradient id="lotusPetalGold" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#FDE68A" />
                <stop offset="45%" stopColor="#FBBF24" />
                <stop offset="100%" stopColor="#D97706" />
              </linearGradient>
            </defs>

            <circle cx="60" cy="60" r="26" fill="url(#lotusCenterGlow)" />

            <g className="opacity-80">
              <path
                d="M60 16 C50 30 44 44 46 58 C48 70 55 78 60 82 C65 78 72 70 74 58 C76 44 70 30 60 16 Z"
                fill="url(#lotusPetalGold)"
                className="lotus-petal-soft"
              />
              <path
                d="M32 34 C26 46 24 58 28 68 C32 78 40 84 48 86 C48 76 50 66 54 58 C58 50 62 44 60 36 C52 34 42 32 32 34 Z"
                fill="url(#lotusPetalGold)"
                className="lotus-petal-soft"
              />
              <path
                d="M88 34 C78 32 68 34 60 36 C58 44 62 50 66 58 C70 66 72 76 72 86 C80 84 88 78 92 68 C96 58 94 46 88 34 Z"
                fill="url(#lotusPetalGold)"
                className="lotus-petal-soft"
              />
            </g>

            <g>
              <path
                d="M60 26 C52 38 48 50 50 60 C52 70 56 76 60 80 C64 76 68 70 70 60 C72 50 68 38 60 26 Z"
                fill="url(#lotusPetalGold)"
                className="lotus-petal-foreground"
              />
              <path
                d="M44 40 C36 46 32 54 32 62 C32 70 36 76 42 80 C44 72 48 66 52 60 C56 54 58 48 58 42 C52 40 48 40 44 40 Z"
                fill="url(#lotusPetalGold)"
                className="lotus-petal-foreground"
              />
              <path
                d="M76 40 C72 40 68 40 62 42 C62 48 64 54 68 60 C72 66 76 72 78 80 C84 76 88 70 88 62 C88 54 84 46 76 40 Z"
                fill="url(#lotusPetalGold)"
                className="lotus-petal-foreground"
              />
            </g>

            <ellipse cx="60" cy="60" rx="10" ry="14" fill="#FEF3C7" className="opacity-90" />
            <circle cx="60" cy="54" r="3.2" fill="#FBBF24" />
          </svg>
        </div>
      </div>
    </button>
  );
};

const WisdomBoardRevealPage: React.FC = () => {
  const [messages, setMessages] = useState<WisdomMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<WisdomMessage | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function loadMessages() {
      try {
        setLoading(true);
        setError(null);

        const res = await fetch('/api/messages?type=wisdom', {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
          cache: 'no-store',
        });

        if (!res.ok) throw new Error(`Failed to load wisdom messages (${res.status})`);

        const data = await res.json();
        const list: WisdomMessage[] = data.posts || [];

        if (!cancelled) setMessages(clampLotuses(list));
      } catch (e) {
        if (!cancelled) {
          setError('The lotus sanctuary is quiet at the moment. Please try again in a little while.');
          console.error(e);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    loadMessages();
    const interval = setInterval(loadMessages, 60000);
    return () => {
      cancelled = true;
      clearInterval(interval);
    };
  }, []);

  const hasMessages = messages && messages.length > 0;

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-slate-950 text-slate-50">

      {/* ⭐ FULL-SCREEN OCEAN BACKGROUND */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Moon glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[900px] bg-[radial-gradient(circle_at_center,_rgba(255,255,255,0.18),_rgba(255,255,255,0.05),_transparent_70%)] opacity-70" />

        {/* Horizon shimmer */}
        <div className="absolute top-1/3 left-0 right-0 h-40 bg-gradient-to-b from-amber-200/10 via-amber-100/5 to-transparent" />

        {/* Water texture */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(148,163,184,0.12),transparent_55%),radial-gradient(circle_at_80%_60%,rgba(148,163,184,0.1),transparent_55%)] opacity-40 mix-blend-screen" />
      </div>

      {/* HEADER */}
      <header className="relative z-10 max-w-4xl mx-auto pt-24 px-6 text-center">
        <p className="text-xs tracking-[0.35em] uppercase text-amber-300/70 mb-3">
          wisdom board reveal
        </p>
        <h1 className="text-4xl sm:text-5xl font-semibold tracking-tight text-slate-50 mb-3">
          The Lotus Sanctuary
        </h1>
        <p className="text-sm sm:text-base text-slate-300/80 max-w-xl mx-auto">
          Where your shared wisdom becomes awakening light.
        </p>
      </header>

      {/* LOTUS FIELD */}
      <main className="relative z-10 w-full h-[70vh] mt-10">
        {loading && (
          <div className="flex h-full items-center justify-center">
            <p className="text-sm text-slate-300/80">
              The water is still… gathering lotus lights.
            </p>
          </div>
        )}

        {!loading && error && (
          <div className="flex h-full items-center justify-center px-4 text-center">
            <p className="text-sm text-slate-300/80">{error}</p>
          </div>
        )}

        {!loading && !error && !hasMessages && (
          <div className="flex h-full items-center justify-center px-4 text-center">
            <p className="text-sm text-slate-300/80 max-w-md">
              No wisdom has been released into the water yet. When the first message is shared,
              a lotus will bloom here.
            </p>
          </div>
        )}

        {!loading && !error && hasMessages && (
          <div className="absolute inset-0">
            {messages.map((m, idx) => (
              <Lotus
                key={m.id ?? idx}
                message={m}
                index={idx}
                total={messages.length}
                onSelect={setSelected}
              />
            ))}
          </div>
        )}
      </main>

      {/* MODAL */}
      {selected && (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm">
          <div className="relative max-w-lg w-full mx-4 rounded-3xl bg-slate-950/95 border border-amber-200/20 shadow-[0_0_60px_rgba(251,191,36,0.35)] px-6 py-6 sm:px-8 sm:py-7">
            <div className="absolute -inset-px rounded-3xl bg-gradient-to-b from-amber-200/10 via-transparent to-amber-500/5 pointer-events-none" />
            <div className="relative space-y-4">
              <p className="text-xs tracking-[0.3em] uppercase text-amber-300/70">
                shared wisdom
              </p>
              <p className="text-sm sm:text-base text-slate-50 whitespace-pre-wrap leading-relaxed">
                {selected.content}
              </p>
              {selected.author_name && (
                <p className="text-xs text-slate-400/80 mt-1">
                  — {selected.author_name}
                </p>
              )}
              <div className="pt-3 flex justify-end">
                <button
                  type="button"
                  onClick={() => setSelected(null)}
                  className="inline-flex items-center rounded-full border border-amber-200/40 bg-slate-950/60 px-4 py-1.5 text-xs sm:text-sm text-amber-100 hover:bg-slate-900/80 transition-colors"
                >
                  Close sanctuary
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ANIMATIONS */}
      <style jsx global>{`
        @keyframes lotus-drift {
          0% {
            transform: translate3d(-50%, -50%, 0) translateX(-6px) translateY(3px);
          }
          50% {
            transform: translate3d(-50%, -50%, 0) translateX(8px) translateY(-5px);
          }
          100% {
            transform: translate3d(-50%, -50%, 0) translateX(-4px) translateY(2px);
          }
        }

        .lotus-petal-soft {
          filter: drop-shadow(0 0 10px rgba(251, 191, 36, 0.35));
        }

        .lotus-petal-foreground {
          filter: drop-shadow(0 0 14px rgba(251, 191, 36, 0.5));
        }

        .bg-gradient-radial {
          background-image: radial-gradient(circle, var(--tw-gradient-stops));
        }
      `}</style>
    </div>
  );
};

export default WisdomBoardRevealPage;
