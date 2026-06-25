'use client';

import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';

export default function SignInModal({ isOpen, onClose }) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[999] flex items-center justify-center bg-black/70 backdrop-blur-md"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-[#0A1628] border border-white/10 rounded-xl p-10 max-w-sm w-full text-center"
          >
            <h2 className="text-golden-400 font-display text-xl tracking-[3px] mb-6">
              Welcome Back
            </h2>

            <p className="text-white/70 text-sm mb-8">
              Sign in to access your sanctuary.
            </p>

            {/* SIGN IN BUTTON */}
            <Link
              href="/auth/signin"
              onClick={onClose}
              className="btn-golden w-full py-3 text-[12px] tracking-[2px]"
            >
              Sign In
            </Link>

            {/* CLOSE BUTTON */}
            <button
              onClick={onClose}
              className="mt-6 text-white/40 hover:text-white/60 text-xs tracking-[2px]"
            >
              Close
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
