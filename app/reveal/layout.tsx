
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Reveal | Discover Sea Within',
  description:
    'Discover Sea Within, a cinematic sanctuary for calm and personal growth. Explore mindful rituals, atmospheric videos, and quiet moments to unwind and reconnect with yourself.',
  alternates: {
    canonical: '/reveal',
  },
};

export default function RevealLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
