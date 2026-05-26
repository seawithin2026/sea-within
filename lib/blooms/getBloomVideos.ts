/// CLEAN BLOOM VIDEO LOADER
// ------------------------------------------------------------

import { BloomVideo } from "./types";

// This is your simple, static bloom library.
// Add or remove videos as you wish.
// All paths must point to files inside /public/blooms/

export async function getBloomVideos(): Promise<BloomVideo[]> {
  return [
    {
      id: "bloom-01",
      src: "/blooms/bloom-01.mp4",
      title: "Sanctuary Bloom",
      base_level: 1,
      element: "ether",
    },
  ];
}

