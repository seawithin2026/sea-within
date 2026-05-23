"use client";

import React from "react";

type ProceduralFlowerProps = {
  size?: number;          // px
  level: number;          // 1–10+
  element?: "water" | "fire" | "earth" | "air";
  seed?: number;          // for variation later
};

export const ProceduralFlower: React.FC<ProceduralFlowerProps> = ({
  size = 260,
  level,
  element = "water",
}) => {
  // Petal + glow intensity scale with level
  const clampedLevel = Math.max(1, Math.min(level, 10));
  const petals = 6 + clampedLevel * 2; // 8–26 petals
  const innerRadius = 0.12;
  const outerRadius = 0.45 + clampedLevel * 0.02;

  // Elemental color palette
  const palette =
    element === "fire"
      ? { base: "#ffb347", glow: "#ff6a3d", core: "#ffe6c7" }
      : element === "earth"
      ? { base: "#c3a56b", glow: "#8fbf7f", core: "#f5eddc" }
      : element === "air"
      ? { base: "#c7e9ff", glow: "#8fd3ff", core: "#ffffff" }
      : // water (default)
        { base: "#7fd4ff", glow: "#3fb5ff", core: "#e6f7ff" };

  const viewBox = "-1 -1 2 2";

  const petalsArray = Array.from({ length: petals });

  return (
    <div
      style={{ width: size, height: size }}
      className="relative flex items-center justify-center"
    >
      <svg viewBox={viewBox} className="w-full h-full">
        <defs>
          {/* Soft radial glow behind the flower */}
          <radialGradient id="bgGlow" cx="0" cy="0" r="1">
            <stop offset="0%" stopColor={palette.glow} stopOpacity={0.7} />
            <stop offset="60%" stopColor={palette.glow} stopOpacity={0.15} />
            <stop offset="100%" stopColor="transparent" stopOpacity={0} />
          </radialGradient>

          {/* Petal gradient */}
          <radialGradient id="petalGradient" cx="0.3" cy="0.2" r="1">
            <stop offset="0%" stopColor={palette.core} stopOpacity={0.95} />
            <stop offset="40%" stopColor={palette.base} stopOpacity={0.95} />
            <stop offset="100%" stopColor={palette.glow} stopOpacity={0.2} />
          </radialGradient>

          {/* Core glow */}
          <radialGradient id="coreGlow" cx="0" cy="0" r="1">
            <stop offset="0%" stopColor={palette.core} stopOpacity={1} />
            <stop offset="50%" stopColor={palette.glow} stopOpacity={0.7} />
            <stop offset="100%" stopColor="transparent" stopOpacity={0} />
          </radialGradient>

          {/* Soft blur for halo */}
          <filter id="softBlur" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="0.08" />
          </filter>
        </defs>

        {/* Background halo */}
        <circle
          cx={0}
          cy={0}
          r={0.95}
          fill="url(#bgGlow)"
          filter="url(#softBlur)"
        />

        {/* Petals */}
        {petalsArray.map((_, i) => {
          const angle = (i / petals) * Math.PI * 2;
          const rotation = (angle * 180) / Math.PI;

          // Slight wobble based on level for organic feel
          const wobble = 0.03 * Math.sin(i * 1.7 + clampedLevel * 0.4);

          const path = `
            M 0 ${-innerRadius}
            C ${-0.18} ${-innerRadius - 0.12},
              ${-0.22} ${-outerRadius - wobble},
              0 ${-outerRadius - wobble}
            C ${0.22} ${-outerRadius - wobble},
              ${0.18} ${-innerRadius - 0.12},
              0 ${-innerRadius}
            Z
          `;

          return (
            <g key={i} transform={`rotate(${rotation})`}>
              <path
                d={path}
                fill="url(#petalGradient)"
                stroke={palette.glow}
                strokeWidth={0.01}
                opacity={0.9}
              />
            </g>
          );
        })}

        {/* Inner layered petals for depth */}
        {petalsArray.map((_, i) => {
          const angle = (i / petals) * Math.PI * 2 + Math.PI / petals;
          const rotation = (angle * 180) / Math.PI;
          const innerOuter = outerRadius * 0.6;

          const path = `
            M 0 ${-innerRadius * 0.4}
            C ${-0.12} ${-innerRadius - 0.06},
              ${-0.14} ${-innerOuter},
              0 ${-innerOuter}
            C ${0.14} ${-innerOuter},
              ${0.12} ${-innerRadius - 0.06},
              0 ${-innerRadius * 0.4}
            Z
          `;

          return (
            <g key={`inner-${i}`} transform={`rotate(${rotation})`}>
              <path
                d={path}
                fill={palette.base}
                opacity={0.55}
                stroke={palette.glow}
                strokeWidth={0.006}
              />
            </g>
          );
        })}

        {/* Core glow */}
        <circle
          cx={0}
          cy={0}
          r={0.28 + clampedLevel * 0.01}
          fill="url(#coreGlow)"
          filter="url(#softBlur)"
        />

        {/* Core nucleus */}
        <circle
          cx={0}
          cy={0}
          r={0.09 + clampedLevel * 0.005}
          fill={palette.core}
          stroke={palette.glow}
          strokeWidth={0.015}
        />
      </svg>
    </div>
  );
};
