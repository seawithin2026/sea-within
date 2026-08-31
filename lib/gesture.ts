import { supabase } from "./supabase/client";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";

dayjs.extend(utc);
dayjs.extend(timezone);

/* -----------------------------------------------------
   🌿 Fetch Gesture Progress (timezone‑aware)
----------------------------------------------------- */
export async function getGestureProgress() {
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

  const { data, error } = await supabase
    .from("gesture_progress")
    .select("id, current_index, last_index, last_completed")
    .eq("user_id", user.id)
    .single();

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

    return created;
  }

  if (error) throw error;

  // ⭐ Convert last_completed into user's timezone
if (data?.last_completed) {
  return {
    ...data,
    last_completed_local: dayjs(data.last_completed)
      .tz(userTimezone)
      .format("YYYY-MM-DD"),
  };
}

return data;

}

/* -----------------------------------------------------
   🌿 Complete Gesture (timezone‑correct)
----------------------------------------------------- */
export async function completeGesture(currentIndex: number) {
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

  // ⭐ Compute "now" and "today" in user's timezone
  const now = dayjs().tz(userTimezone);
  const today = now.format("YYYY-MM-DD");

  const nextIndex = currentIndex + 1;

  const { data, error } = await supabase
    .from("gesture_progress")
    .update({
      current_index: nextIndex,
      last_index: currentIndex,
      last_completed: today, // ⭐ timezone‑correct
      updated_at: now.toISOString(), // ⭐ stored in UTC
    })
    .eq("user_id", user.id)
    .select()
    .single();

  if (error) throw error;
  return data;
}

/* -----------------------------------------------------
   🌿 Reset Gesture Cycle (timezone‑correct)
----------------------------------------------------- */
export async function resetGestureCycle() {
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

  const { data, error } = await supabase
    .from("gesture_progress")
    .update({
      current_index: 0,
      last_index: -1,
      last_completed: null,
      updated_at: now.toISOString(), // ⭐ stored in UTC
    })
    .eq("user_id", user.id)
    .select()
    .single();

  if (error) throw error;
  return data;
}
