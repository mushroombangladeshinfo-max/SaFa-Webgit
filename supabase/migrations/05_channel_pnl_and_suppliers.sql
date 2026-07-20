-- ============================================================================
-- SaFa Naturals — 05 CHANNEL P&L, SUPPLIERS, HARVEST SOURCE, SAMPLES
-- ============================================================================
-- Adds the operational detail needed to answer:
--   1. How much mushroom came from healthy bags vs recovered/mold-affected
--      bags that still produced usable harvest?
--   2. Per spawn purchase: which supplier, ৳/kg, how much was wasted to
--      mold/problems, how much of that was refunded?
--   3. How much product went out as free marketing samples (friends/family/
--      restaurants) — tracked without being double-counted as a cost?
--   4. Online vs offline: separate revenue, separate direct costs
--      (packaging/delivery), with shared production costs (spawn, substrate,
--      labor, electricity...) allocated between them by REVENUE SHARE —
--      the standard "ability to bear" method. Not a straight kg-split,
--      because online and offline sell at different price points and
--      different product mixes, so kg is not a fair proxy for cost-bearing
--      capacity.
--
-- NO DUPLICATION RULE: every fact lives in exactly one table.
--   - Spawn cost → spawn_purchases (NEW). The old farm_daily_logs.ex_spawn
--     field becomes legacy: stop entering it once you start using the
--     Suppliers tab, so spawn cost is never counted twice. Both are
--     summed defensively in the P&L view with a note — see 5d.
--   - Online revenue → orders table (already exists, unchanged).
--   - Offline revenue → farm_daily_logs sales fields (already exist).
--   - Marketing samples → tracked in kg + shown at retail-value equivalent,
--     NEVER added into expenses (the mushroom's production cost is already
--     inside the shared farm expense pool — adding retail value on top
--     would double-count it).
--
-- SAFE TO RE-RUN. Run after 01, 02, 04.
-- ============================================================================


-- ────────────────────────────────────────────────────────────────────────────
-- 0. ADMIN LIST — sync every enforcement point to the current 3 admins.
-- (Frontend gates in src/admin-auth.js + src/auth-nav.js updated separately;
-- this section is the server-side enforcement that actually matters.)
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

-- These three tables predate is_admin() and still hardcode the email array
-- directly in their policy — switch them onto the shared function so future
-- admin changes only ever require editing is_admin() once.
DROP POLICY IF EXISTS admin_only ON public.farm_daily_logs;
CREATE POLICY admin_only ON public.farm_daily_logs
  FOR ALL TO authenticated
  USING (public.is_admin()) WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS admin_only ON public.one_off_expenses;
CREATE POLICY admin_only ON public.one_off_expenses
  FOR ALL TO authenticated
  USING (public.is_admin()) WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS admin_only ON public.b2b_pipeline;
CREATE POLICY admin_only ON public.b2b_pipeline
  FOR ALL TO authenticated
  USING (public.is_admin()) WITH CHECK (public.is_admin());


-- ────────────────────────────────────────────────────────────────────────────
-- 1. SPAWN PURCHASES — one row per purchase/delivery from a supplier.
-- Replaces the single daily spawn_bought_kg/spawn_price_per_kg/spawn_supplier
-- fields on farm_daily_logs with a proper ledger: multiple suppliers,
-- multiple purchases per day, and problem/refund tracking per purchase.
-- ────────────────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.spawn_purchases (
  id                BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  purchase_date     DATE NOT NULL DEFAULT CURRENT_DATE,
  supplier_name     TEXT,                              -- optional, as requested
  kg_purchased      NUMERIC(8,3) NOT NULL CHECK (kg_purchased > 0),
  price_per_kg      NUMERIC(8,2) NOT NULL CHECK (price_per_kg >= 0),
  total_cost        NUMERIC(10,2) GENERATED ALWAYS AS (kg_purchased * price_per_kg) STORED,

  -- Problem tracking — mold, contamination, or any other supplier-side defect
  kg_wasted         NUMERIC(8,3) NOT NULL DEFAULT 0 CHECK (kg_wasted >= 0),
  problem_type      TEXT,                              -- 'mold' | 'contamination' | 'weak_growth' | 'other'
  problem_notes     TEXT,

  -- Supplier remedy — a purchase can be refunded in cash, replaced with
  -- free stock, or not remedied at all (all three are valid states)
  kg_refunded       NUMERIC(8,3) NOT NULL DEFAULT 0 CHECK (kg_refunded >= 0),
  refund_amount     NUMERIC(10,2) NOT NULL DEFAULT 0 CHECK (refund_amount >= 0),
  refund_notes      TEXT,

  created_at        TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at        TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  CHECK (kg_wasted <= kg_purchased),
  CHECK (kg_refunded <= kg_wasted)
);

CREATE INDEX IF NOT EXISTS idx_spawn_purchases_date     ON public.spawn_purchases (purchase_date DESC);
CREATE INDEX IF NOT EXISTS idx_spawn_purchases_supplier ON public.spawn_purchases (supplier_name);

ALTER TABLE public.spawn_purchases ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS spawn_purchases_admin ON public.spawn_purchases;
CREATE POLICY spawn_purchases_admin ON public.spawn_purchases
  FOR ALL USING (public.is_admin()) WITH CHECK (public.is_admin());

DROP TRIGGER IF EXISTS trg_spawn_purchases_touch ON public.spawn_purchases;
CREATE TRIGGER trg_spawn_purchases_touch BEFORE UPDATE ON public.spawn_purchases
  FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();


-- ────────────────────────────────────────────────────────────────────────────
-- 2. FARM LOG ADDITIONS — harvest source split, marketing samples,
-- and actual per-channel packaging/delivery cost.
-- All additive (ADD COLUMN IF NOT EXISTS) — zero risk to existing data.
-- ────────────────────────────────────────────────────────────────────────────

-- 2a. Harvest source: healthy bags vs recovered from mold-affected bags.
-- This is independent of the existing harvest_fresh_a/b grade fields
-- (A/B is visual quality of the harvest; this is which bags it came from).
ALTER TABLE public.farm_daily_logs ADD COLUMN IF NOT EXISTS harvest_healthy_kg   NUMERIC(8,3);
ALTER TABLE public.farm_daily_logs ADD COLUMN IF NOT EXISTS harvest_recovered_kg NUMERIC(8,3);
COMMENT ON COLUMN public.farm_daily_logs.harvest_healthy_kg   IS 'Fresh harvest from clean, unaffected bags';
COMMENT ON COLUMN public.farm_daily_logs.harvest_recovered_kg IS 'Fresh harvest salvaged from mold/problem-affected bags that still produced usable mushroom';

-- 2b. Marketing samples — free product given away (friends/family/restaurant
-- trials). Tracked by product type since each has a different retail price
-- for the value-equivalent calculation in the analytics view (5c).
ALTER TABLE public.farm_daily_logs ADD COLUMN IF NOT EXISTS sample_fresh_kg  NUMERIC(8,3);
ALTER TABLE public.farm_daily_logs ADD COLUMN IF NOT EXISTS sample_dried_kg  NUMERIC(8,3);
ALTER TABLE public.farm_daily_logs ADD COLUMN IF NOT EXISTS sample_powder_kg NUMERIC(8,3);
ALTER TABLE public.farm_daily_logs ADD COLUMN IF NOT EXISTS sample_notes     TEXT;
COMMENT ON COLUMN public.farm_daily_logs.sample_notes IS 'Who/why: e.g. "Restaurant trial — Cafe Nilkantha", "Friends & family"';

-- 2c. Actual packaging + delivery cost incurred, split by channel. This is
-- the real cost to the business — separate from orders.delivery_fee, which
-- is what the ONLINE customer was charged (revenue side, not cost side).
ALTER TABLE public.farm_daily_logs ADD COLUMN IF NOT EXISTS online_packaging_cost  NUMERIC(10,2);
ALTER TABLE public.farm_daily_logs ADD COLUMN IF NOT EXISTS online_delivery_cost   NUMERIC(10,2);
ALTER TABLE public.farm_daily_logs ADD COLUMN IF NOT EXISTS offline_packaging_cost NUMERIC(10,2);
ALTER TABLE public.farm_daily_logs ADD COLUMN IF NOT EXISTS offline_delivery_cost  NUMERIC(10,2);


-- ────────────────────────────────────────────────────────────────────────────
-- 3. ONE-OFF EXPENSES — optional channel tag, so a one-off cost (e.g. a
-- delivery bike repair) can be attributed to a channel when relevant.
-- NULL = shared/overhead (default, unallocated by channel — still counted
-- in total P&L, just not split into the channel view).
-- ────────────────────────────────────────────────────────────────────────────
ALTER TABLE public.one_off_expenses ADD COLUMN IF NOT EXISTS channel TEXT
  CHECK (channel IS NULL OR channel IN ('online','offline'));


-- ════════════════════════════════════════════════════════════════════════════
-- 4. VIEWS
-- ════════════════════════════════════════════════════════════════════════════

-- ── 4a. Supplier scorecard — output, cost, and problem rate per supplier ──
CREATE OR REPLACE VIEW public.v_supplier_scorecard
WITH (security_invoker = true) AS
SELECT
  COALESCE(supplier_name, 'Unnamed / Unspecified')     AS supplier_name,
  COUNT(*)                                              AS purchase_count,
  SUM(kg_purchased)                                     AS total_kg_purchased,
  SUM(total_cost)                                       AS total_spent,
  ROUND(SUM(total_cost) / NULLIF(SUM(kg_purchased),0), 2) AS avg_price_per_kg,
  SUM(kg_wasted)                                        AS total_kg_wasted,
  ROUND(100.0 * SUM(kg_wasted) / NULLIF(SUM(kg_purchased),0), 1) AS waste_rate_pct,
  SUM(kg_refunded)                                      AS total_kg_refunded,
  SUM(refund_amount)                                    AS total_refunded_amount,
  SUM(total_cost) - SUM(refund_amount)                  AS net_cost_after_refunds,
  MAX(purchase_date)                                    AS last_purchase_date,
  MIN(purchase_date)                                    AS first_purchase_date
FROM public.spawn_purchases
GROUP BY 1;

-- ── 4b. Spawn cost per month — the authoritative number for channel P&L ──
CREATE OR REPLACE VIEW public.v_spawn_cost_monthly
WITH (security_invoker = true) AS
SELECT
  DATE_TRUNC('month', purchase_date)::DATE AS month,
  SUM(total_cost)                          AS gross_spawn_cost,
  SUM(refund_amount)                       AS refunds_received,
  SUM(total_cost) - SUM(refund_amount)     AS net_spawn_cost
FROM public.spawn_purchases
GROUP BY 1;

-- ── 4c. Marketing samples per month — kg + retail-value equivalent.
-- Informational only: NEVER folded into v_pnl_monthly's expenses, because
-- the mushroom's production cost is already inside the shared farm expense
-- pool. This view exists so you can SEE how much goodwill/marketing value
-- you're giving away without it inflating your cost totals.
CREATE OR REPLACE VIEW public.v_marketing_samples_monthly
WITH (security_invoker = true) AS
SELECT
  DATE_TRUNC('month', log_date)::DATE AS month,
  SUM(COALESCE(sample_fresh_kg,0))    AS sample_fresh_kg,
  SUM(COALESCE(sample_dried_kg,0))    AS sample_dried_kg,
  SUM(COALESCE(sample_powder_kg,0))   AS sample_powder_kg,
  -- Value equivalent, priced at that day's actual selling price where
  -- entered, falling back to the product catalogue price otherwise.
  SUM(
    COALESCE(sample_fresh_kg,0)  * COALESCE(s_fresh_price,  (SELECT price FROM public.products WHERE id='fresh_oyster')) +
    COALESCE(sample_dried_kg,0)  * COALESCE(s_dried_price,  (SELECT price FROM public.products WHERE id='dried_oyster')) +
    COALESCE(sample_powder_kg,0) * COALESCE(s_powder_price, (SELECT price FROM public.products WHERE id='mushroom_powder'))
  ) AS estimated_retail_value
FROM public.farm_daily_logs
GROUP BY 1;

-- ── 4d. Harvest source per month — healthy vs recovered, recovery rate ──
CREATE OR REPLACE VIEW public.v_harvest_source_monthly
WITH (security_invoker = true) AS
SELECT
  DATE_TRUNC('month', log_date)::DATE                       AS month,
  SUM(COALESCE(harvest_healthy_kg,0))                        AS healthy_kg,
  SUM(COALESCE(harvest_recovered_kg,0))                      AS recovered_kg,
  SUM(COALESCE(harvest_healthy_kg,0)) + SUM(COALESCE(harvest_recovered_kg,0)) AS total_kg,
  ROUND(100.0 * SUM(COALESCE(harvest_recovered_kg,0))
        / NULLIF(SUM(COALESCE(harvest_healthy_kg,0)) + SUM(COALESCE(harvest_recovered_kg,0)), 0), 1)
                                                              AS recovered_pct
FROM public.farm_daily_logs
GROUP BY 1;

-- ── 4e. ONLINE vs OFFLINE monthly P&L — the main deliverable.
--
-- ONLINE revenue  = orders table (web checkout), status not cancelled/returned
-- OFFLINE revenue = farm_daily_logs direct + B2B sales (fresh/dried/powder + B2B lump)
--
-- DIRECT costs (channel-specific, never shared):
--   online:  online_packaging_cost + online_delivery_cost + ad_spend
--            (ad spend drives the web funnel — see marketing_metrics)
--   offline: offline_packaging_cost + offline_delivery_cost
--            + one_off_expenses tagged channel='offline'
--
-- SHARED costs (spawn, substrate, labor, electricity, transport, water,
-- other — the physical cost of growing mushroom regardless of who buys it)
-- are allocated between channels BY REVENUE SHARE: a channel that generated
-- 60% of the month's revenue carries 60% of shared costs. This is the
-- standard "ability to bear" allocation method — robust to online and
-- offline selling at different prices / different product mixes, which
-- makes a straight kg-based split unreliable here.
--
-- Spawn cost uses v_spawn_cost_monthly (the Suppliers ledger) as the
-- authoritative source. If you still have legacy ex_spawn entries on
-- farm_daily_logs from before the Suppliers tab existed, they are ADDED
-- (not replaced) — stop entering ex_spawn once you're using Spawn
-- Purchases, so nothing is ever double-counted going forward.
CREATE OR REPLACE VIEW public.v_channel_pnl_monthly
WITH (security_invoker = true) AS
WITH online AS (
  SELECT DATE_TRUNC('month', created_at)::DATE AS month,
         SUM(total_amount) AS revenue,
         COUNT(*) AS orders
  FROM public.orders
  WHERE status NOT IN ('cancelled','returned')
  GROUP BY 1
),
offline AS (
  SELECT DATE_TRUNC('month', log_date)::DATE AS month,
         SUM(COALESCE(s_fresh_kg,0)*COALESCE(s_fresh_price,0)
           + COALESCE(s_dried_kg,0)*COALESCE(s_dried_price,0)
           + COALESCE(s_powder_kg,0)*COALESCE(s_powder_price,0)
           + COALESCE(s_b2b_value,0)) AS revenue,
         SUM(COALESCE(online_packaging_cost,0))  AS online_pack,
         SUM(COALESCE(online_delivery_cost,0))   AS online_deliv,
         SUM(COALESCE(offline_packaging_cost,0)) AS offline_pack,
         SUM(COALESCE(offline_delivery_cost,0))  AS offline_deliv,
         SUM(COALESCE(ex_substrate,0) + COALESCE(ex_labor,0) + COALESCE(ex_electricity,0)
           + COALESCE(ex_transport,0) + COALESCE(ex_water,0) + COALESCE(ex_other,0)) AS shared_daily_costs,
         SUM(COALESCE(ex_spawn,0)) AS legacy_ex_spawn
  FROM public.farm_daily_logs
  GROUP BY 1
),
ad_spend AS (
  SELECT DATE_TRUNC('month', metric_date)::DATE AS month, SUM(spend) AS spend
  FROM public.marketing_metrics GROUP BY 1
),
oneoff AS (
  SELECT DATE_TRUNC('month', expense_date)::DATE AS month,
         SUM(amount) FILTER (WHERE channel = 'online')  AS online_oneoff,
         SUM(amount) FILTER (WHERE channel = 'offline') AS offline_oneoff,
         SUM(amount) FILTER (WHERE channel IS NULL)     AS unallocated_oneoff
  FROM public.one_off_expenses GROUP BY 1
),
months AS (
  SELECT month FROM online
  UNION SELECT month FROM offline
  UNION SELECT month FROM ad_spend
  UNION SELECT month FROM oneoff
),
base AS (
  SELECT
    mo.month,
    COALESCE(o.revenue, 0)   AS online_revenue,
    COALESCE(o.orders, 0)    AS online_orders,
    COALESCE(f.revenue, 0)   AS offline_revenue,
    COALESCE(f.online_pack,0) + COALESCE(f.online_deliv,0) + COALESCE(a.spend,0) + COALESCE(oo.online_oneoff,0)
                              AS online_direct_costs,
    COALESCE(f.offline_pack,0) + COALESCE(f.offline_deliv,0) + COALESCE(oo.offline_oneoff,0)
                              AS offline_direct_costs,
    COALESCE(f.shared_daily_costs,0) + COALESCE(f.legacy_ex_spawn,0) + COALESCE(sc.net_spawn_cost,0)
      + COALESCE(oo.unallocated_oneoff,0)
                              AS total_shared_costs
  FROM months mo
  LEFT JOIN online  o  ON o.month  = mo.month
  LEFT JOIN offline f  ON f.month  = mo.month
  LEFT JOIN ad_spend a ON a.month  = mo.month
  LEFT JOIN oneoff   oo ON oo.month = mo.month
  LEFT JOIN v_spawn_cost_monthly sc ON sc.month = mo.month
)
SELECT
  month,
  online_orders,
  online_revenue,
  offline_revenue,
  online_revenue + offline_revenue AS total_revenue,
  -- Revenue-share allocation ratio (guards div-by-zero when both are 0)
  ROUND(100.0 * online_revenue / NULLIF(online_revenue + offline_revenue, 0), 1) AS online_revenue_share_pct,
  online_direct_costs,
  offline_direct_costs,
  total_shared_costs,
  ROUND(total_shared_costs * online_revenue / NULLIF(online_revenue + offline_revenue, 0), 2)  AS online_allocated_shared_cost,
  ROUND(total_shared_costs * offline_revenue / NULLIF(online_revenue + offline_revenue, 0), 2) AS offline_allocated_shared_cost,
  online_revenue - online_direct_costs
    - ROUND(total_shared_costs * online_revenue / NULLIF(online_revenue + offline_revenue, 0), 2)
                                    AS online_net_profit,
  offline_revenue - offline_direct_costs
    - ROUND(total_shared_costs * offline_revenue / NULLIF(online_revenue + offline_revenue, 0), 2)
                                    AS offline_net_profit,
  (online_revenue + offline_revenue) - online_direct_costs - offline_direct_costs - total_shared_costs
                                    AS combined_net_profit
FROM base
ORDER BY month;

-- ============================================================================
-- END 05 — the Suppliers tab (expenses.html) reads/writes spawn_purchases
-- and v_supplier_scorecard. The Insights dashboard reads v_channel_pnl_monthly,
-- v_marketing_samples_monthly, and v_harvest_source_monthly.
-- ============================================================================
