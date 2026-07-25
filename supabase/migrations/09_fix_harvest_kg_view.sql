-- ============================================================================
-- 09_fix_harvest_kg_view.sql — v_ops_daily was blind to the healthy/recovered
-- harvest fields
-- ============================================================================
-- farm_daily_logs has two harvest recording models: the older Grade A/B/
-- Rejected split, and the newer healthy-vs-mold-recovered split used by
-- quick-log.html (added in 08_site_engagement.sql's era, see that PR).
-- v_ops_daily.harvest_fresh_kg only ever summed fresh_a + fresh_b, so any
-- entry using the newer fields — including the two real harvest entries
-- entered on 2026-07-23/24 — showed up as zero everywhere v_kpi_daily is
-- read (insights.html's Overview "Daily Harvest" chart, P&L, Operations).
-- ============================================================================

CREATE OR REPLACE VIEW public.v_ops_daily
WITH (security_invoker = true) AS
SELECT
  f.log_date                                         AS day,
  COALESCE(f.harvest_fresh_a,0) + COALESCE(f.harvest_fresh_b,0)
    + COALESCE(f.harvest_healthy_kg,0) + COALESCE(f.harvest_recovered_kg,0)
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
