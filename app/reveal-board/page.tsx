"use client";

export default function RevealBoard() {
  const message = {
    country: "Canada",
    date: "2026-05-09",
    time: "00:21",
    text: "Even in the deepest water, your breath is a lantern.",
  };

  return (
    <main
      className="min-h-screen w-full flex flex-col items-center"
      style={{ backgroundColor: "var(--sea-dark)", color: "var(--ocean-light)" }}
    >
      {/* ============================
          HERO VIDEO (CINEMATIC)
      ============================ */}
      <section className="video-section">
        <video
          src="https://cdn.pixabay.com/video/2024/03/26/206421_large.mp4"
          autoPlay
          loop
          muted
          playsInline
        />
        <div className="video-overlay" />

        {/* Title Overlay */}
        <div className="relative z-10 h-full w-full flex flex-col justify-end">
          <div className="max-w-5xl mx-auto px-6 pb-20">
            <p
              className="text-xs uppercase"
              style={{ letterSpacing: "0.3em", color: "var(--ocean-mist)" }}
            >
              Sea Within
            </p>
            <h1 className="text-5xl md:text-6xl font-light golden-glow">
              Reveal Board
            </h1>
          </div>
        </div>
      </section>

      {/* ============================
          SACRED MESSAGE PANEL
      ============================ */}
      <section className="w-full max-w-3xl px-6 -mt-32 pb-32 relative">
        {/* Ambient Glow */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "radial-gradient(circle at center, rgba(0,120,255,0.12), transparent 70%)",
            filter: "blur(40px)",
            zIndex: -1,
          }}
        />

        <div className="sanctuary-card p-12 rounded-2xl relative overflow-hidden shadow-2xl">

          {/* Floating Caustics */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              opacity: 0.18,
              background:
                "radial-gradient(circle at 30% 20%, rgba(255,255,255,0.18), transparent 60%), radial-gradient(circle at 80% 80%, rgba(0,150,255,0.18), transparent 60%)",
              animation: "floatGlow 12s ease-in-out infinite",
            }}
          />

          {/* Header */}
          <p
            className="text-xs uppercase mb-6"
            style={{ letterSpacing: "0.35em", color: "var(--ocean-mist)" }}
          >
            Anonymous — {message.country} — {message.date} — {message.time}
          </p>

          {/* Message */}
          <p
            className="whisper-text visible"
            style={{
              fontSize: "1.8rem",
              lineHeight: 1.7,
              color: "var(--golden-soft)",
              textShadow:
                "0 0 20px rgba(229,173,67,0.25), 0 0 40px rgba(229,173,67,0.15)",
            }}
          >
            {message.text}
          </p>
        </div>
      </section>
    </main>
  );
}
