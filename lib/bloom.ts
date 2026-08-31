import { supabase } from "./supabase/client";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";

dayjs.extend(utc);
dayjs.extend(timezone);

const BLOOM_MAX_DAY = 12;

// -----------------------------------------------------
// ⭐ GET BLOOM PROGRESS (timezone‑aware)
// -----------------------------------------------------
export async function getBloomProgress() {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  // Fetch profile to get timezone
  const { data: profile } = await supabase
    .from("profiles")
    .select("timezone")
    .eq("id", user.id)
    .single();

  const userTimezone = profile?.timezone || "UTC";

  const { data, error } = await supabase
    .from("bloom_progress")
    .select("*")
    .eq("user_id", user.id)
    .single();

  if (error && error.code === "PGRST116") {
    // Create new row
    const { data: created } = await supabase
      .from("bloom_progress")
      .insert({
        user_id: user.id,
        current_day: 1,
        completed_all: false,
        last_completed: null,
      })
      .select()
      .single();

    return created;
  }

  if (error) throw error;

  // ⭐ Convert last_completed into user's timezone
  if (data?.last_completed) {
    data.last_completed_local = dayjs(data.last_completed)
      .tz(userTimezone)
      .format("YYYY-MM-DD");
  }

  return data;
}

// -----------------------------------------------------
// ⭐ COMPLETE TODAY BLOOM (timezone‑correct)
// -----------------------------------------------------
export async function completeTodayBloom(progress: any) {
  // Fetch user + timezone
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: profile } = await supabase
    .from("profiles")
    .select("timezone")
    .eq("id", user.id)
    .single();

  const userTimezone = profile?.timezone || "UTC";

  // ⭐ Compute "today" in user's timezone
  const now = dayjs().tz(userTimezone);
  const today = now.format("YYYY-MM-DD");

  let nextDay = progress.current_day + 1;
  let completedAll = progress.completed_all;

  if (nextDay > BLOOM_MAX_DAY) {
    nextDay = BLOOM_MAX_DAY;
    completedAll = true;
  }

  const { data, error } = await supabase
    .from("bloom_progress")
    .update({
      current_day: nextDay,
      last_completed: today, // ⭐ timezone‑correct
      completed_all: completedAll,
      updated_at: now.toISOString(), // ⭐ still stored in UTC
    })
    .eq("id", progress.id)
    .select()
    .single();

  if (error) throw error;
  return data;
}

// -----------------------------------------------------
// ⭐ RESET BLOOM CYCLE (timezone‑correct)
// -----------------------------------------------------
export async function resetBloomCycle(progress: any) {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: profile } = await supabase
    .from("profiles")
    .select("timezone")
    .eq("id", user.id)
    .single();

  const userTimezone = profile?.timezone || "UTC";

  const now = dayjs().tz(userTimezone);

  const { data, error } = await supabase
    .from("bloom_progress")
    .update({
      current_day: 1,
      last_completed: null,
      completed_all: false,
      updated_at: now.toISOString(), // ⭐ stored in UTC
    })
    .eq("id", progress.id)
    .select()
    .single();

  if (error) throw error;
  return data;
}
