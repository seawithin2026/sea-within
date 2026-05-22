import { createClient } from "@/lib/supabase/client";
import { BloomVideo } from "./types";

export async function getBloomVideos(): Promise<BloomVideo[]> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("bloom_videos")
    .select("id, src, title, base_level, element")
    .order("base_level", { ascending: true });

  if (error || !data) return [];

  return data as BloomVideo[];
}
