'use client';

import ScrollReveal from '@/components/ui/ScrollReveal';
import Navigation from '@/components/layout/Navigation';
import { useState } from 'react';

export default function RevealPage() {
  const [loading, setLoading] = useState(false);

  const handleJoin = async (plan: 'monthly' | 'yearly') => {
    setLoading(true);

    const res = await fetch('/api/checkout', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ plan }),
    });

    const data = await res.json();
    if (data.url) {
      window.location.href = data.url;
    }

    setLoading(false);
  };

  return (
    <main className="min-h-screen bg-sanctuary-dark text-sea-100">
      <Navigation />

      <section className="relative px-6 pt-32 pb-40 max-w-3xl mx-auto">
        {/* Ambient glow */}
        <div className="pointer-events-none absolute inset-0 -z-10">
          <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full bg-golden-400/5 blur-[140px]" />
          <div className="absolute bottom-1/4 right-1/3 w-[420px] h-[420px] rounded-full bg-sea-400/10 blur-[120px]" />
        </div>

        {/* Opening whisper */}
        <ScrollReveal delay={100}>
          <p className="font-whisper text-center text-golden-400/60 tracking-[6px] uppercase mb-6">
            a quiet unveiling
          </p>
        </ScrollReveal>

        <ScrollReveal delay={200}>
          <h1 className="font-display text-4xl md:text-5xl text-center font-light mb-10 leading-snug">
            If you’ve made it this far…
            <br />
            <span className="text-golden-400/80">
              something in you recognizes this place.
            </span>
          </h1>
        </ScrollReveal>

        <ScrollReveal delay={300}>
          <p className="font-body text-lg leading-relaxed text-white/70 mb-14 text-center">
            Not from memory — from instinct. From that quiet inner knowing that has
            followed you your whole life, waiting for somewhere it could finally rest.
            Sea Within is not a program. It is a belonging — the kind you&apos;ve felt
            in your chest long before you ever had words for it. A place where the
            deeper part of you is no longer wandering alone.
          </p>
        </ScrollReveal>

        {/* The Descent */}
        <ScrollReveal delay={400}>
          <h2 className="font-display text-3xl font-light mb-4">The Descent</h2>
          <p className="font-body text-white/60 leading-relaxed mb-14">
            As you move deeper, imagine the world above softening. Light bending.
            Sound dissolving. Everything slowing into something gentler, truer.
            Here, you&apos;re not asked to perform or to be &quot;better&quot;.
            You&apos;re not asked to fix yourself. You&apos;re invited to come home —
            to your breath, to your depth, to the quiet truth beneath everything.
          </p>
        </ScrollReveal>

        {/* What Sea Within Is */}
        <ScrollReveal delay={500}>
          <h2 className="font-display text-3xl font-light mb-4">What Sea Within Is</h2>
          <p className="font-body text-white/60 leading-relaxed mb-14">
            Sea Within is a guided inner journey — a cinematic ritual space designed
            to bring you back into yourself. Inside the sanctuary, you&apos;ll find
            immersive audio descents, elemental rituals, slow sensory practices,
            grounding reflections, and storytelling that feels like water, breath,
            and light. Every piece is crafted to feel like stepping into a hidden
            underwater world — quiet, glowing, intimate.
          </p>
        </ScrollReveal>

        {/* Gathering Circle */}
        <ScrollReveal delay={600}>
          <h2 className="font-display text-3xl font-light mb-4">The Gathering Circle</h2>
          <p className="font-body text-white/60 leading-relaxed mb-14">
            You walk your inner world alone — but you don&apos;t have to feel alone
            inside it. The Gathering Circle is a quiet room of similar souls. Not a
            community platform. Not a chatroom. Not noise. A circle. A place where
            people who feel deeply, move gently, and crave meaning sit together in
            the same soft light. Each person in their own inner journey. Each person
            returning to themselves. Together. A belonging you&apos;ve been craving
            without knowing where to find it.
          </p>
        </ScrollReveal>

        {/* What You Receive */}
        <ScrollReveal delay={700}>
          <h2 className="font-display text-3xl font-light mb-4">What You Receive</h2>
          <p className="font-body text-white/60 leading-relaxed mb-14">
            You don&apos;t receive content — you receive experiences. Moments that
            soften you. Rituals that anchor you. Words that open you. Practices that
            bring you back into your body. Each month, a new descent. A new element.
            A new doorway into yourself.
          </p>
        </ScrollReveal>

        {/* Transformation */}
        <ScrollReveal delay={800}>
          <h2 className="font-display text-3xl font-light mb-4">The Transformation</h2>
          <p className="font-body text-white/60 leading-relaxed mb-14">
            Sea Within is for the part of you that feels deeply, moves quickly, and
            longs for stillness and depth. For the part that wants to reconnect with
            your inner world and is tired of surface‑level healing. This is not
            self‑improvement. This is self‑returning.
          </p>
        </ScrollReveal>

        {/* Invitation + Buttons */}
        <ScrollReveal delay={900}>
          <h2 className="font-display text-3xl font-light mb-4">The Invitation</h2>
          <p className="font-body text-white/60 leading-relaxed mb-8">
            If something in you is leaning forward — if something in you is quietly
            whispering yes — the sanctuary is open. Membership is{' '}
            <span className="text-golden-400">$77/month</span>, cancel anytime, enter
            immediately. This is your doorway.
          </p>

          {/* MONTHLY */}
          <button
            onClick={() => handleJoin('monthly')}
            disabled={loading}
            className="btn-golden w-full text-center py-4 text-lg disabled:opacity-50"
          >
            {loading ? 'Opening the door…' : 'Enter the Sanctuary — $77/month'}
          </button>

          {/* YEARLY */}
          <button
            onClick={() => handleJoin('yearly')}
            disabled={loading}
            className="btn-golden w-full text-center py-4 text-lg disabled:opacity-50 mt-4"
          >
            {loading ? 'Opening the door…' : 'Enter Yearly — $770/year'}
          </button>
        </ScrollReveal>
      </section>
    </main>
  );
}
