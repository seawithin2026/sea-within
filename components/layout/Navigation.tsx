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
      transition={{ duration: 1 }}
      className={`fixed top-0 left-0 right-0 z-[9999] transition-all duration-700 ${
        isScrolled
          ? 'bg-[#020617]/85 backdrop-blur-xl border-b border-[#d4af37]/25'
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">

        {/* Logo + Brand */}
        <Link href="/" className="group flex items-center gap-4">
          <Image
            src="/images/logo.png"
            alt="Sea Within Logo"
            width={110}
            height={110}
            className="opacity-90 group-hover:opacity-100 transition-all duration-300 border border-[#d4af37] rounded-full shadow-[0_0_14px_rgba(212,175,55,0.45)]"
          />
          <span className="text-3xl font-display tracking-wide font-semibold text-[#d4af37] group-hover:text-[#f5d97c] transition-colors duration-500">
            Sea Within
          </span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-10">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-white/90 hover:text-[#d4af37] font-body text-base tracking-widest uppercase transition-colors duration-300"
            >
              {link.label}
            </Link>
          ))}

          {/* Join Button */}
          <Link
            href="/join"
            className="border border-[#d4af37] text-[#d4af37] px-7 py-3 rounded-full text-base tracking-widest hover:bg-[#d4af37] hover:text-black transition-all duration-300 shadow-[0_0_10px_rgba(212,175,55,0.35)]"
          >
            Join
          </Link>
        </div>

        {/* Mobile Menu Toggle */}
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="md:hidden text-white/90 hover:text-[#d4af37] transition-colors"
        >
          {isMobileMenuOpen ? <X size={26} /> : <Menu size={26} />}
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-[#020617]/95 backdrop-blur-xl border-t border-[#d4af37]/25"
          >
            <div className="px-6 py-10 flex flex-col gap-8">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="text-white/90 hover:text-[#d4af37] font-body text-xl tracking-widest transition-colors duration-300"
                >
                  {link.label}
                </Link>
              ))}

              <Link
                href="/join"
                onClick={() => setIsMobileMenuOpen(false)}
                className="border border-[#d4af37] text-[#d4af37] px-8 py-4 rounded-full text-center text-xl tracking-widest hover:bg-[#d4af37] hover:text-black transition-all duration-300 shadow-[0_0_10px_rgba(212,175,55,0.35)]"
              >
                Join
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}
