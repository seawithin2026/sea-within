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

export default function JournalPage() {
  const [stage, setStage] = useState<Stage>('video');

  const [session, setSession] = useState<any>(null);
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [currentText, setCurrentText] = useState('');
  const [selectedEntryId, setSelectedEntryId] = useState<string | null>(null);

  const [showCalendar, setShowCalendar] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const [saving, setSaving] = useState(false);

  // TODAY'S PRETTY DATE (for new pages only)
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
    };
    loadUser();
  }, []);

  // LOAD ENTRIES
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
         setCurrentText(last.content);
        }
      }
    };

    loadEntries();
  }, [session]);

  const selectedEntry = entries.find(e => e.id === selectedEntryId) || null;

  // AUTO‑ADVANCE STAGES
  useEffect(() => {
    if (stage === 'video') {
      const t = setTimeout(() => setStage('logo'), 4000);
      return () => clearTimeout(t);
    }
    if (stage === 'logo') {
      const t = setTimeout(() => setStage('write'), 2500);
      return () => clearTimeout(t);
    }
  }, [stage]);

  // SAVE ENTRY — ALWAYS INSERT (unlimited entries per day)
  const handleSave = async () => {
    if (!session?.user?.id) return;
    if (!currentText.trim()) return;

    setSaving(true);

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
setCurrentText(data.content);
    }

    setSaving(false);
  };

  // DELETE ENTRY
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

    setShowDeleteConfirm(false);
  };

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
        <div className="absolute inset-0 flex items-center justify-center bg-black">
          <video
            src="/videos/book-opening.mp4"
            autoPlay
            playsInline
            className="w-full h-full object-cover"
            onEnded={() => setStage('logo')}
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
                style={{ top: '-8%', right: '0%' }}
              >
                {selectedEntry
                  ? new Date(selectedEntry.created_at).toLocaleDateString(undefined, {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })
                  : todayPretty}
              </div>

              {/* ENTRY OR TEXTAREA */}
              {selectedEntry ? (
                <div className="w-full h-full overflow-auto text-[#3b2414] text-center">
                  <div className="ink-writing whitespace-pre-wrap text-lg leading-relaxed">
                    {selectedEntry.content}
                  </div>
                </div>
              ) : (
                <textarea
                  className="w-full h-full bg-transparent resize-none text-[#3b2414] text-lg leading-relaxed outline-none text-center placeholder-[#3b2414]/60"
                  placeholder="Let the sea within you speak..."
                  value={currentText}
                  onChange={e => setCurrentText(e.target.value)}
                />
              )}
            </div>

            {/* CALENDAR */}
            {showCalendar && (
              <div className="absolute top-[10%] right-[10%] bg-[#fdf7e6] shadow-xl rounded-xl p-4 w-72 max-h-[70%] overflow-auto border border-[#d8c9a3]">
                <h2 className="text-[#3b2414] font-bold mb-3">Your Entries</h2>
{entries.map(entry => (
  <button
    key={entry.id}
    onClick={() => {
      setSelectedEntryId(entry.id);
      setCurrentText('');
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

            {/* DELETE CONFIRM */}
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

            {/* CONTROLS */}
            <div className="absolute bottom-[10%] left-0 right-0 flex flex-wrap justify-center gap-4">

              <button
                onClick={() => {
                  if (!selectedEntryId) return;
                  const idx = entries.findIndex(e => e.id === selectedEntryId);
                  if (idx > 0) {
                    const prev = entries[idx - 1];
                    setSelectedEntryId(prev.id);
                    setCurrentText('');
                  }
                }}
                className="sea-btn"
              >
                ◀ Previous
              </button>

              <button
                onClick={() => {
                  setSelectedEntryId(null);
                  setCurrentText('');
                }}
                className="sea-btn"
              >
                New Page
              </button>

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
                  const idx = entries.findIndex(e => e.id === selectedEntryId);
                  if (idx < entries.length - 1 && idx !== -1) {
                    const next = entries[idx + 1];
                    setSelectedEntryId(next.id);
                    setCurrentText('');
                  }
                }}
                className="sea-btn"
              >
                Next ▶
              </button>

            </div>
          </div>
        </div>
      )}

      {/* GLOBAL STYLES */}
      <style jsx global>{`
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
      `}</style>
    </div>
  );
}
