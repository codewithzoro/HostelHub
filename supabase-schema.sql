-- ============================================================
-- HostelHub — Supabase Database Schema
-- Run this entire file in the Supabase SQL Editor
-- ============================================================

-- ────────────────────────────────────────────────────────────
-- 1. PROFILES
-- ────────────────────────────────────────────────────────────
CREATE TABLE public.profiles (
  id            UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  name          TEXT NOT NULL DEFAULT '',
  hostel_block  TEXT NOT NULL DEFAULT '',
  phone         TEXT NOT NULL DEFAULT '',
  avatar_url    TEXT,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Anyone can read profiles
CREATE POLICY "Profiles are viewable by everyone"
  ON public.profiles FOR SELECT
  USING (true);

-- Users can insert their own profile
CREATE POLICY "Users can insert their own profile"
  ON public.profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

-- Users can update their own profile
CREATE POLICY "Users can update their own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id);

-- Auto-create a profile row when a new user signs up
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, name)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data ->> 'name', '')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();


-- ────────────────────────────────────────────────────────────
-- 2. ITEMS
-- ────────────────────────────────────────────────────────────
CREATE TYPE public.item_category  AS ENUM ('Books', 'Electronics', 'Essentials', 'Vehicles');
CREATE TYPE public.item_condition AS ENUM ('New', 'Like New', 'Good', 'Fair', 'Poor');
CREATE TYPE public.item_status    AS ENUM ('Available', 'Reserved', 'Sold');

CREATE TABLE public.items (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  seller_id     UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  title         TEXT NOT NULL,
  description   TEXT NOT NULL DEFAULT '',
  category      public.item_category NOT NULL,
  price         NUMERIC(10,2) NOT NULL CHECK (price >= 0),
  condition     public.item_condition NOT NULL DEFAULT 'Good',
  status        public.item_status NOT NULL DEFAULT 'Available',
  image_url     TEXT,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.items ENABLE ROW LEVEL SECURITY;

-- Anyone can browse items
CREATE POLICY "Items are viewable by everyone"
  ON public.items FOR SELECT
  USING (true);

-- Authenticated users can create items
CREATE POLICY "Authenticated users can create items"
  ON public.items FOR INSERT
  WITH CHECK (auth.uid() = seller_id);

-- Sellers can update their own items (status toggle, etc.)
CREATE POLICY "Sellers can update their own items"
  ON public.items FOR UPDATE
  USING (auth.uid() = seller_id);

-- Sellers can delete their own items
CREATE POLICY "Sellers can delete their own items"
  ON public.items FOR DELETE
  USING (auth.uid() = seller_id);


-- ────────────────────────────────────────────────────────────
-- 3. CONVERSATIONS
-- ────────────────────────────────────────────────────────────
CREATE TABLE public.conversations (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  item_id       UUID NOT NULL REFERENCES public.items(id) ON DELETE CASCADE,
  buyer_id      UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  seller_id     UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(item_id, buyer_id)          -- one conversation per buyer per item
);

ALTER TABLE public.conversations ENABLE ROW LEVEL SECURITY;

-- Only buyer and seller in a conversation can see it
CREATE POLICY "Participants can view conversations"
  ON public.conversations FOR SELECT
  USING (auth.uid() = buyer_id OR auth.uid() = seller_id);

-- Authenticated buyers can start a conversation
CREATE POLICY "Buyers can start conversations"
  ON public.conversations FOR INSERT
  WITH CHECK (auth.uid() = buyer_id);


-- ────────────────────────────────────────────────────────────
-- 4. MESSAGES
-- ────────────────────────────────────────────────────────────
CREATE TYPE public.message_type AS ENUM ('text', 'offer');

CREATE TABLE public.messages (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id   UUID NOT NULL REFERENCES public.conversations(id) ON DELETE CASCADE,
  sender_id         UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  content           TEXT NOT NULL,
  message_type      public.message_type NOT NULL DEFAULT 'text',
  offer_amount      NUMERIC(10,2),       -- populated when message_type = 'offer'
  created_at        TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;

-- Only conversation participants can read messages
CREATE POLICY "Participants can view messages"
  ON public.messages FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.conversations c
      WHERE c.id = conversation_id
        AND (auth.uid() = c.buyer_id OR auth.uid() = c.seller_id)
    )
  );

-- Participants can send messages
CREATE POLICY "Participants can send messages"
  ON public.messages FOR INSERT
  WITH CHECK (
    auth.uid() = sender_id
    AND EXISTS (
      SELECT 1 FROM public.conversations c
      WHERE c.id = conversation_id
        AND (auth.uid() = c.buyer_id OR auth.uid() = c.seller_id)
    )
  );


-- ────────────────────────────────────────────────────────────
-- 5. ENABLE REALTIME
-- ────────────────────────────────────────────────────────────
ALTER PUBLICATION supabase_realtime ADD TABLE public.messages;
ALTER PUBLICATION supabase_realtime ADD TABLE public.conversations;


-- ────────────────────────────────────────────────────────────
-- 6. INDEXES FOR PERFORMANCE
-- ────────────────────────────────────────────────────────────
CREATE INDEX idx_items_seller     ON public.items(seller_id);
CREATE INDEX idx_items_category   ON public.items(category);
CREATE INDEX idx_items_status     ON public.items(status);
CREATE INDEX idx_conv_item        ON public.conversations(item_id);
CREATE INDEX idx_conv_buyer       ON public.conversations(buyer_id);
CREATE INDEX idx_conv_seller      ON public.conversations(seller_id);
CREATE INDEX idx_msg_conv         ON public.messages(conversation_id);
CREATE INDEX idx_msg_created      ON public.messages(created_at);
