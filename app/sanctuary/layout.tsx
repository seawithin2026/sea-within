import { redirect } from "next/navigation";
import { supabaseServer } from "@/lib/supabase/server";
import UsernameModal from "@/components/UsernameModal";
import "../globals.css";

export default async function SanctuaryLayout({ children }) {
  const supabase = supabaseServer();

  // Get user (more reliable than getSession)
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/reveal");

  // Fetch profile
  const { data: profile } = await supabase
    .from("profiles")
    .select("username, membership_status")
    .eq("id", user.id)
    .single();

  if (!profile) redirect("/reveal");

  const status = profile.membership_status?.toLowerCase();
  const hasAccess = status === "active" || status === "cancelling";

  if (!hasAccess) redirect("/reveal");

  return (
    <>
      {!profile.username && <UsernameModal onComplete={() => {}} />}
      {children}
    </>
  );
}
