export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import affirmations from "@/data/affirmations";

import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";

dayjs.extend(utc);
dayjs.extend(timezone);

export async function GET() {
 
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  // 1. Get the authenticated user (service role cannot read cookies)
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  // 2. Fetch user's timezone from profile
  const { data: profile } = await supabase
    .from("profiles")
    .select("timezone")
    .eq("id", user.id)
    .single();

  const userTimezone = profile?.timezone || "UTC";

  // 3. Compute "today" in the user's timezone
  const today = dayjs().tz(userTimezone).format("YYYY-MM-DD");

  // 4. Check if today's affirmation already exists
  const { data: existing } = await supabase
    .from("daily_affirmations")
    .select("*")
    .eq("date", today)
    .maybeSingle();

  if (existing) {
    return NextResponse.json({
      message: existing.message,
      attribution: existing.attribution,
    });
  }

  // 5. Pull the next affirmation from the pool
  let { data: pool } = await supabase
    .from("affirmation_pool")
    .select("*")
    .order("id", { ascending: true });

  // 6. If pool is empty → refill from backup file
  if (!pool || pool.length === 0) {
    await supabase.from("affirmation_pool").insert(affirmations);

    const refreshed = await supabase
      .from("affirmation_pool")
      .select("*")
      .order("id", { ascending: true });

    pool = refreshed.data || [];
  }

  // 7. Select the first affirmation in the pool
  const affirmation = pool[0];

  // 8. Insert today's affirmation
  const { data: inserted } = await supabase
    .from("daily_affirmations")
    .insert({
      message: affirmation.message,
      attribution: affirmation.attribution,
      date: today,
    })
    .select()
    .maybeSingle();

  // 9. Remove it from the pool
  await supabase.from("affirmation_pool").delete().eq("id", affirmation.id);

  // 10. Return the final message
  return NextResponse.json({
    message: inserted.message,
    attribution: inserted.attribution,
  });
}
