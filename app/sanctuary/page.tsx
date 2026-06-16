import { redirect } from 'next/navigation';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import VideoGrid from './VideoGrid';

export default async function SanctuaryPage() {
  const supabase = createServerSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();

  // if (!user) redirect('/login');

  return (
    <main className="min-h-screen bg-black text-white sanctuary-root">

      {/* HERO VIDEO */}
      <section className="relative w-full h-[130vh] overflow-hidden sanctuary-video">
        <video
          src="/video-season1/season-1-hero.mp4"
          autoPlay
          loop
          muted
          playsInline
          className="w-full h-full object-cover"
        />

        {/* OVERLAY TEXT */}
        <div 
          className="absolute inset-0 flex flex-col justify-end px-10 sanctuary-hero-text"
          style={{ paddingBottom: "51rem" }}
        >
          <p 
            className="uppercase text-slate-200 sanctuary-hero-subtitle"
            style={{
              fontSize: "0.85rem",
              letterSpacing: "0.38em",
              marginBottom: "1.2rem",
              opacity: 0.92,
            }}
          >
            Welcome Home Beautiful Souls
          </p>

          <h1
            className="font-light text-slate-100 sanctuary-hero-title"
            style={{
              fontSize: "2.9rem",
              lineHeight: "1.45",
              maxWidth: "38rem",
              textShadow: "0 0 22px rgba(0,0,0,0.65)",
            }}
          >
            This is how your story begins.
          </h1>

          <p
            className="text-slate-300 sanctuary-hero-subtext"
            style={{
              marginTop: "1.8rem",
              fontSize: "1.25rem",
              letterSpacing: "0.08em",
              opacity: 0.95,
            }}
          >
            Living is Feeling.
          </p>
        </div>
      </section>

      {/* DIVIDER */}
      <div className="w-full h-42 bg-gradient-to-b from-black/0 to-black"></div>

      {/* GRID SECTION */}
      <section className="max-w-6xl mx-auto px-6 pb-32">
        <h2 className="text-center text-2xl md:text-3xl font-light mb-12 tracking-wide">
          Your Ritual Journey Into Self
        </h2>

        {/* CLIENT COMPONENT */}
        <VideoGrid />
      </section>

    </main>
  );
}
