"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase/client";
import BloomClient from "./BloomClient";
import MembershipGateWrapper from "@/components/MembershipGateWrapper";

export default function BloomPage() {
  const [ready, setReady] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const [bloom, setBloom] = useState<any>(null);
  const [gesture, setGesture] = useState<any>(null);

  useEffect(() => {
    setReady(true);
  }, []);

  async function fetchBloom(userId: string) {
    const { data } = await supabase
      .from("blooms")
      .select("*")
      .eq("user_id", userId)
      .maybeSingle();
    return data;
  }

  async function fetchGesture(userId: string) {
    const { data } = await supabase
      .from("gestures")
      .select("*")
      .eq("user_id", userId)
      .maybeSingle();
    return data;
  }

  useEffect(() => {
    if (!ready) return;

    async function load() {
      const { data } = await supabase.auth.getUser();
      const user = data?.user;

      if (!user) return;

      setUserId(user.id);

      const bloomData = await fetchBloom(user.id);
      const gestureData = await fetchGesture(user.id);

      // ⭐ DEBUG LOGS — THIS IS WHAT YOU NEED
      console.log("USER ID:", user.id);
      console.log("BLOOM DATA:", bloomData);
      console.log("GESTURE DATA:", gestureData);

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
    const bloomData = await fetchBloom(userId);
    const gestureData = await fetchGesture(userId);

    // ⭐ DEBUG LOGS AGAIN
    console.log("REFRESH BLOOM:", bloomData);
    console.log("REFRESH GESTURE:", gestureData);

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
