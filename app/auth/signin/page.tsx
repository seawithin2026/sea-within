'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client'; // <-- IMPORTANT

export default function SignInPage() {
  const router = useRouter();
  const supabase = createClient(); // <-- CREATE THE CLIENT HERE

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSignIn = async (e) => {
    e.preventDefault();
    setError('');

    // 1. Sign in user
    const { data: auth, error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (signInError) {
      setError(signInError.message);
      return;
    }

    const user = auth.user;

    // 2. Fetch profile (automatic)
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('is_member, username')
      .eq('id', user.id)
      .single();

    if (profileError) {
      setError('Unable to load your profile.');
      return;
    }

    // 3. Store membership locally for fast gating
    localStorage.setItem('isMember', profile.is_member ? 'true' : 'false');

    // 4. If no username → force username creation
    if (!profile.username) {
      router.push('/create-username');
      return;
    }

    // 5. If member → unlock ecosystem
    if (profile.is_member) {
      router.push('/sanctuary');
      return;
    }

    // 6. If not member → paywall
    router.push('/paywall');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0A1628] px-6">
      <div className="bg-white/5 border border-white/10 rounded-xl p-10 max-w-sm w-full backdrop-blur-xl">
        <h1 className="text-golden-400 font-display text-xl tracking-[3px] mb-6 text-center">
          Sign In
        </h1>

        <form onSubmit={handleSignIn} className="flex flex-col gap-4">
          <input
            type="email"
            placeholder="Email"
            className="bg-white/10 text-white px-4 py-3 rounded-md outline-none"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <input
            type="password"
            placeholder="Password"
            className="bg-white/10 text-white px-4 py-3 rounded-md outline-none"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          {error && (
            <p className="text-red-400 text-sm text-center">{error}</p>
          )}

          <button
            type="submit"
            className="btn-golden w-full py-3 text-[12px] tracking-[2px]"
          >
            Enter Sanctuary
          </button>
        </form>
      </div>
    </div>
  );
}
