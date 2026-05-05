'use client';

import { useState } from 'react';

export default function JoinPage() {
  const [isLoading, setIsLoading] = useState(false);

  const handleJoin = async (plan: 'monthly' | 'yearly') => {
    setIsLoading(true);

    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ plan }),
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
         Enter the doorway into the world you&apos;ve been sensing all along.
        </p>

        {/* MONTHLY */}
        <button
          onClick={() => handleJoin('monthly')}
          disabled={isLoading}
          className="btn-golden w-full py-4 text-lg disabled:opacity-50"
        >
          {isLoading ? 'Opening the door…' : 'Enter the Sanctuary — $77/month'}
        </button>

        {/* YEARLY */}
        <button
          onClick={() => handleJoin('yearly')}
          disabled={isLoading}
          className="btn-golden w-full py-4 text-lg disabled:opacity-50 mt-4"
        >
          {isLoading ? 'Opening the door…' : 'Enter the Sanctuary — $770/year (Save 2 Months)'}
        </button>

      </section>
    </main>
  );
}
