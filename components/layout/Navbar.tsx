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

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
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
          ? 'bg-sea-deep/80 backdrop-blur-xl border-b border-sea-mid/20'
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">

        {/* Logo + Brand */}
        <Link href="/" className="group flex items-center gap-3">
          <Image
            src="/images/logo.png"
            alt="Sea Within Logo"
            width={34}
            height={34}
            className="opacity-90 group-hover:opacity-100 transition-all duration-300 border border-white"
          />
          <span className="text-2xl font-display font-semibold text-white tracking-wide group-hover:text-sea-glow transition-colors duration-500">
            Sea Within
          </span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-white/70 hover:text-sea-glow font-body text-sm tracking-wider uppercase transition-colors duration-300"
            >
              {link.label}
            </Link>
          ))}
          <Link href="/join" className="btn-sanctuary text-sm py-2.5 px-6">
            Join the Movement
          </Link>
        </div>

        {/* Mobile Menu Toggle */}
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="md:hidden text-white/70 hover:text-sea-glow transition-colors"
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
            className="md:hidden bg-sea-deep/95 backdrop-blur-xl border-t border-sea-mid/20"
          >
            <div className="px-6 py-8 flex flex-col gap-6">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="text-white/70 hover:text-sea-glow font-body text-lg tracking-wider transition-colors duration-300"
                >
                  {link.label}
                </Link>
              ))}
              <Link
                href="/join"
                onClick={() => setIsMobileMenuOpen(false)}
                className="btn-sanctuary text-center mt-4"
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
