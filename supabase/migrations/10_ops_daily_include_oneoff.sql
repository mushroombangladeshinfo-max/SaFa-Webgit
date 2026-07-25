-- ============================================================================
-- 10_ops_daily_include_oneoff.sql — v_ops_daily was blind to one_off_expenses
-- ============================================================================
-- Same class of bug just found and fixed client-side in farm-analytics.html:
-- one_off_expenses (capital/equipment purchases, e.g. a 1,250tk hygrometer)
-- was never included in farm_expenses here, so it was silently missing from
-- every page that reads this view — home.html's Farm Production and Net
-- Position panels, and insights.html's Overview tab (revenue chart, net
-- position KPI) via v_kpi_daily, which is built on top of this view.
--
-- Worse than a simple omission: this view's FROM clause was
-- `FROM public.farm_daily_logs`, so a day with ONLY a one-off expense and no
-- farm log entry (like the hygrometer's 7 July) could never produce a row
-- here at all, no matter what the SELECT list included. Fixed by building
-- the day-list from the UNION of both tables' dates first, then LEFT
-- JOINing each onto it — the same pattern v_pnl_monthly already used
-- correctly at the monthly level (that view was never buggy; this daily
-- one was, which is exactly why insights.html's Overview tab and P&L tab
-- could show two different net-profit numbers for the same period).
-- ============================================================================

CREATE OR REPLACE VIEW public.v_ops_daily
WITH (security_invoker = true) AS
WITH days AS (
  SELECT log_date     AS day FROM public.farm_daily_logs
  UNION
  SELECT expense_date AS day FROM public.one_off_expenses
)
SELECT
  d.day,
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
    + COALESCE(oo.amount, 0)                         AS farm_expenses,
  COALESCE(f.s_waste,0)                              AS waste_kg,
  f.op_bags_total,
  f.n_overall_rating,
  env.avg_temp,
  env.avg_humidity,
  COALESCE(oo.amount, 0)                             AS one_off_expenses
FROM days d
LEFT JOIN public.farm_daily_logs f ON f.log_date = d.day
LEFT JOIN (
  SELECT expense_date AS day, SUM(amount) AS amount
  FROM public.one_off_expenses GROUP BY 1
) oo ON oo.day = d.day
LEFT JOIN (
  SELECT created_at::DATE AS day,
         ROUND(AVG(temperature), 1) AS avg_temp,
         ROUND(AVG(humidity), 1)    AS avg_humidity
  FROM public.sensor_readings
  GROUP BY 1
) env ON env.day = d.day;
