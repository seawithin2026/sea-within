// ============================================
// SEA WITHIN — Authentication (FIXED VERSION)
// ============================================

import { supabase } from "./supabase/client";

// --------------------------------------------
// SIGN UP (FIXED)
// --------------------------------------------
export async function signUp(email: string, password: string) {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
  });

  if (error) throw error;

  // Create minimal profile that matches your schema
  if (data.user) {
    await supabase.from("profiles").insert({
      id: data.user.id,
      email,
      is_member: false,
      membership_status: "none",
    });
  }

  return data;
}

// --------------------------------------------
// SIGN IN
// --------------------------------------------
export async function signIn(email: string, password: string) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) throw error;
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
// RESET PASSWORD (server route)
// --------------------------------------------
export async function resetPassword(email: string) {
  const res = await fetch("/api/reset-password", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email }),
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.error);
  }
}

// --------------------------------------------
// GET CURRENT USER (FIXED)
// --------------------------------------------
export async function getCurrentUser() {
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
// UPDATE PROFILE (FIXED)
// --------------------------------------------
// Only allow updating fields that actually exist in your table
export async function updateProfile(
  userId: string,
  updates: Partial<{
    email: string;
  }>
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
