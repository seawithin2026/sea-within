"use client";

const demoMessage = {
  country: "Canada",
  date: "2026-05-09",
  time: "00:21",
  text: "Even in the deepest water, your breath is a lantern.",
};

export default function RevealBoard() {
  const message = demoMessage; // later: replace with real data

  return (
    <main
      className="min-h-screen w-full flex flex-col items-center"
      style={{ backgroundColor: "var(--sea-dark)", color: "var(--ocean-light)" }}
    >
      {/* HERO VIDEO */}
      <section className="video-section">
        <video
          src="https://cdn.pixabay.com/video/2024/03/26/206421_large.mp4"
          autoPlay
          loop
          muted
          playsInline
        />
        <div className="video-overlay" />

        {/* Hero text overlay */}
        <div className="relative z-10 h-full w-full flex flex-col justify-end">
          <div className="max-w-5xl mx-auto px-6 pb-16">
            <p
              className="text-xs uppercase"
              style={{
                letterSpacing: "0.3em",
                color: "var(--ocean-mist)",
              }}
            >
              Sea Within
            </p>
            <h1 className="text-4xl md:text-5xl font-light golden-glow">
              Reveal Board
            </h1>
          </div>
        </div>
      </section>

      {/* SACRED MESSAGE AREA */}
      <section className="w-full max-w-3xl px-6 pb-24 relative" style={{ marginTop: "-80px" }}>
        <div className="sanctuary-card p-10 md:p-12 relative overflow-hidden">
          {/* Soft glow */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              opacity: 0.18,
              background:
                "radial-gradient(circle at 30% 20%, rgba(255,255,255,0.18), transparent 60%), radial-gradient(circle at 80% 80%, rgba(0,150,255,0.18), transparent 60%)",
            }}
          />

          <div className="relative">
            {/* Header line */}
            <p
              className="text-xs uppercase mb-4"
              style={{
                letterSpacing: "0.35em",
                color: "var(--ocean-mist)",
              }}
            >
              Anonymous — {message.country} — {message.date} — {message.time}
            </p>

            {/* Message text */}
            <p
              className="whisper-text visible"
              style={{
                fontSize: "1.4rem",
                lineHeight: 1.7,
                color: "var(--golden-soft)",
              }}
            >
              {message.text}
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
