import { supabase } from "./supabase/client";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";

dayjs.extend(utc);
dayjs.extend(timezone);

const BLOOM_MAX_DAY = 36;

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
   🌿 GET BLOOM PROGRESS (timezone‑aware)
----------------------------------------------------- */
export async function getBloomProgress() {
  const user = await waitForUser();
  if (!user) return null;

  // Fetch profile timezone + bloom metadata
  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("timezone, last_bloom_date, last_bloom_video")
    .eq("id", user.id)
    .single();

  if (profileError && profileError.code !== "PGRST116") {
    throw profileError;
  }

  const userTimezone = profile?.timezone || "UTC";

  // Fetch bloom progress
  const { data, error } = await supabase
    .from("bloom_progress")
    .select("*")
    .eq("user_id", user.id)
    .single();

  // If no bloom_progress row exists → create one
  if (error && error.code === "PGRST116") {
    const { data: created, error: createError } = await supabase
      .from("bloom_progress")
      .insert({
        user_id: user.id,
        current_day: 1,
        completed_all: false,
        last_completed: null,
      })
      .select()
      .single();

    if (createError) throw createError;

    return {
      ...created,
      last_completed_local: null,
      profile_last_bloom_date: profile?.last_bloom_date ?? null,
      profile_last_bloom_video: profile?.last_bloom_video ?? null,
    };
  }

  if (error) throw error;

  // Convert last_completed to user's timezone
  let lastCompletedLocal: string | null = null;
  if (data?.last_completed) {
    lastCompletedLocal = dayjs(data.last_completed)
      .tz(userTimezone)
      .format("YYYY-MM-DD");
  }

  return {
    ...data,
    last_completed_local: lastCompletedLocal,
    profile_last_bloom_date: profile?.last_bloom_date ?? null,
    profile_last_bloom_video: profile?.last_bloom_video ?? null,
  };
}

/* -----------------------------------------------------
   🌿 COMPLETE TODAY BLOOM (timezone‑correct)
----------------------------------------------------- */
export async function completeTodayBloom(progress: any, videoName: string) {
  const user = await waitForUser();
  if (!user) return null;

  // Fetch timezone
  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("timezone")
    .eq("id", user.id)
    .single();

  if (profileError && profileError.code !== "PGRST116") {
    throw profileError;
  }

  const userTimezone = profile?.timezone || "UTC";

  // Compute "today" in user's timezone
  const now = dayjs().tz(userTimezone);
  const today = now.format("YYYY-MM-DD");

  // Advance bloom cycle
  let nextDay = progress.current_day + 1;
  let completedAll = progress.completed_all;

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
  const { error: profileUpdateError } = await supabase
    .from("profiles")
    .update({
      last_bloom_date: today,
      last_bloom_video: videoName,
    })
    .eq("id", user.id);

  if (profileUpdateError) throw profileUpdateError;

  return bloomData;
}

/* -----------------------------------------------------
   🌿 RESET BLOOM CYCLE (timezone‑correct)
----------------------------------------------------- */
export async function resetBloomCycle(progress: any) {
  const user = await waitForUser();
  if (!user) return null;

  // Fetch timezone
  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("timezone")
    .eq("id", user.id)
    .single();

  if (profileError && profileError.code !== "PGRST116") {
    throw profileError;
  }

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
  const { error: profileUpdateError } = await supabase
    .from("profiles")
    .update({
      last_bloom_date: null,
      last_bloom_video: null,
    })
    .eq("id", user.id);

  if (profileUpdateError) throw profileUpdateError;

  return bloomData;
}
