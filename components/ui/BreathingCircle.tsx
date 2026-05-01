'use client';

export default function BreathingCircle({ size = 120 }: { size?: number }) {
  return (
    <div className="relative flex items-center justify-center">
      <div
        className="absolute rounded-full border border-golden-600/80 animate-breathe"
        style={{ width: size * 1.5, height: size * 1.5 }}
      />
      <div
        className="absolute rounded-full border border-golden-400/70 animate-breathe"
        style={{ width: size * 1.2, height: size * 1.2, animationDelay: '1s' }}
      />
      <div
        className="rounded-full border border-golden-600/80 animate-breathe"
        style={{ width: size, height: size, animationDelay: '2s' }}
      />
      <div className="absolute w-2 h-2 rounded-full bg-golden-400/60 animate-glow" />
    </div>
  );
}
