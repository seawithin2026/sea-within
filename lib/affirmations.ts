import { createClient } from "@supabase/supabase-js";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";

dayjs.extend(utc);
dayjs.extend(timezone);

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// Fetch today's affirmation or generate a new one
export async function getTodayAffirmation(userTimezone: string = "UTC") {
  // ⭐ Compute "today" in the user's timezone
  const today = dayjs().tz(userTimezone).format("YYYY-MM-DD");

  // 1. Check if today's message already exists
  const { data: existing } = await supabase
    .from("daily_affirmations")
    .select("*")
    .eq("date", today)
    .maybeSingle();

  if (existing) {
    return existing;
  }

  // 2. Get a random message from the pool
  let { data: pool } = await supabase.from("affirmation_pool").select("*");

  if (!pool || pool.length === 0) {
    const { default: refillMessages } = await import("../data/affirmations");
    await supabase.from("affirmation_pool").insert(refillMessages);

    const refreshed = await supabase.from("affirmation_pool").select("*");
    pool = refreshed.data || [];
  }

  return await generateNewAffirmation(pool, today);
}

// Helper to generate a new affirmation
async function generateNewAffirmation(pool: any[], today: string) {
  const random = pool[Math.floor(Math.random() * pool.length)];

  // Insert into daily_affirmations
  await supabase.from("daily_affirmations").insert({
    message: random.message,
    attribution: random.attribution,
    date: today, // ⭐ timezone-correct date
  });

  // Remove from pool
  await supabase.from("affirmation_pool").delete().eq("id", random.id);

  return {
    message: random.message,
    attribution: random.attribution,
    date: today,
  };
}
