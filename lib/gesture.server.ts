import { supabaseServer } from "@/lib/supabase/server";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";

dayjs.extend(utc);
dayjs.extend(timezone);

const GESTURE_MAX = 50;

export async function getGestureProgress(userId: string) {
  const supabase = await supabaseServer();
  if (!userId) return null;

  const { data: profile } = await supabase
    .from("profiles")
    .select("timezone, last_gesture_date")
    .eq("id", userId)
    .maybeSingle();

  const userTimezone = profile?.timezone ?? "UTC";
  const todayLocal = dayjs().tz(userTimezone).format("YYYY-MM-DD");

  let { data, error } = await supabase
    .from("gesture_progress")
    .select("*")
    .eq("user_id", userId)
    .maybeSingle();

  if (!data) {
    const { data: created, error: createError } = await supabase
      .from("gesture_progress")
      .upsert(
        {
          user_id: userId,
          current_index: 0,
          last_index: -1,
          last_completed: null,
        },
        { onConflict: "user_id" }
      )
      .select()
      .single();

    if (createError) return null;

    return {
      ...created,
      today_local: todayLocal,
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
    today_local: todayLocal,
    last_completed_local: lastCompletedLocal,
    profile_last_gesture_date: profile?.last_gesture_date ?? null,
  };
}

export async function completeGesture(progress: any, userId: string) {
  const supabase = await supabaseServer();
  if (!userId) throw new Error("Missing userId in completeGesture");

  const { data: profile } = await supabase
    .from("profiles")
    .select("timezone")
    .eq("id", userId)
    .maybeSingle();

  const userTimezone = profile?.timezone ?? "UTC";
  const todayLocal = dayjs().tz(userTimezone).format("YYYY-MM-DD");
  const nowUtcIso = new Date().toISOString();

  let nextIndex = (progress?.current_index ?? 0) + 1;
  if (nextIndex >= GESTURE_MAX) nextIndex = 0;

  // Update gesture_progress (last_completed is TIMESTAMPTZ: ISO string)
  const { data: gestureData, error: gestureError } = await supabase
    .from("gesture_progress")
    .update({
      current_index: nextIndex,
      last_index: progress?.current_index ?? 0,
      last_completed: nowUtcIso,
      updated_at: nowUtcIso,
    })
    .eq("user_id", userId)
    .select()
    .single();

  if (gestureError) throw new Error(`gesture_progress error: ${gestureError.message}`);

  // Update profiles (last_gesture_date is text: YYYY-MM-DD)
  const { error: profileError } = await supabase
    .from("profiles")
    .update({
      last_gesture_date: todayLocal,
    })
    .eq("id", userId);

  if (profileError) throw new Error(`profiles error: ${profileError.message}`);

  return gestureData;
}