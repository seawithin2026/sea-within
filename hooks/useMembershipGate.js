"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export function useMembershipGate() {
  const router = useRouter();
  const [allowed, setAllowed] = useState(false);

  useEffect(() => {
    const isMember = localStorage.getItem("isMember");

    if (isMember === "true") {
      setAllowed(true);
    } else {
      router.replace("/paywall");
    }
  }, []);

  return allowed;
}
