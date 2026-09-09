'use client';

import { useState, useEffect } from 'react';
import Navigation from '@/components/layout/Navigation';
import ScrollReveal from '@/components/ui/ScrollReveal';

export default function ProfilePage() {
  const [user, setUser] = useState({
    username: '',
    email: '',
    membership_tier: 'free',
  });

  const [message, setMessage] = useState('');

  // ⭐ LOAD USER + PROFILE
  useEffect(() => {
    async function loadProfile() {
      const { supabase } = await import('@/lib/supabase/client');

      const {
        data: { user: authUser },
      } = await supabase.auth.getUser();

      if (!authUser) {
        window.location.href = '/auth/signin';
        return;
      }

      const { data: profile } = await supabase
        .from('profiles')
        .select('username, membership_status, is_member')
        .eq('id', authUser.id)
        .single();

      if (profile) {
        const status = profile.membership_status;
        const active = profile.is_member === true;

        let tier = 'free';
        if (active) tier = 'explorer';
        else if (status === 'past_due') tier = 'seeker';

        setUser({
          username: profile.username || '',
          email: authUser.email,
          membership_tier: tier,
        });
      }
    }

    loadProfile();
  }, []);

  const tierLabels = {
    free: 'Free Spirit',
    seeker: 'Seeker',
    explorer: 'Explorer',
  };

  const tierColors = {
    free: 'text-white/40',
    seeker: 'text-sea-300',
    explorer: 'text-golden-400',
  };

  return (
    <main className="min-h-screen bg-sanctuary-dark">
      <Navigation />

      <div className="max-w-2xl mx-auto px-6 pt-32 pb-24">
        <ScrollReveal delay={200}>
          <div className="text-center mb-12">
            <p className="font-whisper text-sm tracking-[6px] uppercase text-golden-400/40 mb-4">
              your space
            </p>
            <h1 className="font-display text-3xl md:text-4xl font-light text-sea-100">
              Your Profile
            </h1>
          </div>
        </ScrollReveal>

        <ScrollReveal delay={400}>
          <div className="sanctuary-card p-8 md:p-12">

            {/* Avatar */}
            <div className="flex justify-center mb-8">
              <div className="w-24 h-24 rounded-full bg-gradient-to-br from-sea-400/20 to-golden-400/20 border border-white/10 flex items-center justify-center">
                <span className="font-display text-3xl text-golden-400/60">
                  {user.username ? user.username[0]?.toUpperCase() : '?'}
                </span>
              </div>
            </div>

            {/* Username */}
            <div className="mb-6">
              <label className="block font-body text-[11px] tracking-[2px] uppercase text-white/40 mb-2">
                Username
              </label>
              <p className="font-display text-xl text-sea-100 font-light">
                {user.username || 'Beautiful Soul'}
              </p>
            </div>

            {/* Email */}
            <div className="mb-6">
              <label className="block font-body text-[11px] tracking-[2px] uppercase text-white/40 mb-2">
                Email
              </label>
              <p className="font-body text-sm text-white/50">
                {user.email}
              </p>
            </div>

            {/* Membership Tier */}
            <div className="mb-6">
              <label className="block font-body text-[11px] tracking-[2px] uppercase text-white/40 mb-2">
                Membership
              </label>
              <p className={`font-display text-lg font-light ${tierColors[user.membership_tier]}`}>
                {tierLabels[user.membership_tier]}
              </p>
            </div>

            {message && (
              <p className="font-body text-sm text-golden-400/80 text-center mb-6">
                {message}
              </p>
            )}

            {/* Sign Out */}
            <div className="flex justify-center mt-8">
              <button
                onClick={async () => {
                  const { supabase } = await import('@/lib/supabase/client');
                  await supabase.auth.signOut();
                  window.location.href = '/';
                }}
                className="font-body text-[11px] text-white/15 hover:text-white/30 transition-colors tracking-[1px]"
              >
                Sign Out
              </button>
            </div>
          </div>
        </ScrollReveal>
      </div>
    </main>
  );
}
