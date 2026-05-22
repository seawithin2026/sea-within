// BLOOM SELECTION ENGINE
// ------------------------------------------------------------
// This engine selects a unique bloom video for each cycle.
// It prevents repeats until all blooms are used, then resets.
// It also supports bloom levels + elemental themes.

export type BloomVideo = {
  id: string;
  src: string;
  element: "earth" | "air" | "fire" | "light";
  baseLevel: number; // starting glow level
};

// MASTER BLOOM LIST
export const BLOOM_LIBRARY: BloomVideo[] = [
  {
    id: "bloom-01",
    src: "/bloom-videos/bloom-01.mp4",
    element: "earth",
    baseLevel: 1,
  },
  {
    id: "bloom-02",
    src: "/bloom-videos/bloom-02.mp4",
    element: "air",
    baseLevel: 1,
  },
  {
    id: "bloom-03",
    src: "/bloom-videos/bloom-03.mp4",
    element: "fire",
    baseLevel: 2,
  },
  {
    id: "bloom-04",
    src: "/bloom-videos/bloom-04.mp4",
    element: "light",
    baseLevel: 2,
  },
  {
    id: "bloom-05",
    src: "/bloom-videos/bloom-05.mp4",
    element: "earth",
    baseLevel: 3,
  },
];

// ------------------------------------------------------------
// SELECT NEXT BLOOM
// ------------------------------------------------------------

export function selectNextBloom(
  usedBloomIds: string[],
  userLevel: number
): BloomVideo {
  // 1. Filter out blooms already used
  const unused = BLOOM_LIBRARY.filter((b) => !usedBloomIds.includes(b.id));

  // 2. If all blooms used → reset
  const pool = unused.length > 0 ? unused : BLOOM_LIBRARY;

  // 3. Weight blooms by closeness to user level
  const weighted = pool.flatMap((b) => {
    const diff = Math.abs(b.baseLevel - userLevel);
    const weight = Math.max(1, 4 - diff); // closer levels = higher weight
    return Array(weight).fill(b);
  });

  // 4. Randomly select from weighted pool
  const choice = weighted[Math.floor(Math.random() * weighted.length)];

  return choice;
}
