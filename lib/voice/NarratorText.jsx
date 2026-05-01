'use client';
// ═══════════════════════════════════════════════════════════════
//  S E A   W I T H I N  —  NarratorText
//
//  Renders narrator lines with a smokey materialization effect.
//  Each line emerges from soft blur → clarity, like breath
//  condensing on cold glass, with a faint blue luminance.
//
//  Reusable across every day, every season.
// ═══════════════════════════════════════════════════════════════

import { useMemo } from 'react';
import { VOICE_CONFIG } from './voiceConfig';

const { animationMs, staggerMs } = VOICE_CONFIG.textReveal;

export function NarratorText({ lines, activeIndex, className }) {
  const delays = useMemo(
    () => (lines ?? []).map((_, i) => i * staggerMs),
    [lines],
  );

  if (!lines?.length) return null;

  return (
    <div className={className} role="log" aria-live="polite" aria-relevant="additions">
      {lines.map((line, i) => {
        const revealed = i <= activeIndex;

        return (
          <p
            key={i}
            className="narrator-line"
            data-revealed={revealed}
            style={{
              // ── Smoke materialization ──
              opacity:    revealed ? 1 : 0,
              filter:     revealed ? 'blur(0px)' : 'blur(18px)',
              transform:  revealed
                ? 'translateY(0) scale(1)'
                : 'translateY(8px) scale(0.985)',
              color:      revealed
                ? 'var(--narrator-color-solid, #d4dce8)'
                : 'var(--narrator-color-smoke, transparent)',
              textShadow: revealed
                ? [
                    '0 0 32px var(--narrator-glow, rgba(120,160,210,0.35))',
                    '0 0 8px var(--narrator-glow-inner, rgba(140,175,220,0.18))',
                  ].join(', ')
                : '0 0 40px var(--narrator-glow, rgba(120,160,210,0.55))',

              // ── Timing — all five properties, one organic motion ──
              transition: [
                `opacity ${animationMs}ms cubic-bezier(0.22, 0.61, 0.36, 1)`,
                `filter ${animationMs * 1.1}ms cubic-bezier(0.22, 0.61, 0.36, 1)`,
                `transform ${animationMs}ms cubic-bezier(0.22, 0.61, 0.36, 1)`,
                `color ${animationMs * 0.8}ms ease`,
                `text-shadow ${animationMs * 1.2}ms ease`,
              ].join(', '),
              transitionDelay: revealed ? `${delays[i]}ms` : '0ms',

              // ── Typography ──
              margin:        0,
              padding:       '0.6em 0',
              lineHeight:    1.85,
              letterSpacing: '0.025em',
              willChange:    revealed ? 'auto' : 'opacity, filter, transform',
            }}
            aria-hidden={!revealed}
          >
            {line.text}
          </p>
        );
      })}
    </div>
  );
}
