'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import Navigation from '@/components/layout/Navigation';
import Footer from '@/components/layout/Footer';

export default function ResetPasswordPage() {
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (password !== confirm) {
      setError('Passwords do not match.');
      setLoading(false);
      return;
    }

    try {
      const { createClient } = await import('@/lib/supabase/client');
      const supabase = createClient();

      const { error: updateError } = await supabase.auth.updateUser({
        password,
      });

      if (updateError) {
        setError('Unable to reset password. Please try again.');
      } else {
        setSuccess(true);
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
              Create a New Password
            </h1>
            <p className="font-whisper text-xl text-white/50">
              A fresh key to your sanctuary.
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
            {success ? (
              <div className="text-center py-10">
                <p className="text-sea-glow text-lg mb-4">
                  Your password has been reset
                </p>
                <p className="text-white/60 text-sm leading-relaxed mb-6">
                  You may now return to your sanctuary.
                </p>

                <a
                  href="/login"
                  className="btn-sanctuary-gold inline-block px-10 py-3"
                >
                  Sign In
                </a>
              </div>
            ) : (
              <form onSubmit={handleReset} className="space-y-6">
                {/* ERROR */}
                {error && (
                  <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4">
                    <p className="text-red-400 text-sm font-body">{error}</p>
                  </div>
                )}

                {/* NEW PASSWORD */}
                <div>
                  <label className="block font-body text-white/60 text-sm mb-2">
                    New Password
                  </label>
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="input-sanctuary"
                    placeholder="Enter new password"
                  />
                </div>

                {/* CONFIRM PASSWORD */}
                <div>
                  <label className="block font-body text-white/60 text-sm mb-2">
                    Confirm Password
                  </label>
                  <input
                    type="password"
                    required
                    value={confirm}
                    onChange={(e) => setConfirm(e.target.value)}
                    className="input-sanctuary"
                    placeholder="Confirm new password"
                  />
                </div>

                {/* SUBMIT */}
                <button
                  type="submit"
                  disabled={loading}
                  className="btn-sanctuary-gold w-full disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'Updating...' : 'Reset Password'}
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
