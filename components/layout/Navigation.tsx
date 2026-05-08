'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X } from 'lucide-react';
import SignInModal from '../SignInModal'; // <-- FIXED PATH

const navLinks = [
  { href: '/sanctuary', label: 'Sanctuary' },
  { href: '/sanctuary/journal', label: 'Journal' },
  { href: '/wisdom-board', label: 'Wisdom Board' },
  { href: '/reveal-board', label: 'Wisdom Board Reveal' },
  { href: '/community', label: 'Community' },
];

export default function Navigation() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSignInOpen, setIsSignInOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      <SignInModal isOpen={isSignInOpen} onClose={() => setIsSignInOpen(false)} />

      <motion.nav
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 0.5 }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-700 ${
          isScrolled
            ? 'backdrop-blur-xl border-b border-white/5'
            : 'bg-transparent'
        }`}
        style={{
          backgroundColor: isScrolled ? 'rgba(10, 22, 40, 0.90)' : 'transparent',
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

            {/* TEMPORARY: Join opens Sign-In modal */}
            <button
              onClick={() => setIsSignInOpen(true)}
              className="btn-golden text-[11px] px-6 py-2.5"
            >
              Join
            </button>
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
              className="md:hidden backdrop-blur-xl border-t border-white/5"
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

                {/* Mobile Join → opens modal */}
                <button
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    setIsSignInOpen(true);
                  }}
                  className="btn-golden text-center text-[11px]"
                >
                  Join the Movement
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.nav>
    </>
  );
}
