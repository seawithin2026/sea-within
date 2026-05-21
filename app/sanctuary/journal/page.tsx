'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { createClient } from '@/lib/supabase/client';

const supabase = createClient();

type Stage = 'video' | 'logo' | 'write';

interface JournalEntry {
  id: string;
  user_id: string;
  content: string;
  created_at: string;
}
const WriteStage = React.memo(({ children }: { children: React.ReactNode }) => {
  return (
    <div className="journal-write-stage fade-in-book bg-black flex items-center justify-center w-full min-h-[100dvh]">
      {children}
    </div>
  );
});


export default function JournalPage() {
  const [stage, setStage] = useState<Stage>('video');
  const [videoTriggered, setVideoTriggered] = useState(false);
  const [shadowVisible, setShadowVisible] = useState(false);

  const [session, setSession] = useState<any>(null);
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [currentText, setCurrentText] = useState('');
  const [selectedEntryId, setSelectedEntryId] = useState<string | null>(null);

  const [calendarOpen, setCalendarOpen] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);

  const [saving, setSaving] = useState(false);
  const [loadingUser, setLoadingUser] = useState(true);
  const [isEditing, setIsEditing] = useState(false);

  // Pretty date for new entries
  const todayPretty = useMemo(() => {
    return new Date().toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  }, []);

  // Load user session
  useEffect(() => {
    const load = async () => {
      const { data } = await supabase.auth.getUser();
      if (data?.user) setSession({ user: data.user });
      setLoadingUser(false);
    };
    load();
  }, []);

  // Load journal entries for the authenticated user
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

  // Save or update entry
  const handleSave = async () => {
    if (!session?.user?.id) return;
    if (!currentText.trim()) return;

    setSaving(true);

    // Update existing entry
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

    // Create new entry
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

  // Delete entry
  const deleteEntry = async () => {
    if (!selectedEntryId) return;

    await supabase.from('journal_entries').delete().eq('id', selectedEntryId);

    setEntries(prev => {
      const index = prev.findIndex(e => e.id === selectedEntryId);
      const remaining = prev.filter(e => e.id !== selectedEntryId);

      if (remaining.length > 0 && index !== -1) {
        const newIndex = Math.max(0, index - 1);
        const nextEntry = remaining[newIndex];
        setSelectedEntryId(nextEntry.id);
        setCurrentText('');
      } else {
        setSelectedEntryId(null);
        setCurrentText('');
      }

      return remaining;
    });

    setIsEditing(false);
    setConfirmDelete(false);
  };

  // Loading screen
  if (loadingUser) {
    return <div className="flex items-center justify-center min-h-screen bg-black" />;
  }

  // Sign-in required
  if (!session) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#f5ecdd]">
        <p className="text-[#3b2414]">Please sign in to access your journal.</p>
      </div>
    );
  }

  const selectedEntry =
    entries.find(e => e.id === selectedEntryId) || null;

  return (
    <div className="journal-root relative w-screen overflow-hidden bg-black">
      {/* VIDEO STAGE */}
      {stage === 'video' && (
        <div className="absolute inset-0 flex items-center justify-center bg-black relative">
          <video
            src="/videos/book-opening.mp4"
            autoPlay
            playsInline
            className="w-full h-full object-cover"
            onTimeUpdate={e => {
              const video = e.target as HTMLVideoElement;
              if (!video.duration || Number.isNaN(video.duration)) return;

              const timeLeft = video.duration - video.currentTime;

              if (timeLeft < 0.08 && !shadowVisible) {
                setShadowVisible(true);
              }

              if (!videoTriggered && timeLeft < 0.25) {
                setVideoTriggered(true);
                setTimeout(() => setStage('logo'), 450);
              }
            }}
            onEnded={() => {
              if (!videoTriggered) setStage('logo');
            }}
          />

          {/* Shadow overlay */}
          <div
            className={`absolute inset-0 bg-black transition-opacity duration-[900ms] pointer-events-none ${
              shadowVisible ? 'opacity-40' : 'opacity-0'
            }`}
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
        <WriteStage>
          <div className="journal-center-container relative w-full flex items-center justify-center">

            {/* Parchment */}
            <img
              src="/images/parchment-page.png"
              className="journal-parchment pointer-events-none select-none"
            />

            {/* Writing area */}
           <div className="writing-area-desktop absolute">

              {/* Date */}
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

              {/* Entry viewer or editor */}
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
            {calendarOpen && (
              <div className="absolute top-[10%] right-[10%] bg-[#ccb072] shadow-xl rounded-xl p-4 w-72 max-h-[70%] overflow-auto border border-[#d8c9a3]">
                <h2 className="text-[#3b2414] font-bold mb-3">Your Entries</h2>

                {entries.map(entry => (
                  <button
                    key={entry.id}
                    onClick={() => {
                      setSelectedEntryId(entry.id);
                      setCurrentText('');
                      setIsEditing(false);
                      setCalendarOpen(false);
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
                  onClick={() => setCalendarOpen(false)}
                  className="sea-btn w-full mt-2"
                >
                  Close
                </button>
              </div>
            )}

            {/* Delete confirmation */}
            {confirmDelete && (
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
                      onClick={() => setConfirmDelete(false)}
                      className="sea-btn"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Controls */}
            <div className="absolute bottom-[10%] left-0 right-0 flex flex-wrap justify-center gap-4">
              {/* Previous */}
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

                  const index = entries.findIndex(
                    e => e.id === selectedEntryId
                  );
                  if (index > 0) {
                    const prev = entries[index - 1];
                    setSelectedEntryId(prev.id);
                    setCurrentText('');
                    setIsEditing(false);
                  }
                }}
                className="sea-btn"
              >
                ◀ Previous
              </button>

              {/* New Page */}
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

              {/* Edit */}
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

              {/* Cancel Edit */}
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

              {/* Save */}
              <button
                onClick={handleSave}
                className="sea-btn"
                disabled={saving}
              >
                {saving ? 'Saving...' : 'Save'}
              </button>

              {/* Delete */}
              {selectedEntry && (
                <button
                  onClick={() => setConfirmDelete(true)}
                  className="sea-btn bg-red-200/80 hover:bg-red-300/90"
                >
                  Delete
                </button>
              )}

              {/* Calendar */}
              <button
                onClick={() => setCalendarOpen(true)}
                className="sea-btn"
              >
                📅 Calendar
              </button>

              {/* Next */}
              <button
                onClick={() => {
                  if (!selectedEntryId) return;
                  const index = entries.findIndex(
                    e => e.id === selectedEntryId
                  );
                  if (index < entries.length - 1 && index !== -1) {
                    const next = entries[index + 1];
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

      {/* Global styles */}
      <style jsx global>{`
        /* Desktop protection */
        .writing-area-desktop {
  left: 53%;
  top: 18%;
  width: 20%;
  height: 60%;
}

        .journal-fixed-wrapper,
        .journal-fixed-canvas {
          min-width: 900px !important;
        }

        /* Buttons */
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
        }

        .sea-btn:active {
          transform: scale(0.97);
        }

        /* Book fade-in */
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

        /* Scrollbar */
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

        /* Text fade-in */
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

        /* Mobile scaling */
        @media (max-width: 640px) {
        .journal-fixed-wrapper,
  .journal-fixed-canvas {
    min-width: 100% !important;
    width: 100% !important;
  }
        .writing-area-desktop {
  left: 50% !important;
  top: 12% !important;
  width: 70% !important;
  height: 60% !important;
  transform: translateX(-50%) !important;
}
  .journal-center-container {
  height: 100dvh !important;
  min-height: 100dvh !important;
  max-height: 100dvh !important;
}

  /* PATCH 3 — ROOT CONTAINER FIX */
  html,
  body,
  .journal-root {
    height: 100dvh !important;
    min-height: 100dvh !important;
  }
          .journal-write-stage {
  position: relative !important;
  inset: unset !important;
  display: block !important;
  background: transparent !important;

  /* THE FIX */
  height: 100dvh !important;
  min-height: 100dvh !important;
}


        .journal-parchment {
  width: 100% !important;
  height: 100dvh !important;
  max-height: 100dvh !important;
  object-fit: contain !important;
  margin-left: auto !important;
  margin-right: auto !important;
}

.controls {
  margin-top: 8px !important;
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
