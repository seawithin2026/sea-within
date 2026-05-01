import { createClient } from '@supabase/supabase-js';

// ============================================
// SEA WITHIN — Supabase Client
// ============================================

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

// Client-side Supabase instance
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Server-side Supabase instance (with service role key)
export function createServerSupabase() {
  return createClient(
    supabaseUrl,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    }
  );
}

// ============================================
// Database Types
// ============================================
export interface User {
  id: string;
  email: string;
  full_name: string;
  avatar_url?: string;
  bio?: string;
  membership_tier: 'free' | 'seeker' | 'explorer' | 'guardian';
  created_at: string;
  updated_at: string;
}

export interface WisdomPost {
  id: string;
  user_id: string;
  content: string;
  is_approved: boolean;
  created_at: string;
  user?: User;
}

export interface ChatMessage {
  id: string;
  user_id: string;
  room: string;
  message: string;
  is_approved: boolean;
  created_at: string;
  user?: User;
}

export interface Payment {
  id: string;
  user_id: string;
  stripe_payment_id?: string;
  amount: number;
  currency: string;
  status: 'pending' | 'completed' | 'refunded' | 'failed';
  type: 'membership' | 'product' | 'donation';
  description?: string;
  created_at: string;
}

export interface TaxRecord {
  id: string;
  payment_id: string;
  user_id: string;
  amount: number;
  tax_amount: number;
  category: string;
  fiscal_year: number;
  fiscal_month: number;
  created_at: string;
  payment?: Payment;
}
