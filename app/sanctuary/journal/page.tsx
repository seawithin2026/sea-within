"use client";

import { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";
import Navigation from "@/components/layout/Navigation";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function JournalPage() {
  const [entry, setEntry] = useState("");
  const [charCount, setCharCount] = useState(0);
  const [entries, setEntries] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Load entries on mount
  useEffect(() => {
    fetchEntries();
  }, []);

  async function fetchEntries() {
    setLoading(true);

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      setLoading(false);
      return;
    }

    const { data, error } = await supabase
      .from("journal_entries")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });

    if (!error && data) {
      setEntries(data);
    }

    setLoading(false);
  }

  async function saveEntry() {
    if (!entry.trim()) return;

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return;

    const { error } = await supabase.from("journal_entries").insert({
      user_id: user.id,
      content: entry,
    });

    if (!error) {
      setEntry("");
      setCharCount(0);
      fetchEntries();
    }
  }

  return (
    <div className="min-h-screen bg-[#0b0f14] text-white">
      <Navigation />

      {/* HERO */}
      <section className="pt-24 pb-10 text-center">
        <h1 className="text-3xl tracking-[0.18em] uppercase text-white/90">
          Your Journal
        </h1>
        <p className="mt-3 text-white/60 max-w-xl mx-auto">
          A quiet place to reflect, release, and return to yourself.
        </p>
      </section>

      {/* WRITING AREA */}
      <section className="max-w-2xl mx-auto px-6">
        <div className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-xl shadow-[0_0_40px_rgba(0,0,0,0.4)]">
          <textarea
            value={entry}
            onChange={(e) => {
              setEntry(e.target.value);
              setCharCount(e.target.value.length);
            }}
            placeholder="Write what’s on your heart..."
            className="w-full h-40 bg-transparent outline-none resize-none text-white placeholder-white/30"
          />

          <div className="flex items-center justify-between mt-4">
            <span className="text-white/40 text-sm">{charCount} characters</span>

            <button
              onClick={saveEntry}
              className="px-6 py-2 rounded-full bg-gradient-to-r from-amber-400 to-rose-400 text-black font-semibold shadow-lg hover:opacity-90 transition"
            >
              Save Entry
            </button>
          </div>
        </div>
      </section>

      {/* ENTRIES LIST */}
      <section className="max-w-4xl mx-auto px-6 mt-12 pb-24">
        {loading ? (
          <p className="text-center text-white/40">Loading your entries…</p>
        ) : entries.length === 0 ? (
          <p className="text-center text-white/40">Your journal is waiting for your first entry.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {entries.map((item) => (
              <div
                key={item.id}
                className="bg-white/5 border border-white/10 rounded-2xl p-5 backdrop-blur-xl shadow-[0_0_30px_rgba(0,0,0,0.35)]"
              >
                <p className="text-white/80 whitespace-pre-wrap">{item.content}</p>
                <p className="mt-4 text-xs text-white/40">
                  {new Date(item.created_at).toLocaleDateString()}
                </p>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}