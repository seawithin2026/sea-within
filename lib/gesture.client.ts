"use client";

import { supabase } from "@/lib/supabase/client";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";

dayjs.extend(utc);
dayjs.extend(timezone);

export async function getGestureProgressClient() {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  const { data: profile } = await supabase
    .from("profiles")
    .select("timezone, last_gesture_date")
    .eq("id", user.id)
    .single();

  const userTimezone = profile?.timezone ?? "UTC";

  const { data } = await supabase
    .from("gesture_progress")
    .select("*")
    .eq("user_id", user.id)
    .single();

  if (!data) return null;

  const lastCompletedLocal = data.last_completed
    ? dayjs(data.last_completed).tz(userTimezone).format("YYYY-MM-DD")
    : null;

  return {
    ...data,
    last_completed_local: lastCompletedLocal,
    profile_last_gesture_date: profile?.last_gesture_date ?? null,
  };
}
