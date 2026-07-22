-- ============================================================================
-- 07_order_attribution.sql — UTM attribution on orders
-- ============================================================================
-- Solves the "which channel actually drove this order" gap: marketing_metrics
-- gives aggregate channel performance (impressions, clicks, spend), GA4 gives
-- self-reported conversions, but neither lets you point at a specific row in
-- `orders` and say which channel drove it. These columns close that gap.
--
-- Populated client-side by src/attribution.js (captures utm_source/medium/
-- campaign off the landing URL, last-touch model) and attached at checkout —
-- see checkout.html's extRow. All nullable: a direct/organic visit with no
-- UTM params on record simply leaves these null, which is itself meaningful
-- (distinguishes "no tracked channel drove this" from a real value).
--
-- Additive only — safe to re-run.
-- ============================================================================

ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS utm_source   TEXT;
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS utm_medium   TEXT;
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS utm_campaign TEXT;

COMMENT ON COLUMN public.orders.utm_source   IS 'Last-touch attribution: e.g. facebook, google, whatsapp. Null = no UTM-tagged visit on record before checkout.';
COMMENT ON COLUMN public.orders.utm_medium   IS 'Last-touch attribution: e.g. cpc, product_card, faq.';
COMMENT ON COLUMN public.orders.utm_campaign IS 'Last-touch attribution: campaign/placement name.';

-- Real (not GA4-self-reported) revenue and order count by channel, using
-- your own confirmed orders — the fix for the COD attribution problem
-- (GA4's "purchase" fires at order-placed, not at confirmed-delivered;
-- this view can be filtered to exclude cancelled/returned status, which
-- GA4 has no way to know about after the fact).
CREATE OR REPLACE VIEW public.v_order_attribution_monthly
WITH (security_invoker = true) AS
SELECT
  DATE_TRUNC('month', created_at)::DATE           AS month,
  COALESCE(utm_source, 'direct/untracked')        AS utm_source,
  utm_medium,
  utm_campaign,
  COUNT(*)                                        AS orders,
  SUM(total_amount)                               AS revenue,
  ROUND(AVG(total_amount), 2)                     AS aov,
  COUNT(*) FILTER (WHERE status IN ('cancelled','returned')) AS cancelled_or_returned
FROM public.orders
GROUP BY 1, 2, 3, 4
ORDER BY 1 DESC, revenue DESC;
