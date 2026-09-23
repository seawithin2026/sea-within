"use client";

import MembershipGate from "./MembershipGate";

export default function MembershipGateWrapper({ children }: { children: React.ReactNode }) {
  return <MembershipGate>{children}</MembershipGate>;
}
