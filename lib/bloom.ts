import { supabase } from './supabase/client';


const BLOOM_MAX_DAY = 12; // change if needed

export async function getBloomProgress() {

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  const { data, error } = await supabase
    .from('bloom_progress')
    .select('*')
    .eq('user_id', user.id)
    .single();

  if (error && error.code === 'PGRST116') {
    // no row yet → create one
    const { data: created } = await supabase
      .from('bloom_progress')
      .insert({
        user_id: user.id,
        current_day: 1,
        completed_all: false,
      })
      .select()
      .single();

    return created;
  }

  if (error) throw error;
  return data;
}

export async function completeTodayBloom(progress: any) {

  const today = new Date().toISOString().slice(0, 10); // YYYY-MM-DD

  let nextDay = progress.current_day + 1;
  let completedAll = progress.completed_all;

  if (nextDay > BLOOM_MAX_DAY) {
    // finished cycle → mark completed_all
    nextDay = BLOOM_MAX_DAY;
    completedAll = true;
  }

  const { data, error } = await supabase
    .from('bloom_progress')
    .update({
      current_day: nextDay,
      last_completed: today,
      completed_all: completedAll,
      updated_at: new Date().toISOString(),
    })
    .eq('id', progress.id)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function resetBloomCycle(progress: any) {


  const { data, error } = await supabase
    .from('bloom_progress')
    .update({
      current_day: 1,
      last_completed: null,
      completed_all: false,
      updated_at: new Date().toISOString(),
    })
    .eq('id', progress.id)
    .select()
    .single();

  if (error) throw error;
  return data;
}
