"use client";

import { useMembershipGate } from "./useMembershipGate";

export default function MembershipGate() {
  const allowed = useMembershipGate();

  if (allowed === null) return null;

  if (allowed === false) {
    if (typeof window !== "undefined") window.location.href = "/reveal";
    return null;
  }

  return null;
}
