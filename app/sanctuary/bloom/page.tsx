"use client";

import { useEffect, useState, useCallback } from "react";
import BloomClient from "./BloomClient";
import { supabase } from "@/lib/supabase/client";
import { getBloomProgressClient } from "@/lib/bloom.client";
import { getGestureProgressClient } from "@/lib/gesture.client";
import MembershipGate from "@/components/MembershipGate";

export default function BloomPage() {
  const [ready, setReady] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [bloom, setBloom] = useState<any>(null);
  const [gesture, setGesture] = useState<any>(null);

  useEffect(() => {
    setReady(true);
  }, []);

  const load = useCallback(async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      setUser(null);
      setBloom(null);
      setGesture(null);
      return;
    }

    setUser(user);

    const bloomData = await getBloomProgressClient();
    const gestureData = await getGestureProgressClient();

    setBloom(bloomData);
    setGesture(gestureData);
  }, []);

  useEffect(() => {
    if (!ready) return;
    load();
  }, [ready, load]);

  if (!ready || user === null) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <p className="text-white/40 tracking-[3px] uppercase">
          Loading Ritual…
        </p>
      </div>
    );
  }

  return (
    <MembershipGate>
      <BloomClient
        bloom={bloom}
        gesture={gesture}
        onRefresh={load}
        userId={user.id}
      />
    </MembershipGate>
  );
}
