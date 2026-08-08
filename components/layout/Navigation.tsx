'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X } from 'lucide-react';
import { supabase } from "@/lib/supabase/client";
import SignInModal from '../SignInModal';

const navLinks = [
  { href: '/sanctuary', label: 'Sanctuary' },
  { href: '/sanctuary/bloom', label: 'Bloom' },
  { href: '/wisdom-board', label: 'Wisdom Board' },
  { href: '/community', label: 'Community' },
];

export default function Navigation() {

  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSignInOpen, setIsSignInOpen] = useState(false);
  const [user, setUser] = useState(null);

  // Detect scroll
  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Detect user session
  useEffect(() => {
    async function loadUser() {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      setUser(user);
    }

    loadUser();

    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setUser(session?.user ?? null);
      }
    );

    return () => listener.subscription.unsubscribe();
  }, []);

  
  return (
    <>
      <SignInModal isOpen={isSignInOpen} onClose={() => setIsSignInOpen(false)} />

      {/* ⭐ TEMPORARY FIX: NAV BACKGROUND DOES NOT BLOCK CLICKS */}
      <motion.nav
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 0.5 }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-700 pointer-events-none ${
          isScrolled ? 'backdrop-blur-xl' : 'bg-transparent'
        }`}
        style={{
          backgroundColor: isScrolled ? 'rgba(10, 22, 40, 0.90)' : 'transparent',
        }}
      >
        {/* ⭐ ALL INTERACTIVE CONTENT RE-ENABLED */}
        <div className="pointer-events-auto max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">

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

            {/* SIGN IN / SIGN OUT BUTTON */}
            {!user ? (
              <button
                onClick={() => setIsSignInOpen(true)}
                className="btn-golden text-[11px] px-6 py-2.5 ml-8"
              >
                Sign In
              </button>
            ) : (
              <>
                <button
                  onClick={() => {
                    window.location.href = '/logout';
                  }}
                  className="btn-golden text-[11px] px-6 py-2.5 ml-8"
                >
                  Sign Out
                </button>

  
                <Link
                  href="/account"
                  className="font-body text-[13px] tracking-[2px] uppercase text-white/60 hover:text-golden-400 transition-colors ml-4"
                >
                  Account
                </Link>
              </>
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
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="pointer-events-auto md:hidden backdrop-blur-xl"
              style={{ backgroundColor: 'rgba(10, 22, 40, 0.95)' }}
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


                {!user ? (
                  <button
                    onClick={() => {
                      setIsMobileMenuOpen(false);
                      setIsSignInOpen(true);
                    }}
                    className="btn-golden text-[11px] px-6 py-2.5"
                  >
                    Sign In
                  </button>
                ) : (
                  <>
                    <button
                      onClick={() => {
                        setIsMobileMenuOpen(false);
                        window.location.href = '/logout';
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
