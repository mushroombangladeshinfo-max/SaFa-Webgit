-- ============================================================================
-- 08_site_engagement.sql — on-page behavior: which content gets read vs ignored
-- ============================================================================
-- Fed by GA4's `section_view` and `scroll_depth` custom events (already
-- firing from src/analytics.js on every page load — see the
-- data-section-name attributes in index.html). sync-ga4 pulls the daily
-- aggregates via the GA4 Data API and upserts them here once the matching
-- custom dimensions are registered in GA4 Admin (Section Name / Scroll
-- Percent) — see INTEGRATIONS.md.
--
-- Answers: "which homepage section does nobody read" and "how far down the
-- page do people actually get before leaving" — the input for deciding what
-- to reposition or cut, and for spotting a page that's losing people early.
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.site_section_engagement (
  metric_date   DATE NOT NULL,
  page_path     TEXT NOT NULL DEFAULT '/',
  section_name  TEXT NOT NULL,
  views         BIGINT NOT NULL DEFAULT 0,

  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  PRIMARY KEY (metric_date, page_path, section_name)
);

CREATE INDEX IF NOT EXISTS idx_sse_date ON public.site_section_engagement (metric_date DESC);

ALTER TABLE public.site_section_engagement ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS site_section_engagement_admin ON public.site_section_engagement;
CREATE POLICY site_section_engagement_admin ON public.site_section_engagement
  FOR ALL USING (public.is_admin()) WITH CHECK (public.is_admin());

DROP TRIGGER IF EXISTS trg_sse_touch ON public.site_section_engagement;
CREATE TRIGGER trg_sse_touch BEFORE UPDATE ON public.site_section_engagement
  FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();


CREATE TABLE IF NOT EXISTS public.site_scroll_depth (
  metric_date       DATE NOT NULL,
  page_path         TEXT NOT NULL DEFAULT '/',
  percent_scrolled  SMALLINT NOT NULL CHECK (percent_scrolled IN (25, 50, 75, 90)),
  sessions          BIGINT NOT NULL DEFAULT 0,

  created_at        TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at        TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  PRIMARY KEY (metric_date, page_path, percent_scrolled)
);

CREATE INDEX IF NOT EXISTS idx_ssd_date ON public.site_scroll_depth (metric_date DESC);

ALTER TABLE public.site_scroll_depth ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS site_scroll_depth_admin ON public.site_scroll_depth;
CREATE POLICY site_scroll_depth_admin ON public.site_scroll_depth
  FOR ALL USING (public.is_admin()) WITH CHECK (public.is_admin());

DROP TRIGGER IF EXISTS trg_ssd_touch ON public.site_scroll_depth;
CREATE TRIGGER trg_ssd_touch BEFORE UPDATE ON public.site_scroll_depth
  FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();


-- Section engagement ranked within each page, latest 30 days — the direct
-- answer to "which section does everyone ignore." pct_of_top_section
-- normalizes against that page's own best-seen section, so a page with
-- naturally lower traffic doesn't look artificially "ignored."
CREATE OR REPLACE VIEW public.v_section_engagement_30d
WITH (security_invoker = true) AS
SELECT
  page_path,
  section_name,
  total_views,
  ROUND(total_views::NUMERIC / NULLIF(MAX(total_views) OVER (PARTITION BY page_path), 0) * 100, 1) AS pct_of_top_section
FROM (
  SELECT page_path, section_name, SUM(views) AS total_views
  FROM public.site_section_engagement
  WHERE metric_date >= CURRENT_DATE - INTERVAL '30 days'
  GROUP BY page_path, section_name
) totals
ORDER BY page_path, total_views DESC;

-- Scroll drop-off curve, latest 30 days, per page.
CREATE OR REPLACE VIEW public.v_scroll_depth_30d
WITH (security_invoker = true) AS
SELECT
  page_path,
  percent_scrolled,
  SUM(sessions) AS sessions
FROM public.site_scroll_depth
WHERE metric_date >= CURRENT_DATE - INTERVAL '30 days'
GROUP BY page_path, percent_scrolled
ORDER BY page_path, percent_scrolled;
