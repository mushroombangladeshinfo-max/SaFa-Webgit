-- ============================================================================
-- SaFa Naturals — 04 ANALYTICS WAREHOUSE
-- ============================================================================
-- One place where every data stream meets:
--
--   EXTERNAL  Facebook · Instagram · TikTok · WhatsApp · LinkedIn ·
--             Google Ads · Website (GA4)
--   INTERNAL  orders / order_items (web shop) · farm_daily_logs (production,
--             farm-gate sales, expenses) · one_off_expenses · sensor_readings
--
-- Design:  ── two small INPUT tables (channel_accounts, marketing_metrics)
--          ── one optional campaign detail table (ad_campaigns)
--          ── read-only VIEWS that join everything into chart-ready KPIs
--
-- Data can arrive three ways, all landing in the same rows:
--   source = 'manual'  → typed into the Insights page
--   source = 'csv'     → uploaded via the Insights page CSV importer
--   source = 'api'     → pushed by the sync edge functions (Phase 3)
-- API syncs UPSERT on (metric_date, channel, account_ref), so switching a
-- channel from manual to automatic needs no migration — new data just
-- overwrites the manual rows for the same day.
--
-- SAFE TO RE-RUN. Run after 01, 02, and the farm/expenses SQL.
-- ============================================================================


-- ────────────────────────────────────────────────────────────────────────────
-- 0. DEPENDENCY STUBS
-- These tables are defined elsewhere (dashboard.html setup panel /
-- expenses_and_pipeline.sql). Created here as stubs so the views below
-- always compile, even on a fresh project where those haven't run yet.
-- IF NOT EXISTS → completely harmless when the real tables are present.
-- ────────────────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.sensor_readings (
  id          BIGSERIAL PRIMARY KEY,
  created_at  TIMESTAMPTZ DEFAULT NOW(),
  room_id     TEXT NOT NULL,
  temperature NUMERIC(5,2),
  humidity    NUMERIC(5,2),
  co2_ppm     INTEGER,
  o2_pct      NUMERIC(4,2),
  airflow_ms  NUMERIC(4,2),
  vpd_kpa     NUMERIC(4,3),
  light_lux   INTEGER,
  dew_point   NUMERIC(5,2)
);

CREATE TABLE IF NOT EXISTS public.one_off_expenses (
  id          BIGSERIAL PRIMARY KEY,
  expense_date DATE NOT NULL DEFAULT CURRENT_DATE,
  category    TEXT,
  description TEXT,
  amount      NUMERIC(10,2) NOT NULL DEFAULT 0,
  vendor      TEXT,
  receipt_url TEXT,
  notes       TEXT,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);


-- ────────────────────────────────────────────────────────────────────────────
-- 1. CHANNEL ACCOUNTS  (registry of connected platforms)
-- One row per platform account you market on. The api_config JSONB holds
-- NON-SECRET identifiers only (page id, ad account id, pixel id...).
-- ⚠ Secrets (access tokens) NEVER go here — they live in Edge Function
--   secrets (Phase 3). This table is what the dashboard lists and what the
--   sync functions read to know which accounts to pull.
-- ────────────────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.channel_accounts (
  id           BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  channel      TEXT NOT NULL CHECK (channel IN (
                 'facebook','instagram','tiktok','whatsapp',
                 'linkedin','google_ads','website','other')),
  account_ref  TEXT NOT NULL DEFAULT 'default', -- page id / handle / 'default'
  display_name TEXT NOT NULL,                   -- 'SaFa Naturals FB Page'
  api_config   JSONB NOT NULL DEFAULT '{}',     -- non-secret ids, e.g.
                                                -- {"page_id":"PLACEHOLDER",
                                                --  "ad_account_id":"PLACEHOLDER"}
  sync_enabled BOOLEAN NOT NULL DEFAULT FALSE,  -- flip TRUE when API is wired
  last_synced  TIMESTAMPTZ,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (channel, account_ref)
);

ALTER TABLE public.channel_accounts ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS channel_accounts_admin ON public.channel_accounts;
CREATE POLICY channel_accounts_admin ON public.channel_accounts
  FOR ALL USING (public.is_admin()) WITH CHECK (public.is_admin());

-- Seed one placeholder account per channel so the dashboard renders a
-- complete channel list from day 1. Edit display names freely.
INSERT INTO public.channel_accounts (channel, display_name) VALUES
  ('facebook',   'Facebook Page'),
  ('instagram',  'Instagram'),
  ('tiktok',     'TikTok'),
  ('whatsapp',   'WhatsApp Business'),
  ('linkedin',   'LinkedIn Company Page'),
  ('google_ads', 'Google Ads'),
  ('website',    'Website (GA4)')
ON CONFLICT (channel, account_ref) DO NOTHING;


-- ────────────────────────────────────────────────────────────────────────────
-- 2. MARKETING METRICS  (the core fact table)
-- Grain: one row per DAY per CHANNEL (per account). Columns are the union
-- of what the platforms report — each channel fills what applies and
-- leaves the rest NULL:
--
--   Channel     │ typical fields
--   ────────────┼──────────────────────────────────────────────
--   facebook    │ spend, impressions, reach, clicks, engagements, followers
--   instagram   │ impressions, reach, engagements, followers, video_views
--   tiktok      │ video_views, engagements, followers, spend (if ads)
--   whatsapp    │ conversations (→ leads), messages_sent/delivered
--   linkedin    │ impressions, clicks, engagements, followers
--   google_ads  │ spend, impressions, clicks, conversions
--   website     │ sessions (→ impressions), users (→ reach), conversions
--
-- CSV IMPORT FORMAT (Insights page uploader):
--   date,channel,spend,impressions,reach,clicks,engagements,followers,
--   video_views,leads,conversions
--   2026-07-01,facebook,1200,45000,32000,890,410,5210,0,12,3
-- ────────────────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.marketing_metrics (
  id            BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  metric_date   DATE NOT NULL,
  channel       TEXT NOT NULL CHECK (channel IN (
                  'facebook','instagram','tiktok','whatsapp',
                  'linkedin','google_ads','website','other')),
  account_ref   TEXT NOT NULL DEFAULT 'default',

  -- Paid
  spend         NUMERIC(12,2),  -- BDT spent on ads that day
  -- Visibility
  impressions   BIGINT,
  reach         BIGINT,
  -- Action
  clicks        BIGINT,
  engagements   BIGINT,         -- likes + comments + shares + saves
  video_views   BIGINT,
  -- Audience
  followers     BIGINT,         -- END-OF-DAY total (snapshot, not delta)
  -- Outcomes
  leads         BIGINT,         -- WhatsApp conversations / form fills
  conversions   BIGINT,         -- platform-attributed purchases
  revenue_attr  NUMERIC(12,2),  -- platform-attributed revenue (if reported)

  source        TEXT NOT NULL DEFAULT 'manual'
                CHECK (source IN ('manual','csv','api')),
  notes         TEXT,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  -- One row per day/channel/account → API syncs and re-uploads UPSERT here
  UNIQUE (metric_date, channel, account_ref)
);

CREATE INDEX IF NOT EXISTS idx_mm_date    ON public.marketing_metrics (metric_date DESC);
CREATE INDEX IF NOT EXISTS idx_mm_channel ON public.marketing_metrics (channel, metric_date DESC);

ALTER TABLE public.marketing_metrics ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS marketing_metrics_admin ON public.marketing_metrics;
CREATE POLICY marketing_metrics_admin ON public.marketing_metrics
  FOR ALL USING (public.is_admin()) WITH CHECK (public.is_admin());

DROP TRIGGER IF EXISTS trg_mm_touch ON public.marketing_metrics;
CREATE TRIGGER trg_mm_touch BEFORE UPDATE ON public.marketing_metrics
  FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();


-- ────────────────────────────────────────────────────────────────────────────
-- 3. AD CAMPAIGNS  (optional per-campaign detail)
-- Use when you want to compare campaigns inside a channel ("Eid promo" vs
-- "Ramadan combo"), not just channel totals. Filled manually or by the
-- sync functions. Day-level rows, same upsert pattern.
-- ────────────────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.ad_campaigns (
  id            BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  metric_date   DATE NOT NULL,
  channel       TEXT NOT NULL,
  campaign_id   TEXT NOT NULL,      -- platform's campaign id, or your own slug
  campaign_name TEXT NOT NULL,
  objective     TEXT,               -- 'conversions' | 'traffic' | 'awareness'
  spend         NUMERIC(12,2),
  impressions   BIGINT,
  clicks        BIGINT,
  conversions   BIGINT,
  revenue_attr  NUMERIC(12,2),
  source        TEXT NOT NULL DEFAULT 'manual'
                CHECK (source IN ('manual','csv','api')),
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (metric_date, channel, campaign_id)
);

CREATE INDEX IF NOT EXISTS idx_ac_date ON public.ad_campaigns (metric_date DESC);

ALTER TABLE public.ad_campaigns ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS ad_campaigns_admin ON public.ad_campaigns;
CREATE POLICY ad_campaigns_admin ON public.ad_campaigns
  FOR ALL USING (public.is_admin()) WITH CHECK (public.is_admin());


-- ════════════════════════════════════════════════════════════════════════════
-- 4. UNIFIED VIEWS — the "holistic picture"
-- All views use security_invoker so the caller's RLS applies: only admins
-- can read them (they sit on admin-only tables). The Insights page queries
-- these directly — no client-side joining needed.
-- ════════════════════════════════════════════════════════════════════════════

-- ── 4a. Web-shop sales per day ──────────────────────────────────────────────
CREATE OR REPLACE VIEW public.v_sales_daily
WITH (security_invoker = true) AS
SELECT
  created_at::DATE                                   AS day,
  COUNT(*)                                           AS orders,
  COUNT(*) FILTER (WHERE status NOT IN ('cancelled','returned'))
                                                     AS orders_valid,
  SUM(total_amount) FILTER (WHERE status NOT IN ('cancelled','returned'))
                                                     AS revenue,
  AVG(total_amount) FILTER (WHERE status NOT IN ('cancelled','returned'))
                                                     AS avg_order_value,
  SUM(discount_amount)                               AS discounts_given,
  COUNT(DISTINCT customer_phone)                     AS unique_customers
FROM public.orders
GROUP BY 1;

-- ── 4b. Farm operations per day ─────────────────────────────────────────────
-- Production, farm-gate revenue (fresh/dried/powder/B2B) and daily expenses
-- from the farm log, plus grow-room climate averages from IoT sensors.
CREATE OR REPLACE VIEW public.v_ops_daily
WITH (security_invoker = true) AS
SELECT
  f.log_date                                         AS day,
  COALESCE(f.harvest_fresh_a,0) + COALESCE(f.harvest_fresh_b,0)
                                                     AS harvest_fresh_kg,
  COALESCE(f.harvest_dried,0)                        AS harvest_dried_kg,
  COALESCE(f.harvest_powder,0)                       AS harvest_powder_kg,
  COALESCE(f.qc_pass,0)                              AS qc_pass_kg,
  COALESCE(f.qc_fail,0)                              AS qc_fail_kg,
  COALESCE(f.s_fresh_kg,0)  * COALESCE(f.s_fresh_price,0)
    + COALESCE(f.s_dried_kg,0)  * COALESCE(f.s_dried_price,0)
    + COALESCE(f.s_powder_kg,0) * COALESCE(f.s_powder_price,0)
    + COALESCE(f.s_b2b_value,0)                      AS farm_revenue,
  COALESCE(f.ex_spawn,0) + COALESCE(f.ex_substrate,0)
    + COALESCE(f.ex_packaging,0) + COALESCE(f.ex_labor,0)
    + COALESCE(f.ex_electricity,0) + COALESCE(f.ex_transport,0)
    + COALESCE(f.ex_water,0) + COALESCE(f.ex_other,0)
                                                     AS farm_expenses,
  COALESCE(f.s_waste,0)                              AS waste_kg,
  f.op_bags_total,
  f.n_overall_rating,
  env.avg_temp,
  env.avg_humidity
FROM public.farm_daily_logs f
LEFT JOIN (
  SELECT created_at::DATE AS day,
         ROUND(AVG(temperature), 1) AS avg_temp,
         ROUND(AVG(humidity), 1)    AS avg_humidity
  FROM public.sensor_readings
  GROUP BY 1
) env ON env.day = f.log_date;

-- ── 4c. Marketing per day (all channels rolled up) ─────────────────────────
CREATE OR REPLACE VIEW public.v_marketing_daily
WITH (security_invoker = true) AS
SELECT
  metric_date                AS day,
  SUM(spend)                 AS total_spend,
  SUM(impressions)           AS impressions,
  SUM(reach)                 AS reach,
  SUM(clicks)                AS clicks,
  SUM(engagements)           AS engagements,
  SUM(leads)                 AS leads,
  SUM(conversions)           AS conversions
FROM public.marketing_metrics
GROUP BY 1;

-- ── 4d. THE HOLISTIC DAILY KPI  (marketing × sales × farm, one row per day)
-- This is the dashboard's main time-series source. Full outer joins so a
-- day appears if ANY stream has data for it.
CREATE OR REPLACE VIEW public.v_kpi_daily
WITH (security_invoker = true) AS
SELECT
  COALESCE(s.day, m.day, o.day)              AS day,
  -- Sales (web shop)
  COALESCE(s.orders_valid, 0)                AS web_orders,
  COALESCE(s.revenue, 0)                     AS web_revenue,
  s.avg_order_value,
  -- Marketing
  COALESCE(m.total_spend, 0)                 AS ad_spend,
  m.impressions, m.reach, m.clicks, m.engagements, m.leads,
  -- Farm
  COALESCE(o.harvest_fresh_kg, 0)            AS harvest_kg,
  COALESCE(o.farm_revenue, 0)                AS farm_revenue,
  COALESCE(o.farm_expenses, 0)               AS farm_expenses,
  o.avg_temp, o.avg_humidity,
  -- Blended daily result
  COALESCE(s.revenue,0) + COALESCE(o.farm_revenue,0)
    - COALESCE(o.farm_expenses,0) - COALESCE(m.total_spend,0)
                                             AS net_position
FROM public.v_sales_daily s
FULL OUTER JOIN public.v_marketing_daily m ON m.day = s.day
FULL OUTER JOIN public.v_ops_daily o       ON o.day = COALESCE(s.day, m.day);

-- ── 4e. Channel performance per month (ROAS / CAC / CPC / CTR) ─────────────
-- Orders can't be perfectly attributed per channel without pixels, so this
-- reports platform-attributed conversions/revenue where available and the
-- efficiency metrics that don't need attribution (CPC, CTR, CPM).
CREATE OR REPLACE VIEW public.v_channel_month
WITH (security_invoker = true) AS
SELECT
  DATE_TRUNC('month', metric_date)::DATE     AS month,
  channel,
  SUM(spend)                                 AS spend,
  SUM(impressions)                           AS impressions,
  SUM(reach)                                 AS reach,
  SUM(clicks)                                AS clicks,
  SUM(engagements)                           AS engagements,
  SUM(leads)                                 AS leads,
  SUM(conversions)                           AS conversions,
  SUM(revenue_attr)                          AS revenue_attr,
  MAX(followers)                             AS followers_eom,   -- end of month
  -- Efficiency (NULL-safe)
  ROUND(SUM(spend) / NULLIF(SUM(clicks),0), 2)        AS cpc,
  ROUND(1000.0 * SUM(spend) / NULLIF(SUM(impressions),0), 2) AS cpm,
  ROUND(100.0 * SUM(clicks) / NULLIF(SUM(impressions),0), 2) AS ctr_pct,
  ROUND(SUM(spend) / NULLIF(SUM(conversions),0), 2)   AS cac,
  ROUND(SUM(revenue_attr) / NULLIF(SUM(spend),0), 2)  AS roas
FROM public.marketing_metrics
GROUP BY 1, 2;

-- ── 4f. Monthly P&L (all revenue vs ALL cost buckets) ──────────────────────
CREATE OR REPLACE VIEW public.v_pnl_monthly
WITH (security_invoker = true) AS
WITH months AS (
  SELECT DISTINCT DATE_TRUNC('month', d)::DATE AS month FROM (
    SELECT created_at::DATE AS d FROM public.orders
    UNION SELECT log_date        FROM public.farm_daily_logs
    UNION SELECT expense_date    FROM public.one_off_expenses
    UNION SELECT metric_date     FROM public.marketing_metrics
  ) all_dates
)
SELECT
  mo.month,
  COALESCE(web.revenue, 0)      AS web_revenue,
  COALESCE(farm.revenue, 0)     AS farm_revenue,
  COALESCE(web.revenue,0) + COALESCE(farm.revenue,0)          AS total_revenue,
  COALESCE(farm.expenses, 0)    AS farm_expenses,
  COALESCE(oneoff.amount, 0)    AS one_off_expenses,
  COALESCE(ads.spend, 0)        AS ad_spend,
  COALESCE(farm.expenses,0) + COALESCE(oneoff.amount,0) + COALESCE(ads.spend,0)
                                AS total_expenses,
  COALESCE(web.revenue,0) + COALESCE(farm.revenue,0)
    - COALESCE(farm.expenses,0) - COALESCE(oneoff.amount,0) - COALESCE(ads.spend,0)
                                AS net_profit
FROM months mo
LEFT JOIN (
  SELECT DATE_TRUNC('month', created_at)::DATE AS month,
         SUM(total_amount) AS revenue
  FROM public.orders WHERE status NOT IN ('cancelled','returned') GROUP BY 1
) web ON web.month = mo.month
LEFT JOIN (
  SELECT DATE_TRUNC('month', log_date)::DATE AS month,
         SUM(COALESCE(s_fresh_kg,0)*COALESCE(s_fresh_price,0)
           + COALESCE(s_dried_kg,0)*COALESCE(s_dried_price,0)
           + COALESCE(s_powder_kg,0)*COALESCE(s_powder_price,0)
           + COALESCE(s_b2b_value,0)) AS revenue,
         SUM(COALESCE(ex_spawn,0)+COALESCE(ex_substrate,0)+COALESCE(ex_packaging,0)
           + COALESCE(ex_labor,0)+COALESCE(ex_electricity,0)+COALESCE(ex_transport,0)
           + COALESCE(ex_water,0)+COALESCE(ex_other,0)) AS expenses
  FROM public.farm_daily_logs GROUP BY 1
) farm ON farm.month = mo.month
LEFT JOIN (
  SELECT DATE_TRUNC('month', expense_date)::DATE AS month, SUM(amount) AS amount
  FROM public.one_off_expenses GROUP BY 1
) oneoff ON oneoff.month = mo.month
LEFT JOIN (
  SELECT DATE_TRUNC('month', metric_date)::DATE AS month, SUM(spend) AS spend
  FROM public.marketing_metrics GROUP BY 1
) ads ON ads.month = mo.month;

-- ── 4g. Product performance per month (from normalised line items) ─────────
CREATE OR REPLACE VIEW public.v_product_month
WITH (security_invoker = true) AS
SELECT
  DATE_TRUNC('month', oi.created_at)::DATE   AS month,
  oi.product_id,
  oi.product_name,
  SUM(oi.quantity)                           AS units_sold,
  SUM(oi.subtotal)                           AS revenue,
  COUNT(DISTINCT oi.order_id)                AS orders
FROM public.order_items oi
JOIN public.orders o ON o.id = oi.order_id
WHERE o.status NOT IN ('cancelled','returned')
GROUP BY 1, 2, 3;

-- ── 4h. Customer insights (repeat rate, geography) ─────────────────────────
CREATE OR REPLACE VIEW public.v_customer_summary
WITH (security_invoker = true) AS
SELECT
  COUNT(DISTINCT customer_phone)                            AS total_customers,
  COUNT(DISTINCT customer_phone) FILTER (WHERE order_count > 1)
                                                            AS repeat_customers,
  ROUND(100.0 * COUNT(DISTINCT customer_phone) FILTER (WHERE order_count > 1)
        / NULLIF(COUNT(DISTINCT customer_phone),0), 1)      AS repeat_rate_pct,
  ROUND(AVG(lifetime_value), 0)                             AS avg_lifetime_value
FROM (
  SELECT customer_phone,
         COUNT(*)          AS order_count,
         SUM(total_amount) AS lifetime_value
  FROM public.orders
  WHERE status NOT IN ('cancelled','returned')
  GROUP BY customer_phone
) c;

CREATE OR REPLACE VIEW public.v_district_month
WITH (security_invoker = true) AS
SELECT
  DATE_TRUNC('month', created_at)::DATE AS month,
  COALESCE(district, 'Unknown')         AS district,
  COUNT(*)                              AS orders,
  SUM(total_amount)                     AS revenue
FROM public.orders
WHERE status NOT IN ('cancelled','returned')
GROUP BY 1, 2;

-- ============================================================================
-- END 04 — the Insights dashboard (insights.html) reads:
--   v_kpi_daily        → main time-series (revenue vs spend vs production)
--   v_channel_month    → per-platform table + ROAS/CAC cards
--   v_pnl_monthly      → profit & loss chart
--   v_product_month    → best-seller ranking
--   v_customer_summary → repeat-rate / LTV cards
--   v_district_month   → geography breakdown
-- ============================================================================
