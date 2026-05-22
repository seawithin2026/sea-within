"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

export default function DashboardPage() {
  const [loading, setLoading] = useState(true);
  const [userName, setUserName] = useState<string | null>(null);
  const [nextBloom, setNextBloom] = useState<any>(null);
  const [garden, setGarden] = useState<any[]>([]);

  useEffect(() => {
    async function loadData() {
      // ⭐ Later: fetch user, next bloom, garden from Supabase
      setLoading(false);
    }
    loadData();
  }, []);

  if (loading) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-slate-950 text-white/70">
        Loading your dashboard…
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-950 text-white p-10 flex flex-col gap-12">

      {/* HEADER */}
      <section>
        <h1 className="text-3xl tracking-[0.15em] uppercase text-white/80">
          Welcome back{userName ? `, ${userName}` : ""}
        </h1>
        <p className="text-white/50 mt-2">
          Your journey continues. Here is your current cycle and your garden.
        </p>
      </section>

      {/* CURRENT CYCLE */}
      <section className="bg-black/30 border border-white/10 rounded-2xl p-6 backdrop-blur-xl">
        <h2 className="text-xl tracking-[0.15em] uppercase text-white/70 mb-4">
          Current Cycle
        </h2>

        {nextBloom ? (
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white/80">Your next bloom is forming…</p>
              <p className="text-white/50 text-sm mt-1">
                Level {nextBloom.level} • {nextBloom.element}
              </p>
            </div>

            <Link
              href="/journal"
              className="px-4 py-2 rounded-lg bg-white/10 border border-white/20 text-sm"
            >
              Continue Journal
            </Link>
          </div>
        ) : (
          <div className="text-white/50">
            You haven’t started a cycle yet.
            <Link href="/journal" className="underline ml-2">
              Begin your first entry
            </Link>
          </div>
        )}
      </section>

      {/* GARDEN */}
      <section className="bg-black/30 border border-white/10 rounded-2xl p-6 backdrop-blur-xl">
        <h2 className="text-xl tracking-[0.15em] uppercase text-white/70 mb-4">
          Your Garden
        </h2>

        {garden.length === 0 ? (
          <p className="text-white/50">
            Your garden is empty. Complete a cycle to grow your first bloom.
          </p>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {garden.map((bloom) => (
              <div
                key={bloom.id}
                className="bg-white/5 border border-white/10 rounded-xl p-3 flex flex-col gap-2"
              >
                <img
                  src={bloom.still_url}
                  alt={bloom.title}
                  className="rounded-lg object-cover aspect-[4/5]"
                />
                <p className="text-sm text-white/80">{bloom.title}</p>
                <p className="text-xs text-white/50">
                  Level {bloom.level} • {bloom.element}
                </p>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* NAVIGATION */}
      <section className="flex gap-4">
        <Link
          href="/journal"
          className="px-4 py-2 rounded-lg bg-white/10 border border-white/20 text-sm"
        >
          Journal
        </Link>

        <Link
          href="/garden"
          className="px-4 py-2 rounded-lg bg-white/10 border border-white/20 text-sm"
        >
          Garden
        </Link>

        <Link
          href="/bloom-test"
          className="px-4 py-2 rounded-lg bg-white/10 border border-white/20 text-sm"
        >
          Bloom Test Lab
        </Link>
      </section>
    </main>
  );
}
