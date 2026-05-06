'use client';

import { useState, useEffect } from "react";
import Navigation from "@/components/layout/Navigation";
import ScrollReveal from "@/components/ui/ScrollReveal";
import { createClient } from "@/lib/supabase/client";

interface JournalEntry {
  id: string;
  content: string;
  created_at: string;
}

export default function JournalPage() {
  const supabase = createClient();

  const [entry, setEntry] = useState("");
  const [saved, setSaved] = useState(false);
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [user, setUser] = useState<any>(null);

  // Load user session
  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user);
    });
  }, []);

  // Load entries once user is known
  useEffect(() => {
    if (user) fetchEntries();
  }, [user]);

  const fetchEntries = async () => {
    const { data, error } = await supabase
      .from("journal_entries")
      .select("*")
      .order("created_at", { ascending: false });

    if (!error && data) setEntries(data);
  };

  const saveEntry = async () => {
    setSaved(false);

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      alert("You must be logged in to save your journal.");
      return;
    }

    const { error } = await supabase.from("journal_entries").insert({
      user_id: user.id,
      content: entry,
    });

    if (!error) {
      setSaved(true);
      setEntry("");
      fetchEntries();
    }
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-CA", {
      month: "long",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <main className="min-h-screen bg-sanctuary-dark">
      <Navigation />

      {/* Hero */}
      <section className="relative pt-32 pb-16 overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[600px] h-[400px] rounded-full bg-golden-400/4 blur-[120px]" />
        </div>

        <div className="relative z-10 text-center px-6">
          <ScrollReveal delay={200}>
            <p className="font-whisper text-sm tracking-[6px] uppercase text-golden-400/40 mb-6">
              inner sanctuary
            </p>
          </ScrollReveal>

          <ScrollReveal delay={400}>
            <h1 className="font-display text-3xl md:text-5xl font-light text-sea-100">
              Your Private Journal
            </h1>
          </ScrollReveal>

          <ScrollReveal delay={600}>
            <p className="font-body text-base text-white/30 mt-6 max-w-lg mx-auto leading-relaxed">
              A quiet space to release, remember, and explore your inner world.
              Only you can see what is written here.
            </p>
          </ScrollReveal>
        </div>
      </section>

      {/* Journal Form */}
      <section className="max-w-2xl mx-auto px-6 pb-12">
        <ScrollReveal>
          <div className="sanctuary-card p-8">
            <label className="block font-body text-[11px] tracking-[2px] uppercase text-white/40 mb-3">
              Write Your Reflection
            </label>

            <textarea
              value={entry}
              onChange={(e) => setEntry(e.target.value)}
              placeholder="What is alive in your inner ocean today?"
              rows={6}
              className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3.5
                         font-body text-sea-100 placeholder:text-white/20 resize-none
                         focus:outline-none focus:border-golden-400/40 focus:bg-white/8
                         transition-all duration-300"
            />

            <div className="flex justify-between items-center mt-3">
              <p className="font-body text-[11px] text-white/20">
                {entry.length} characters
              </p>

              <button
                onClick={saveEntry}
                disabled={!entry.trim()}
                className="btn-golden text-[11px] px-6 py-2.5 disabled:opacity-40"
              >
                Save Entry
              </button>
            </div>

            {saved && (
              <div className="mt-4 p-4 rounded-lg border bg-sea-400/10 border-sea-400/20 text-sea-200 text-sm font-body">
                Your entry has been saved.
              </div>
            )}
          </div>
        </ScrollReveal>
      </section>

      {/* Entries Grid */}
      <section className="max-w-4xl mx-auto px-6 pb-24">
        <div className="columns-1 md:columns-2 gap-6 space-y-6">
          {entries.map((entry, index) => (
            <ScrollReveal key={entry.id} delay={100 + index * 50}>
              <div className="wisdom-card break-inside-avoid">
                <p className="font-display text-lg font-light text-sea-100/80 leading-relaxed italic whitespace-pre-line">
                  {entry.content}
                </p>

                <div className="flex items-center justify-between mt-6 pt-4 border-t border-white/5">
                  <p className="font-body text-[11px] text-white/20">
                    {formatDate(entry.created_at)}
                  </p>
                </div>
              </div>
            </ScrollReveal>
          ))}

          {entries.length === 0 && (
            <div className="col-span-2 text-center py-16">
              <p className="font-display text-xl text-white/20 font-light">
                Your journal is waiting.
              </p>
              <p className="font-body text-sm text-white/10 mt-3">
                Begin by writing your first reflection.
              </p>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
