import { supabase } from "@/lib/supabase/client";

export async function syncTimezone() {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return;

  const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;

  await supabase
    .from("profiles")
    .update({ timezone: tz })
    .eq("id", user.id);
}
