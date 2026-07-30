-- v_ops_daily and v_kpi_daily are plain views with no security_invoker set,
-- owned by postgres (BYPASSRLS) -- since `authenticated` holds a SELECT
-- grant on both, any logged-in customer, not just admins, could query them
-- directly and see full farm revenue/expense/harvest/marketing data,
-- completely bypassing is_admin() on the underlying tables. Found while
-- building v_batch_yield (migration 21), which was built correctly from
-- the start; this closes the same gap on the two older views. Confirmed in
-- migration 21's testing that `authenticated` has direct base-table SELECT
-- grants on farm_daily_logs etc., so this should be a safe flip -- verified
-- live (not just assumed) in this same session: a non-admin authenticated
-- session sees 0 rows, an is_admin() session still sees real data.

alter view public.v_ops_daily set (security_invoker = true);
alter view public.v_kpi_daily  set (security_invoker = true);
