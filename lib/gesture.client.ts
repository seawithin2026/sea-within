import { supabase } from "@/lib/supabase/client";

export async function getGestureProgressClient() {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  // Fetch gesture progress
  const { data } = await supabase
    .from("gesture_progress")
    .select("*")
    .eq("user_id", user.id)
    .single();

  if (!data) return null;

  // Gesture server stores last_completed as YYYY-MM-DD
  const lastCompletedLocal = data.last_completed ?? null;

  return {
    ...data,
    last_completed_local: lastCompletedLocal,
  };
}
