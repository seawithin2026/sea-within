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
    <div
      key="write-stage"
      className="journal-write-stage absolute inset-0 fade-in-book bg-black flex items-center justify-center"
    >
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

    await supabase
      .from('journal_entries')
      .delete()
      .eq('id', selectedEntryId);

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

  const selectedEntry = entries.find(e => e.id === selectedEntryId) || null;

  const goPrev = () => {
    if (!selectedEntryId || entries.length === 0) return;
    const idx = entries.findIndex(e => e.id === selectedEntryId);
    if (idx > 0) {
      const prev = entries[idx - 1];
      setSelectedEntryId(prev.id);
      setCurrentText('');
      setIsEditing(false);
    }
  };

  const goNext = () => {
    if (!selectedEntryId || entries.length === 0) return;
    const idx = entries.findIndex(e => e.id === selectedEntryId);
    if (idx < entries.length - 1) {
      const next = entries[idx + 1];
      setSelectedEntryId(next.id);
      setCurrentText('');
      setIsEditing(false);
    }
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

  return (
    <div className="relative h-screen w-screen overflow-hidden bg-black">

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

              if (timeLeft < 0.08 && !showShadow) {
                setShowShadow(true);
              }

              if (!hasTriggeredVideoEnd && timeLeft < 0.25) {
                setHasTriggeredVideoEnd(true);

                setTimeout(() => {
                  setStage('logo');
                }, 450);
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
          <div className="relative w-full h-full flex items-center justify-center">

            {/* DESKTOP VERSION */}
            <div className="hidden md:flex w-full h-full items-center justify-center">
              <div className="relative w-[900px] h-[600px] flex">

                {/* LEFT PAGE (PARCHMENT) */}
                <div
                  className="w-1/2 bg-cover bg-center"
                  style={{ backgroundImage: "url('/images/parchment-page.png')" }}
                />

                {/* RIGHT PAGE (WRITING AREA) */}
                <div className="w-1/2 bg-[#f5ecdd] p-10 flex flex-col">

                  {/* DATE */}
                  <div className="text-right text-[#4b2e1a] text-sm font-medium mb-4">
                    {selectedEntry
                      ? new Date(selectedEntry.created_at).toLocaleDateString(
                          undefined,
                          { year: 'numeric', month: 'long', day: 'numeric' }
                        )
                      : todayPretty}
                  </div>

                  {/* ENTRY OR TEXTAREA */}
                  {selectedEntry && !isEditing ? (
                    <div className="text-[#3b2414] whitespace-pre-wrap text-[18px] leading-relaxed">
                      {selectedEntry.content}
                    </div>
                  ) : (
                    <textarea
                      className="w-full flex-1 bg-transparent resize-none text-[#3b2414] text-[18px] leading-relaxed outline-none placeholder-[#3b2414]/60"
                      placeholder="Let the sea within you speak..."
                      value={currentText}
                      onChange={e => setCurrentText(e.target.value)}
                    />
                  )}

                  {/* DESKTOP BUTTONS */}
                  <div className="mt-6 flex gap-3 justify-end">

                    <button
                      onClick={goPrev}
                      className="px-4 py-2 bg-[#d9c7b3] text-[#3b2414] rounded hover:bg-[#cbb59e]"
                    >
                      Previous
                    </button>

                    <button
                      onClick={goNext}
                      className="px-4 py-2 bg-[#d9c7b3] text-[#3b2414] rounded hover:bg-[#cbb59e]"
                    >
                      Next
                    </button>

                    {selectedEntry && !isEditing && (
                      <button
                        onClick={() => {
                          setIsEditing(true);
                          setCurrentText(selectedEntry.content);
                        }}
                        className="px-4 py-2 bg-amber-200 text-[#3b2414] rounded hover:bg-amber-300"
                      >
                        Edit
                      </button>
                    )}

                    {(isEditing || !selectedEntry) && (
                      <button
                        onClick={handleSave}
                        disabled={saving}
                        className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50"
                      >
                        {saving ? 'Saving…' : 'Save'}
                      </button>
                    )}

                    {selectedEntry && (
                      <button
                        onClick={() => setShowDeleteConfirm(true)}
                        className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                      >
                        Delete
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* MOBILE VERSION */}
            <div className="md:hidden relative w-full h-full flex flex-col items-center overflow-y-auto">

              <div
                className="w-full bg-cover bg-center"
                style={{
                  backgroundImage: "url('/images/parchment-page.png')",
                  aspectRatio: '3 / 2',
                }}
              />

              <div className="w-full flex justify-end px-4 -mt-10">
                <div className="w-[70%]">

                  <div className="text-right text-[#4b2e1a] text-sm font-medium mb-2">
                    {selectedEntry
                      ? new Date(selectedEntry.created_at).toLocaleDateString(
                          undefined,
                          { year: 'numeric', month: 'long', day: 'numeric' }
                        )
                      : todayPretty}
                  </div>

                  {selectedEntry && !isEditing ? (
                    <div className="text-[#3b2414] whitespace-pre-wrap text-[17px] leading-relaxed">
                      {selectedEntry.content}
                    </div>
                  ) : (
                    <textarea
                      className="w-full h-48 bg-transparent resize-none text-[#3b2414] text-[17px] leading-relaxed outline-none placeholder-[#3b2414]/60"
                      placeholder="Let the sea within you speak..."
                      value={currentText}
                      onChange={e => setCurrentText(e.target.value)}
                    />
                  )}
                </div>
              </div>

              <div className="w-full mt-8 flex flex-wrap justify-center gap-3 pb-10">

                <button
                  onClick={goPrev}
                  className="px-4 py-2 bg-[#d9c7b3] text-[#3b2414] rounded hover:bg-[#cbb59e]"
                >
                  Previous
                </button>

                <button
                  onClick={goNext}
                  className="px-4 py-2 bg-[#d9c7b3] text-[#3b2414] rounded hover:bg-[#cbb59e]"
                >
                  Next
                </button>

                {selectedEntry && !isEditing && (
                  <button
                    onClick={() => {
                      setIsEditing(true);
                      setCurrentText(selectedEntry.content);
                    }}
                    className="px-4 py-2 bg-amber-200 text-[#3b2414] rounded hover:bg-amber-300"
                  >
                    Edit
                  </button>
                )}

                {(isEditing || !selectedEntry) && (
                  <button
                    onClick={handleSave}
                    disabled={saving}
                    className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50"
                  >
                    {saving ? 'Saving…' : 'Save'}
                  </button>
                )}

                {selectedEntry && (
                  <button
                    onClick={() => setShowDeleteConfirm(true)}
                    className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                  >
                    Delete
                  </button>
                )}
              </div>
            </div>
          </div>
        </WriteStage>
      )}

      {showDeleteConfirm && (
        <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
          <div className="bg-white p-6 rounded shadow-lg text-center">
            <p className="text-[#3b2414] mb-4">Delete this entry?</p>
            <div className="flex justify-center gap-4">
              <button
                onClick={deleteEntry}
                className="px-4 py-2 bg-red-600 text-white rounded"
              >
                Delete
              </button>
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="px-4 py-2 bg-gray-300 text-[#3b2414] rounded"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
