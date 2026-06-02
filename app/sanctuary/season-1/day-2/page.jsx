{/* HERO VIDEO */}
<section className="relative w-full h-[130vh] overflow-hidden day2-hero">
  <video
    src="/video-season1/day-2.mp4"
    autoPlay
    loop
    muted
    playsInline
    className="w-full h-full object-cover"
  />

  {/* DARK GRADIENT OVERLAY */}
  <div className="absolute inset-0 bg-gradient-to-b from-black/0 to-black/80 z-10"></div>

  {/* HERO TEXT */}
  <div 
    className="absolute inset-0 flex flex-col justify-end px-10 z-20"
    style={{ paddingBottom: "48rem" }}
  >
    <p 
      className="uppercase text-slate-200"
      style={{
        fontSize: "0.85rem",
        letterSpacing: "0.38em",
        marginBottom: "1.2rem",
        opacity: 0.92,
      }}
    >
      Sea Within · Day 2
    </p>

    <h1
      className="font-light text-slate-100"
      style={{
        fontSize: "2.9rem",
        lineHeight: "1.45",
        maxWidth: "38rem",
        textShadow: "0 0 22px rgba(0,0,0,0.65)",
      }}
    >
      Triple Flame Ritual
    </h1>

    <p
      className="text-slate-300"
      style={{
        marginTop: "1.8rem",
        fontSize: "1.25rem",
        letterSpacing: "0.08em",
        opacity: 0.95,
      }}
    >
      Awaken the Fire, the Wells, the Earth within you.
    </p>
  </div>
</section>
