'use client';

import React, { useEffect, useState, useMemo } from 'react';
import { createClient } from '@/lib/supabase/client';

const supabase = createClient();

type Stage = 'video' | 'logo' | 'write';

type JournalEntry = {
  id: string;
  user_id: string;
  content: string;
  created_at: string;
};

const WriteStage = React.memo(function WriteStage({ children }: { children: React.ReactNode }) {
  return (
    <div className="absolute inset-0 fade-in-book bg-black flex items-center justify-center">
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

  const todayPretty = useMemo(() => {
    return new Date().toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  }, []);

  // LOAD USER
  useEffect(() => {
    const loadUser = async () => {
      const { data } = await supabase.auth.getUser();
      if (data?.user) setSession({ user: data.user });
      setLoadingUser(false);
    };
    loadUser();
  }, []);

  // LOAD ENTRIES
  useEffect(() => {
    if (!session?.user?.id) return;

    const loadEntries = async () => {
      const { data } = await supabase
        .from('journal_entries')
        .select('id,user_id,content,created_at')
        .eq('user_id', session.user.id)
        .order('created_at', { ascending: true });

      if (data) {
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

  // SAVE ENTRY
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
          prev.map(e => (e.id === selectedEntryId ? { ...e, content: currentText } : e))
        );
        setIsEditing(false);
        setCurrentText('');
      }

      setSaving(false);
      return;
    }

    const { data } = await supabase
      .from('journal_entries')
      .insert({
        user_id: session.user.id,
        content: currentText,
      })
      .select()
      .single();

    if (data) {
      setEntries(prev => [...prev, data]);
      setSelectedEntryId(data.id);
      setCurrentText('');
      setIsEditing(false);
    }

    setSaving(false);
  };

  // DELETE ENTRY
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
    return <div className="flex items-center justify-center min-h-screen bg-black" />;
  }

  if (!session) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#f5ecdd]">
        <p className="text-[#3b2414]">Please sign in to access your journal.</p>
      </div>
    );
  }

  const selectedEntry = entries.find(e => e.id === selectedEntryId) || null;

  return (
    <div className="relative h-screen w-screen overflow-hidden bg-black">
      {/* VIDEO STAGE */}
      {stage === 'video' && (
        <div className="absolute inset-0 bg-black overflow-hidden">
          <video
            src="/videos/book-opening.mp4"
            autoPlay
            playsInline
            muted
            className="absolute inset-0 w-full h-full object-cover book-opening-video"
            onTimeUpdate={e => {
              const video = e.target as HTMLVideoElement;
              if (!video.duration || Number.isNaN(video.duration)) return;

              const timeLeft = video.duration - video.currentTime;

              if (timeLeft < 0.08 && !showShadow) setShowShadow(true);

              if (!hasTriggeredVideoEnd && timeLeft < 0.25) {
                setHasTriggeredVideoEnd(true);
                setTimeout(() => setStage('logo'), 450);
              }
            }}
            onEnded={() => {
              if (!hasTriggeredVideoEnd) setStage('logo');
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
        <div className="absolute inset-0 fade-in-book bg-black flex items-center justify-center">
          <img src="/images/sea-within-logo-page.png" className="logo-book object-contain mx-auto" />

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
          <div className="journal-shell">
            {/* CODED BOOK FRAME */}
            <div className="journal-book-frame">
              {/* LEFT PAGE (visual only for now) */}
              <div className="journal-page journal-page-left">
                {/* You can add a quote or leave it empty */}
              </div>

              {/* RIGHT PAGE — WRITING AREA */}
              <div className="journal-page journal-page-right">
                <div className="journal-date">
                  {selectedEntry
                    ? new Date(selectedEntry.created_at).toLocaleDateString(undefined, {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })
                    : todayPretty}
                </div>

                {selectedEntry && !isEditing ? (
                  <div className="journal-text ink-writing whitespace-pre-wrap">
                    {selectedEntry.content}
                  </div>
                ) : (
                  <textarea
                    className="journal-textarea"
                    placeholder="Let the sea within you speak..."
                    value={currentText}
                    onChange={e => setCurrentText(e.target.value)}
                  />
                )}
              </div>
            </div>

            {/* CALENDAR */}
            {showCalendar && (
              <div className="calendar-panel bg-[#ccb072] shadow-xl rounded-xl p-4 border border-[#d8c9a3]">
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

                <button onClick={() => setShowCalendar(false)} className="sea-btn w-full mt-2">
                  Close
                </button>
              </div>
            )}

            {/* DELETE CONFIRM */}
            {showDeleteConfirm && (
              <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                <div className="delete-modal bg-[#fdf7e6] border border-[#d8c9a3] rounded-xl p-6 shadow-xl text-center">
                  <p className="text-[#3b2414] mb-4">Are you sure you want to delete this entry?</p>

                  <div className="flex justify-center gap-4">
                    <button onClick={deleteEntry} className="sea-btn bg-red-300/80 hover:bg-red-400/80">
                      Delete
                    </button>

                    <button onClick={() => setShowDeleteConfirm(false)} className="sea-btn">
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* CONTROLS */}
            <div className="controls">
              {/* PREVIOUS */}
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

                  const idx = entries.findIndex(e => e.id === selectedEntryId);
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

              {/* NEW PAGE */}
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

              {/* EDIT */}
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

              {/* CANCEL EDIT */}
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

              {/* SAVE */}
              <button onClick={handleSave} className="sea-btn" disabled={saving}>
                {saving ? 'Saving...' : 'Save'}
              </button>

              {/* DELETE */}
              {selectedEntry && (
                <button
                  onClick={() => setShowDeleteConfirm(true)}
                  className="sea-btn bg-red-200/80 hover:bg-red-300/90"
                >
                  Delete
                </button>
              )}

              {/* CALENDAR */}
              <button onClick={() => setShowCalendar(true)} className="sea-btn">
                📅 Calendar
              </button>

              {/* NEXT */}
              <button
                onClick={() => {
                  if (!selectedEntryId) return;
                  const idx = entries.findIndex(e => e.id === selectedEntryId);
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

      {/* GLOBAL STYLES */}
      <style jsx global>{`
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
        }
        .sea-btn:active {
          transform: scale(0.97);
        }

        /* BOOK FADE */
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

        /* JOURNAL — CODED BOOK LAYOUT (DESKTOP BASE) */
        .journal-shell {
          position: relative;
          width: min(1400px, 100vw);
          margin: 0 auto;
          padding: 0 1.5rem 3.5rem;
        }

        .journal-book-frame {
          position: relative;
          width: 100%;
          /* Match your 1536x1024 reference ratio */
          aspect-ratio: 1536 / 1024;
          margin: 0 auto;
          border-radius: 18px;
          overflow: hidden;
          box-shadow: 0 24px 60px rgba(0, 0, 0, 0.7);
          display: flex;
          background: radial-gradient(circle at 50% 0%, #fdf5e4 0%, #e3cda0 45%, #c29b6a 100%);
        }

        .journal-page {
          flex: 1;
          padding: clamp(1.5rem, 3vw, 3rem);
          display: flex;
          flex-direction: column;
          justify-content: flex-start;
          position: relative;
          background: repeating-linear-gradient(
              to bottom,
              rgba(255, 255, 255, 0.08),
              rgba(255, 255, 255, 0.08) 1px,
              transparent 1px,
              transparent 22px
            ),
            radial-gradient(circle at 0 0, rgba(255, 255, 255, 0.4), transparent 55%),
            radial-gradient(circle at 100% 100%, rgba(255, 255, 255, 0.25), transparent 55%),
            linear-gradient(135deg, #fdf5e4, #e7cf9f);
        }

        .journal-page-left {
          border-right: 2px solid rgba(120, 80, 40, 0.45);
        }

        .journal-page-right {
          border-left: 2px solid rgba(120, 80, 40, 0.45);
        }

        .journal-date {
          font-size: 0.9rem;
          color: #4b2e1a;
          text-align: right;
          margin-bottom: 0.75rem;
          opacity: 0.9;
        }

        .journal-text,
        .journal-textarea {
          flex: 1;
          width: 100%;
          color: #3b2414;
          font-size: 1.1rem;
          line-height: 1.5;
          background: transparent;
          border: none;
          outline: none;
          resize: none;
          text-align: center;
        }

        .journal-textarea::placeholder {
          color: rgba(59, 36, 20, 0.45);
        }

        .controls {
          margin: 1.5rem auto 0 auto;
          max-width: 900px;
          display: flex;
          justify-content: center;
          gap: 1rem;
          flex-wrap: wrap;
        }

        .calendar-panel {
          position: absolute;
          top: 10%;
          right: 6%;
          max-width: 260px;
          z-index: 10;
        }

        /* MOBILE OVERRIDES */
        @media (max-width: 640px) {
          .journal-shell {
            width: 100%;
            padding: 1.5rem 1rem 2.5rem;
          }

          .journal-book-frame {
            aspect-ratio: 3 / 4;
            border-radius: 14px;
          }

          .journal-page {
            padding: 1.25rem;
          }

          .journal-date {
            font-size: 0.8rem;
            text-align: center;
          }

          .journal-text,
          .journal-textarea {
            font-size: 0.95rem;
            line-height: 1.35;
          }

          .calendar-panel {
            position: static;
            margin: 1rem auto 0 auto;
            width: 100%;
            max-width: 360px;
          }

          .controls {
            margin-top: 1.75rem;
            width: 100%;
            padding: 0 0.5rem 0;
            gap: 0.75rem;
          }

          .sea-btn {
            width: 70%;
            max-width: 260px;
            text-align: center;
          }

          /* Less zoomed video on mobile */
          .book-opening-video {
            object-fit: contain !important;
            background: black;
          }
        }
      `}</style>
    </div>
  );
}
