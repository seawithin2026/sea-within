// ============================================// SEA WITHIN — Authentication
// ============================================

// ❗ Only import the client for functions that actually use it
import { supabase } from "./supabase/client";

// --------------------------------------------
// SIGN UP
// --------------------------------------------
export async function signUp(email: string, password: string, fullName: string) {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: fullName,
      },
    },
  });

  if (error) throw error;


  if (data.user) {
    await supabase.from("profiles").insert({
      id: data.user.id,
      email,
      full_name: fullName,
      membership_tier: "free",
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
// ⭐ FIXED: RESET PASSWORD (server route)
// --------------------------------------------
// This now calls your API route instead of Supabase directly.
// This is the ONLY way redirectTo works correctly.
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
// GET CURRENT USER
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
// UPDATE PROFILE
// --------------------------------------------
export async function updateProfile(
  userId: string,
  updates: Partial<{
    full_name: string;
    avatar_url: string;
    bio: string;
  }>
) {
  const { data, error } = await supabase
    .from("profiles")
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq("id", userId)
    .select()
    .single();

  if (error) throw error;
  return data;
}
