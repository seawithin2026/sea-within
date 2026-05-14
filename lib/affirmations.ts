import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// Fetch today's affirmation or generate a new one
export async function getTodayAffirmation() {
  const today = new Date().toISOString().split('T')[0];

  // 1. Check if today's message already exists
  const { data: existing } = await supabase
    .from('daily_affirmations')
    .select('*')
    .eq('date', today)
    .maybeSingle();

  if (existing) {
    return existing;
  }

  // 2. Get a random message from the pool
  let { data: pool } = await supabase
    .from('affirmation_pool')
    .select('*');

  if (!pool || pool.length === 0) {
    const { default: refillMessages } = await import('../data/affirmations');
    await supabase.from('affirmation_pool').insert(refillMessages);

    const refreshed = await supabase
      .from('affirmation_pool')
      .select('*');

    pool = refreshed.data || [];
  }

  return await generateNewAffirmation(pool, today);
}

// Helper to generate a new affirmation
async function generateNewAffirmation(pool: any[], today: string) {
  const random = pool[Math.floor(Math.random() * pool.length)];

  // Insert into daily_affirmations
  await supabase.from('daily_affirmations').insert({
    message: random.message,
    attribution: random.attribution,
    date: today,
  });

  // Remove from pool
  await supabase
    .from('affirmation_pool')
    .delete()
    .eq('id', random.id);

  return {
    message: random.message,
    attribution: random.attribution,
    date: today,
  };
}
