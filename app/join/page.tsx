'use client';

export default function JoinPage() {
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

        {/* BUTTON → REVEAL PAGE */}
        <a
          href="/reveal"
          className="btn-golden w-full py-4 text-lg inline-block"
        >
          See Membership Options
        </a>

      </section>
    </main>
  );
}
