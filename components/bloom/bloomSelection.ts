// BLOOM SELECTION ENGINE
// ------------------------------------------------------------

export type BloomVideo = {
  id: string;
  src: string;
  title: string;
  base_level: number;
};

export function selectNextBloom(
  bloomLibrary: BloomVideo[],
  usedBloomIds: string[],
  userLevel: number
): BloomVideo {
  const unused = bloomLibrary.filter((b) => !usedBloomIds.includes(b.id));

  const pool = unused.length > 0 ? unused : bloomLibrary;

  const weighted = pool.flatMap((b) => {
    const diff = Math.abs(b.base_level - userLevel);
    const weight = Math.max(1, 4 - diff);
    return Array(weight).fill(b);
  });

  return weighted[Math.floor(Math.random() * weighted.length)];
}
