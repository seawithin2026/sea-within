import { supabaseServer } from "@/lib/supabase/server";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";

dayjs.extend(utc);
dayjs.extend(timezone);

const GESTURE_MAX = 50;

export async function getGestureProgress(userId: string) {
  const supabase = supabaseServer();
  if (!userId) return null;

  const { data: profile } = await supabase
    .from("profiles")
    .select("timezone, last_gesture_date")
    .eq("id", userId)
    .single();

  const userTimezone = profile?.timezone ?? dayjs.tz.guess();

  const { data, error } = await supabase
    .from("gesture_progress")
    .select("*")
    .eq("user_id", userId)
    .single();

  if (error && error.code === "PGRST116") {
    const { data: created } = await supabase
      .from("gesture_progress")
      .insert({
        user_id: userId,
        current_index: 0,
        last_index: -1,
        last_completed: null,
      })
      .select()
      .single();

    return {
      ...created,
      last_completed_local: null,
      profile_last_gesture_date: profile?.last_gesture_date ?? null,
    };
  }

  let lastCompletedLocal = null;
  if (data?.last_completed) {
    lastCompletedLocal = dayjs(data.last_completed)
      .tz(userTimezone)
      .format("YYYY-MM-DD");
  }

  return {
    ...data,
    last_completed_local: lastCompletedLocal,
    profile_last_gesture_date: profile?.last_gesture_date ?? null,
  };
}

export async function completeGesture(progress: any, userId: string) {
  const supabase = supabaseServer();
  if (!userId) return null;

  const { data: profile } = await supabase
    .from("profiles")
    .select("timezone")
    .eq("id", userId)
    .single();

  const userTimezone = profile?.timezone ?? dayjs.tz.guess();
  const todayLocal = dayjs().tz(userTimezone).format("YYYY-MM-DD");

  let nextIndex = progress.current_index + 1;
  if (nextIndex >= GESTURE_MAX) nextIndex = 0;

  const { data: gestureData } = await supabase
    .from("gesture_progress")
    .update({
      current_index: nextIndex,
      last_index: progress.current_index,
      last_completed: todayLocal,
      updated_at: new Date().toISOString(),
    })
    .eq("user_id", userId)
    .select()
    .single();

  await supabase
    .from("profiles")
    .update({
      last_gesture_date: todayLocal,
    })
    .eq("id", userId);

  return gestureData;
}

export async function resetGestureCycle(progress: any, userId: string) {
  const supabase = supabaseServer();
  if (!userId) return null;

  const nowUtcIso = new Date().toISOString();

  const { data: gestureData } = await supabase
    .from("gesture_progress")
    .update({
      current_index: 0,
      last_index: -1,
      last_completed: null,
      updated_at: nowUtcIso,
    })
    .eq("user_id", userId)
    .select()
    .single();

  await supabase
    .from("profiles")
    .update({
      last_gesture_date: null,
    })
    .eq("id", userId);

  return gestureData;
}
