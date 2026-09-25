"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase/client";
import BloomClient from "./BloomClient";
import { getBloomProgress } from "@/lib/bloom.server";
import { getGestureProgress } from "@/lib/gesture.server";
import MembershipGateWrapper from "@/components/MembershipGateWrapper";

export default function BloomPage() {
  const [ready, setReady] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const [bloom, setBloom] = useState<any>(null);
  const [gesture, setGesture] = useState<any>(null);

  useEffect(() => {
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) return;

    async function load() {
      const { data } = await supabase.auth.getUser();
      const user = data?.user;

      if (!user) {
        // still let SanctuaryLayout / MembershipGate handle redirect
        return;
      }

      setUserId(user.id);

      // server helpers still fine to call from client via fetch/RPC,
      // but if they are pure server functions, replace with client queries:
      const bloomData = await getBloomProgress(user.id);
      const gestureData = await getGestureProgress(user.id);

      setBloom(bloomData);
      setGesture(gestureData);
    }

    load();
  }, [ready]);

  if (!ready || !userId || !bloom || !gesture) {
    return (
      <main className="min-h-screen bg-black text-white flex items-center justify-center">
        <p className="text-white/40 tracking-[3px] uppercase">
          Loading Ritual…
        </p>
      </main>
    );
  }

  async function onRefresh() {
    if (!userId) return;
    const bloomData = await getBloomProgress(userId);
    const gestureData = await getGestureProgress(userId);
    setBloom(bloomData);
    setGesture(gestureData);
  }

  return (
    <MembershipGateWrapper>
      <BloomClient
        bloom={bloom}
        gesture={gesture}
        onRefresh={onRefresh}
        userId={userId}
      />
    </MembershipGateWrapper>
  );
}
