'use client';

import { useState } from 'react';
import Navigation from '@/components/layout/Navigation';

export default function JoinPage() {
  const [isLoading, setIsLoading] = useState(false);

  const handleJoin = async () => {
    setIsLoading(true);

    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ plan: 'monthly' }),
      });

      const data = await res.json();

      if (data.url) {
        window.location.href = data.url;
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-sanctuary-dark text-sea-100">
      <Navigation />

      <section className="relative px-6 pt-32 pb-40 max-w-2xl mx-auto text-center">

        {/* Ambient glow */}
        <div className="pointer-events-none absolute inset-0 -z-10">
          <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full bg-golden-400/5 blur-[140px]" />
        </div>

        <h1 className="font-display text-4xl md:text-5xl font-light mb-10 leading-snug">
          When you&apos;re ready,
          <br />
          <span className="text-golden-400/80">the sanctuary opens with a single step.</span>
        </h1>

        <p className="font-body text-lg text-white/70 leading-relaxed mb-12">
          No forms. No barriers.  
          Just the doorway into the world you&apos;ve been sensing all along.
        </p>

        <button
          onClick={handleJoin}
          disabled={isLoading}
          className="btn-golden w-full py-4 text-lg disabled:opacity-50"
        >
          {isLoading ? 'Opening the door…' : 'Enter the Sanctuary — $77/month'}
        </button>
      </section>
    </main>
  );
}
