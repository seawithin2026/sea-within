"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

export default function ScrollDownArrow() {
  const pathname = usePathname();
  const [visible, setVisible] = useState(true);

  // Hide on community chat
  if (pathname === "/sanctuary/community") return null;

  useEffect(() => {
    // Prevent crash during SSR
    if (typeof window === "undefined") return;

    const handleScroll = () => {
      if (window.scrollY > 40) {
        setVisible(false); // fade out once user scrolls
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div
      className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 transition-opacity duration-700"
      style={{
        opacity: visible ? 0.9 : 0,
      }}
    >
      <div
        className="
          flex flex-col items-center justify-center
          animate-bounce-slow
        "
      >
        <span
          className="
            text-[#E8D6A8]
            text-3xl
            drop-shadow-[0_0_8px_rgba(255,215,130,0.35)]
          "
        >
          ↓
        </span>
      </div>
    </div>
  );
}
