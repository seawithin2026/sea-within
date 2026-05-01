'use client';

import ScrollReveal from '../ui/ScrollReveal';

interface ElementSectionProps {
  element: 'earth' | 'air' | 'fire' | 'water' | 'universe';
  videoSrc: string;
  whisperText: string;
  subText?: string;
}

const elementColors = {
  earth: 'text-sand-300',
  air: 'text-sea-200',
  fire: 'text-golden-400',
  water: 'text-sea-300',
  universe: 'text-sea-100',
};

const elementGlows = {
  earth: 'rgba(213, 197, 176, 0.2)',
  air: 'rgba(161, 224, 233, 0.2)',
  fire: 'rgba(229, 173, 67, 0.3)',
  water: 'rgba(106, 200, 214, 0.2)',
  universe: 'rgba(208, 240, 244, 0.15)',
};

export default function ElementSection({
  element,
  videoSrc,
  whisperText,
  subText,
}: ElementSectionProps) {
  return (
    <section className="relative w-screen h-screen overflow-hidden">
      <video
        autoPlay muted loop playsInline
        className="absolute top-1/2 left-1/2 min-w-full min-h-full -translate-x-1/2 -translate-y-1/2 object-cover"
      >
        <source src={videoSrc} type="video/mp4" />
      </video>

      <div className="absolute inset-0 bg-sanctuary-dark/40 z-10" />

      <div className="relative z-20 h-full flex flex-col items-center justify-center px-6 text-center">
        <ScrollReveal delay={300}>
          <p
            className={`font-whisper text-sm tracking-[6px] uppercase mb-6 ${elementColors[element]}`}
            style={{ textShadow: `0 0 30px ${elementGlows[element]}` }}
          >
            {element}
          </p>
        </ScrollReveal>

        <ScrollReveal delay={600}>
          <h2
            className={`font-display text-3xl md:text-5xl lg:text-6xl font-light leading-relaxed max-w-4xl ${elementColors[element]}`}
            style={{ textShadow: `0 0 40px ${elementGlows[element]}` }}
          >
            {whisperText}
          </h2>
        </ScrollReveal>

        {subText && (
          <ScrollReveal delay={900}>
            <p className="font-body text-base md:text-lg text-white/40 mt-8 max-w-2xl leading-relaxed">
              {subText}
            </p>
          </ScrollReveal>
        )}
      </div>
    </section>
  );
}
