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

      {stage === 'closed' && (
        <>
          <video
            className="absolute inset-0 h-full w-full object-cover"
            src="/videos/deep-water.mp4"
            autoPlay
            loop
            muted
            playsInline
          />
          <div className="absolute inset-0 bg-black/40" />
        </>
      )}

      <div className="relative z-10 flex h-full w-full items-center justify-center">

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

    {/* REMOVE the dark overlay completely */}
    {/* <div className="absolute inset-0 bg-black/40" /> */}

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
                setTimeout(() => setStage('logo'), 1200);
              }}
            />
          </div>
        )}

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

        {stage === 'write' && (
          <div className="absolute inset-0 fade-in-book bg-black flex items-center justify-center">

            {/* Container that scales with the parchment */}
            <div className="relative w-full h-full flex items-center justify-center">

              {/* Parchment image */}
              <img
                src="/images/parchment-page.png"
                className="w-full h-full object-contain pointer-events-none select-none"
              />

              {/*
                Right-page writing area
                Ratios based on 1536x1024:
                - left ~ 58% of width
                - top ~ 18% of height
                - width ~ 30% of width
                - height ~ 60% of height
              */}
              <div
  className="absolute"
  style={{
    left: '58%',
    top: '18%',
    width: '20%',
    height: '60%',
    background: 'rgba(255, 0, 0, 0.15)', // TEMP: transparent red overlay so you can SEE it
    border: '2px solid rgba(255, 0, 0, 0.4)', // TEMP: outline to confirm placement
  }}
              >
                {/* Date in top-right of the rectangle */}
                <div
                  className="absolute text-[#4b2e1a] text-sm font-medium"
                  style={{
                    top: '-8%',
                    right: '0%',
                  }}
                >
                  {today}
                </div>

                {/* Entry or textarea */}
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

              {/* Controls */}
              <div className="absolute bottom-[10%] left-0 right-0 flex justify-center gap-6">
                <button
                  onClick={() =>
                    currentIndex !== null
                      ? goToPage(currentIndex - 1, 'left')
                      : goToPage(entries.length - 2, 'left')
                  }
                  disabled={entries.length <= 1 || currentIndex === 0 || currentIndex === null}
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
                  className="rounded-full bg-amber-200/70 px-4 py-1 text-xs font-semibold text-[#3b2414] disabled:opacity-40"
                >
                  Next ▶
                </button>
              </div>

            </div>
          </div>
        )}

      </div>

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
