import { supabaseServer } from "@/lib/supabase/server";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";

dayjs.extend(utc);
dayjs.extend(timezone);

const BLOOM_MAX_DAY = 36;

export async function getBloomProgress(userId: string) {
  const supabase = await supabaseServer();
  if (!userId) return null;

  const { data: profile } = await supabase
    .from("profiles")
    .select("timezone, last_bloom_date, last_bloom_video")
    .eq("id", userId)
    .maybeSingle();

  const userTimezone = profile?.timezone ?? "UTC";
  const todayLocal = dayjs().tz(userTimezone).format("YYYY-MM-DD");

  let { data, error } = await supabase
    .from("bloom_progress")
    .select("*")
    .eq("user_id", userId)
    .maybeSingle();

  if (!data) {
    const { data: created, error: createError } = await supabase
      .from("bloom_progress")
      .upsert(
        {
          user_id: userId,
          current_day: 1,
          completed_all: false,
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
      profile_last_bloom_date: profile?.last_bloom_date ?? null,
      profile_last_bloom_video: profile?.last_bloom_video ?? null,
    };
  }

  let lastCompletedLocal = null;
  if (data?.last_completed) {
    lastCompletedLocal = dayjs(data.last_completed).format("YYYY-MM-DD");
  }

  return {
    ...data,
    today_local: todayLocal,
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
  const supabase = await supabaseServer();
  if (!userId) throw new Error("Missing userId in completeTodayBloom");

  const { data: profile } = await supabase
    .from("profiles")
    .select("timezone")
    .eq("id", userId)
    .maybeSingle();

  const userTimezone = profile?.timezone ?? "UTC";
  const todayLocal = dayjs().tz(userTimezone).format("YYYY-MM-DD");
  const nowUtcIso = new Date().toISOString();

  let nextDay = (progress?.current_day ?? 1) + 1;
  let completedAll = progress?.completed_all ?? false;

  if (nextDay > BLOOM_MAX_DAY) {
    nextDay = 1;
    completedAll = true;
  }

  // Update bloom_progress (last_completed is DATE: YYYY-MM-DD)
  const { data: bloomData, error: bloomError } = await supabase
    .from("bloom_progress")
    .update({
      current_day: nextDay,
      last_completed: todayLocal,
      completed_all: completedAll,
      updated_at: nowUtcIso,
    })
    .eq("user_id", userId)
    .select()
    .single();

  if (bloomError) throw new Error(`bloom_progress error: ${bloomError.message}`);

  // Update profiles (last_bloom_date is text: YYYY-MM-DD)
  const { error: profileError } = await supabase
    .from("profiles")
    .update({
      last_bloom_date: todayLocal,
      last_bloom_video: videoName,
    })
    .eq("id", userId);

  if (profileError) throw new Error(`profiles error: ${profileError.message}`);

  return bloomData;
}