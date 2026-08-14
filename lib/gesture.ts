import { supabase } from './supabase/client';

/* -----------------------------------------------------
   🌿 Fetch Gesture Progress
----------------------------------------------------- */
export async function getGestureProgress() {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  const { data, error } = await supabase
    .from('gesture_progress')
    .select('current_index, last_index, last_completed')
    .eq('user_id', user.id)
    .single();

  if (error && error.code === 'PGRST116') {
    const { data: created } = await supabase
      .from('gesture_progress')
      .insert({
        user_id: user.id,
        current_index: 0,
        last_index: -1,
        last_completed: null,
      })
      .select()
      .single();

    return created;
  }

  if (error) throw error;
  return data;
}

/* -----------------------------------------------------
   🌿 Complete Gesture
----------------------------------------------------- */
export async function completeGesture(currentIndex: number) {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  const nextIndex = currentIndex + 1;
  const now = new Date().toISOString();

  const { data, error } = await supabase
    .from('gesture_progress')
    .update({
      current_index: nextIndex,
      last_index: currentIndex,
      last_completed: now,
    })
    .eq('user_id', user.id)
    .select()
    .single();

  if (error) throw error;
  return data;
}

/* -----------------------------------------------------
   🌿 Reset Gesture Cycle
----------------------------------------------------- */
export async function resetGestureCycle() {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  const { data, error } = await supabase
    .from('gesture_progress')
    .update({
      current_index: 0,
      last_index: -1,
      last_completed: null,
    })
    .eq('user_id', user.id)
    .select()
    .single();

  if (error) throw error;
  return data;
}
