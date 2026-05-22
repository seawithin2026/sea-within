import { BloomReveal } from "@/components/bloom/BloomReveal";

const mockBloomVideo = {
  id: "bloom-01",
  src: "/bloom-videos/bloom-01.mp4",
  title: "First Bloom",
  level: 1,
};

export default function DashboardPage() {
  // In your real logic, `earned` becomes true when the cycle is complete.
  const earned = true;

  return (
    <main className="min-h-screen flex items-center justify-center bg-slate-950">
      <BloomReveal
        earned={earned}
        bloomVideo={mockBloomVideo}
        onSaved={(bloomId) => {
          console.log("Bloom saved:", bloomId);
          // Here you can:
          // - show toast
          // - refresh garden
          // - spawn new seed, etc.
        }}
      />
    </main>
  );
}
