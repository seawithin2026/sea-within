'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Navigation from '@/components/layout/Navigation';
import Footer from '@/components/layout/Footer';
import Link from 'next/link';

export default function LoginPage() {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [remember, setRemember] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  // ⭐ Load remembered email on mount
  useEffect(() => {
    const saved = localStorage.getItem('rememberedEmail');
    if (saved) {
      setFormData((prev) => ({ ...prev, email: saved }));
      setRemember(true);
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      // ⭐ Save or clear remembered email
      if (remember) {
        localStorage.setItem('rememberedEmail', formData.email);
      } else {
        localStorage.removeItem('rememberedEmail');
      }

      const { createClient } = await import('@/lib/supabase/client');
      const supabase = createClient();

      const { error: authError } = await supabase.auth.signInWithPassword({
        email: formData.email,
        password: formData.password,
      });

      if (authError) {
        setError('Invalid email or password. Please try again.');
      } else {
        window.location.href = '/sanctuary';
      }
    } catch {
      setError('Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-sea-deep">
      <Navigation />

      <section className="pt-32 pb-32 px-6">
        <div className="max-w-md mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            className="text-center mb-12"
          >
            <h1 className="font-display text-4xl text-white mb-4">Welcome Back</h1>
            <p className="font-whisper text-xl text-white/50">
              Step back inside your sanctuary.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="card-sanctuary"
          >
            {error && (
              <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4 mb-6">
                <p className="text-red-400 text-sm font-body">{error}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block font-body text-white/60 text-sm mb-2">Email</label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  className="input-sanctuary"
                  placeholder="you@example.com"
                />
              </div>

              <div>
                <label className="block font-body text-white/60 text-sm mb-2">Password</label>
                <input
                  type="password"
                  required
                  value={formData.password}
                  onChange={(e) =>
                    setFormData({ ...formData, password: e.target.value })
                  }
                  className="input-sanctuary"
                  placeholder="Your password"
                />
              </div>

              {/* ⭐ REMEMBER MY EMAIL */}
              <label className="flex items-center gap-2 text-white/60 text-sm cursor-pointer">
                <input
                  type="checkbox"
                  checked={remember}
                  onChange={(e) => setRemember(e.target.checked)}
                  className="accent-sea-glow"
                />
                Remember my email
              </label>

              <div className="flex justify-end">
                <Link
                  href="/forgot-password"
                  className="text-sea-glow/60 hover:text-sea-glow text-sm transition-colors"
                >
                  Forgot password?
                </Link>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="btn-sanctuary-gold w-full disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? 'Signing in...' : 'Sign In'}
              </button>

              <p className="text-center text-white/30 text-xs mt-6">
                Not a member yet?{' '}
                <Link
                  href="/join"
                  className="text-sea-glow/60 hover:text-sea-glow transition-colors"
                >
                  Join the movement
                </Link>
              </p>
            </form>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
