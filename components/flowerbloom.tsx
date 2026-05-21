import React from "react";

type FlowerBloomProps = {
  level: number;
  size?: number;
};

export default function FlowerBloom({ level, size = 220 }: FlowerBloomProps) {
  const petalCount = Math.min(6 + level * 2, 24);
  const glowIntensity = Math.min(0.2 + level * 0.03, 0.9);

  const baseHue = 320;
  const saturation = Math.min(40 + level * 3, 90);
  const lightness = Math.max(70 - level * 1.2, 40);

  const petalColor = `hsl(${baseHue}, ${saturation}%, ${lightness}%)`;
  const centerColor = `hsl(${baseHue}, ${Math.min(
    saturation + 10,
    100
  )}%, ${Math.max(lightness - 10, 30)}%)`;

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
        <circle
          cx={0}
          cy={0}
          r={90 + glowIntensity * 20}
          fill={`rgba(255, 200, 255, ${0.08 + glowIntensity * 0.12})`}
        />

        {petals}

        <circle cx={0} cy={0} r={22} fill={centerColor} />
        <circle cx={0} cy={0} r={10} fill="rgba(255,255,255,0.7)" />
      </svg>
    </div>
  );
}
