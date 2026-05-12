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
            onClick={() => setStage('video')}
            className="cursor-pointer transition-transform duration-700 hover:scale-105"
          >
            <img
              src="/images/sea-within-book-closed.png"
              className="h-[340px] w-auto drop-shadow-[0_25px_40px_rgba(0,0,0,0.7)]"
            />
          </div>
        )}

        {/* VIDEO OPENING WITH FADE OUT */}
        {stage === 'video' && (
          <div className="relative w-[900px] max-w-[95vw]">
            <video
              src="/videos/book-opening.mp4"
              autoPlay
              playsInline
              className={`w-full h-auto rounded-lg shadow-[0_30px_60px_rgba(0,0,0,0.8)] ${
                fadeVideo ? 'fade-out-video' : ''
              }`}
              onEnded={() => {
                setFadeVideo(true);
                setTimeout(() => setStage('logo'), 1200);
              }}
            />
          </div>
        )}

        {/* LOGO PAGE WITH FADE TO PARCHMENT */}
        {stage === 'logo' && (
          <div className="relative w-[900px] max-w-[95vw] fade-in-book">
            <img
              src="/images/book-open-frame.png"
              className="w-full h-auto drop-shadow-[0_30px_60px_rgba(0,0,0,0.8)]"
            />

            <div className="absolute inset-[7%] flex">
              {/* LEFT PAGE */}
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

              {/* RIGHT PAGE */}
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

        {/* WRITING PAGE */}
        {stage === 'write' && (
          <div className="relative w-[900px] max-w-[95vw] fade-in-book">
            <img
              src="/images/book-open-frame.png"
              className="w-full h-auto drop-shadow-[0_30px_60px_rgba(0,0,0,0.8)]"
            />

            <div className="absolute inset-[7%] flex">
              {/* LEFT PAGE */}
              <div className="relative flex-1 mr-4">
                <img
                  src="/images/parchment-page.png"
                  className="absolute inset-0 w-full h-full object-cover rounded-md"
                />
              </div>

              {/* RIGHT PAGE */}
              <div className="relative flex-1 ml-4 px-10 py-8">
                {/* DATE */}
                <div className="absolute top-6 right-10 text-[#4b2e1a] text-sm font-medium">
                  {today}
                </div>

                {/* ENTRY OR TEXTAREA */}
                {currentIndex !== null && entries[currentIndex] ? (
                  <div
                    className={`absolute top-14 left-10 w-[80%] h-[70%] overflow-auto ${
                      turnDirection === 'left' ? 'page-turn-left' : ''
                    } ${turnDirection === 'right' ? 'page-turn-right' : ''}`}
                  >
                    <div className="ink-writing whitespace-pre-wrap">
                      {entries[currentIndex]}
                    </div>
                  </div>
                ) : (
                  <textarea
                    className="absolute top-14 left-10 w-[80%] h-[70%] bg-transparent resize-none text-[#3b2414] text-lg leading-relaxed outline-none"
                    placeholder="Let the sea within you speak..."
                    value={draft}
                    onChange={e => setDraft(e.target.value)}
                  />
                )}

                {/* CONTROLS */}
                <div className="absolute bottom-6 left-10 right-10 flex justify-between">
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
          </div>
        )}

      </div>

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

        @keyframes logoFade {
          0% { opacity: 1; }
          100% { opacity: 0; }
        }
        .animate-logoFade {
          animation: logoFade 2.5s ease-out forwards;
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
