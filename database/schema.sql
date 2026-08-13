-- ============================================
-- SEA WITHIN — Clean Database Schema
-- ============================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- 1. PROFILES
-- ============================================
CREATE TABLE public.profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email TEXT NOT NULL,
  full_name TEXT,
  display_name TEXT,
  avatar_url TEXT,
  bio TEXT,
  membership_tier TEXT DEFAULT 'free' CHECK (membership_tier IN ('free', 'explorer', 'sanctuary', 'guardian')),
  membership_status TEXT DEFAULT 'active' CHECK (membership_status IN ('active', 'paused', 'cancelled', 'expired')),
  stripe_customer_id TEXT,
  joined_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own profile"
  ON public.profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id);

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name)
  VALUES (
    NEW.id,
    NEW.email,
    NEW.raw_user_meta_data->>'full_name'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ============================================
-- 2. WISDOM POSTS
-- ============================================
CREATE TABLE public.wisdom_posts (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  content TEXT NOT NULL CHECK (char_length(content) BETWEEN 1 AND 2000),
  is_approved BOOLEAN DEFAULT FALSE,
  moderation_status TEXT DEFAULT 'pending' CHECK (moderation_status IN ('pending', 'approved', 'rejected')),
  moderation_note TEXT,
  hearts_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.wisdom_posts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view approved wisdom posts"
  ON public.wisdom_posts FOR SELECT
  USING (is_approved = TRUE);

CREATE POLICY "Authenticated users can create wisdom posts"
  ON public.wisdom_posts FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own wisdom posts"
  ON public.wisdom_posts FOR UPDATE
  USING (auth.uid() = user_id);

-- ============================================
-- 3. WISDOM HEARTS
-- ============================================
CREATE TABLE public.wisdom_hearts (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  post_id UUID REFERENCES public.wisdom_posts(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(post_id, user_id)
);

ALTER TABLE public.wisdom_hearts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view hearts"
  ON public.wisdom_hearts FOR SELECT
  USING (TRUE);

CREATE POLICY "Authenticated users can heart posts"
  ON public.wisdom_hearts FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can remove own hearts"
  ON public.wisdom_hearts FOR DELETE
  USING (auth.uid() = user_id);

-- ============================================
-- 4. COMMUNITY CHAT
-- ============================================
CREATE TABLE public.chat_messages (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  room TEXT DEFAULT 'sanctuary' CHECK (room IN ('sanctuary', 'earth', 'air', 'fire', 'water', 'universe')),
  content TEXT NOT NULL CHECK (char_length(content) BETWEEN 1 AND 1000),
  is_approved BOOLEAN DEFAULT FALSE,
  moderation_status TEXT DEFAULT 'pending' CHECK (moderation_status IN ('pending', 'approved', 'rejected')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.chat_messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view approved chat messages"
  ON public.chat_messages FOR SELECT
  USING (is_approved = TRUE);

CREATE POLICY "Authenticated users can send messages"
  ON public.chat_messages FOR INSERT
  WITH CHECK (auth.uid() = user_id);

ALTER PUBLICATION supabase_realtime ADD TABLE public.chat_messages;

-- ============================================
-- 5. PAYMENTS (Stripe metadata mirror)
-- ============================================
CREATE TABLE public.payments (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  stripe_payment_id TEXT,
  stripe_invoice_id TEXT,
  amount DECIMAL(10, 2) NOT NULL,
  currency TEXT DEFAULT 'CAD',
  payment_type TEXT NOT NULL CHECK (payment_type IN ('membership', 'product', 'donation', 'ritual_pack', 'refund')),
  status TEXT DEFAULT 'completed' CHECK (status IN ('pending', 'completed', 'failed', 'refunded')),
  description TEXT,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own payments"
  ON public.payments FOR SELECT
  USING (auth.uid() = user_id);

-- ============================================
-- 6. EMAIL LOG
-- ============================================
CREATE TABLE public.email_log (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  email_type TEXT NOT NULL CHECK (email_type IN (
    'welcome',
    'membership_confirmation',
    'password_reset',
    'payment_receipt',
    'renewal_reminder',
    'community_update',
    'wisdom_approved'
  )),
  to_email TEXT NOT NULL,
  subject TEXT NOT NULL,
  status TEXT DEFAULT 'sent' CHECK (status IN ('sent', 'failed', 'bounced')),
  resend_id TEXT,
  metadata JSONB DEFAULT '{}',
  sent_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.email_log ENABLE ROW LEVEL SECURITY;

-- ============================================
-- 7. ADMIN USERS
-- ============================================
CREATE TABLE public.admin_users (
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE PRIMARY KEY,
  role TEXT DEFAULT 'moderator' CHECK (role IN ('moderator', 'admin', 'owner')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.admin_users ENABLE ROW LEVEL SECURITY;

-- ============================================
-- 8. INDEXES
-- ============================================
CREATE INDEX idx_wisdom_posts_approved ON public.wisdom_posts(is_approved, created_at DESC);
CREATE INDEX idx_chat_messages_room ON public.chat_messages(room, created_at DESC);
CREATE INDEX idx_payments_user ON public.payments(user_id, created_at DESC);
CREATE INDEX idx_email_log_user ON public.email_log(user_id, sent_at DESC);

-- ============================================
-- 9. UPDATED_AT TRIGGERS
-- ============================================
CREATE OR REPLACE FUNCTION public.update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

CREATE TRIGGER update_wisdom_posts_updated_at
  BEFORE UPDATE ON public.wisdom_posts
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();
