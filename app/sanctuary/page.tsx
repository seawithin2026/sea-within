import { redirect } from 'next/navigation';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import Link from 'next/link';

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
            Season 1 — Living is Feeling.
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

        <div className="grid gap-10 md:grid-cols-3">

          {/* DAY 1 */}
          <Link
            href="/sanctuary/season-1/day-1"
            className="group relative overflow-hidden rounded-2xl border border-slate-700 hover:border-slate-300 transition"
          >
            <div className="absolute inset-0 bg-gradient-to-b from-black/0 to-black/70 z-10"></div>
            <video
              src="/video-season1/day-1.mp4"
              autoPlay
              loop
              muted
              playsInline
              className="sanctuary-card-video group-hover:scale-105 transition duration-700"
            />
            <div className="absolute bottom-6 left-6 z-20">
              <p className="text-xs text-slate-300">Day 1</p>
              <p className="text-lg font-light">Water Purification Ritual</p>
            </div>
          </Link>

          {/* DAY 2 */}
          <Link
            href="/sanctuary/season-1/day-2"
            className="group relative overflow-hidden rounded-2xl border border-slate-700 hover:border-slate-300 transition"
          >
            <div className="absolute inset-0 bg-gradient-to-b from-black/0 to-black/70 z-10"></div>
            <video
              src="/video-season1/day-2.mp4"
              autoPlay
              loop
              muted
              playsInline
              className="sanctuary-card-video group-hover:scale-105 transition duration-700"
            />
            <div className="absolute bottom-6 left-6 z-20">
              <p className="text-xs text-slate-300">Day 2</p>
              <p className="text-lg font-light">Triple Flame Ritual</p>
            </div>
          </Link>

          {/* DAY 3 */}
          <Link
            href="/sanctuary/season-1/day-3"
            className="group relative overflow-hidden rounded-2xl border border-slate-700 hover:border-slate-300 transition"
          >
            <div className="absolute inset-0 bg-gradient-to-b from-black/0 to-black/70 z-10"></div>
            <video
              src="/video-season1/day-3.mp4"
              autoPlay
              loop
              muted
              playsInline
              className="sanctuary-card-video group-hover:scale-105 transition duration-700"
            />
            <div className="absolute bottom-6 left-6 z-20">
              <p className="text-xs text-slate-300">Day 3</p>
              <p className="text-lg font-light">Grounding Ritual</p>
            </div>
          </Link>

          {/* DAY 4 */}
          <Link
            href="/sanctuary/season-1/day-4"
            className="group relative overflow-hidden rounded-2xl border border-slate-700 hover:border-slate-300 transition"
          >
            <div className="absolute inset-0 bg-gradient-to-b from-black/0 to-black/70 z-10"></div>
            <video
              src="/video-season1/day4-hero.mp4"
              autoPlay
              loop
              muted
              playsInline
              className="sanctuary-card-video group-hover:scale-105 transition duration-700"
            />
            <div className="absolute bottom-6 left-6 z-20">
              <p className="text-xs text-slate-300">Day 4</p>
              <p className="text-lg font-light">Protection Ritual</p>
            </div>
          </Link>

          {/* DAY 5 */}
          <Link
            href="/sanctuary/season-1/day-5"
            className="group relative overflow-hidden rounded-2xl border border-slate-700 hover:border-slate-300 transition"
          >
            <div className="absolute inset-0 bg-gradient-to-b from-black/0 to-black/70 z-10"></div>
            <video
              src="/video-season1/day-5.mp4"
              autoPlay
              loop
              muted
              playsInline
              className="sanctuary-card-video group-hover:scale-105 transition duration-700"
            />
            <div className="absolute bottom-6 left-6 z-20">
              <p className="text-xs text-slate-300">Day 5</p>
              <p className="text-lg font-light">Breath of Life Ritual</p>
            </div>
          </Link>

          {/* DAY 6 */}
          <Link
            href="/sanctuary/season-1/day-6"
            className="group relative overflow-hidden rounded-2xl border border-slate-700 hover:border-slate-300 transition"
          >
            <div className="absolute inset-0 bg-gradient-to-b from-black/0 to-black/70 z-10"></div>
            <video
              src="/video-season1/day-6.mp4"
              autoPlay
              loop
              muted
              playsInline
              className="sanctuary-card-video group-hover:scale-105 transition duration-700"
            />
            <div className="absolute bottom-6 left-6 z-20">
              <p className="text-xs text-slate-300">Day 6</p>
              <p className="text-lg font-light">The Ancient Sun Greeting Ritual</p>
            </div>
          </Link>

          {/* DAY 7 */}
          <Link
            href="/sanctuary/season-1/day-7"
            className="group relative overflow-hidden rounded-2xl border border-slate-700 hover:border-slate-300 transition"
          >
            <div className="absolute inset-0 bg-gradient-to-b from-black/0 to-black/70 z-10"></div>
            <video
              src="/video-season1/day-7.mp4"
              autoPlay
              loop
              muted
              playsInline
              className="sanctuary-card-video group-hover:scale-105 transition duration-700"
            />
            <div className="absolute bottom-6 left-6 z-20">
              <p className="text-xs text-slate-300">Day 7</p>
              <p className="text-lg font-light">The Wind Ritual</p>
            </div>
          </Link>

           {/* DAY 8 */}
          <Link
            href="/sanctuary/season-1/day-8"
            className="group relative overflow-hidden rounded-2xl border border-slate-700 hover:border-slate-300 transition"
          >
            <div className="absolute inset-0 bg-gradient-to-b from-black/0 to-black/70 z-10"></div>
            <video
              src="/video-season1/day-8.mp4"
              autoPlay
              loop
              muted
              playsInline
              className="sanctuary-card-video group-hover:scale-105 transition duration-700"
            />
            <div className="absolute bottom-6 left-6 z-20">
              <p className="text-xs text-slate-300">Day 8</p>
              <p className="text-lg font-light">The Shadow Ritual</p>
            </div>
          </Link>

          {/* DAY 9 */}
          <Link
            href="/sanctuary/season-1/day-9"
            className="group relative overflow-hidden rounded-2xl border border-slate-700 hover:border-slate-300 transition"
          >
            <div className="absolute inset-0 bg-gradient-to-b from-black/0 to-black/70 z-10"></div>
            <video
              src="/video-season1/day-9.mp4"
              autoPlay
              loop
              muted
              playsInline
              className="sanctuary-card-video group-hover:scale-105 transition duration-700"
            />
            <div className="absolute bottom-6 left-6 z-20">
              <p className="text-xs text-slate-300">Day 9</p>
              <p className="text-lg font-light">The Heart‑Fire Ritual</p>
            </div>
          </Link>

          
          {/* DAY 10 */}
          <Link
            href="/sanctuary/season-1/day-10"
            className="group relative overflow-hidden rounded-2xl border border-slate-700 hover:border-slate-300 transition"
          >
            <div className="absolute inset-0 bg-gradient-to-b from-black/0 to-black/70 z-10"></div>
            <video
              src="/video-season1/day-10.mp4"
              autoPlay
              loop
              muted
              playsInline
              className="sanctuary-card-video group-hover:scale-105 transition duration-700"
            />
            <div className="absolute bottom-6 left-6 z-20">
              <p className="text-xs text-slate-300">Day 10</p>
              <p className="text-lg font-light">The Stillness Ritual</p>
            </div>
          </Link>

        </div>
      </section>

    </main>
  );
}
