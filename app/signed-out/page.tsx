'use client';

import { useEffect } from 'react';
import { supabase } from '@/lib/supabase/client';

export default function SignedOut() {
  useEffect(() => {
    supabase.auth.signOut();
    window.location.href = '/';
  }, []);

  return null;
}
