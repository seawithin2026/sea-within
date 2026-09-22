// app/sanctuary/bloom/page.tsx
import { getBloomProgress } from "@/lib/bloom";
import { getGestureProgress } from "@/lib/gesture";
import BloomClient from "./BloomClient";

export default async function BloomPage() {
  const [bloom, gesture] = await Promise.all([
    getBloomProgress(),
    getGestureProgress(),
  ]);

  return <BloomClient bloom={bloom} gesture={gesture} />;
}
