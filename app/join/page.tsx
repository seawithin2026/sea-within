'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

export default function JoinPage() {
  const supabase = createClientComponentClient();
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

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

  // ⭐ Send magic link + detect rate limit
  const sendLink = async () => {
    setErrorMsg('');

    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${window.location.origin}/account`,
      },
    });

    // ⭐ RATE LIMIT DETECTION
    if (error) {
      if (error.message.includes('rate limit')) {
        setErrorMsg(
          'Too many attempts — please wait a moment before trying again.'
        );
        return;
      }

      // ⭐ Any other Supabase error
      setErrorMsg(error.message);
      return;
    }

    setSent(true);
  };

  return (
    <main className="min-h-screen flex items-center justify-center px-6 bg-[#0A1628] text-white">
      <div className="max-w-sm w-full text-center">

        {!sent ? (
          <>
            <h1 className="text-[22px] tracking-[3px] mb-6 text-golden-400 font-display">
              Enter the Sanctuary
            </h1>

            <p className="text-white/60 text-[13px] tracking-[1px] mb-10">
              Receive your magic link to enter.
            </p>

            <input
              type="email"
              placeholder="Your email"
              className="w-full bg-white/5 border border-white/10 rounded-md py-3 px-4 text-[13px] tracking-[1px] focus:outline-none focus:border-white/30 mb-4"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            {errorMsg && (
              <p className="text-red-400 text-[13px] mb-4">
                {errorMsg}
              </p>
            )}

            <button
              onClick={sendLink}
              className="btn-golden w-full py-3 text-[12px] tracking-[2px]"
            >
              SEND MAGIC LINK
            </button>
          </>
        ) : (
          <p className="text-center text-lg text-golden-400">
            Check your email — your doorway is waiting.
          </p>
        )}

      </div>
    </main>
  );
}
