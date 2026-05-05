'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X } from 'lucide-react';

const navLinks = [
  { href: '/', label: 'Home' },
  { href: '/sanctuary', label: 'Sanctuary' },
  { href: '/wisdom-board', label: 'Wisdom Board' },
  { href: '/community', label: 'Community' },
];

export default function Navigation() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <motion.nav
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 1, delay: 0.5 }}
      className={`fixed top-0 left-0 right-0 z-[9999] transition-all duration-700 ${
        isScrolled
          ? 'bg-[#020617]/85 backdrop-blur-xl border-b border-[#d4af37]/20'
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-3 py-3 flex items-center justify-between">

        {/* Logo + Brand */}
        <Link href="/" className="group flex items-center gap-4">
          <Image
            src="/images/logo.png"
            alt="Sea Within Logo"
            width={120}
            height={120}
            className="opacity-90 group-hover:opacity-100 transition-all duration-300 border border-[#d4af37] rounded-full shadow-[0_0_12px_rgba(212,175,55,0.35)]"
          />
          <span className="text-2xl font-display font-semibold tracking-wide text-[#d4af37] group-hover:text-[#f5d97c] transition-colors duration-500">
            Sea Within
          </span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-white/85 hover:text-[#d4af37] font-body text-sm tracking-wider uppercase transition-colors duration-300"
            >
              {link.label}
            </Link>
          ))}

          {/* Join Button */}
          <Link
            href="/join"
            className="border border-[#d4af37] text-[#d4af37] px-6 py-2.5 rounded-full text-sm tracking-wide hover:bg-[#d4af37] hover:text-black transition-all duration-300"
          >
            Join the Movement
          </Link>
        </div>

        {/* Mobile Menu Toggle */}
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="md:hidden text-white/85 hover:text-[#d4af37] transition-colors"
          aria-label="Toggle menu"
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
            className="md:hidden bg-[#020617]/95 backdrop-blur-xl border-t border-[#d4af37]/20"
          >
            <div className="px-6 py-8 flex flex-col gap-6">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="text-white/85 hover:text-[#d4af37] font-body text-lg tracking-wider transition-colors duration-300"
                >
                  {link.label}
                </Link>
              ))}

              <Link
                href="/join"
                onClick={() => setIsMobileMenuOpen(false)}
                className="border border-[#d4af37] text-[#d4af37] px-6 py-3 rounded-full text-center text-lg tracking-wide hover:bg-[#d4af37] hover:text-black transition-all duration-300"
              >
                Join the Movement
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}
