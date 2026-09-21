import { supabaseServer } from "@/lib/supabase/server";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";

dayjs.extend(utc);
dayjs.extend(timezone);

const BLOOM_MAX_DAY = 36;

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

export async function getBloomProgress() {
  const supabase = supabaseServer();
  const user = await waitForUser();
  if (!user) return null;

  const { data: profile } = await supabase
    .from("profiles")
    .select("timezone, last_bloom_date, last_bloom_video")
    .eq("id", user.id)
    .single();

  const userTimezone = profile?.timezone ?? dayjs.tz.guess();

  const { data, error } = await supabase
    .from("bloom_progress")
    .select("*")
    .eq("user_id", user.id)
    .single();

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

export async function completeTodayBloom(progress, videoName) {
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
  const todayLocal = now.format("YYYY-MM-DD");
  const nowUtcIso = new Date().toISOString();

  let nextDay = progress.current_day + 1;
  let completedAll = progress.completed_all;

  if (nextDay > BLOOM_MAX_DAY) {
    nextDay = 1;
    completedAll = false;
  }

  const { data: bloomData } = await supabase
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

  await supabase
    .from("profiles")
    .update({
      last_bloom_date: todayLocal,
      last_bloom_video: videoName,
    })
    .eq("id", user.id);

  return bloomData;
}
