import { supabase } from "./supabase/client";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";

dayjs.extend(utc);
dayjs.extend(timezone);

const GESTURE_MAX = 50;

/* -----------------------------------------------------
   🌿 SESSION HELPER — WAIT FOR USER (OTP‑safe)
----------------------------------------------------- */
async function waitForUser() {
  for (let i = 0; i < 10; i++) {
    const { data } = await supabase.auth.getSession();
    const user = data.session?.user;
    if (user) return user;
    await new Promise((r) => setTimeout(r, 150));
  }
  return null;
}

/* -----------------------------------------------------
   🌿 GET GESTURE PROGRESS (timezone‑aware)
----------------------------------------------------- */
export async function getGestureProgress() {
  const user = await waitForUser();
  if (!user) return null;

  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("timezone, last_gesture_date")
    .eq("id", user.id)
    .single();

  if (profileError && profileError.code !== "PGRST116") {
    throw profileError;
  }

  const userTimezone = profile?.timezone ?? dayjs.tz.guess();

  const { data, error } = await supabase
    .from("gesture_progress")
    .select("*")
    .eq("user_id", user.id)
    .single();

  if (error && error.code === "PGRST116") {
    const { data: created, error: createError } = await supabase
      .from("gesture_progress")
      .insert({
        user_id: user.id,
        current_index: 0,
        last_index: -1,
        last_completed: null,
      })
      .select()
      .single();

    if (createError) throw createError;

    return {
      ...created,
      last_completed_local: null,
      profile_last_gesture_date: profile?.last_gesture_date ?? null,
    };
  }

  if (error) throw error;

  let lastCompletedLocal: string | null = null;
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

/* -----------------------------------------------------
   🌿 COMPLETE GESTURE (timezone‑correct)
----------------------------------------------------- */
export async function completeGesture(progress: any) {
  const user = await waitForUser();
  if (!user) return null;

  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("timezone")
    .eq("id", user.id)
    .single();

  if (profileError && profileError.code !== "PGRST116") {
    throw profileError;
  }

  const userTimezone = profile?.timezone ?? dayjs.tz.guess();

  const now = dayjs().tz(userTimezone);
  const todayLocal = now.format("YYYY-MM-DD");
  const nowUtcIso = new Date().toISOString();

  let nextIndex = progress.current_index + 1;
  if (nextIndex >= GESTURE_MAX) {
    nextIndex = 0;
  }

  const { data: gestureData, error: gestureError } = await supabase
    .from("gesture_progress")
    .update({
      current_index: nextIndex,
      last_index: progress.current_index,
      last_completed: nowUtcIso,
      updated_at: nowUtcIso,
    })
    .eq("user_id", user.id)
    .select()
    .single();

  if (gestureError) throw gestureError;

  const { error: profileUpdateError } = await supabase
    .from("profiles")
    .update({
      last_gesture_date: todayLocal,
    })
    .eq("id", user.id);

  if (profileUpdateError) throw profileUpdateError;

  return gestureData;
}

/* -----------------------------------------------------
   🌿 RESET GESTURE CYCLE (manual reset)
----------------------------------------------------- */
export async function resetGestureCycle(progress: any) {
  const user = await waitForUser();
  if (!user) return null;

  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("timezone")
    .eq("id", user.id)
    .single();

  if (profileError && profileError.code !== "PGRST116") {
    throw profileError;
  }

  const userTimezone = profile?.timezone ?? dayjs.tz.guess();
  const now = dayjs().tz(userTimezone);
  const nowUtcIso = new Date().toISOString();

  const { data: gestureData, error: gestureError } = await supabase
    .from("gesture_progress")
    .update({
      current_index: 0,
      last_index: -1,
      last_completed: null,
      updated_at: nowUtcIso,
    })
    .eq("user_id", user.id)
    .select()
    .single();

  if (gestureError) throw gestureError;

  const { error: profileUpdateError } = await supabase
    .from("profiles")
    .update({
      last_gesture_date: null,
    })
    .eq("id", user.id);

  if (profileUpdateError) throw profileUpdateError;

  return gestureData;
}
