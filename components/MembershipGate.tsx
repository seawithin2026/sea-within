"use client";

import { useMembershipGate } from "./useMembershipGate";

export default function MembershipGate({ children }: { children?: React.ReactNode }) {
  const allowed = useMembershipGate();

  if (allowed === null) {
    return (
      <main className="min-h-screen flex items-center justify-center text-white">
        <p className="text-white/40 tracking-[3px] uppercase">Loading...</p>
      </main>
    );
  }

  if (allowed === false) {
    if (typeof window !== "undefined") window.location.href = "/reveal";
    return null;
  }

  return <>{children}</>;
}
