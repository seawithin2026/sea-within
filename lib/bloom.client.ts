"use client";

import { supabase } from "@/lib/supabase/client";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";

dayjs.extend(utc);
dayjs.extend(timezone);

export async function getBloomProgressClient() {
  const { data } = await supabase.auth.getUser();
  const user = data?.user;

  if (!user) return null;

  // Fetch profile fields
  const { data: profile } = await supabase
    .from("profiles")
    .select("last_bloom_date, last_bloom_video, timezone")
    .eq("id", user.id)
    .single();

  // Fetch bloom progress
  const { data: bloom } = await supabase
    .from("bloom_progress")
    .select("*")
    .eq("user_id", user.id)
    .single();

  if (!bloom) return null;

  const userTimezone = profile?.timezone ?? "UTC";

  // Convert last_completed to YYYY-MM-DD in user's timezone
  const lastCompletedLocal = bloom.last_completed
    ? dayjs(bloom.last_completed).tz(userTimezone).format("YYYY-MM-DD")
    : null;

  // Get today's date in user's timezone
  const { data: todayLocal } = await supabase.rpc("get_user_today", {
    user_tz: userTimezone,
  });

  // ⭐ FULL FIX — return the correct bloom object
  return {
    id: bloom.id,                               // REQUIRED for server update
    user_id: bloom.user_id,                     // optional but safe
    current_day: bloom.current_day,
    completed_all: bloom.completed_all,

    last_completed_local: lastCompletedLocal,
    today_local: todayLocal,

    profile_last_bloom_date: profile?.last_bloom_date ?? null,
    profile_last_bloom_video: profile?.last_bloom_video ?? null,
  };
}
