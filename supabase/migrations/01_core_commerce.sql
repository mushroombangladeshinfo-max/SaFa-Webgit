-- ============================================================================
-- SaFa Naturals — 01 CORE COMMERCE SCHEMA
-- ============================================================================
-- The canonical, version-controlled definition of every table the customer
-- storefront and admin panel depend on. Previously these lived only inside
-- the Supabase dashboard — this file makes the backend reproducible.
--
-- SAFE TO RE-RUN: every statement is additive (IF NOT EXISTS / OR REPLACE /
-- DROP POLICY IF EXISTS). Running it against the live project changes nothing
-- that already matches, and fills in anything missing.
--
-- HOW TO RUN: Supabase Dashboard → SQL Editor → paste → Run.
-- ORDER: run 01 → 02 → 03 (farm) → 04 (analytics warehouse).
-- ============================================================================


-- ────────────────────────────────────────────────────────────────────────────
-- 0. ADMIN HELPER
-- One place to define who counts as an admin. Every RLS policy below calls
-- this — to add/remove an admin, edit this single function and re-run it.
-- ────────────────────────────────────────────────────────────────────────────
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN
LANGUAGE sql STABLE SECURITY DEFINER
SET search_path = public
AS $$
  SELECT COALESCE(auth.jwt() ->> 'email', '') IN (
    'quazishaab@gmail.com',
    'mushroombangladesh.info@gmail.com',
    'abrarfahim.nsu@gmail.com'
  );
$$;


-- ────────────────────────────────────────────────────────────────────────────
-- 1. PRODUCTS
-- Read by: index.html (price sync), product.html, admin products.html (CRUD).
-- id is a TEXT slug ('fresh_oyster') because the storefront links products
-- by slug in URLs and cart items.
-- ────────────────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.products (
  id              TEXT PRIMARY KEY,              -- slug, e.g. 'fresh_oyster'
  name            TEXT NOT NULL,
  name_bn         TEXT,                          -- Bengali display name
  price           NUMERIC(10,2) NOT NULL CHECK (price >= 0),
  discount_price  NUMERIC(10,2) CHECK (discount_price IS NULL OR discount_price >= 0),
  unit            TEXT,                          -- '1 KG Pack', '100g Jar'
  category        TEXT,                          -- 'fresh' | 'dry' | ...
  inventory_count INTEGER NOT NULL DEFAULT 0 CHECK (inventory_count >= 0),
  image_url       TEXT,
  description     TEXT,
  active          BOOLEAN NOT NULL DEFAULT TRUE,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

-- Customers may read active products; admins see and manage everything.
DROP POLICY IF EXISTS products_public_read ON public.products;
CREATE POLICY products_public_read ON public.products
  FOR SELECT USING (active = TRUE OR public.is_admin());

DROP POLICY IF EXISTS products_admin_write ON public.products;
CREATE POLICY products_admin_write ON public.products
  FOR ALL USING (public.is_admin()) WITH CHECK (public.is_admin());


-- ────────────────────────────────────────────────────────────────────────────
-- 2. ORDERS
-- Inserted anonymously from checkout.html. Read by admin panel and (own rows
-- only) by logged-in customers on account.html. Anonymous tracking goes
-- through the track_order() RPC (02) — never direct SELECT.
-- ────────────────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.orders (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_number    TEXT NOT NULL UNIQUE,          -- 'SAFA-DDMM-XXXX'
  user_id         UUID REFERENCES auth.users(id),-- NULL for guest checkout
  customer_name   TEXT NOT NULL,
  customer_phone  TEXT NOT NULL,                 -- raw digits: 01XXXXXXXXX
  customer_email  TEXT,
  district        TEXT,
  thana           TEXT,
  full_address    TEXT,
  special_notes   TEXT,
  items           JSONB NOT NULL DEFAULT '[]',   -- denormalised line snapshot
  subtotal        NUMERIC(10,2) NOT NULL DEFAULT 0,
  delivery_fee    NUMERIC(10,2) NOT NULL DEFAULT 0,
  discount_amount NUMERIC(10,2) NOT NULL DEFAULT 0,
  coupon_code     TEXT,
  total_amount    NUMERIC(10,2) NOT NULL DEFAULT 0,
  payment_method  TEXT NOT NULL DEFAULT 'cod',
  status          TEXT NOT NULL DEFAULT 'pending'
                  CHECK (status IN ('pending','confirmed','processing',
                                    'shipped','delivered','cancelled','returned')),
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Columns added by later features — safe no-ops where they already exist.
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS customer_email  TEXT;
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS discount_amount NUMERIC(10,2) NOT NULL DEFAULT 0;
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS coupon_code     TEXT;

-- Hot query paths: admin list (newest first), status filter, customer lookup,
-- and the track_order RPC (order_number + phone).
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON public.orders (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_orders_status     ON public.orders (status);
CREATE INDEX IF NOT EXISTS idx_orders_phone      ON public.orders (customer_phone);
CREATE INDEX IF NOT EXISTS idx_orders_user       ON public.orders (user_id) WHERE user_id IS NOT NULL;

ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

-- Guest checkout: anyone may INSERT (no read-back — checkout generates its
-- own UUID client-side so it never needs SELECT after INSERT).
DROP POLICY IF EXISTS orders_public_insert ON public.orders;
CREATE POLICY orders_public_insert ON public.orders
  FOR INSERT WITH CHECK (TRUE);

-- Logged-in customers read only their own orders (account.html history).
DROP POLICY IF EXISTS orders_own_read ON public.orders;
CREATE POLICY orders_own_read ON public.orders
  FOR SELECT USING (auth.uid() = user_id OR public.is_admin());

-- Only admins update or delete (status changes, corrections).
DROP POLICY IF EXISTS orders_admin_update ON public.orders;
CREATE POLICY orders_admin_update ON public.orders
  FOR UPDATE USING (public.is_admin()) WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS orders_admin_delete ON public.orders;
CREATE POLICY orders_admin_delete ON public.orders
  FOR DELETE USING (public.is_admin());

-- Customers may cancel their own PENDING orders (account.html cancel button).
DROP POLICY IF EXISTS orders_own_cancel ON public.orders;
CREATE POLICY orders_own_cancel ON public.orders
  FOR UPDATE USING (auth.uid() = user_id AND status = 'pending')
  WITH CHECK (status IN ('pending','cancelled'));


-- ────────────────────────────────────────────────────────────────────────────
-- 3. ORDER ITEMS  (normalised line items — powers per-product analytics)
-- ────────────────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.order_items (
  id           BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  order_id     UUID NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
  product_id   TEXT,                             -- slug; soft ref (products may change)
  product_name TEXT NOT NULL,
  unit_price   NUMERIC(10,2) NOT NULL,
  quantity     INTEGER NOT NULL CHECK (quantity > 0),
  subtotal     NUMERIC(10,2) NOT NULL,
  unit         TEXT,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_order_items_order   ON public.order_items (order_id);
CREATE INDEX IF NOT EXISTS idx_order_items_product ON public.order_items (product_id);

ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS order_items_public_insert ON public.order_items;
CREATE POLICY order_items_public_insert ON public.order_items
  FOR INSERT WITH CHECK (TRUE);

DROP POLICY IF EXISTS order_items_admin_read ON public.order_items;
CREATE POLICY order_items_admin_read ON public.order_items
  FOR SELECT USING (public.is_admin());

DROP POLICY IF EXISTS order_items_admin_write ON public.order_items;
CREATE POLICY order_items_admin_write ON public.order_items
  FOR UPDATE USING (public.is_admin()) WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS order_items_admin_delete ON public.order_items;
CREATE POLICY order_items_admin_delete ON public.order_items
  FOR DELETE USING (public.is_admin());


-- ────────────────────────────────────────────────────────────────────────────
-- 4. COUPONS
-- Managed in admin products.html. Customers never read this table directly —
-- validation goes through the validate_coupon() RPC (02) so codes, usage
-- counts and margins are never exposed to the browser.
-- ────────────────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.coupons (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code        TEXT NOT NULL UNIQUE,               -- stored UPPERCASE
  type        TEXT NOT NULL CHECK (type IN ('percent','fixed')),
  value       NUMERIC(10,2) NOT NULL CHECK (value > 0),
  min_order   NUMERIC(10,2) DEFAULT 0,            -- minimum subtotal to qualify
  max_uses    INTEGER,                            -- NULL = unlimited
  uses        INTEGER DEFAULT 0,                  -- redemption count so far
  description TEXT,
  active      BOOLEAN DEFAULT TRUE,
  expires_at  TIMESTAMPTZ,                        -- NULL = never expires
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.coupons ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS coupons_admin_all ON public.coupons;
CREATE POLICY coupons_admin_all ON public.coupons
  FOR ALL USING (public.is_admin()) WITH CHECK (public.is_admin());


-- ────────────────────────────────────────────────────────────────────────────
-- 5. SETTINGS  (key/value store: delivery fee, free-delivery threshold, …)
-- Public read (checkout needs the threshold), admin write.
-- Known keys: 'free_delivery_threshold', 'delivery_fee'
-- ────────────────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.settings (
  key        TEXT PRIMARY KEY,
  value      TEXT NOT NULL,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.settings ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS settings_public_read ON public.settings;
CREATE POLICY settings_public_read ON public.settings
  FOR SELECT USING (TRUE);

DROP POLICY IF EXISTS settings_admin_write ON public.settings;
CREATE POLICY settings_admin_write ON public.settings
  FOR ALL USING (public.is_admin()) WITH CHECK (public.is_admin());

-- Sensible defaults so a fresh project works immediately.
INSERT INTO public.settings (key, value) VALUES
  ('free_delivery_threshold', '700'),
  ('delivery_fee', '100')
ON CONFLICT (key) DO NOTHING;


-- ────────────────────────────────────────────────────────────────────────────
-- 6. REVIEWS
-- Inserted anonymously from product.html. Served through the
-- get_product_reviews() RPC which returns only approved rows — giving you a
-- moderation switch without any code change (set approved = FALSE to hide).
-- ────────────────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.reviews (
  id            BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  product_id    TEXT NOT NULL,
  customer_name TEXT NOT NULL,
  rating        INTEGER NOT NULL CHECK (rating BETWEEN 1 AND 5),
  body          TEXT NOT NULL,
  verified      BOOLEAN NOT NULL DEFAULT FALSE,  -- set TRUE for known buyers
  approved      BOOLEAN NOT NULL DEFAULT TRUE,   -- moderation flag
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_reviews_product ON public.reviews (product_id, created_at DESC);

ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS reviews_public_insert ON public.reviews;
CREATE POLICY reviews_public_insert ON public.reviews
  FOR INSERT WITH CHECK (
    -- Server-side sanity limits (client also validates)
    char_length(customer_name) BETWEEN 1 AND 80 AND
    char_length(body)          BETWEEN 1 AND 2000
  );

DROP POLICY IF EXISTS reviews_admin_all ON public.reviews;
CREATE POLICY reviews_admin_all ON public.reviews
  FOR ALL USING (public.is_admin()) WITH CHECK (public.is_admin());


-- ────────────────────────────────────────────────────────────────────────────
-- 7. updated_at AUTO-TOUCH
-- One trigger function shared by every table that has updated_at.
-- ────────────────────────────────────────────────────────────────────────────
CREATE OR REPLACE FUNCTION public.touch_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END; $$;

DROP TRIGGER IF EXISTS trg_products_touch ON public.products;
CREATE TRIGGER trg_products_touch BEFORE UPDATE ON public.products
  FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();

DROP TRIGGER IF EXISTS trg_orders_touch ON public.orders;
CREATE TRIGGER trg_orders_touch BEFORE UPDATE ON public.orders
  FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();

DROP TRIGGER IF EXISTS trg_settings_touch ON public.settings;
CREATE TRIGGER trg_settings_touch BEFORE UPDATE ON public.settings
  FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();

-- ============================================================================
-- END 01 — next: 02_rpc_functions.sql
-- ============================================================================
