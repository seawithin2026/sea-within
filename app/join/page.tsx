'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

export default function JoinPage() {
  const supabase = createClientComponentClient();
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);

  // ⭐ Detect magic link login
  useEffect(() => {
    supabase.auth.getUser().then(async ({ data }) => {
      if (data.user) {
        // ⭐ Create profile silently
        await fetch('/api/profile/init', { method: 'POST' });

        // ⭐ Redirect to Stripe Checkout
        const res = await fetch('/api/checkout', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ plan: 'monthly' }),
        });

        const { url } = await res.json();
        if (url) window.location.href = url;
      }
    });
  }, []);

  // ⭐ Send magic link
  const sendLink = async () => {
    await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${window.location.origin}/join`,
      },
    });

    setSent(true);
  };

  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-6">
      {!sent ? (
        <>
          <h1 className="text-3xl mb-6">Enter the Sanctuary</h1>
          <input
            type="email"
            placeholder="Your email"
            className="border px-4 py-3 rounded w-full max-w-md mb-4"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <button
            onClick={sendLink}
            className="btn-golden w-full max-w-md py-3"
          >
            Send Magic Link
          </button>
        </>
      ) : (
        <p className="text-center text-lg">
          Check your email — your doorway is waiting.
        </p>
      )}
    </main>
  );
}
