"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
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
  const [hydrated, setHydrated] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [user, setUser] = useState<any>(null);

  // Hydration guard
  useEffect(() => {
    setHydrated(true);
  }, []);

  // Scroll detection
  useEffect(() => {
    if (!hydrated) return;

    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);

    return () => window.removeEventListener("scroll", handleScroll);
  }, [hydrated]);

  // Detect user
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

  // Skeleton during hydration
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

  return (
    <>
      <motion.nav
        initial={false}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
        className={`fixed top-0 left-0 right-0 z-[9999] transition-all duration-700 ${
          isScrolled ? "backdrop-blur-xl" : "bg-transparent"
        }`}
        style={{
          backgroundColor: isScrolled
            ? "rgba(10, 22, 40, 0.90)"
            : "transparent",
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

            {/* AUTH BUTTONS */}
            {!user ? (
              <Link
                href="/login"
                className="btn-golden text-[11px] px-6 py-2.5 ml-8"
              >
                Sign In
              </Link>
            ) : (
              <div className="flex items-center gap-6 ml-8">
                {/* ⭐ SIGN OUT FIRST */}
                <button
                  onClick={async () => {
                    await supabase.auth.signOut();
                    window.location.href = "/login";
                  }}
                  className="btn-golden text-[11px] px-6 py-2.5"
                >
                  Sign Out
                </button>

                {/* ⭐ ACCOUNT SECOND */}
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
              <div className="px-6 py-8 flex flex-col gap-6">
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
                {!user ? (
                  <Link
                    href="/login"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="btn-golden text-[11px] px-6 py-2.5"
                  >
                    Sign In
                  </Link>
                ) : (
                  <>
                    {/* ⭐ SIGN OUT FIRST */}
                    <button
                      onClick={async () => {
                        await supabase.auth.signOut();
                        setIsMobileMenuOpen(false);
                        window.location.href = "/login";
                      }}
                      className="btn-golden text-[11px] px-6 py-2.5"
                    >
                      Sign Out
                    </button>

                    {/* ⭐ ACCOUNT SECOND */}
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
