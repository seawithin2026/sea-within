import { supabaseServer } from "@/lib/supabase/server";
import { getBloomProgress } from "@/lib/bloom";
import { getGestureProgress } from "@/lib/gesture";
import BloomClient from "./BloomClient";

export default async function BloomPage() {
  const supabase = supabaseServer();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return null;
  }

  const bloom = await getBloomProgress();
  const gesture = await getGestureProgress();

  return <BloomClient bloom={bloom} gesture={gesture} />;
}
