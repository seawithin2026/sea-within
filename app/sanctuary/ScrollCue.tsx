"use client";

export default function ScrollCue({ scrollProgress }) {
  return (
    <div
      className="sea-scroll-right"
      style={{
        opacity: scrollProgress < 0.92 ? 1 - scrollProgress : 0,
        transform: `translateY(calc(-50% + ${scrollProgress * 20}px))`,
      }}
    >
      <p className="sea-scroll-word">SCROLL</p>

      <div className="sea-scroll-arrows">
        <span className="chevron-line">⌄</span>
        <span className="chevron-line">⌄</span>
      </div>
    </div>
  );
}
