"use server";

import { completeGesture } from "@/lib/gesture.server";
import { completeTodayBloom } from "@/lib/bloom.server";

export async function completeGestureAction(progress: any, userId: string) {
  return await completeGesture(progress, userId);
}

export async function completeTodayBloomAction(
  progress: any,
  videoSrc: string,
  userId: string
) {
  return await completeTodayBloom(progress, videoSrc, userId);
}
