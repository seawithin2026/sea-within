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
            className="absolute inset-0 w-full h-full object-cover"
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

          <div className="journal-root">

            <div className="journal-wrapper">

              {/* FULL-FRAME BOOK */}
              <img
                src="/images/parchment-page.png"
                alt="Sea Within Journal Book"
                className="journal-book"
              />

              {/* RIGHT PAGE WRITING FRAME */}
              <div className="journal-writing-frame">

                {/* DATE */}
                <div className="journal-date">
                  {selectedEntry
                    ? new Date(selectedEntry.created_at).toLocaleDateString(undefined, {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })
                    : todayPretty}
                </div>

                {/* ENTRY OR TEXTAREA */}
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

            </div>

            {/* CONTROLS */}
            <div className="controls">

              {/* PREVIOUS */}
              <button
                className="sea-btn"
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
              >
                ◀ Previous
              </button>

              {/* NEW PAGE */}
              <button
                className="sea-btn"
                onClick={() => {
                  setSelectedEntryId(null);
                  setCurrentText('');
                  setIsEditing(false);
                }}
              >
                New Page
              </button>

              {/* EDIT */}
              {selectedEntry && !isEditing && (
                <button
                  className="sea-btn"
                  onClick={() => {
                    setIsEditing(true);
                    setCurrentText(selectedEntry.content);
                  }}
                >
                  Edit
                </button>
              )}

              {/* CANCEL EDIT */}
              {isEditing && (
                <button
                  className="sea-btn"
                  onClick={() => {
                    setIsEditing(false);
                    setCurrentText('');
                  }}
                >
                  Cancel Edit
                </button>
              )}

              {/* SAVE */}
              <button className="sea-btn" onClick={handleSave} disabled={saving}>
                {saving ? 'Saving...' : 'Save'}
              </button>

              {/* DELETE */}
              {selectedEntry && (
                <button
                  className="sea-btn bg-red-200/80 hover:bg-red-300/90"
                  onClick={() => setShowDeleteConfirm(true)}
                >
                  Delete
                </button>
              )}

              {/* CALENDAR */}
              <button className="sea-btn" onClick={() => setShowCalendar(true)}>
                📅 Calendar
              </button>

              {/* NEXT */}
              <button
                className="sea-btn"
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
              >
                Next ▶
              </button>

            </div>

          </div>

        </WriteStage>
      )}

    </div>
  );
}
