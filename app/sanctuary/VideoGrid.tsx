"use client";

import Link from "next/link";

export default function VideoGrid() {
  return (
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

      {/* DAY 7 — slowed */}
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
          onLoadedMetadata={(e) => { e.currentTarget.playbackRate = 0.5; }}
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

      {/* DAY 11 — slowed */}
      <Link
        href="/sanctuary/season-1/day-11"
        className="group relative overflow-hidden rounded-2xl border border-slate-700 hover:border-slate-300 transition"
      >
        <div className="absolute inset-0 bg-gradient-to-b from-black/0 to-black/70 z-10"></div>
        <video
          src="/video-season1/day-11.mp4"
          autoPlay
          loop
          muted
          playsInline
          className="sanctuary-card-video group-hover:scale-105 transition duration-700"
          onLoadedMetadata={(e) => { e.currentTarget.playbackRate = 0.4; }}
        />
        <div className="absolute bottom-6 left-6 z-20">
          <p className="text-xs text-slate-300">Day 11</p>
          <p className="text-lg font-light">The Cold Water Ritual</p>
        </div>
      </Link>

      {/* DAY 12 */}
      <Link
        href="/sanctuary/season-1/day-12"
        className="group relative overflow-hidden rounded-2xl border border-slate-700 hover:border-slate-300 transition"
      >
        <div className="absolute inset-0 bg-gradient-to-b from-black/0 to-black/70 z-10"></div>
        <video
          src="/video-season1/day-12.mp4"
          autoPlay
          loop
          muted
          playsInline
          className="sanctuary-card-video group-hover:scale-105 transition duration-700"
        />
        <div className="absolute bottom-6 left-6 z-20">
          <p className="text-xs text-slate-300">Day 12</p>
          <p className="text-lg font-light">The Qi Cultivation Ritual</p>
        </div>
      </Link>

    </div>
  );
}
