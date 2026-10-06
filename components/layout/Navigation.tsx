"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";
import { supabase } from "@/lib/supabase/client";

const navLinks = [
  { href: "/sanctuary", label: "Sanctuary" },
  { href: "/sanctuary/bloom", label: "Bloom" },
  { href: "/sanctuary/wisdom-board", label: "Wisdom Board" },
  { href: "/sanctuary/community", label: "Community" },
];

export default function Navigation() {
  const router = useRouter();

  const [hydrated, setHydrated] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [scrollReady, setScrollReady] = useState(false);

  // ⭐ Cinematic lock
  const [freezeNav, setFreezeNav] = useState(true);

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [user, setUser] = useState<any>(null);

  /* -----------------------------------------------------
     HYDRATION
  ----------------------------------------------------- */
  useEffect(() => {
    setHydrated(true);
  }, []);

  /* -----------------------------------------------------
     ⭐ CINEMATIC LOCK — 600ms
     Prevents ALL layout-shift flickers
  ----------------------------------------------------- */
  useEffect(() => {
    const t = setTimeout(() => setFreezeNav(false), 600);
    return () => clearTimeout(t);
  }, []);

  /* -----------------------------------------------------
     SCROLL DETECTION
  ----------------------------------------------------- */
  useEffect(() => {
    if (!hydrated) return;

    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
      setScrollReady(true);
    };

    handleScroll(); // run immediately
    window.addEventListener("scroll", handleScroll);

    return () => window.removeEventListener("scroll", handleScroll);
  }, [hydrated]);

  /* -----------------------------------------------------
     USER DETECTION
  ----------------------------------------------------- */
  useEffect(() => {
    if (!hydrated) return;

    async function loadUser() {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      setUser(user);
    }

    loadUser();
  }, [hydrated]);

  /* -----------------------------------------------------
     NAV CLASS — LOCKED DURING CINEMATIC BUFFER
  ----------------------------------------------------- */
  const navClass = freezeNav
    ? "backdrop-blur-xl"
    : isScrolled
    ? "backdrop-blur-xl"
    : "bg-transparent";

  const navBg = freezeNav
    ? "rgba(10, 22, 40, 0.90)"
    : isScrolled
    ? "rgba(10, 22, 40, 0.90)"
    : "transparent";

  /* -----------------------------------------------------
     SKELETON DURING HYDRATION
  ----------------------------------------------------- */
  if (!hydrated) {
    return (
      <nav className="fixed top-0 left-0 right-0 z-[9999] bg-transparent">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <span className="text-2xl font-display font-semibold tracking-[4px] text-golden-400">
            SEA WITHIN
          </span>
        </div>
      </nav>
    );
  }

  /* -----------------------------------------------------
     FINAL NAVIGATION
  ----------------------------------------------------- */
  return (
    <>
      <motion.nav
        initial={false}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
        className={`fixed top-0 left-0 right-0 z-[9999] transition-all duration-700 ${navClass}`}
        style={{
          backgroundColor: navBg,

          // ⭐ Cinematic lock properties
          height: freezeNav ? "80px" : undefined,
          transform: freezeNav ? "translateY(0)" : undefined,
          opacity: freezeNav ? 1 : undefined,
        }}
      >
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          {/* Brand */}
          <Link href="/" className="group flex items-center gap-3">
            <span className="text-2xl font-display font-semibold tracking-[4px] text-golden-400 group-hover:text-golden-300 transition-colors duration-500">
              SEA WITHIN
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="font-body text-[13px] tracking-[2px] uppercase text-white/60 hover:text-golden-400 transition-colors"
              >
                {link.label}
              </Link>
            ))}

            {/* AUTH BUTTONS — NO FLASH */}
            {user === null ? (
              <div className="w-[80px] ml-8" /> // invisible placeholder
            ) : (
              <div className="flex items-center gap-12 ml-8">
                <button
                  onClick={() => router.push("/logout")}
                  className="btn-golden text-[11px] px-6 py-2.5"
                >
                  Sign Out
                </button>

                <Link
                  href="/account"
                  className="font-body text-[13px] tracking-[2px] uppercase text-white/60 hover:text-golden-400 transition-colors"
                >
                  Account
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Toggle */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden text-white/60 hover:text-golden-400 transition-colors"
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden backdrop-blur-xl"
              style={{ backgroundColor: "rgba(10, 22, 40, 0.95)" }}
            >
              <div className="px-6 py-8 flex flex-col gap-12">
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="font-body text-[13px] tracking-[2px] uppercase text-white/60 hover:text-golden-400 transition-colors"
                  >
                    {link.label}
                  </Link>
                ))}

                {/* MOBILE AUTH BUTTONS */}
                {user === null ? (
                  <div className="w-[80px]" /> // invisible placeholder
                ) : (
                  <>
                    <button
                      onClick={() => {
                        setIsMobileMenuOpen(false);
                        router.push("/logout");
                      }}
                      className="btn-golden text-[11px] px-6 py-2.5"
                    >
                      Sign Out
                    </button>

                    <Link
                      href="/account"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="font-body text-[13px] tracking-[2px] uppercase text-white/60 hover:text-golden-400 transition-colors"
                    >
                      Account
                    </Link>
                  </>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.nav>
    </>
  );
}
