'use client';

import React, { useEffect, useState, useMemo } from 'react';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

type Stage = 'video' | 'logo' | 'write';

type JournalEntry = {
  id: string;
  user_id: string;
  content: string;
  created_at: string;
};

const paperButtonStyle: React.CSSProperties = {
  background: '#f3e4c8',
  border: '1px solid #c9b28a',
  borderRadius: 12,
  padding: '8px 20px',
  fontFamily: '"Cormorant Garamond", serif',
  fontWeight: 600,
  fontSize: '0.95rem',
  color: '#2f1b0f',
  letterSpacing: '0.3px',
  boxShadow: '0 4px 8px rgba(0,0,0,0.25)',
  cursor: 'pointer',
  transition: 'all 0.25s ease',
  backgroundImage:
    'radial-gradient(circle at top left, rgba(255,255,255,0.35), transparent 60%), radial-gradient(circle at bottom right, rgba(0,0,0,0.15), transparent 70%)',
};

const inkStyle: React.CSSProperties = {
  color: '#2f1b0f',
  fontFamily: '"Cormorant Garamond", serif',
};

export default function JournalPage() {
  const [stage, setStage] = useState<Stage>('video');

  const [session, setSession] = useState<any>(null);
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [currentText, setCurrentText] = useState('');
  const [selectedEntryId, setSelectedEntryId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);


  // Load session
  useEffect(() => {
    const getSession = async () => {
      const { data } = await supabase.auth.getSession();
      setSession(data.session ?? null);
    };
    getSession();
  }, [supabase]);

  // Load entries
  useEffect(() => {
    if (!session) return;
    const loadEntries = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from('journal_entries')
        .select('*')
        .eq('user_id', session.user.id)
        .order('created_at', { ascending: true });

      if (!error && data) {
        setEntries(data as JournalEntry[]);
        if (data.length > 0) {
          const last = data[data.length - 1];
          setSelectedEntryId(last.id);
          setCurrentText(last.content ?? '');
        }
      }
      setLoading(false);
    };
    loadEntries();
  }, [session, supabase]);

  const selectedEntry = useMemo(
    () => entries.find((e) => e.id === selectedEntryId) ?? null,
    [entries, selectedEntryId]
  );

  // Auto-advance stages
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

  const formatDate = (iso: string) => {
    const d = new Date(iso);
    return d.toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  // SAVE ENTRY — FIXED & COMPLETE
  const handleSave = async () => {
    if (!session) return;
    if (!currentText.trim()) return;

    setSaving(true);

    if (selectedEntryId) {
      const { error } = await supabase
        .from('journal_entries')
        .update({ content: currentText })
        .eq('id', selectedEntryId);

      if (!error) {
        setEntries((prev) =>
          prev.map((e) =>
            e.id === selectedEntryId ? { ...e, content: currentText } : e
          )
        );
      }
    } else {
      const { data, error } = await supabase
        .from('journal_entries')
        .insert({
          user_id: session.user.id,
          content: currentText,
        })
        .select()
        .single();

      if (!error && data) {
        setEntries((prev) => [...prev, data]);
        setSelectedEntryId(data.id);
      }
    }

    setSaving(false);
  };

  if (!session) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#f5ecdd]">
        <p style={inkStyle}>Please sign in to access your journal.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0b1720] flex items-center justify-center">
      <div className="relative w-full max-w-6xl h-[80vh] shadow-2xl rounded-3xl overflow-hidden border border-[#d2bfa0] bg-black">

        {/* VIDEO STAGE */}
        {stage === 'video' && (
          <div className="absolute inset-0 bg-black flex items-center justify-center">
            <video className="w-full h-full object-cover" autoPlay muted playsInline>
              <source src="/journal-intro.mp4" type="video/mp4" />
            </video>
          </div>
        )}

        {/* LOGO STAGE */}
        {stage === 'logo' && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#050b10]">
            <img
              src="/sea-within-symbol.png"
              alt="Sea Within"
              className="w-40 h-40 mb-6 object-contain"
            />
            <p
              style={{
                ...inkStyle,
                color: '#f5ecdd',
                fontSize: '1.05rem',
                maxWidth: '420px',
                textAlign: 'center',
                opacity: 0.9,
              }}
            >
              A quiet place for your inner tides, written in ink that belongs only to you.
            </p>
          </div>
        )}

        {/* WRITE STAGE */}
        {stage === 'write' && (
          <div className="absolute inset-0 flex items-center justify-center bg-[#0b1720]">
            <div className="relative w-[80%] h-[80%]">
              <img
                src="/parchment-page.png"
                alt="Sea Within Journal"
                className="w-full h-full object-contain"
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
                <div className="relative w-full h-full">
                  <div className="flex items-center justify-between mb-2">
                    <div
                      style={{
                        ...inkStyle,
                        fontSize: '0.85rem',
                        opacity: 0.85,
                      }}
                    >
                      {selectedEntry ? formatDate(selectedEntry.created_at) : 'New entry'}
                    </div>
                  </div>

                  <textarea
                    value={currentText}
                    onChange={(e) => setCurrentText(e.target.value)}
                    className="w-full h-[85%] bg-transparent outline-none resize-none"
                    style={{
                      ...inkStyle,
                      fontSize: '1rem',
                      lineHeight: 1.6,
                    }}
                    placeholder="Let your thoughts flow…"
                  />

                  <div className="flex items-center justify-between mt-2">
                    {selectedEntry && (
                      <button
                        style={paperButtonStyle}
                        onClick={() => setDeletingId(selectedEntry.id)}
                        disabled={saving}
                      >
                        Delete
                      </button>
                    )}
                    <button
                      style={paperButtonStyle}
                      onClick={handleSave}
                      disabled={saving || !currentText.trim()}
                    >
                      {saving ? 'Saving…' : 'Save'}
                    </button>
                  </div>
                </div>
              </div>

              {/* SIDEBAR */}
              <div
                className="absolute"
                style={{
                  left: '10%',
                  top: '18%',
                  width: '20%',
                  height: '60%',
                }}
              >
                <div className="w-full h-full flex flex-col">
                  <div className="flex items-center justify-between mb-3">
                    <h2
                      style={{
                        ...inkStyle,
                        fontSize: '1.1rem',
                        fontWeight: 600,
                      }}
                    >
                      Entries
                    </h2>
                    <button
                      style={paperButtonStyle}
                      onClick={() => {
                        setSelectedEntryId(null);
                        setCurrentText('');
                      }}
                    >
                      New
                    </button>
                  </div>

                  <div className="flex-1 overflow-y-auto pr-1">
                    {loading && (
                      <p
                        style={{
                          ...inkStyle,
                          fontSize: '0.9rem',
                          opacity: 0.8,
                        }}
                      >
                        Loading…
                      </p>
                    )}

                    {!loading &&
                      entries.map((entry) => (
                        <button
                          key={entry.id}
                          onClick={() => {
                            setSelectedEntryId(entry.id);
                            setCurrentText(entry.content ?? '');
                          }}
                          className="w-full text-left mb-2 px-2 py-1 rounded-lg transition-colors"
                          style={{
                            backgroundColor:
                              selectedEntryId === entry.id
                                ? '#e4d1af'
                                : 'transparent',
                          }}
                        >
                          <div
                            style={{
                              ...inkStyle,
                              fontSize: '0.8rem',
                              opacity: 0.8,
                            }}
                          >
                            {formatDate(entry.created_at)}
                          </div>
                          <div
                            style={{
                              ...inkStyle,
                              fontSize: '0.85rem',
                              whiteSpace: 'nowrap',
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                            }}
                          >
                            {entry.content || 'Untitled'}
                          </div>
                        </button>
                      ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* DELETE MODAL */}
        {deletingId && (
          <div className="absolute inset-0 bg-black/40 flex items-center justify-center z-50">
            <div className="bg-[#f3e4c8] rounded-2xl shadow-2xl border border-[#d2bfa0] px-6 py-5 max-w-sm w-full">
              <h3
                style={{
                  ...inkStyle,
                  fontSize: '1.1rem',
                  marginBottom: '0.5rem',
                }}
              >
                Delete this entry?
              </h3>
              <p
                style={{
                  ...inkStyle,
                  fontSize: '0.95rem',
                  opacity: 0.85,
                  marginBottom: '1rem',
                }}
              >
                This action cannot be undone.
              </p>
              <div className="flex justify-end gap-3">
                <button
                  style={paperButtonStyle}
                  onClick={() => setDeletingId(null)}
                >
                  Cancel
                </button>
                <button
                  style={{
                    ...paperButtonStyle,
                    background: '#e3c1b8',
                    borderColor: '#c29a8f',
                  }}
                  onClick={async () => {
                    const id = deletingId;
                    setDeletingId(null);

                    const { error } = await supabase
                      .from('journal_entries')
                      .delete()
                      .eq('id', id);

                    if (!error) {
                      setEntries((prev) => prev.filter((e) => e.id !== id));

                      if (selectedEntryId === id) {
                        const remaining = entries.filter((e) => e.id !== id);
                        if (remaining.length > 0) {
                          const last = remaining[remaining.length - 1];
                          setSelectedEntryId(last.id);
                          setCurrentText(last.content ?? '');
                        } else {
                          setSelectedEntryId(null);
                          setCurrentText('');
                        }
                      }
                    }
                  }}
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
