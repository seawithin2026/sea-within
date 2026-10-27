
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Reveal | Discover Sea Within',
  description:
    'Step into Sea Within, a cinematic space for calm, mindful rituals, self-reflection, and personal growth.',
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
