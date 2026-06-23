'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';

export default function CreateUsernamePage() {
  const router = useRouter();
  const supabase = createClient();

  const [username, setUsername] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const saveUsername = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // ⭐ FIX: use getSession instead of getUser
    const {
      data: { session },
    } = await supabase.auth.getSession();

    const user = session?.user;

    if (!user) {
      setError('You must be signed in.');
      setLoading(false);
      return;
    }

    const { error: updateError } = await supabase
      .from('profiles')
      .update({ username })
      .eq('id', user.id);

    if (updateError) {
      setError('This name is already taken.');
      setLoading(false);
      return;
    }

    setLoading(false);
    router.push('/sanctuary');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0A1628] px-6">
      <div className="bg-white/5 border border-white/10 rounded-xl p-10 max-w-sm w-full backdrop-blur-xl">
        <h1 className="text-golden-400 font-display text-xl tracking-[3px] mb-6 text-center">
          Choose Your Sanctuary Name
        </h1>

        <form onSubmit={saveUsername} className="flex flex-col gap-4">
          <input
            type="text"
            placeholder="Your chosen name"
            className="bg-white/10 text-white px-4 py-3 rounded-md outline-none"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />

          {error && (
            <p className="text-red-400 text-sm text-center">{error}</p>
          )}

          <button
            type="submit"
            disabled={loading || username.trim().length < 3}
            className="btn-golden w-full py-3 text-[12px] tracking-[2px]"
          >
            {loading ? 'Saving...' : 'Save Name'}
          </button>
        </form>
      </div>
    </div>
  );
}
