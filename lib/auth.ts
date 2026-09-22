// ============================================
// SEA WITHIN — Authentication (SAFE VERSION)
// ============================================

import { supabase } from "./supabase/client";

// --------------------------------------------
// SIGN UP (SAFE)
// --------------------------------------------
export async function signUp(email: string, password: string) {
  // Hydrate session first
  await supabase.auth.getSession();

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
  });

  if (error) throw error;

  if (data.user) {
    const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;

    // Create profile ONLY if not exists
    await supabase.from("profiles").upsert({
      id: data.user.id,
      email,
      is_member: false,
      membership_status: "none",
      timezone,
    });
  }

  return data;
}

// --------------------------------------------
// SIGN IN (SAFE)
// --------------------------------------------
export async function signIn(email: string, password: string) {
  await supabase.auth.getSession();

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) throw error;

  if (data.user) {
    const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;

    await supabase
      .from("profiles")
      .update({ timezone })
      .eq("id", data.user.id);
  }

  return data;
}

// --------------------------------------------
// SIGN OUT
// --------------------------------------------
export async function signOut() {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
}

// --------------------------------------------
// GET CURRENT PROFILE (SAFE)
// --------------------------------------------
export async function getCurrentProfile() {
  await supabase.auth.getSession();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  return profile;
}

// --------------------------------------------
// UPDATE PROFILE (SAFE)
// --------------------------------------------
export async function updateProfile(
  userId: string,
  updates: Partial<{ email: string }>
) {
  const { data, error } = await supabase
    .from("profiles")
    .update({
      ...updates,
      updated_at: new Date().toISOString(),
    })
    .eq("id", userId)
    .select()
    .single();

  if (error) throw error;
  return data;
}
