import BloomClient from "./BloomClient";
import { supabaseServer } from "@/lib/supabase/server";
import { getBloomProgress } from "@/lib/bloom.server";
import { getGestureProgress } from "@/lib/gesture.server";
import MembershipGate from "@/components/MembershipGate";

export default async function BloomPage() {
  const supabase = supabaseServer();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <p className="text-white/40 tracking-[3px] uppercase">
          Loading Ritual…
        </p>
      </div>
    );
  }

  const bloom = await getBloomProgress(user.id);
  const gesture = await getGestureProgress(user.id);

  // Dummy refresh function to satisfy BloomClient's required prop
  async function onRefresh() {}

  return (
    <MembershipGate>
      <BloomClient
        bloom={bloom}
        gesture={gesture}
        onRefresh={onRefresh}
        userId={user.id}
      />
    </MembershipGate>
  );
}
