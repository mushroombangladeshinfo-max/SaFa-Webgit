-- Found while RLS-testing the v_kpi_daily security_invoker fix (migration
-- 24): v_kpi_daily still leaked real orders data (customer name, phone,
-- revenue) to a non-admin authenticated session even after the view fix.
-- Traced to the real cause -- not a view problem at all.
--
-- Five policies, named as if they gate admin/public access correctly,
-- actually have USING (true) / WITH CHECK (true), granting ANY
-- authenticated user (not just admins) the stated access -- or, for the
-- one products SELECT case, granting even anonymous visitors more than
-- intended:
--   - orders:   admin_select_orders (SELECT), admin_update_orders (UPDATE)
--               -- both role-scoped to `authenticated`
--   - coupons:  admin_all (ALL -- SELECT/INSERT/UPDATE/DELETE), `authenticated`
--   - products: admin_write (ALL -- SELECT/INSERT/UPDATE/DELETE), `authenticated`
--   - products: public_read (SELECT), role-scoped to `public` -- shadows
--               products_public_read's `active = true OR is_admin()` filter,
--               so inactive/unpublished products are readable by anyone too
-- None of these five appear anywhere in the tracked migration history --
-- created outside of it at some point, never caught since RLS enabled +
-- "a" permissive policy existing looks correct at a glance without
-- checking what the policy's USING clause actually says.
--
-- Confirmed each one is a pure redundant duplicate of an existing, correct
-- policy already covering the identical command on the same table
-- (orders_own_read/orders_admin_update, coupons_admin_all,
-- products_admin_write, products_public_read) -- dropping these five
-- removes zero legitimate functionality, only the accidental open door.
-- None of the four `authenticated`-scoped ones are reachable by
-- `public`/`anon`, so guest checkout (orders_public_insert / insert_orders)
-- is untouched; the storefront's public product listing stays fully
-- functional via products_public_read.

drop policy if exists admin_select_orders on public.orders;
drop policy if exists admin_update_orders on public.orders;
drop policy if exists admin_all           on public.coupons;
drop policy if exists admin_write         on public.products;
drop policy if exists public_read         on public.products;
