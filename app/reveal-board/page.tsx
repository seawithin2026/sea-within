"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";

type PageEntry = {
  id: string;
  content: string;
  author: string;
  created_at: string;
};

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function RevealBook() {
  const [pages, setPages] = useState<PageEntry[]>([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [isOpen, setIsOpen] = useState(false);

  // Fetch all wisdom posts
  useEffect(() => {
    const loadPages = async () => {
      const { data, error } = await supabase
        .from("wisdom_posts")
        .select("id, content, author, created_at")
        .order("created_at", { ascending: true });

      if (!data || error) return;
      setPages(data);
    };

    loadPages();
  }, []);

  // Animate book opening
  useEffect(() => {
    const t = setTimeout(() => setIsOpen(true), 2000);
    return () => clearTimeout(t);
  }, []);

  const entry = pages[currentPage];

  const formattedDate = entry
    ? new Date(entry.created_at).toLocaleString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
        hour: "numeric",
        minute: "2-digit",
      })
    : "";

  return (
    <main className="relative min-h-screen w-full overflow-hidden bg-black text-amber-50">
      {/* Underwater background */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#020617] to-[#020617]" />

      <div className="relative z-10 flex min-h-screen items-center justify-center px-4">

        {/* BOOK CONTAINER */}
        <div className="relative h-[480px] w-[780px] max-w-full">

          {/* CLOSED BOOK */}
          <Image
            src="/images/sea-within-book-closed.png"
            alt="Sea Within Closed Book"
            fill
            className={`object-contain transition-all duration-[2500ms] ease-in-out
              ${isOpen ? "opacity-0 rotate-y-12" : "opacity-100 rotate-y-0"}
            `}
            priority
          />

          {/* OPEN BOOK */}
          <Image
            src="/images/sea-within-book-open.png"
            alt="Sea Within Open Book"
            fill
            className={`object-contain transition-all duration-[2500ms] ease-in-out
              ${isOpen ? "opacity-100 rotate-y-0" : "opacity-0 rotate-y-[-12deg]"}
            `}
            priority
          />

          {/* TEXT OVERLAY ON OPEN BOOK */}
          {isOpen && entry && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="relative h-[70%] w-[70%] flex">

                {/* LEFT PAGE */}
                <div className="flex-1 pr-6">
                  <p className="text-[10px] uppercase tracking-[0.3em] text-slate-200/80 drop-shadow">
                    Sea Within
                  </p>
                  <p className="mt-2 text-xs text-slate-200/80 drop-shadow max-w-[90%]">
                    A living book of every message ever written on the Wisdom Board.
                  </p>
                </div>

                {/* RIGHT PAGE */}
                <div className="flex-1 pl-6">
                  <p className="text-[10px] uppercase tracking-[0.35em] text-amber-900/85 mb-1 drop-shadow">
                    {formattedDate}
                  </p>
                  <p className="text-xs text-amber-900/85 mb-3 drop-shadow">
                    By {entry.author}
                  </p>
                  <p className="text-sm leading-relaxed text-amber-900/95 whitespace-pre-line drop-shadow max-w-[95%]">
                    {entry.content}
                  </p>
                </div>

              </div>
            </div>
          )}

          {/* PAGE NAVIGATION */}
          {isOpen && pages.length > 1 && (
            <>
              <button
                onClick={() => setCurrentPage((p) => Math.max(0, p - 1))}
                className="absolute left-0 top-1/2 -translate-y-1/2 text-amber-200/70 hover:text-amber-100 text-4xl"
              >
                ‹
              </button>

              <button
                onClick={() =>
                  setCurrentPage((p) => Math.min(pages.length - 1, p + 1))
                }
                className="absolute right-0 top-1/2 -translate-y-1/2 text-amber-200/70 hover:text-amber-100 text-4xl"
              >
                ›
              </button>
            </>
          )}

        </div>
      </div>
    </main>
  );
}
