import { supabase } from "@/lib/supabase/client";

export async function getGestureProgressClient() {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  const { data } = await supabase
    .from("gesture_progress")
    .select("*")
    .eq("user_id", user.id)
    .single();

  return data ?? null;
}
