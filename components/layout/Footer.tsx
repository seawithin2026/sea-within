'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';

export default function Footer() {
  return (
    <footer className="relative bg-sea-deep border-t border-sea-mid/20 py-16">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          
          {/* Brand */}
          <div>
            <h3 className="font-display text-2xl text-white mb-4">Sea Within</h3>
            <p className="font-body text-white/50 text-sm leading-relaxed max-w-xs">
              A cinematic sanctuary for inner awakening. Come home to the part of yourself
              you left behind.
            </p>
          </div>

          {/* Explore */}
          <div>
            <h4 className="font-body text-white/70 text-sm uppercase tracking-wider mb-4">
              Explore
            </h4>
            <ul className="space-y-3">
              {[
                { href: '/sanctuary', label: 'Sanctuary' },
                { href: '/bloom', label: 'Bloom' },
                { href: '/wisdom-board', label: 'Wisdom Board' },
                { href: '/community', label: 'Community' },
                { href: '/join', label: 'Join the Movement' },
              ].map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-white/40 hover:text-sea-glow text-sm transition-colors duration-300"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="font-body text-white/70 text-sm uppercase tracking-wider mb-4">
              Legal
            </h4>
            <ul className="space-y-3">
              {[
                { href: '/privacy', label: 'Privacy Policy' },
                { href: '/terms', label: 'Terms of Service' },
                { href: '/refund', label: 'Refund Policy' },
                { href: '/guidelines', label: 'Community Guidelines' },
                { href: '/accessibility', label: 'Accessibility Statement' },
              ].map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-white/40 hover:text-sea-glow text-sm transition-colors duration-300"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Connect */}
          <div>
            <h4 className="font-body text-white/70 text-sm uppercase tracking-wider mb-4">
              Connect
            </h4>
            <p className="text-white/40 text-sm mb-2">seawithinyourself@gmail.com</p>
            <p className="text-white/30 text-xs mt-6">New Brunswick, Canada</p>
          </div>
        </div>

        {/* Bottom */}
        <div className="divider-wave" />
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-white/30 text-xs">
            &copy; {new Date().getFullYear()} Sea Within. All rights reserved.
          </p>
       
        </div>
      </div>
    </footer>
  );
}
