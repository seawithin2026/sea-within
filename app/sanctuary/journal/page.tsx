'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { createClient } from '@/lib/supabase/client';

const supabase = createClient();

type Stage = 'video' | 'logo' | 'write';

type JournalEntry = {
  id: string;
  user_id: string;
  content: string;
  created_at: string;
};

const WriteStage = React.memo(function WriteStage({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="journal-write-stage absolute inset-0 fade-in-book bg-black flex items-center justify-center">
      {children}
    </div>
  );
});

export default function JournalPage() {
  const [stage, setStage] = useState<Stage>('video');
  const [hasTriggeredVideoEnd, setHasTriggeredVideoEnd] = useState(false);
  const [showShadow, setShowShadow] = useState(false);

  const [session, setSession] = useState<any>(null);
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [currentText, setCurrentText] = useState('');
  const [selectedEntryId, setSelectedEntryId] = useState<string | null>(null);

  const [showCalendar, setShowCalendar] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const [saving, setSaving] = useState(false);
  const [loadingUser, setLoadingUser] = useState(true);
  const [isEditing, setIsEditing] = useState(false);

  const todayPretty = useMemo(
    () =>
      new Date().toLocaleDateString(undefined, {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      }),
    []
  );

  useEffect(() => {
    const loadUser = async () => {
      const { data } = await supabase.auth.getUser();
      if (data?.user) {
        setSession({ user: data.user });
      }
      setLoadingUser(false);
    };

    loadUser();
  }, []);

  useEffect(() => {
    if (!session?.user?.id) return;

    const loadEntries = async () => {
      const { data, error } = await supabase
        .from('journal_entries')
        .select('id,user_id,content,created_at')
        .eq('user_id', session.user.id)
        .order('created_at', { ascending: true });

      if (!error && data) {
        setEntries(data);
        if (data.length > 0) {
          const last = data[data.length - 1];
          setSelectedEntryId(last.id);
          setCurrentText('');
        }
      }
    };

    loadEntries();
  }, [session]);

  const handleSave = async () => {
    if (!session?.user?.id) return;
    if (!currentText.trim()) return;

    setSaving(true);

    if (isEditing && selectedEntryId) {
      const { error } = await supabase
        .from('journal_entries')
        .update({ content: currentText })
        .eq('id', selectedEntryId);

      if (!error) {
        setEntries(prev =>
          prev.map(e =>
            e.id === selectedEntryId ? { ...e, content: currentText } : e
          )
        );
        setIsEditing(false);
        setCurrentText('');
      }

      setSaving(false);
      return;
    }

    const { data, error } = await supabase
      .from('journal_entries')
      .insert({
        user_id: session.user.id,
        content: currentText,
      })
      .select()
      .single();

    if (!error && data) {
      setEntries(prev => [...prev, data]);
      setSelectedEntryId(data.id);
      setCurrentText('');
      setIsEditing(false);
    }

    setSaving(false);
  };

  const deleteEntry = async () => {
    if (!selectedEntryId) return;

    await supabase.from('journal_entries').delete().eq('id', selectedEntryId);

    setEntries(prev => {
      const idx = prev.findIndex(e => e.id === selectedEntryId);
      const filtered = prev.filter(e => e.id !== selectedEntryId);

      if (filtered.length > 0 && idx !== -1) {
        const newIndex = Math.max(0, idx - 1);
        const newEntry = filtered[newIndex];
        setSelectedEntryId(newEntry.id);
        setCurrentText('');
      } else {
        setSelectedEntryId(null);
        setCurrentText('');
      }

      return filtered;
    });

    setIsEditing(false);
    setShowDeleteConfirm(false);
  };

  if (loadingUser) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-black" />
    );
  }

  if (!session) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#f5ecdd]">
        <p className="text-[#3b2414] font-family['Cormorant Garamond']">
          Please sign in to access your journal.
        </p>
      </div>
    );
  }

  const selectedEntry = entries.find(e => e.id === selectedEntryId) || null;

  return (
    <div className="relative h-screen w-screen overflow-hidden bg-black journal-fixed-wrapper">
      {/* VIDEO STAGE */}
      {stage === 'video' && (
        <div className="absolute inset-0 flex items-center justify-center bg-black relative journal-fixed-canvas">
          <video
            src="/videos/book-opening.mp4"
            autoPlay
            playsInline
            className="w-full h-full object-cover"
            onTimeUpdate={e => {
              const video = e.target as HTMLVideoElement;
              if (!video.duration || Number.isNaN(video.duration)) return;

              const timeLeft = video.duration - video.currentTime;

              if (timeLeft < 0.08 && !showShadow) {
                setShowShadow(true);
              }

              if (!hasTriggeredVideoEnd && timeLeft < 0.25) {
                setHasTriggeredVideoEnd(true);
                setTimeout(() => setStage('logo'), 450);
              }
            }}
            onEnded={() => {
              if (!hasTriggeredVideoEnd) {
                setStage('logo');
              }
            }}
          />

          <div
            className={`absolute inset-0 bg-black transition-opacity duration-[900ms] pointer-events-none ${
              showShadow ? 'opacity-40' : 'opacity-0'
            }`}
          />
        </div>
      )}

      {/* LOGO STAGE */}
      {stage === 'logo' && (
        <div className="absolute inset-0 fade-in-book bg-black flex items-center justify-center journal-fixed-canvas">
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
        <WriteStage>
          <div className="relative w-full h-full flex items-center justify-center journal-fixed-canvas journal-inner">
            {/* Parchment */}
            <img
              src="/images/parchment-page.png"
              className="journal-parchment pointer-events-none select-none"
            />

            {/* Writing area */}
            <div
              className="absolute writing-area"
              style={{
                left: '53%',
                top: '18%',
                width: '20%',
                height: '60%',
              }}
            >
              <div
                className="absolute text-[#4b2e1a] text-sm font-medium"
                style={{ top: '-8%', right: '0%' }}
              >
                {selectedEntry
                  ? new Date(selectedEntry.created_at).toLocaleDateString(
                      undefined,
                      {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      }
                    )
                  : todayPretty}
              </div>

              {selectedEntry && !isEditing ? (
                <div className="w-full h-full overflow-auto text-[#3b2414] text-center">
                  <div className="ink-writing whitespace-pre-wrap text-lg leading-relaxed text-fade-in">
                    {selectedEntry.content}
                  </div>
                </div>
              ) : (
                <textarea
                  className="w-full h-full bg-transparent resize-none text-[#3b2414] text-lg leading-relaxed outline-none text-center placeholder-[#3b2414]/60 text-fade-in"
                  placeholder="Let the sea within you speak..."
                  value={currentText}
                  onChange={e => setCurrentText(e.target.value)}
                />
              )}
            </div>

            {/* Calendar panel */}
            {showCalendar && (
              <div className="absolute top-[10%] right-[10%] bg-[#ccb072] shadow-xl rounded-xl p-4 w-72 max-h-[70%] overflow-auto border border-[#d8c9a3] calendar-panel">
                <h2 className="text-[#3b2414] font-bold mb-3">Your Entries</h2>

                {entries.map(entry => (
                  <button
                    key={entry.id}
                    onClick={() => {
                      setSelectedEntryId(entry.id);
                      setCurrentText('');
                      setIsEditing(false);
                      setShowCalendar(false);
                    }}
                    className="block w-full text-left text-sm text-[#3b2414] hover:underline"
                  >
                    {new Date(entry.created_at).toLocaleDateString(undefined, {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </button>
                ))}

                <button
                  onClick={() => setShowCalendar(false)}
                  className="sea-btn w-full mt-2"
                >
                  Close
                </button>
              </div>
            )}

            {/* Delete confirm */}
            {showDeleteConfirm && (
              <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                <div className="bg-[#fdf7e6] border border-[#d8c9a3] rounded-xl p-6 shadow-xl w-80 text-center">
                  <p className="text-[#3b2414] mb-4">
                    Are you sure you want to delete this entry?
                  </p>

                  <div className="flex justify-center gap-4">
                    <button
                      onClick={deleteEntry}
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

            {/* Controls */}
            <div className="absolute bottom-[10%] left-0 right-0 flex flex-wrap justify-center gap-4 journal-controls">
              {entries.length > 0 && (
                <button
                  onClick={() => {
                    if (entries.length === 0) return;

                    if (!selectedEntryId) {
                      const last = entries[entries.length - 1];
                      setSelectedEntryId(last.id);
                      setCurrentText('');
                      setIsEditing(false);
                      return;
                    }

                    const idx = entries.findIndex(
                      e => e.id === selectedEntryId
                    );
                    if (idx > 0) {
                      const prev = entries[idx - 1];
                      setSelectedEntryId(prev.id);
                      setCurrentText('');
                      setIsEditing(false);
                    }
                  }}
                  className="sea-btn"
                >
                  ◀ Previous
                </button>
              )}

              <button
                onClick={() => {
                  setSelectedEntryId(null);
                  setCurrentText('');
                  setIsEditing(false);
                }}
                className="sea-btn"
              >
                New Page
              </button>

              {selectedEntry && !isEditing && (
                <button
                  onClick={() => {
                    setIsEditing(true);
                    setCurrentText(selectedEntry.content);
                  }}
                  className="sea-btn"
                >
                  Edit
                </button>
              )}

              {isEditing && (
                <button
                  onClick={() => {
                    setIsEditing(false);
                    setCurrentText('');
                  }}
                  className="sea-btn"
                >
                  Cancel Edit
                </button>
              )}

              <button
                onClick={handleSave}
                className="sea-btn"
                disabled={saving}
              >
                {saving ? 'Saving...' : 'Save'}
              </button>

              {selectedEntry && (
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
                onClick={() => {
                  if (!selectedEntryId) return;
                  const idx = entries.findIndex(
                    e => e.id === selectedEntryId
                  );
                  if (idx < entries.length - 1 && idx !== -1) {
                    const next = entries[idx + 1];
                    setSelectedEntryId(next.id);
                    setCurrentText('');
                    setIsEditing(false);
                  }
                }}
                className="sea-btn"
              >
                Next ▶
              </button>
            </div>
          </div>
        </WriteStage>
      )}

      <style jsx global>{`
        /* DESKTOP LOCK */
        .journal-fixed-wrapper,
        .journal-fixed-canvas {
          min-width: 900px !important;
        }

        /* BUTTONS */
        .sea-btn {
          background: linear-gradient(135deg, #e9a107 0%, #e9a107 100%);
          color: #3b2414;
          padding: 8px 18px;
          border-radius: 9999px;
          font-weight: 600;
          font-size: 0.85rem;
          box-shadow: 0 4px 10px rgba(0, 0, 0, 0.25);
          transition: all 0.3s ease;
          border: none;
        }

        .sea-btn:hover {
          transform: translateY(-2px) scale(1.05);
          box-shadow: 0 6px 14px rgba(0, 0, 0, 0.35);
          background: linear-gradient(135deg, #e9a107 0%, #e9a107 100%);
        }

        .sea-btn:active {
          transform: scale(0.97);
        }

        /* BOOK FADE-IN */
        .fade-in-book {
          animation: fadeInBook 1.2s ease-out forwards;
        }

        @keyframes fadeInBook {
          0% {
            opacity: 0;
            transform: translateY(10px) scale(0.98);
            filter: blur(4px);
          }
          60% {
            opacity: 0.6;
            transform: translateY(4px) scale(0.995);
            filter: blur(1px);
          }
          100% {
            opacity: 1;
            transform: translateY(0) scale(1);
            filter: blur(0);
          }
        }

        /* SCROLLBAR */
        ::-webkit-scrollbar {
          width: 10px;
        }

        ::-webkit-scrollbar-track {
          background: #a47a3b;
        }

        ::-webkit-scrollbar-thumb {
          background: #3b2414;
          border-radius: 10px;
          border: 2px solid #a47a3b;
        }

        ::-webkit-scrollbar-thumb:hover {
          background: #2a180d;
        }

        /* TEXT FADE-IN */
        .text-fade-in {
          opacity: 0;
          animation: textFadeIn 0.8s ease-out 0.2s forwards;
        }

        @keyframes textFadeIn {
          from {
            opacity: 0;
            transform: translateY(2px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        /* MOBILE-ONLY OVERRIDES */
        @media (max-width: 640px) {
          .journal-fixed-wrapper {
            min-width: 0 !important;
          }

          .journal-fixed-canvas {
            min-width: 0 !important;
          }

          .journal-write-stage {
            position: relative !important;
            inset: unset !important;
            display: block !important;
            background: transparent !important;
            height: auto !important;
          }

          .journal-inner {
            display: block !important;
            height: auto !important;
            min-height: 100vh !important;
            padding-top: 12px;
            padding-bottom: 20px;
            align-items: unset !important;
            justify-content: unset !important;
          }

          .journal-parchment {
            width: auto !important;
            height: calc(100vh - 60px) !important;
            max-height: calc(100vh - 60px) !important;
            object-fit: contain !important;
            margin-left: auto !important;
            margin-right: auto !important;
            transform: translateX(-12vw) !important;
            display: block !important;
          }

          .writing-area {
            /* keep absolute; you’ll tweak later */
          }

          .journal-controls {
            position: static !important;
            margin-top: 20px !important;
            display: flex !important;
            justify-content: center !important;
            flex-wrap: wrap !important;
          }

          .calendar-panel {
            top: 8% !important;
            right: 5% !important;
            width: 80% !important;
            max-height: 60% !important;
          }

          .sea-btn {
            padding: 4px 10px !important;
            font-size: 0.68rem !important;
            min-width: 85px !important;
            border-radius: 9999px !important;
            box-shadow: 0 2px 6px rgba(0, 0, 0, 0.22) !important;
          }
        }
      `}</style>
    </div>
  );
}
