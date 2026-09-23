"use client";

import { useEffect, useState, useCallback } from "react";
import BloomClient from "./BloomClient";
import { supabase } from "@/lib/supabase/client";
import { getBloomProgressClient } from "@/lib/bloom.client";
import { getGestureProgressClient } from "@/lib/gesture.client";
import MembershipGate from "@/components/MembershipGate";

export default function BloomPage() {
  const [ready, setReady] = useState(false);
  const [user, setUser] = useState(null);
  const [bloom, setBloom] = useState(null);
  const [gesture, setGesture] = useState(null);

  // Hydration guard
  useEffect(() => {
    setReady(true);
  }, []);

  // ⭐ Reusable loader (BloomClient will call this)
  const load = useCallback(async () => {
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
  }, []);

  // Initial load
  useEffect(() => {
    if (!ready) return;
    load();
  }, [ready, load]);

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

  // ⭐ Membership Gate — protects Bloom Ritual
  return (
    <>
      <MembershipGate />

      <BloomClient
        bloom={bloom}
        gesture={gesture}
        onRefresh={load}
      />
    </>
  );
}
