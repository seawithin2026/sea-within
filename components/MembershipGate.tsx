"use client";

import { useMembershipGate } from "./useMembershipGate";

export default function MembershipGate({ children }: { children?: React.ReactNode }) {
  const allowed = useMembershipGate();

  // Blank screen instead of "Loading..."
  if (allowed === null) {
    return <main className="min-h-screen bg-black" />;
  }

  if (allowed === false) {
    if (typeof window !== "undefined") window.location.href = "/reveal";
    return null;
  }

  return <>{children}</>;
}