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

  const { data: profile } = await supabase
    .from("profiles")
    .select("last_bloom_date, last_bloom_video, timezone")
    .eq("id", user.id)
    .single();

  const { data: bloom } = await supabase
    .from("bloom_progress")
    .select("*")
    .eq("user_id", user.id)
    .single();

  if (!bloom) return null;

  const userTimezone = profile?.timezone ?? "UTC";

  const lastCompletedLocal = bloom.last_completed
    ? dayjs(bloom.last_completed).tz(userTimezone).format("YYYY-MM-DD")
    : null;

  const { data: todayLocal } = await supabase.rpc("get_user_today", {
    user_tz: userTimezone,
  });

  return {
    id: bloom.id,
    user_id: bloom.user_id,
    current_day: bloom.current_day,
    completed_all: bloom.completed_all,

    last_completed_local: lastCompletedLocal,
    today_local: todayLocal,

    profile_last_bloom_date: profile?.last_bloom_date ?? null,
    profile_last_bloom_video: profile?.last_bloom_video ?? null,
  };
}
