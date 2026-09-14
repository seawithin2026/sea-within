import { supabase } from "./supabase/client";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";

dayjs.extend(utc);
dayjs.extend(timezone);

const BLOOM_MAX_DAY = 36;

/* -----------------------------------------------------
   🌿 GET BLOOM PROGRESS (timezone‑aware)
----------------------------------------------------- */
export async function getBloomProgress() {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  // Fetch profile timezone + bloom metadata
  const { data: profile } = await supabase
    .from("profiles")
    .select("timezone, last_bloom_date, last_bloom_video")
    .eq("id", user.id)
    .single();

  const userTimezone = profile?.timezone || "UTC";

  // Fetch bloom progress
  const { data, error } = await supabase
    .from("bloom_progress")
    .select("*")
    .eq("user_id", user.id)
    .single();

  // If no bloom_progress row exists → create one
  if (error && error.code === "PGRST116") {
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

    return {
      ...created,
      profile_last_bloom_date: profile?.last_bloom_date,
      profile_last_bloom_video: profile?.last_bloom_video,
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
    profile_last_bloom_date: profile?.last_bloom_date,
    profile_last_bloom_video: profile?.last_bloom_video,
  };
}

/* -----------------------------------------------------
   🌿 COMPLETE TODAY BLOOM (timezone‑correct)
----------------------------------------------------- */
export async function completeTodayBloom(progress: any, videoName: string) {
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

  // Compute "today" in user's timezone
  const now = dayjs().tz(userTimezone);
  const today = now.format("YYYY-MM-DD");

  // Advance bloom cycle
  let nextDay = progress.current_day + 1;
  let completedAll = progress.completed_all;

  // If cycle ends → reset to day 1
  if (nextDay > BLOOM_MAX_DAY) {
    nextDay = 1;
    completedAll = false;
  }

  // Update bloom_progress
  const { data: bloomData, error: bloomError } = await supabase
    .from("bloom_progress")
    .update({
      current_day: nextDay,
      last_completed: today,
      completed_all: completedAll,
      updated_at: now.toISOString(),
    })
    .eq("id", progress.id)
    .select()
    .single();

  if (bloomError) throw bloomError;

  // Update profile bloom metadata
  const { error: profileError } = await supabase
    .from("profiles")
    .update({
      last_bloom_date: today,
      last_bloom_video: videoName,
    })
    .eq("id", user.id);

  if (profileError) throw profileError;

  return bloomData;
}

/* -----------------------------------------------------
   🌿 RESET BLOOM CYCLE (timezone‑correct)
----------------------------------------------------- */
export async function resetBloomCycle(progress: any) {
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

  // Reset bloom_progress
  const { data: bloomData, error: bloomError } = await supabase
    .from("bloom_progress")
    .update({
      current_day: 1,
      last_completed: null,
      completed_all: false,
      updated_at: now.toISOString(),
    })
    .eq("id", progress.id)
    .select()
    .single();

  if (bloomError) throw bloomError;

  // Reset profile bloom metadata
  const { error: profileError } = await supabase
    .from("profiles")
    .update({
      last_bloom_date: null,
      last_bloom_video: null,
    })
    .eq("id", user.id);

  if (profileError) throw profileError;

  return bloomData;
}
