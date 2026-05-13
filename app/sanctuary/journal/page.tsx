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

  // NEW SESSION LOADING — FIXED
  useEffect(() => {
    const getUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (user) {
        setSession({ user });
      } else {
        setSession(null);
      }
    };

    getUser();
  }, []);

  // LOAD ENTRIES — FIXED
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
        setEntries(data);
        if (data.length > 0) {
          const last = data[data.length - 1];
          setSelectedEntryId(last.id);
          setCurrentText(last.content ?? '');
        }
      }

      setLoading(false);
    };

    loadEntries();
  }, [session]);

  const selectedEntry = useMemo(
    () => entries.find((e) => e.id === selectedEntryId) ?? null,
    [entries, selectedEntryId]
  );

  // AUTO-ADVANCE STAGES
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

  // SAVE ENTRY — FIXED
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
          <div className="absolute inset-0 flex">
            {/* LEFT SIDEBAR */}
            <div className="w-1/4 bg-[#f5ecdd] p-6 overflow-y-auto border-r border-[#d2bfa0]">
              <button
                style={paperButtonStyle}
                onClick={() => {
                  setSelectedEntryId(null);
                  setCurrentText('');
                }}
              >
                + New Entry
              </button>

              <div className="mt-6 space-y-4">
                {entries.map((entry) => (
                  <div
                    key={entry.id}
                    className={`p-3 rounded-lg cursor-pointer transition ${
                      selectedEntryId === entry.id
                        ? 'bg-[#e8d8bd]'
                        : 'bg-[#f9f1e3]'
                    }`}
                    onClick={() => {
                      setSelectedEntryId(entry.id);
                      setCurrentText(entry.content);
                    }}
                  >
                    <p style={inkStyle} className="text-sm opacity-70">
                      {formatDate(entry.created_at)}
                    </p>
                    <p style={inkStyle} className="truncate">
                      {entry.content || 'Empty entry'}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* WRITING AREA */}
            <div className="flex-1 relative bg-[#f5ecdd] p-10">
              <textarea
                value={currentText}
                onChange={(e) => setCurrentText(e.target.value)}
                className="w-full h-full bg-transparent outline-none resize-none text-lg"
                style={inkStyle}
              />

              <button
                style={{
                  ...paperButtonStyle,
                  position: 'absolute',
                  bottom: 20,
                  right: 20,
                }}
                onClick={handleSave}
                disabled={saving}
              >
                {saving ? 'Saving...' : 'Save'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
