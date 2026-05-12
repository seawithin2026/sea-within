'use client';

import { useState, useMemo } from 'react';

type Stage = 'closed' | 'video' | 'logo' | 'write';

export default function JournalPage() {
  const [stage, setStage] = useState<Stage>('closed');
  const [entries, setEntries] = useState<string[]>([]);
  const [currentIndex, setCurrentIndex] = useState<number | null>(null);
  const [draft, setDraft] = useState('');
  const [turnDirection, setTurnDirection] = useState<'left' | 'right' | null>(null);
  const [fadeVideo, setFadeVideo] = useState(false);

  const today = useMemo(() => {
    return new Date().toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  }, []);

  /* -------------------------------------------------------
     SAVE — always switch to the saved page immediately
  ------------------------------------------------------- */
  const handleSave = () => {
    if (!draft.trim()) return;

    setEntries(prev => {
      const next = [...prev, draft.trim()];
      setCurrentIndex(next.length - 1); // show saved page instantly
      return next;
    });

    setDraft(''); // clear textarea AFTER switching
  };

  /* -------------------------------------------------------
     NEW PAGE — blank page but navigation still works
  ------------------------------------------------------- */
  const showNewPage = () => {
    setCurrentIndex(null);
    setDraft('');
  };

  /* -------------------------------------------------------
     SAFE NAVIGATION — always back‑traceable
  ------------------------------------------------------- */
  const goToPrevious = () => {
    if (entries.length === 0) return;

    if (currentIndex === null) {
      setCurrentIndex(entries.length - 1);
    } else if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const goToNext = () => {
    if (entries.length === 0) return;

    if (currentIndex !== null && currentIndex < entries.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  return (
    <div className="relative h-screen w-screen overflow-hidden bg-black">

      {/* CLOSED STAGE */}
      {stage === 'closed' && (
        <>
          <video
            className="absolute inset-0 h-full w-full object-cover"
            src="/videos/deep-water.mp4"
            autoPlay
            loop
            muted
            playsInline
            preload="auto"
          />

          {/* Book appears immediately with the wave */}
          <div
            onClick={() => setStage('video')}
            className="absolute inset-0 flex items-center justify-center cursor-pointer transition-transform duration-700 hover:scale-105"
          >
            <img
              src="/images/sea-within-book-closed.png"
              className="h-[340px] w-auto drop-shadow-[0_25px_40px_rgba(0,0,0,0.7)]"
            />
          </div>
        </>
      )}

      {/* VIDEO STAGE */}
      {stage === 'video' && (
        <div className="absolute inset-0 flex items-center justify-center bg-black">
          <video
            src="/videos/book-opening.mp4"
            autoPlay
            playsInline
            className={`w-full h-full object-cover ${
              fadeVideo ? 'fade-out-video' : ''
            }`}
            onEnded={() => {
              setFadeVideo(true);
              setTimeout(() => setStage('logo'), 300);
            }}
          />
        </div>
      )}

      {/* LOGO STAGE */}
      {stage === 'logo' && (
        <div className="absolute inset-0 fade-in-book bg-black flex items-center justify-center">
          <img
            src="/images/sea-within-logo-page.png"
            className="w-full h-full object-contain mx-auto"
          />

          <button
            type="button"
            onClick={() => setStage('write')}
            className="absolute inset-0 flex items-center justify-center"
          >
            <span className="rounded-full bg-black/40 px-4 py-2 text-sm text-amber-100">
              Tap to begin writing
            </span>
          </button>
        </div>
      )}

      {/* WRITE STAGE */}
      {stage === 'write' && (
        <div className="absolute inset-0 fade-in-book bg-black flex items-center justify-center">

          <div className="relative w-full h-full flex items-center justify-center">

            {/* Parchment */}
            <img
              src="/images/parchment-page.png"
              className="w-full h-full object-contain pointer-events-none select-none"
            />

            {/* WRITING AREA */}
            <div
              className="absolute"
              style={{
                left: '53%',
                top: '18%',
                width: '20%',
                height: '60%',
              }}
            >
              {/* DATE */}
              <div
                className="absolute text-[#4b2e1a] text-sm font-medium"
                style={{
                  top: '-8%',
                  right: '0%',
                }}
              >
                {today}
              </div>

              {/* ENTRY OR TEXTAREA */}
              {currentIndex !== null && entries[currentIndex] ? (
                <div
                  className={`w-full h-full overflow-auto text-[#3b2414] text-center ${
                    turnDirection === 'left' ? 'page-turn-left' : ''
                  } ${turnDirection === 'right' ? 'page-turn-right' : ''}`}
                >
                  <div className="ink-writing whitespace-pre-wrap text-lg leading-relaxed">
                    {entries[currentIndex]}
                  </div>
                </div>
              ) : (
                <textarea
                  className="w-full h-full bg-transparent resize-none text-[#3b2414] text-lg leading-relaxed outline-none text-center"
                  placeholder="Let the sea within you speak..."
                  value={draft}
                  onChange={e => setDraft(e.target.value)}
                />
              )}
            </div>

            {/* CONTROLS */}
            <div className="absolute bottom-[10%] left-0 right-0 flex justify-center gap-6">

              <button
                onClick={goToPrevious}
                disabled={entries.length === 0}
                className="rounded-full bg-amber-200/70 px-4 py-1 text-xs font-semibold text-[#3b2414] disabled:opacity-40"
              >
                ◀ Previous
              </button>

              <button
                onClick={showNewPage}
                className="rounded-full bg-amber-100/80 px-4 py-1 text-xs font-semibold text-[#3b2414]"
              >
                New Page
              </button>

              <button
                onClick={handleSave}
                className="rounded-full bg-amber-200/80 px-5 py-2 text-sm font-semibold text-[#3b2414]"
              >
                Save
              </button>

              <button
                onClick={goToNext}
                disabled={entries.length === 0}
                className="rounded-full bg-amber-200/70 px-4 py-1 text-xs font-semibold text-[#3b2414] disabled:opacity-40"
              >
                Next ▶
              </button>

            </div>

          </div>
        </div>
      )}

      {/* GLOBAL ANIMATIONS */}
      <style jsx global>{`
        @keyframes fadeOutVideo {
          0% { opacity: 1; }
          100% { opacity: 0; }
        }
        .fade-out-video {
          animation: fadeOutVideo 1.2s ease-out forwards;
        }

        @keyframes fadeInBook {
          0% { opacity: 0; transform: scale(0.97); }
          100% { opacity: 1; transform: scale(1); }
        }
        .fade-in-book {
          animation: fadeInBook 1.2s ease-out forwards;
        }

        @keyframes inkWrite {
          0% { opacity: 0; filter: blur(3px); transform: translateY(4px); }
          100% { opacity: 1; filter: blur(0); transform: translateY(0); }
        }
        .ink-writing {
          animation: inkWrite 2.4s ease-out forwards;
        }

        @keyframes pageTurnLeft {
          0% { transform-origin: left center; transform: rotateY(0deg); }
          100% { transform-origin: left center; transform: rotateY(-14deg); }
        }
        @keyframes pageTurnRight {
          0% { transform-origin: right center; transform: rotateY(0deg); }
          100% { transform-origin: right center; transform: rotateY(14deg); }
        }
        .page-turn-left { animation: pageTurnLeft 0.26s ease-out; }
        .page-turn-right { animation: pageTurnRight 0.26s ease-out; }
      `}</style>
    </div>
  );
}
