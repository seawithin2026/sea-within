import { supabaseServer } from "@/lib/supabase/server";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";

dayjs.extend(utc);
dayjs.extend(timezone);

const GESTURE_MAX = 50;

/* -----------------------------------------------------
   SERVER: Wait for user (SSR session polling)
----------------------------------------------------- */
async function waitForUser() {
  const supabase = supabaseServer();

  for (let i = 0; i < 10; i++) {
    const { data } = await supabase.auth.getSession();
    const user = data.session?.user;
    if (user) return user;
    await new Promise((r) => setTimeout(r, 150));
  }
  return null;
}

/* -----------------------------------------------------
   SERVER: Get gesture progress (SSR)
----------------------------------------------------- */
export async function getGestureProgress() {
  const supabase = supabaseServer();
  const user = await waitForUser();
  if (!user) return null;

  const { data: profile } = await supabase
    .from("profiles")
    .select("timezone, last_gesture_date")
    .eq("id", user.id)
    .single();

  const userTimezone = profile?.timezone ?? dayjs.tz.guess();

  const { data, error } = await supabase
    .from("gesture_progress")
    .select("*")
    .eq("user_id", user.id)
    .single();

  // Create gesture_progress row if missing
  if (error && error.code === "PGRST116") {
    const { data: created } = await supabase
      .from("gesture_progress")
      .insert({
        user_id: user.id,
        current_index: 0,
        last_index: -1,
        last_completed: null, // pure date stored later
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
    // last_completed is stored as YYYY-MM-DD
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
   SERVER: Complete today's gesture
----------------------------------------------------- */
export async function completeGesture(progress) {
  const supabase = supabaseServer();
  const user = await waitForUser();
  if (!user) return null;

  const { data: profile } = await supabase
    .from("profiles")
    .select("timezone")
    .eq("id", user.id)
    .single();

  const userTimezone = profile?.timezone ?? dayjs.tz.guess();

  const now = dayjs().tz(userTimezone);

  // ⭐ FIX: store pure date string, not ISO timestamp
  const todayLocal = now.format("YYYY-MM-DD");

  let nextIndex = progress.current_index + 1;
  if (nextIndex >= GESTURE_MAX) {
    nextIndex = 0;
  }

  // ⭐ FIX: last_completed must be YYYY-MM-DD
  const { data: gestureData } = await supabase
    .from("gesture_progress")
    .update({
      current_index: nextIndex,
      last_index: progress.current_index,
      last_completed: todayLocal, // FIXED
      updated_at: new Date().toISOString(),
    })
    .eq("user_id", user.id)
    .select()
    .single();

  await supabase
    .from("profiles")
    .update({
      last_gesture_date: todayLocal, // matches gesture_progress
    })
    .eq("id", user.id);

  return gestureData;
}

/* -----------------------------------------------------
   SERVER: Reset gesture cycle
----------------------------------------------------- */
export async function resetGestureCycle(progress) {
  const supabase = supabaseServer();
  const user = await waitForUser();
  if (!user) return null;

  const nowUtcIso = new Date().toISOString();

  const { data: gestureData } = await supabase
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

  await supabase
    .from("profiles")
    .update({
      last_gesture_date: null,
    })
    .eq("id", user.id);

  return gestureData;
}
