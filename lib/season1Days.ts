export type DayContent = {
  slug: string;
  dayNumber: number;
  title: string;
  thumbnailVideoUrl: string;
  heroVideoUrl: string;
  pdfUrl?: string;
  audioUrl?: string;
};

export const season1Days: DayContent[] = [
  {
    slug: 'day-1',
    dayNumber: 1,
    title: 'Day 1 The Darkness',
    heroVideoUrl: '/video-season1/day1-hero.mp4',
    thumbnailVideoUrl: '/video-season1/day1-thumb.mp4',
    pdfUrl: '/pdfs-season1/day1.pdf',
    audioUrl: '/audio-season1/day1.mp3',
  },
  // Add more days up to day 30 later
];