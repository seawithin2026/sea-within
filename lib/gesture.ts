import { supabase } from "./supabase/client";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";

dayjs.extend(utc);
dayjs.extend(timezone);

const GESTURE_MAX = 50;

/* -----------------------------------------------------
   🌿 GET GESTURE PROGRESS (timezone‑aware)
----------------------------------------------------- */
export async function getGestureProgress() {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  // Fetch profile timezone + gesture metadata
  const { data: profile } = await supabase
    .from("profiles")
    .select("timezone, last_gesture_date")
    .eq("id", user.id)
    .single();

  const userTimezone = profile?.timezone || "UTC";

  // Fetch gesture_progress
  const { data, error } = await supabase
    .from("gesture_progress")
    .select("*")
    .eq("user_id", user.id)
    .single();

  // If no gesture_progress row exists → create one
  if (error && error.code === "PGRST116") {
    const { data: created } = await supabase
      .from("gesture_progress")
      .insert({
        user_id: user.id,
        current_index: 0,
        last_index: -1,
        last_completed: null,
      })
      .select()
      .single();

    return {
      ...created,
      profile_last_gesture_date: profile?.last_gesture_date,
    };
  }

  if (error) throw error;

  // Convert last_completed to user's timezone
  let lastCompletedLocal = null;
  if (data?.last_completed) {
    lastCompletedLocal = dayjs(data.last_completed)
      .tz(userTimezone)
      .format("YYYY-MM-DD");
  }

  return {
    ...data,
    last_completed_local: lastCompletedLocal,
    profile_last_gesture_date: profile?.last_gesture_date,
  };
}

/* -----------------------------------------------------
   🌿 COMPLETE GESTURE (timezone‑correct, rotating independently)
----------------------------------------------------- */
export async function completeGesture(progress: any) {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  // Fetch timezone
  const { data: profile } = await supabase
    .from("profiles")
    .select("timezone")
    .eq("id", user.id)
    .single();

  const userTimezone = profile?.timezone || "UTC";

  const now = dayjs().tz(userTimezone);
  const today = now.format("YYYY-MM-DD");

  // Advance gesture cycle independently of bloom
  let nextIndex = progress.current_index + 1;
  if (nextIndex >= GESTURE_MAX) {
    nextIndex = 0; // wrap back to start when all gestures are done
  }

  // Update gesture_progress
  const { data: gestureData, error: gestureError } = await supabase
    .from("gesture_progress")
    .update({
      current_index: nextIndex,
      last_index: progress.current_index,
      last_completed: today,
      updated_at: now.toISOString(),
    })
    .eq("user_id", user.id)
    .select()
    .single();

  if (gestureError) throw gestureError;

  // Update profile gesture metadata
  const { error: profileError } = await supabase
    .from("profiles")
    .update({
      last_gesture_date: today,
    })
    .eq("id", user.id);

  if (profileError) throw profileError;

  return gestureData;
}

/* -----------------------------------------------------
   🌿 RESET GESTURE CYCLE (manual reset, if ever needed)
----------------------------------------------------- */
export async function resetGestureCycle(progress: any) {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  // Fetch timezone
  const { data: profile } = await supabase
    .from("profiles")
    .select("timezone")
    .eq("id", user.id)
    .single();

  const userTimezone = profile?.timezone || "UTC";
  const now = dayjs().tz(userTimezone);

  // Reset gesture_progress
  const { data: gestureData, error: gestureError } = await supabase
    .from("gesture_progress")
    .update({
      current_index: 0,
      last_index: -1,
      last_completed: null,
      updated_at: now.toISOString(),
    })
    .eq("user_id", user.id)
    .select()
    .single();

  if (gestureError) throw gestureError;

  // Reset profile gesture metadata
  const { error: profileError } = await supabase
    .from("profiles")
    .update({
      last_gesture_date: null,
    })
    .eq("id", user.id);

  if (profileError) throw profileError;

  return gestureData;
}
