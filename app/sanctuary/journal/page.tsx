import React from "react";

type FlowerBloomProps = {
  level: number;          // bloom level (1, 2, 3, ...)
  size?: number;          // px
};

export const FlowerBloom: React.FC<FlowerBloomProps> = ({ level, size = 220 }) => {
  // --- CORE LOGIC ---

  // Petal count grows with level (clamped)
  const petalCount = Math.min(6 + level * 2, 24);

  // Glow intensity (0–1)
  const glowIntensity = Math.min(0.2 + level * 0.03, 0.9);

  // Color depth: interpolate between soft and rich
  // You can tweak these to match your palette
  const baseHue = 320; // magenta / rosy
  const saturation = Math.min(40 + level * 3, 90);
  const lightness = Math.max(70 - level * 1.2, 40);

  const petalColor = `hsl(${baseHue}, ${saturation}%, ${lightness}%)`;
  const centerColor = `hsl(${baseHue}, ${Math.min(
    saturation + 10,
    100
  )}%, ${Math.max(lightness - 10, 30)}%)`;

  // Generate petals as rotated shapes around center
  const petals = Array.from({ length: petalCount }).map((_, i) => {
    const angle = (360 / petalCount) * i;
    return (
      <g key={i} transform={`rotate(${angle})`}>
        <path
          d="M0,-10 C20,-40 20,-80 0,-110 C-20,-80 -20,-40 0,-10 Z"
          fill={petalColor}
          fillOpacity={0.9}
        />
      </g>
    );
  });

  const viewBoxSize = 240;

  return (
    <div
      style={{
        width: size,
        height: size,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        filter: `drop-shadow(0 0 ${12 + glowIntensity * 30}px rgba(255, 180, 255, ${
          0.3 + glowIntensity * 0.4
        }))`,
        transition: "filter 400ms ease",
      }}
    >
      <svg
        width={size}
        height={size}
        viewBox={`-${viewBoxSize / 2} -${viewBoxSize / 2} ${viewBoxSize} ${viewBoxSize}`}
      >
        {/* Soft aura circle */}
        <circle
          cx={0}
          cy={0}
          r={90 + glowIntensity * 20}
          fill={`radial-gradient(circle, rgba(255,255,255,0.4) 0%, rgba(0,0,0,0) 70%)`}
        />
        {/* Fallback aura using plain SVG fill */}
        <circle
          cx={0}
          cy={0}
          r={90 + glowIntensity * 20}
          fill={`rgba(255, 200, 255, ${0.08 + glowIntensity * 0.12})`}
        />

        {/* Petals */}
        {petals}

        {/* Center */}
        <circle cx={0} cy={0} r={22} fill={centerColor} />
        <circle cx={0} cy={0} r={10} fill="rgba(255,255,255,0.7)" />
      </svg>
    </div>
  );
};
// Example in a page or component
export default function Example() {
  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        gap: 24,
        alignItems: "center",
        justifyContent: "center",
        background: "#f7f0ea",
      }}
    >
      <FlowerBloom level={1} />
      <FlowerBloom level={5} />
      <FlowerBloom level={12} />
    </div>
  );
}
