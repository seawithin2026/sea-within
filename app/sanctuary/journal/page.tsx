'use client';

import { useState, useMemo } from 'react';

type Stage = 'closed' | 'opening' | 'logo' | 'write';

export default function JournalPage() {
  const [stage, setStage] = useState<Stage>('closed');
  const [entries, setEntries] = useState<string[]>([]);
  const [currentIndex, setCurrentIndex] = useState<number | null>(null);
  const [draft, setDraft] = useState('');
  const [turnDirection, setTurnDirection] = useState<'left' | 'right' | null>(null);

  const today = useMemo(() => {
    return new Date().toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  }, []);

  const handleSave = () => {
    if (!draft.trim()) return;
    setEntries(prev => {
      const next = [...prev, draft.trim()];
      setCurrentIndex(next.length - 1);
      return next;
    });
    setDraft('');
  };

  const goToPage = (index: number, dir: 'left' | 'right') => {
    if (index < 0 || index >= entries.length) return;
    setTurnDirection(dir);
    setTimeout(() => {
      setCurrentIndex(index);
      setTurnDirection(null);
    }, 260);
  };

  const showNewPage = () => {
    setCurrentIndex(null);
    setDraft('');
  };

  return (
    <div className="relative h-screen w-screen overflow-hidden bg-black">
      {/* WATER BACKGROUND */}
      <video
        className="absolute inset-0 h-full w-full object-cover"
        src="/videos/deep-water.mp4"
        autoPlay
        loop
        muted
        playsInline
      />

      <div className="absolute inset-0 bg-black/40" />

      {/* MAIN CONTENT */}
      <div className="relative z-10 flex h-full w-full items-center justify-center">

        {/* CLOSED BOOK */}
        {stage === 'closed' && (
          <div
            onClick={() => setStage('opening')}
            className="cursor-pointer transition-transform duration-700 hover:scale-105"
          >
            <img
              src="/images/sea-within-book-closed.png"
              className="h-[340px] w-auto drop-shadow-[0_25px_40px_rgba(0,0,0,0.7)]"
            />
          </div>
        )}

        {/* OPENING ANIMATION */}
        {stage === 'opening' && (
          <div className="relative w-[700px] h-[450px] perspective-1000">
            {/* LEFT COVER */}
            <div
              className="absolute left-0 top-0 h-full w-1/2 origin-right bg-[#1a1a1a] rounded-l-lg shadow-2xl"
              style={{
                animation: 'coverOpen 1s forwards ease-out',
              }}
            />

            {/* PAGE FAN */}
            {[...Array(8)].map((_, i) => (
              <div
                key={i}
                className="absolute left-0 top-0 h-full w-1/2 origin-right bg-white rounded-l-lg shadow-xl"
                style={{
                  animation: `pageFlip ${0.6 + i * 0.08}s forwards ease-out`,
                  opacity: 0,
                }}
              />
            ))}

            {/* RIGHT COVER */}
            <div className="absolute right-0 top-0 h-full w-1/2 bg-[#1a1a1a] rounded-r-lg shadow-2xl" />

            {/* OPEN BOOK FRAME */}
            <img
              src="/images/book-open-frame.png"
              className="absolute inset-0 w-full h-full opacity-0"
              style={{
                animation: 'fadeIn 0.8s forwards ease-out',
                animationDelay: '1.2s',
              }}
              onAnimationEnd={() => setStage('logo')}
            />
          </div>
        )}

        {/* LOGO PAGE WITH FADE TO PARCHMENT */}
        {stage === 'logo' && (
          <div className="relative w-[900px] max-w-[95vw]">
            {/* OPEN BOOK FRAME */}
            <img
              src="/images/book-open-frame.png"
              className="w-full h-auto drop-shadow-[0_30px_60px_rgba(0,0,0,0.8)]"
            />

            {/* INNER PAGES */}
            <div className="absolute inset-[7%] flex">
              {/* LEFT PAGE: LOGO FADES TO PARCHMENT */}
              <div className="relative flex-1 mr-4">
                <img
                  src="/images/parchment-page.png"
                  className="absolute inset-0 w-full h-full object-cover rounded-md"
                />
                <img
                  src="/images/sea-within-logo-page.png"
                  className="absolute inset-0 w-full h-full object-cover rounded-md animate-logoFade"
                />
              </div>

              {/* RIGHT PAGE: TAP TO BEGIN WRITING */}
              <div className="relative flex-1 ml-4">
                <button
                  type="button"
                  onClick={() => setStage('write')}
                  className="relative h-full w-full"
                >
                  <img
                    src="/images/parchment-page.png"
                    className="absolute inset-0 w-full h-full object-cover rounded-md"
                  />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="rounded-full bg-black/40 px-4 py-2 text-sm text-amber-100">
                      Tap to begin writing
                    </span>
                  </div>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* WRITING PAGE WITH INK + PAGE TURNING */}
        {stage === 'write' && (
          <div className="relative w-[900px] max-w-[95vw]">
            <img
              src="/images/parchment-page.png"
              className="w-full h-auto rounded-lg shadow-[0_30px_60px_rgba(0,0,0,0.8)]"
            />

            <div className="absolute inset-0 px-10 py-8 flex flex-col">
              {/* DATE */}
              <div className="text-right text-[#4b2e1a] text-sm font-medium">
                {today}
              </div>

              {/* PAGE CONTENT AREA */}
              <div className="mt-4 flex-1 overflow-hidden">
                {currentIndex !== null && entries[currentIndex] ? (
                  <div
                    className={`h-full w-full ${turnDirection === 'left' ? 'page-turn-left' : ''} ${
                      turnDirection === 'right' ? 'page-turn-right' : ''
                    }`}
                  >
                    <div className="ink-writing whitespace-pre-wrap pr-2 h-full overflow-auto">
                      {entries[currentIndex]}
                    </div>
                  </div>
                ) : (
                  <textarea
                    className="mt-1 h-full w-full bg-transparent resize-none text-[#3b2414] text-lg leading-relaxed outline-none"
                    placeholder="Let the sea within you speak..."
                    value={draft}
                    onChange={e => setDraft(e.target.value)}
                  />
                )}
              </div>

              {/* CONTROLS */}
              <div className="mt-4 flex items-center justify-between gap-3">
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() =>
                      currentIndex !== null
                        ? goToPage(currentIndex - 1, 'left')
                        : goToPage(entries.length - 2, 'left')
                    }
                    disabled={entries.length <= 1 || currentIndex === 0 || currentIndex === null}
                    className="rounded-full bg-amber-200/70 px-4 py-1 text-xs font-semibold text-[#3b2414] shadow-sm shadow-black/20 disabled:opacity-40"
                  >
                    ◀ Previous page
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      currentIndex !== null
                        ? goToPage(currentIndex + 1, 'right')
                        : undefined
                    }
                    disabled={
                      currentIndex === null ||
                      currentIndex === entries.length - 1 ||
                      entries.length === 0
                    }
                    className="rounded-full bg-amber-200/70 px-4 py-1 text-xs font-semibold text-[#3b2414] shadow-sm shadow-black/20 disabled:opacity-40"
                  >
                    Next page ▶
                  </button>
                </div>

                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={showNewPage}
                    className="rounded-full bg-amber-100/80 px-4 py-1 text-xs font-semibold text-[#3b2414] shadow-sm shadow-black/20"
                  >
                    Write new page
                  </button>
                  <button
                    type="button"
                    onClick={handleSave}
                    className="rounded-full bg-amber-200/80 px-5 py-2 text-sm font-semibold text-[#3b2414] shadow-md shadow-black/30 hover:bg-amber-300"
                  >
                    Save to my book
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

      </div>

      {/* GLOBAL ANIMATIONS */}
      <style jsx global>{`
        .perspective-1000 {
          perspective: 1000px;
        }

        @keyframes coverOpen {
          from {
            transform: rotateY(0deg);
          }
          to {
            transform: rotateY(-180deg);
          }
        }

        @keyframes pageFlip {
          0% {
            transform: rotateY(0deg);
            opacity: 0;
          }
          40% {
            opacity: 1;
          }
          100% {
            transform: rotateY(-180deg);
            opacity: 0;
          }
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes logoFade {
          0% {
            opacity: 1;
          }
          100% {
            opacity: 0;
          }
        }

        .animate-logoFade {
          animation: logoFade 2.5s ease-out forwards;
          animation-delay: 0.6s;
        }

        @keyframes inkWrite {
          0% {
            opacity: 0;
            filter: blur(3px) brightness(0.7);
            transform: translateY(4px);
          }
          40% {
            opacity: 0.4;
            filter: blur(2px) brightness(0.85);
          }
          100% {
            opacity: 1;
            filter: blur(0px) brightness(1);
            transform: translateY(0);
          }
        }

        .ink-writing {
          font-family: 'Cormorant Garamond', serif;
          font-style: italic;
          color: #3b2414;
          letter-spacing: 0.4px;
          opacity: 0;
          animation: inkWrite 2.8s ease-out forwards;
          animation-delay: 0.4s;
          text-shadow:
            0 0 1px rgba(30, 18, 10, 0.5),
            0 1px 2px rgba(30, 18, 10, 0.35),
            0 2px 4px rgba(30, 18, 10, 0.25),
            0 0 12px rgba(30, 18, 10, 0.15);
          filter: brightness(0.92) contrast(1.08) saturate(0.9);
        }

        @keyframes pageTurnLeft {
          0% {
            transform-origin: left center;
            transform: rotateY(0deg);
            box-shadow: 0 0 0 rgba(0, 0, 0, 0);
          }
          100% {
            transform-origin: left center;
            transform: rotateY(-14deg);
            box-shadow: 0 18px 35px rgba(0, 0, 0, 0.45);
          }
        }

        @keyframes pageTurnRight {
          0% {
            transform-origin: right center;
            transform: rotateY(0deg);
            box-shadow: 0 0 0 rgba(0, 0, 0, 0);
          }
          100% {
            transform-origin: right center;
            transform: rotateY(14deg);
            box-shadow: 0 18px 35px rgba(0, 0, 0, 0.45);
          }
        }

        .page-turn-left {
          animation: pageTurnLeft 0.26s ease-out;
        }

        .page-turn-right {
          animation: pageTurnRight 0.26s ease-out;
        }
      `}</style>
    </div>
  );
}
