"use client";

import { useEffect, useState } from "react";
import BloomClient from "./BloomClient";
import { supabase } from "@/lib/supabase/client";
import { getBloomProgressClient } from "@/lib/bloom";
import { getGestureProgressClient } from "@/lib/gesture";

export default function BloomPage() {
  const [ready, setReady] = useState(false);
  const [user, setUser] = useState(null);
  const [bloom, setBloom] = useState(null);
  const [gesture, setGesture] = useState(null);

  // Hydration guard
  useEffect(() => {
    setReady(true);
  }, []);

  // Client-side user + ritual fetch
  useEffect(() => {
    if (!ready) return;

    async function load() {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        setUser(null);
        return;
      }

      setUser(user);

      const bloomData = await getBloomProgressClient();
      const gestureData = await getGestureProgressClient();

      setBloom(bloomData);
      setGesture(gestureData);
    }

    load();
  }, [ready]);

  // Hydration-safe skeleton
  if (!ready || user === null) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <p className="text-white/40 tracking-[3px] uppercase">
          Loading Ritual…
        </p>
      </div>
    );
  }

  return <BloomClient bloom={bloom} gesture={gesture} />;
}
