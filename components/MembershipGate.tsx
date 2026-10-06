"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useMembershipGate } from "./useMembershipGate";

export default function MembershipGate({ children }: { children?: React.ReactNode }) {
  const allowed = useMembershipGate();
  const router = useRouter();

  // ⭐ Redirect only when allowed === true
  useEffect(() => {
    if (allowed === true) {
      router.replace("/sanctuary");
    }
  }, [allowed, router]);

  // Blank screen instead of "Loading..."
  if (allowed === null) {
    return <main className="min-h-screen bg-black" />;
  }

  // Not allowed → redirect to reveal
  if (allowed === false) {
    if (typeof window !== "undefined") window.location.href = "/reveal";
    return null;
  }

  // Allowed → children will render for a split second before redirect
  return <>{children}</>;
}
