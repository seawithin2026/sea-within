'use client';

import { useState } from 'react';
import Navigation from '@/components/layout/Navigation';
import ScrollReveal from '@/components/ui/ScrollReveal';
import GoldenButton from '@/components/ui/GoldenButton';

// ============================================
// SEA WITHIN — Join / Sign Up Page
// ============================================

export default function JoinPage() {
  const [isLogin, setIsLogin] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage('');

    try {
      const endpoint = isLogin ? '/api/auth/login' : '/api/auth/signup';
      const body = isLogin
        ? { email, password }
        : { email, password, fullName };

      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.error || 'Something went wrong');

      if (isLogin) {
        window.location.href = '/sanctuary';
      } else {
        setMessage('Welcome, beautiful soul. Check your email to confirm your account.');
      }
    } catch (err: any) {
      setMessage(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-sanctuary-dark">
      <Navigation />

      <div className="min-h-screen flex items-center justify-center px-6 pt-20">
        {/* Background ambient light */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full bg-golden-400/5 blur-[120px]" />
          <div className="absolute bottom-1/4 right-1/3 w-[400px] h-[400px] rounded-full bg-sea-400/5 blur-[100px]" />
        </div>

        <div className="relative z-10 w-full max-w-md">
          <ScrollReveal delay={200}>
            <div className="text-center mb-12">
              <p className="font-whisper text-sm tracking-[6px] uppercase text-golden-400/50 mb-4">
                {isLogin ? 'welcome back' : 'join the movement'}
              </p>
              <h1 className="font-display text-3xl md:text-4xl font-light text-sea-100">
                {isLogin ? 'Enter Your Sanctuary' : 'Step Inside'}
              </h1>
              <p className="font-body text-sm text-white/30 mt-4 leading-relaxed">
                {isLogin
                  ? 'Your journey continues.'
                  : 'Something in you knew it was time.'}
              </p>
            </div>
          </ScrollReveal>

          <ScrollReveal delay={400}>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Name field (signup only) */}
              {!isLogin && (
                <div>
                  <label className="block font-body text-[11px] tracking-[2px] uppercase text-white/40 mb-2">
                    Your Name
                  </label>
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    required={!isLogin}
                    placeholder="Beautiful Soul"
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3.5
                             font-body text-sea-100 placeholder:text-white/20
                             focus:outline-none focus:border-golden-400/40 focus:bg-white/8
                             transition-all duration-300"
                  />
                </div>
              )}

              {/* Email */}
              <div>
                <label className="block font-body text-[11px] tracking-[2px] uppercase text-white/40 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="your@email.com"
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3.5
                           font-body text-sea-100 placeholder:text-white/20
                           focus:outline-none focus:border-golden-400/40 focus:bg-white/8
                           transition-all duration-300"
                />
              </div>

              {/* Password */}
              <div>
                <label className="block font-body text-[11px] tracking-[2px] uppercase text-white/40 mb-2">
                  Password
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={8}
                  placeholder="Create a sacred key"
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3.5
                           font-body text-sea-100 placeholder:text-white/20
                           focus:outline-none focus:border-golden-400/40 focus:bg-white/8
                           transition-all duration-300"
                />
              </div>

              {/* Message */}
              {message && (
                <p className="font-body text-sm text-golden-400/80 text-center py-2">
                  {message}
                </p>
              )}

              {/* Submit */}
              <div className="pt-4">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="btn-golden w-full text-center disabled:opacity-50"
                >
                  {isLoading
                    ? 'Opening the door...'
                    : isLogin
                    ? 'Enter'
                    : 'Join the Movement'}
                </button>
              </div>
            </form>
          </ScrollReveal>

          {/* Toggle login/signup */}
          <ScrollReveal delay={600}>
            <div className="text-center mt-8">
              <button
                onClick={() => {
                  setIsLogin(!isLogin);
                  setMessage('');
                }}
                className="font-body text-sm text-white/30 hover:text-golden-400 transition-colors"
              >
                {isLogin
                  ? "First time here? Join the movement"
                  : 'Already a member? Enter your sanctuary'}
              </button>
            </div>
          </ScrollReveal>

          {/* Forgot password */}
          {isLogin && (
            <ScrollReveal delay={700}>
              <div className="text-center mt-4">
                <a
                  href="/profile/reset-password"
                  className="font-body text-xs text-white/20 hover:text-golden-400/60 transition-colors"
                >
                  Forgot your sacred key?
                </a>
              </div>
            </ScrollReveal>
          )}
        </div>
      </div>
    </main>
  );
}
