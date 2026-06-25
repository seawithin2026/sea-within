'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import Navigation from '@/components/layout/Navigation';
import Footer from '@/components/layout/Footer';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const { createClient } = await import('@/lib/supabase/client');
      const supabase = createClient();

      const { error: resetError } = await supabase.auth.resetPasswordForEmail(
        email,
        {
          redirectTo: `${window.location.origin}/reset-password`,
        }
      );

      if (resetError) {
        setError('Unable to send reset email. Please try again.');
      } else {
        setSent(true);
      }
    } catch {
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-sea-deep">
      <Navigation />

      <section className="pt-32 pb-32 px-6">
        <div className="max-w-md mx-auto">
          {/* HEADER */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            className="text-center mb-12"
          >
            <h1 className="font-display text-4xl text-white mb-4">
              Reset Your Password
            </h1>
            <p className="font-whisper text-xl text-white/50">
              Enter your email to restore access to your sanctuary.
            </p>
          </motion.div>

          {/* CARD */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="card-sanctuary"
          >
            {/* SUCCESS STATE */}
            {sent ? (
              <div className="text-center py-10">
                <p className="text-sea-glow text-lg mb-4">
                  Check your email
                </p>
                <p className="text-white/60 text-sm leading-relaxed">
                  A link to reset your password has been sent to{' '}
                  <span className="text-white">{email}</span>.
                </p>
              </div>
            ) : (
              <form onSubmit={handleReset} className="space-y-6">
                {/* ERROR */}
                {error && (
                  <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4">
                    <p className="text-red-400 text-sm font-body">{error}</p>
                  </div>
                )}

                {/* EMAIL FIELD */}
                <div>
                  <label className="block font-body text-white/60 text-sm mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="input-sanctuary"
                    placeholder="you@example.com"
                  />
                </div>

                {/* SUBMIT */}
                <button
                  type="submit"
                  disabled={loading}
                  className="btn-sanctuary-gold w-full disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'Sending...' : 'Send Reset Link'}
                </button>
              </form>
            )}
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
