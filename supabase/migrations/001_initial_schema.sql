-- ============================================
-- SEA WITHIN — Database Schema
-- ============================================
-- Run this in your Supabase SQL Editor to create
-- all the tables your website needs.
-- ============================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- PROFILES (extends Supabase auth.users)
-- ============================================
CREATE TABLE profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email TEXT NOT NULL,
  full_name TEXT NOT NULL DEFAULT 'Beautiful Soul',
  avatar_url TEXT,
  bio TEXT,
  membership_tier TEXT NOT NULL DEFAULT 'free'
    CHECK (membership_tier IN ('free', 'seeker', 'explorer', 'guardian')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Users can view all profiles
CREATE POLICY "Public profiles are viewable by everyone"
  ON profiles FOR SELECT
  USING (true);

-- Users can update their own profile
CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = id);

-- Users can insert their own profile
CREATE POLICY "Users can insert own profile"
  ON profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

-- ============================================
-- WISDOM BOARD POSTS
-- ============================================
CREATE TABLE wisdom_posts (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  content TEXT NOT NULL CHECK (char_length(content) >= 3 AND char_length(content) <= 500),
  is_approved BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE wisdom_posts ENABLE ROW LEVEL SECURITY;

-- Anyone can view approved posts
CREATE POLICY "Approved wisdom posts are viewable by everyone"
  ON wisdom_posts FOR SELECT
  USING (is_approved = true);

-- Authenticated users can create posts
CREATE POLICY "Authenticated users can create wisdom posts"
  ON wisdom_posts FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Users can delete their own posts
CREATE POLICY "Users can delete own wisdom posts"
  ON wisdom_posts FOR DELETE
  USING (auth.uid() = user_id);

-- ============================================
-- CHAT MESSAGES
-- ============================================
CREATE TABLE chat_messages (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  room TEXT NOT NULL DEFAULT 'general',
  message TEXT NOT NULL CHECK (char_length(message) >= 1 AND char_length(message) <= 300),
  is_approved BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE chat_messages ENABLE ROW LEVEL SECURITY;

-- Anyone can view approved messages
CREATE POLICY "Approved chat messages are viewable by everyone"
  ON chat_messages FOR SELECT
  USING (is_approved = true);

-- Authenticated users can create messages
CREATE POLICY "Authenticated users can create chat messages"
  ON chat_messages FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- ============================================
-- PAYMENTS (Revenue Tracking)
-- ============================================
CREATE TABLE payments (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  stripe_payment_id TEXT,
  amount DECIMAL(10, 2) NOT NULL,
  currency TEXT NOT NULL DEFAULT 'CAD',
  status TEXT NOT NULL DEFAULT 'pending'
    CHECK (status IN ('pending', 'completed', 'refunded', 'failed')),
  type TEXT NOT NULL DEFAULT 'membership'
    CHECK (type IN ('membership', 'product', 'donation')),
  description TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE payments ENABLE ROW LEVEL SECURITY;

-- Users can view their own payments
CREATE POLICY "Users can view own payments"
  ON payments FOR SELECT
  USING (auth.uid() = user_id);

-- Only service role can insert/update payments
CREATE POLICY "Service role can manage payments"
  ON payments FOR ALL
  USING (auth.role() = 'service_role');

-- ============================================
-- TAX RECORDS (Generated from payments)
-- ============================================
CREATE TABLE tax_records (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  payment_id UUID REFERENCES payments(id) ON DELETE CASCADE,
  user_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  amount DECIMAL(10, 2) NOT NULL,
  tax_amount DECIMAL(10, 2) NOT NULL DEFAULT 0,
  category TEXT NOT NULL,
  fiscal_year INTEGER NOT NULL,
  fiscal_month INTEGER NOT NULL CHECK (fiscal_month >= 1 AND fiscal_month <= 12),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE tax_records ENABLE ROW LEVEL SECURITY;

-- Only service role can access tax records
CREATE POLICY "Service role can manage tax records"
  ON tax_records FOR ALL
  USING (auth.role() = 'service_role');

-- ============================================
-- INDEXES (Performance)
-- ============================================
CREATE INDEX idx_wisdom_posts_approved ON wisdom_posts(is_approved, created_at DESC);
CREATE INDEX idx_chat_messages_room ON chat_messages(room, is_approved, created_at);
CREATE INDEX idx_payments_user ON payments(user_id, created_at DESC);
CREATE INDEX idx_payments_status ON payments(status, created_at DESC);
CREATE INDEX idx_payments_type ON payments(type, status);
CREATE INDEX idx_tax_records_year ON tax_records(fiscal_year, fiscal_month);

-- ============================================
-- FUNCTIONS
-- ============================================

-- Auto-update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- Auto-create profile when user signs up
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO profiles (id, email, full_name)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', 'Beautiful Soul')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- Auto-create tax record when payment is completed
CREATE OR REPLACE FUNCTION handle_payment_completed()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.status = 'completed' AND (OLD.status IS NULL OR OLD.status != 'completed') THEN
    INSERT INTO tax_records (payment_id, user_id, amount, category, fiscal_year, fiscal_month)
    VALUES (
      NEW.id,
      NEW.user_id,
      NEW.amount,
      NEW.type,
      EXTRACT(YEAR FROM NEW.created_at),
      EXTRACT(MONTH FROM NEW.created_at)
    );
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_payment_completed
  AFTER INSERT OR UPDATE ON payments
  FOR EACH ROW EXECUTE FUNCTION handle_payment_completed();

-- ============================================
-- REALTIME (Enable for chat)
-- ============================================
ALTER PUBLICATION supabase_realtime ADD TABLE chat_messages;
ALTER PUBLICATION supabase_realtime ADD TABLE wisdom_posts;
