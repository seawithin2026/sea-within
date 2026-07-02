'use client';

import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';

export default function ForgotPasswordPage() {
  const supabase = createClient();
  const router = useRouter();

  const [email, setEmail] = useState('');
  
  const [error, setError] = useState('');

  const handleReset = async (e) => {
    e.preventDefault();
    setError('');


    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });

    if (error) {
      setError(error.message);
      return;
    }

    // ⭐ OPTION C: Redirect immediately to reset page
    router.push(`/reset-password?email=${encodeURIComponent(email)}`);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0A1628] px-6">
      <div className="bg-white/5 border border-white/10 rounded-xl p-10 max-w-sm w-full backdrop-blur-xl">
        <h1 className="text-golden-400 font-display text-xl tracking-[3px] mb-6 text-center">
          Forgot Password
        </h1>

        <form onSubmit={handleReset} className="flex flex-col gap-4">
          <input
            type="email"
            placeholder="Email"
            className="bg-white/10 text-white px-4 py-3 rounded-md outline-none"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          
        {error && <p className="text-red-400 text-sm text-center">{error}</p>}

          <button
            type="submit"
            className="btn-golden w-full py-3 text-[12px] tracking-[2px]"
          >
            Send Reset Code
          </button>
        </form>
      </div>
    </div>
  );
}
