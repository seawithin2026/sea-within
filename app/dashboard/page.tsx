"use client";

export default function DashboardPage() {
  // ⭐ Fake seed data
  const seed = {
    level: 3,
    growth: 72, // %
    wateredToday: true,
    nextGrowthIn: "14 hours",
  };

  // ⭐ Fake next bloom
  const nextBloom = {
    element: "water",
    progress: 45, // %
    eta: "4–6 days",
  };

  // ⭐ Fake garden blooms
  const garden = [
    {
      id: "b1",
      title: "Water Bloom",
      level: 3,
      element: "water",
      still_url: "/placeholder-flower-1.jpg",
    },
    {
      id: "b2",
      title: "Fire Bloom",
      level: 2,
      element: "fire",
      still_url: "/placeholder-flower-2.jpg",
    },
    {
      id: "b3",
      title: "Earth Bloom",
      level: 4,
      element: "earth",
      still_url: "/placeholder-flower-3.jpg",
    },
  ];

  // ⭐ Fake season progress
  const season = {
    name: "Season of Water",
    progress: 12,
    total: 17,
  };

  return (
    <main className="min-h-screen bg-slate-950 text-white p-10 flex flex-col gap-12">

      {/* SEED */}
      <section className="bg-black/30 border border-white/10 rounded-2xl p-6 backdrop-blur-xl">
        <h2 className="text-xl tracking-[0.15em] uppercase text-white/70 mb-4">
          Your Seed
        </h2>

        <p className="text-white/80">Level {seed.level}</p>
        <p className="text-white/50 mt-1">Growth: {seed.growth}%</p>
        <p className="text-white/50 mt-1">
          Next growth in: {seed.nextGrowthIn}
        </p>

        <p className="text-white/60 mt-4">
          {seed.wateredToday
            ? "You watered your seed today."
            : "Your seed is thirsty — visit to water it."}
        </p>
      </section>

      {/* NEXT BLOOM */}
      <section className="bg-black/30 border border-white/10 rounded-2xl p-6 backdrop-blur-xl">
        <h2 className="text-xl tracking-[0.15em] uppercase text-white/70 mb-4">
          Next Bloom
        </h2>

        <p className="text-white/80">Element: {nextBloom.element}</p>
        <p className="text-white/50 mt-1">Progress: {nextBloom.progress}%</p>
        <p className="text-white/50 mt-1">Estimated bloom: {nextBloom.eta}</p>
      </section>

      {/* GARDEN */}
      <section className="bg-black/30 border border-white/10 rounded-2xl p-6 backdrop-blur-xl">
        <h2 className="text-xl tracking-[0.15em] uppercase text-white/70 mb-4">
          Your Garden
        </h2>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {garden.map((bloom) => (
            <div
              key={bloom.id}
              className="bg-white/5 border border-white/10 rounded-xl p-3 flex flex-col gap-2"
            >
              <div className="aspect-[4/5] bg-white/10 rounded-lg" />
              <p className="text-sm text-white/80">{bloom.title}</p>
              <p className="text-xs text-white/50">
                Level {bloom.level} • {bloom.element}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* SEASON */}
      <section className="bg-black/30 border border-white/10 rounded-2xl p-6 backdrop-blur-xl">
        <h2 className="text-xl tracking-[0.15em] uppercase text-white/70 mb-4">
          Season Progress
        </h2>

        <p className="text-white/80">{season.name}</p>
        <p className="text-white/50 mt-1">
          {season.progress} / {season.total} days
        </p>
      </section>
    </main>
  );
}
