import { supabaseServer } from "@/lib/supabase/server";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";

dayjs.extend(utc);
dayjs.extend(timezone);

const BLOOM_MAX_DAY = 36;

export async function getBloomProgress(userId: string) {
  const supabase = supabaseServer();
  if (!userId) return null;

  const { data: profile } = await supabase
    .from("profiles")
    .select("timezone, last_bloom_date, last_bloom_video")
    .eq("id", userId)
    .single();

  const userTimezone = profile?.timezone ?? dayjs.tz.guess();

  const { data, error } = await supabase
    .from("bloom_progress")
    .select("*")
    .eq("user_id", userId)
    .single();

  // If no bloom_progress row exists yet, create it
  if (error && error.code === "PGRST116") {
    const { data: created } = await supabase
      .from("bloom_progress")
      .insert({
        user_id: userId,
        current_day: 1,
        completed_all: false,
        last_completed: null,
      })
      .select()
      .single();

    return {
      ...created,
      last_completed_local: null,
      profile_last_bloom_date: profile?.last_bloom_date ?? null,
      profile_last_bloom_video: profile?.last_bloom_video ?? null,
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
    profile_last_bloom_date: profile?.last_bloom_date ?? null,
    profile_last_bloom_video: profile?.last_bloom_video ?? null,
  };
}

export async function completeTodayBloom(
  progress: any,
  videoName: string,
  userId: string
) {
  const supabase = supabaseServer();
  if (!userId) return null;

  const { data: profile } = await supabase
    .from("profiles")
    .select("timezone")
    .eq("id", userId)
    .single();

  const userTimezone = profile?.timezone ?? dayjs.tz.guess();

  // Use full ISO timestamp in user's timezone
  const todayLocalTimestamp = dayjs().tz(userTimezone).toISOString();

  let nextDay = progress.current_day + 1;
  let completedAll = progress.completed_all;

  if (nextDay > BLOOM_MAX_DAY) {
    nextDay = 1;
    completedAll = false;
  }

  // Safer targeting by user_id, with error surfaced
  const { data: bloomData, error: bloomError } = await supabase
    .from("bloom_progress")
    .update({
      current_day: nextDay,
      last_completed: todayLocalTimestamp,
      completed_all: completedAll,
      updated_at: new Date().toISOString(),
    })
    .eq("user_id", userId)
    .select()
    .single();

  if (bloomError) {
    console.error("Bloom update failed:", bloomError);
    return null;
  }

  const { error: profileError } = await supabase
    .from("profiles")
    .update({
      last_bloom_date: todayLocalTimestamp,
      last_bloom_video: videoName,
    })
    .eq("id", userId)
    .select()
    .single();

  if (profileError) {
    console.error("Profile bloom update failed:", profileError);
  }

  return bloomData;
}
