'use client';

import { useState, useMemo } from 'react';

type Stage = 'closed' | 'video' | 'logo' | 'write';

type Entry = {
  text: string;
  date: string;
};

export default function JournalPage() {
  const [stage, setStage] = useState<Stage>('closed');
  const [entries, setEntries] = useState<Entry[]>([]);
  const [currentIndex, setCurrentIndex] = useState<number | null>(null);
  const [draft, setDraft] = useState('');
  const [turnDirection] = useState<'left' | 'right' | null>(null);
  const [fadeVideo, setFadeVideo] = useState(false);
  const [showCalendar, setShowCalendar] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const today = useMemo(() => {
    return new Date().toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  }, []);

  const currentDate =
    currentIndex !== null && entries[currentIndex]
      ? entries[currentIndex].date
      : today;

  /* -------------------------------------------------------
     SAVE — always switch to the saved page immediately
  ------------------------------------------------------- */
  const handleSave = () => {
    if (!draft.trim()) return;

    const newEntry: Entry = {
      text: draft.trim(),
      date: today,
    };

    setEntries(prev => {
      const next = [...prev, newEntry];
      setCurrentIndex(next.length - 1);
      return next;
    });

    setDraft('');
  };

  /* -------------------------------------------------------
     NEW PAGE — blank page but navigation still works
  ------------------------------------------------------- */
  const showNewPage = () => {
    setCurrentIndex(null);
    setDraft('');
  };

  /* -------------------------------------------------------
     DELETE ENTRY — safe, goes to previous or blank
  ------------------------------------------------------- */
  const deleteEntry = (index: number) => {
    setEntries(prev => {
      const next = prev.filter((_, i) => i !== index);

      if (next.length === 0) {
        setCurrentIndex(null);
        return next;
      }

      const newIndex = Math.max(0, index - 1);
      setCurrentIndex(newIndex);

      return next;
    });
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

  /* -------------------------------------------------------
     GROUP ENTRIES BY MONTH/YEAR FOR CALENDAR
  ------------------------------------------------------- */
  const groupedEntries = entries.reduce(
    (acc, entry, index) => {
      const month = new Date(entry.date).toLocaleString('default', {
        month: 'long',
        year: 'numeric',
      });
      if (!acc[month]) acc[month] = [];
      acc[month].push({ ...entry, index });
      return acc;
    },
    {} as Record<string, { text: string; date: string; index: number }[]>
  );

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
              {/* DATE (entry date or today) */}
              <div
                className="absolute text-[#4b2e1a] text-sm font-medium"
                style={{
                  top: '-8%',
                  right: '0%',
                }}
              >
                {currentDate}
              </div>

              {/* ENTRY OR TEXTAREA */}
              {currentIndex !== null && entries[currentIndex] ? (
                <div
                  className={`w-full h-full overflow-auto text-[#3b2414] text-center ${
                    turnDirection === 'left' ? 'page-turn-left' : ''
                  } ${turnDirection === 'right' ? 'page-turn-right' : ''}`}
                >
                  <div className="ink-writing whitespace-pre-wrap text-lg leading-relaxed">
                    {entries[currentIndex].text}
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

            {/* CALENDAR PANEL */}
            {showCalendar && (
              <div className="absolute top-[10%] right-[10%] bg-[#fdf7e6] shadow-xl rounded-xl p-4 w-72 max-h-[70%] overflow-auto border border-[#d8c9a3]">
                <h2 className="text-[#3b2414] font-bold mb-3">Your Entries</h2>

                {Object.entries(groupedEntries).map(([month, items]) => (
                  <div key={month} className="mb-4">
                    <h3 className="font-semibold text-[#3b2414] mb-1">{month}</h3>
                    {items.map(item => (
                      <button
                        key={item.index}
                        onClick={() => {
                          setCurrentIndex(item.index);
                          setShowCalendar(false);
                        }}
                        className="block w-full text-left text-sm text-[#3b2414] hover:underline"
                      >
                        {item.date}
                      </button>
                    ))}
                  </div>
                ))}

                <button
                  onClick={() => setShowCalendar(false)}
                  className="sea-btn w-full mt-2"
                >
                  Close
                </button>
              </div>
            )}

            {/* DELETE CONFIRM MODAL */}
            {showDeleteConfirm && currentIndex !== null && (
              <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                <div className="bg-[#fdf7e6] border border-[#d8c9a3] rounded-xl p-6 shadow-xl w-80 text-center">
                  <p className="text-[#3b2414] mb-4">
                    Are you sure you want to delete this entry?
                  </p>

                  <div className="flex justify-center gap-4">
                    <button
                      onClick={() => {
                        deleteEntry(currentIndex);
                        setShowDeleteConfirm(false);
                      }}
                      className="sea-btn bg-red-300/80 hover:bg-red-400/80"
                    >
                      Delete
                    </button>

                    <button
                      onClick={() => setShowDeleteConfirm(false)}
                      className="sea-btn"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* CONTROLS */}
            <div className="absolute bottom-[10%] left-0 right-0 flex flex-wrap justify-center gap-4">

              <button
                onClick={goToPrevious}
                disabled={entries.length === 0}
                className={`sea-btn ${entries.length === 0 ? 'disabled' : ''}`}
              >
                ◀ Previous
              </button>

              <button
                onClick={showNewPage}
                className="sea-btn"
              >
                New Page
              </button>

              <button
                onClick={handleSave}
                className="sea-btn"
              >
                Save
              </button>

              {currentIndex !== null && (
                <button
                  onClick={() => setShowDeleteConfirm(true)}
                  className="sea-btn bg-red-200/80 hover:bg-red-300/90"
                >
                  Delete
                </button>
              )}

              <button
                onClick={() => setShowCalendar(true)}
                className="sea-btn"
              >
                📅 Calendar
              </button>

              <button
                onClick={goToNext}
                disabled={entries.length === 0}
                className={`sea-btn ${entries.length === 0 ? 'disabled' : ''}`}
              >
                Next ▶
              </button>

            </div>

          </div>
        </div>
      )}

      {/* GLOBAL ANIMATIONS + BUTTON STYLE */}
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

        .sea-btn {
          background: linear-gradient(135deg, #f7e7c1 0%, #e6c48a 100%);
          color: #3b2414;
          padding: 8px 18px;
          border-radius: 9999px;
          font-weight: 600;
          font-size: 0.85rem;
          box-shadow: 0 4px 10px rgba(0,0,0,0.25);
          transition: all 0.3s ease;
          border: none;
        }
        .sea-btn:hover {
          transform: translateY(-2px) scale(1.05);
          box-shadow: 0 6px 14px rgba(0,0,0,0.35);
          background: linear-gradient(135deg, #fff2d6 0%, #f0d9a8 100%);
        }
        .sea-btn:active {
          transform: scale(0.97);
        }
        .sea-btn.disabled {
          opacity: 0.4;
          pointer-events: none;
        }
      `}</style>
    </div>
  );
}
