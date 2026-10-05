"use server";

import { revalidatePath } from "next/cache";
import { supabaseServer } from "@/lib/supabase/server";
import { completeGesture } from "@/lib/gesture.server";
import { completeTodayBloom } from "@/lib/bloom.server";

export async function completeGestureAction(progress: any, userId: string) {
  try {
    const supabase = await supabaseServer();
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      throw new Error("Unauthorized: Active user session required.");
    }

    const data = await completeGesture(progress, user.id);
    revalidatePath("/bloom");

    return { success: true, data };
  } catch (error: any) {
    console.error("❌ Error in completeGestureAction:", error.message);
    return { success: false, error: error.message };
  }
}

export async function completeTodayBloomAction(
  progress: any,
  videoSrc: string,
  userId: string
) {
  try {
    const supabase = await supabaseServer();
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      throw new Error("Unauthorized: Active user session required.");
    }

    const data = await completeTodayBloom(progress, videoSrc, user.id);
    revalidatePath("/bloom");

    return { success: true, data };
  } catch (error: any) {
    console.error("❌ Error in completeTodayBloomAction:", error.message);
    return { success: false, error: error.message };
  }
}