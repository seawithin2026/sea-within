"use server";

import { completeGesture } from "@/lib/gesture";
import { completeTodayBloom } from "@/lib/bloom";

export async function completeGestureAction(progress: any) {
  return await completeGesture(progress);
}

export async function completeTodayBloomAction(progress: any, videoSrc: string) {
  return await completeTodayBloom(progress, videoSrc);
}
