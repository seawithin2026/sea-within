import { supabase } from "@/lib/supabase/client";

export async function getBloomProgressClient() {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  const { data: profile } = await supabase
    .from("profiles")
    .select("last_bloom_date, last_bloom_video")
    .eq("id", user.id)
    .single();

  const { data } = await supabase
    .from("bloom_progress")
    .select("*")
    .eq("user_id", user.id)
    .single();

  if (!data) return null;

  return {
    ...data,
    last_completed_local: data.last_completed,
    profile_last_bloom_date: profile?.last_bloom_date ?? null,
    profile_last_bloom_video: profile?.last_bloom_video ?? null,
  };
}
