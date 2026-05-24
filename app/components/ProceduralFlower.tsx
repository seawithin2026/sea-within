"use client";

import React, { useMemo } from "react";

type Props = {
  size?: number;
  level: number; // 1–20
  element?: "water" | "fire" | "earth" | "air";
};

export default function ProceduralFlower({
  size = 300,
  level,
  element = "water",
}: Props) {
  const petals = 10 + level * 3; // complexity grows with level
  const innerLayers = 4 + Math.floor(level / 2);
  const glowIntensity = 0.4 + level * 0.05;

  const palette = useMemo(() => {
    switch (element) {
      case "fire":
        return { base: "#ff9f6e", glow: "#ff4d2e", core: "#ffe8d6" };
      case "earth":
        return { base: "#c9b27d", glow: "#8fd39a", core: "#f5f0d8" };
      case "air":
        return { base: "#cfeeff", glow: "#9ad7ff", core: "#ffffff" };
      default:
        return { base: "#8fe3ff", glow: "#4fc3ff", core: "#e8faff" };
    }
  }, [element]);

  const petalsArray = Array.from({ length: petals });
  const layersArray = Array.from({ length: innerLayers });

  return (
    <div
      style={{ width: size, height: size }}
      className="relative flex items-center justify-center"
    >
      <svg viewBox="-1 -1 2 2" className="w-full h-full">
        <defs>
          {/* Outer glow */}
          <radialGradient id="outerGlow" cx="0" cy="0" r="1">
            <stop
              offset="0%"
              stopColor={palette.glow}
              stopOpacity={glowIntensity}
            />
            <stop offset="70%" stopColor={palette.glow} stopOpacity="0.1" />
            <stop offset="100%" stopColor="transparent" />
          </radialGradient>

          {/* Petal gradient */}
          <radialGradient id="petalGrad" cx="0.3" cy="0.2" r="1">
            <stop offset="0%" stopColor={palette.core} stopOpacity="1" />
            <stop offset="40%" stopColor={palette.base} stopOpacity="0.95" />
            <stop offset="100%" stopColor={palette.glow} stopOpacity="0.25" />
          </radialGradient>

          {/* Core glow */}
          <radialGradient id="coreGlow" cx="0" cy="0" r="1">
            <stop offset="0%" stopColor={palette.core} stopOpacity="1" />
            <stop offset="60%" stopColor={palette.glow} stopOpacity="0.7" />
            <stop offset="100%" stopColor="transparent" />
          </radialGradient>

          {/* Soft blur */}
          <filter id="blur" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="0.08" />
          </filter>

          {/* Bioluminescent vein noise (used as a texture source) */}
          <filter id="veinNoise" x="-50%" y="-50%" width="200%" height="200%">
            <feTurbulence
              type="fractalNoise"
              baseFrequency="1.2"
              numOctaves="4"
              seed="7"
              result="noise"
            />
            <feColorMatrix
              in="noise"
              type="matrix"
              values="
                1 0 0 0 0
                0 1 0 0 0
                0 0 1 0 0
                0 0 0 25 -15
              "
              result="highContrastNoise"
            />
          </filter>

          {/* Vein glow (for the final strokes) */}
          <filter id="veinGlow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="0.04" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          {/* Vein mask: uses noise to create branching-like gaps */}
          <mask id="veinMask">
            <rect x="-1" y="-1" width="2" height="2" fill="black" />
            <circle
              cx="0"
              cy="0"
              r="0.7"
              fill="white"
              filter="url(#veinNoise)"
            />
          </mask>
        </defs>

        {/* Outer halo */}
        <circle
          cx="0"
          cy="0"
          r="0.95"
          fill="url(#outerGlow)"
          filter="url(#blur)"
        />

        {/* Outer petals */}
        {petalsArray.map((_, i) => {
          const angle = (i / petals) * Math.PI * 2;
          const rotation = (angle * 180) / Math.PI;
          const wobble = 0.03 * Math.sin(i * 1.7 + level * 0.4);

          const path = `
            M 0 -0.15
            C -0.18 -0.25, -0.22 ${-0.55 - wobble}, 0 ${-0.55 - wobble}
            C 0.22 ${-0.55 - wobble}, 0.18 -0.25, 0 -0.15
            Z
          `;

          return (
            <g key={i} transform={`rotate(${rotation})`}>
              <path
                d={path}
                fill="url(#petalGrad)"
                stroke={palette.glow}
                strokeWidth="0.01"
                opacity={0.9}
              />
            </g>
          );
        })}

        {/* Inner fractal layers */}
        {layersArray.map((_, layer) => {
          const layerScale = 0.6 - layer * 0.1;
          const layerPetals = petals - layer * 2;

          return Array.from({ length: layerPetals }).map((_, i) => {
            const angle = (i / layerPetals) * Math.PI * 2 + layer * 0.2;
            const rotation = (angle * 180) / Math.PI;

            const path = `
              M 0 -0.1
              C -0.12 -0.18, -0.14 ${-0.3 * layerScale}, 0 ${-0.3 * layerScale}
              C 0.14 ${-0.3 * layerScale}, 0.12 -0.18, 0 -0.1
              Z
            `;

            return (
              <g key={`layer-${layer}-${i}`} transform={`rotate(${rotation})`}>
                <path
                  d={path}
                  fill={palette.base}
                  opacity={0.5}
                  stroke={palette.glow}
                  strokeWidth="0.006"
                />
              </g>
            );
          });
        })}

        {/* Bioluminescent veins (masked, glowing, inside the flower) */}
        <g mask="url(#veinMask)" filter="url(#veinGlow)">
          <circle
            cx="0"
            cy="0"
            r={0.6}
            fill="none"
            stroke={palette.glow}
            strokeWidth="0.02"
            opacity={0.45}
          />
          <circle
            cx="0"
            cy="0"
            r={0.4}
            fill="none"
            stroke={palette.glow}
            strokeWidth="0.015"
            opacity={0.5}
          />
          <circle
            cx="0"
            cy="0"
            r={0.25}
            fill="none"
            stroke={palette.glow}
            strokeWidth="0.012"
            opacity={0.6}
          />
        </g>

        {/* Core glow */}
        <circle
          cx="0"
          cy="0"
          r="0.25"
          fill="url(#coreGlow)"
          filter="url(#blur)"
        />

        {/* Core nucleus */}
        <circle
          cx="0"
          cy="0"
          r={0.1 + level * 0.005}
          fill={palette.core}
          stroke={palette.glow}
          strokeWidth="0.015"
        />
      </svg>
    </div>
  );
}
