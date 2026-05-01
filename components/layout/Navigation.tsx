'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function Navigation() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 100);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-700 ${
        isScrolled
          ? 'bg-sanctuary-dark/90 backdrop-blur-lg border-b border-white/5'
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <div className="flex items-center justify-between h-20">
          <Link
            href="/"
            className="font-display text-xl md:text-2xl tracking-[4px] text-golden-400 hover:text-golden-300 transition-colors"
          >
            SEA WITHIN
          </Link>

          <div className="hidden md:flex items-center gap-8">
            <Link href="/sanctuary" className="font-body text-[13px] tracking-[2px] uppercase text-white/50 hover:text-golden-400 transition-colors">
              Sanctuary
            </Link>
            <Link href="/sanctuary/journal" className="font-body text-[13px] tracking-[2px] uppercase text-white/50 hover:text-golden-400 transition-colors">
            Journal
            </Link>

            <Link href="/wisdom-board" className="font-body text-[13px] tracking-[2px] uppercase text-white/50 hover:text-golden-400 transition-colors">
              Wisdom
            </Link>
            <Link href="/community" className="font-body text-[13px] tracking-[2px] uppercase text-white/50 hover:text-golden-400 transition-colors">
              Community
            </Link>
            <Link href="/join" className="btn-golden text-[11px] px-6 py-2.5">
              Join
            </Link>
          </div>

          <button
            onClick={() => setIsMobileOpen(!isMobileOpen)}
            className="md:hidden text-white/60 hover:text-golden-400 transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {isMobileOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 8h16M4 16h16" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {isMobileOpen && (
        <div className="md:hidden bg-sanctuary-dark/95 backdrop-blur-xl border-t border-white/5">
          <div className="px-6 py-8 flex flex-col gap-6">
            <Link href="/sanctuary" onClick={() => setIsMobileOpen(false)} className="font-body text-[13px] tracking-[2px] uppercase text-white/60 hover:text-golden-400">Sanctuary</Link>
            <Link href="/wisdom-board" onClick={() => setIsMobileOpen(false)} className="font-body text-[13px] tracking-[2px] uppercase text-white/60 hover:text-golden-400">Wisdom</Link>
            <Link href="/community" onClick={() => setIsMobileOpen(false)} className="font-body text-[13px] tracking-[2px] uppercase text-white/60 hover:text-golden-400">Community</Link>
            <Link href="/join" onClick={() => setIsMobileOpen(false)} className="btn-golden text-center text-[11px]">Join the Movement</Link>
          </div>
        </div>
      )}
    </nav>
  );
}
