import { createClient } from "@/lib/supabase/server";

export async function getBloomVideos() {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("bloom_videos")
    .select("*")
    .order("base_level", { ascending: true });

  if (error) {
    console.error("Error loading bloom videos:", error);
    return [];
  }

  return data;
}
