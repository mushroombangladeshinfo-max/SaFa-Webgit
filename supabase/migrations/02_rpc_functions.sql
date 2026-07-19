-- ============================================================================
-- SaFa Naturals — 02 RPC FUNCTIONS
-- ============================================================================
-- The three server-side functions the storefront calls. All are
-- SECURITY DEFINER: they run with elevated rights so anonymous visitors can
-- use them WITHOUT any direct table read access — each one exposes only the
-- exact fields it should, nothing more.
--
-- SAFE TO RE-RUN (CREATE OR REPLACE). Run after 01_core_commerce.sql.
-- ============================================================================


-- ────────────────────────────────────────────────────────────────────────────
-- 1. validate_coupon(code, subtotal)
-- Called by: checkout.html "Apply" button.
-- Checks: exists → active → not expired → under max_uses → min_order met.
-- Returns a JSON verdict; never leaks other codes or usage stats.
-- ────────────────────────────────────────────────────────────────────────────
CREATE OR REPLACE FUNCTION public.validate_coupon(
  p_code     TEXT,
  p_subtotal NUMERIC
)
RETURNS JSONB
LANGUAGE plpgsql STABLE SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  c public.coupons%ROWTYPE;
BEGIN
  SELECT * INTO c FROM public.coupons WHERE code = UPPER(TRIM(p_code));

  IF NOT FOUND OR NOT c.active THEN
    RETURN jsonb_build_object('valid', FALSE, 'message', 'Invalid or expired coupon code.');
  END IF;

  IF c.expires_at IS NOT NULL AND c.expires_at < NOW() THEN
    RETURN jsonb_build_object('valid', FALSE, 'message', 'This coupon has expired.');
  END IF;

  IF c.max_uses IS NOT NULL AND c.used_count >= c.max_uses THEN
    RETURN jsonb_build_object('valid', FALSE, 'message', 'This coupon has reached its usage limit.');
  END IF;

  IF p_subtotal < c.min_order THEN
    RETURN jsonb_build_object(
      'valid', FALSE,
      'message', 'Minimum order ৳' || c.min_order::TEXT || ' required for this coupon.'
    );
  END IF;

  RETURN jsonb_build_object(
    'valid',       TRUE,
    'code',        c.code,
    'type',        c.type,
    'value',       c.value,
    'description', c.description
  );
END; $$;

-- Anonymous checkout must be able to call this.
GRANT EXECUTE ON FUNCTION public.validate_coupon(TEXT, NUMERIC) TO anon, authenticated;


-- ────────────────────────────────────────────────────────────────────────────
-- 1b. Redemption counter — keeps used_count honest without giving the
-- browser any write access to coupons. Called by admin panel when an order
-- is confirmed, or wire it into an order-insert trigger later.
-- ────────────────────────────────────────────────────────────────────────────
CREATE OR REPLACE FUNCTION public.redeem_coupon(p_code TEXT)
RETURNS VOID
LANGUAGE sql SECURITY DEFINER
SET search_path = public
AS $$
  UPDATE public.coupons
     SET used_count = used_count + 1
   WHERE code = UPPER(TRIM(p_code));
$$;

GRANT EXECUTE ON FUNCTION public.redeem_coupon(TEXT) TO anon, authenticated;


-- ────────────────────────────────────────────────────────────────────────────
-- 2. track_order(order_number, phone)
-- Called by: track.html. Anonymous, but requires BOTH the order number AND
-- the matching phone number — one alone returns nothing, so order data
-- can't be fished by guessing IDs.
-- ────────────────────────────────────────────────────────────────────────────
CREATE OR REPLACE FUNCTION public.track_order(
  p_order_number TEXT,
  p_phone        TEXT
)
RETURNS JSONB
LANGUAGE plpgsql STABLE SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  o public.orders%ROWTYPE;
BEGIN
  SELECT * INTO o
    FROM public.orders
   WHERE UPPER(order_number) = UPPER(TRIM(p_order_number))
     -- Compare digits only, so 01712-345-678 matches 01712345678
     AND regexp_replace(customer_phone, '\D', '', 'g')
         = regexp_replace(p_phone,      '\D', '', 'g')
   LIMIT 1;

  IF NOT FOUND THEN
    RETURN NULL;
  END IF;

  -- Only the fields the tracking page displays — no email, no user_id.
  RETURN jsonb_build_object(
    'order_number', o.order_number,
    'status',       o.status,
    'created_at',   o.created_at,
    'customer_name',o.customer_name,
    'district',     o.district,
    'thana',        o.thana,
    'items',        o.items,
    'subtotal',     o.subtotal,
    'delivery_fee', o.delivery_fee,
    'discount_amount', o.discount_amount,
    'total_amount', o.total_amount,
    'payment_method', o.payment_method
  );
END; $$;

GRANT EXECUTE ON FUNCTION public.track_order(TEXT, TEXT) TO anon, authenticated;


-- ────────────────────────────────────────────────────────────────────────────
-- 3. get_product_reviews(product_id)
-- Called by: product.html reviews tab. Returns only APPROVED reviews,
-- newest first — flipping reviews.approved to FALSE hides a review
-- instantly with no code change.
-- ────────────────────────────────────────────────────────────────────────────
CREATE OR REPLACE FUNCTION public.get_product_reviews(p_product_id TEXT)
RETURNS TABLE (
  name     TEXT,
  rating   INTEGER,
  body     TEXT,
  date     DATE,
  verified BOOLEAN
)
LANGUAGE sql STABLE SECURITY DEFINER
SET search_path = public
AS $$
  SELECT customer_name       AS name,
         rating,
         body,
         created_at::DATE    AS date,
         verified
    FROM public.reviews
   WHERE product_id = p_product_id
     AND approved = TRUE
   ORDER BY created_at DESC
   LIMIT 100;
$$;

GRANT EXECUTE ON FUNCTION public.get_product_reviews(TEXT) TO anon, authenticated;

-- ============================================================================
-- END 02 — next: 03 is your existing farm/expenses SQL
-- (supabase/farm_daily_logs.sql + expenses_and_pipeline.sql), then
-- 04_analytics_warehouse.sql (Phase 2).
-- ============================================================================
