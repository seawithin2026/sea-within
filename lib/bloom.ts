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

  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("timezone, last_bloom_date, last_bloom_video")
    .eq("id", user.id)
    .single();

  if (profileError && profileError.code !== "PGRST116") {
    throw profileError;
  }

  const userTimezone = profile?.timezone ?? dayjs.tz.guess();

  const { data, error } = await supabase
    .from("bloom_progress")
    .select("*")
    .eq("user_id", user.id)
    .single();

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

  let nextDay = progress.current_day + 1;
  let completedAll = progress.completed_all;

  if (nextDay > BLOOM_MAX_DAY) {
    nextDay = 1;
    completedAll = false;
  }

  const { data: bloomData, error: bloomError } = await supabase
    .from("bloom_progress")
    .update({
      current_day: nextDay,
      last_completed: nowUtcIso,
      completed_all: completedAll,
      updated_at: nowUtcIso,
    })
    .eq("id", progress.id)
    .select()
    .single();

  if (bloomError) throw bloomError;

  const { error: profileUpdateError } = await supabase
    .from("profiles")
    .update({
      last_bloom_date: todayLocal,
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

  const { data: bloomData, error: bloomError } = await supabase
    .from("bloom_progress")
    .update({
      current_day: 1,
      last_completed: null,
      completed_all: false,
      updated_at: nowUtcIso,
    })
    .eq("id", progress.id)
    .select()
    .single();

  if (bloomError) throw bloomError;

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
