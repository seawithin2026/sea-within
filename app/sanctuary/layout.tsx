import { redirect } from "next/navigation";
import { supabaseServer } from "@/lib/supabase/server";
import UsernameModal from "@/components/UsernameModal";
import "../globals.css";

export default async function SanctuaryLayout({ children }) {
  const supabase = supabaseServer();

  // Get session
  const {
    data: { session },
  } = await supabase.auth.getSession();

  const user = session?.user;

  // Not signed in → reveal
  if (!user) {
    redirect("/reveal");
  }

  // Fetch profile
  const { data: profile } = await supabase
    .from("profiles")
    .select("username, is_member, membership_status")
    .eq("id", user.id)
    .single();

  // No profile → reveal
  if (!profile) {
    redirect("/reveal");
  }

  // Membership logic
  const status = profile.membership_status?.toLowerCase();
  const isActive =
    profile.is_member === true &&
    (status === "active" || status === "cancelling");

  // Not active → reveal
  if (!isActive) {
    redirect("/reveal");
  }

  return (
    <>
      {/* Username setup modal */}
      {!profile.username && (
        <UsernameModal onComplete={() => {}} />
      )}

      {children}
    </>
  );
}
