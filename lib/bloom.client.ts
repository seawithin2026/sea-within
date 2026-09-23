import { supabase } from "@/lib/supabase/client";

export async function getBloomProgressClient() {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  // Fetch profile fields
  const { data: profile } = await supabase
    .from("profiles")
    .select("last_bloom_date, last_bloom_video, timezone")
    .eq("id", user.id)
    .single();

  // Fetch bloom progress
  const { data } = await supabase
    .from("bloom_progress")
    .select("*")
    .eq("user_id", user.id)
    .single();

  if (!data) return null;

  // ⭐ Get today's date in user's timezone using your RPC function
  const { data: todayLocal } = await supabase.rpc("get_user_today", {
    user_tz: profile?.timezone ?? "UTC",
  });

  // ⭐ Convert last_completed to YYYY-MM-DD (server already stores pure date)
  const lastCompletedLocal = data.last_completed ?? null;

  return {
    ...data,
    last_completed_local: lastCompletedLocal,
    today_local: todayLocal,
    profile_last_bloom_date: profile?.last_bloom_date ?? null,
    profile_last_bloom_video: profile?.last_bloom_video ?? null,
  };
}
