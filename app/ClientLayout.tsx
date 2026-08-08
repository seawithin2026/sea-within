"use client";

import { Cormorant_Garamond, Inter } from 'next/font/google';
import './globals.css';
import Navigation from '@/components/layout/Navigation';

const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['300'],
  style: ['normal', 'italic'],
  display: 'swap',
  variable: '--font-display',
});

const inter = Inter({
  subsets: ['latin'],
  weight: ['300'],
  display: 'swap',
  variable: '--font-body',
});

export default function ClientLayout({ children }) {
  return (
    <div className={`scroll-smooth ${cormorant.variable} ${inter.variable}`}>
      <Navigation />
      {children}
    </div>
  );
}
