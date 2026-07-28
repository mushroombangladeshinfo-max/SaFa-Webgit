-- is_admin() gates RLS across the entire schema (orders, weather_daily,
-- ai_settings, etc.) and had its own hardcoded email list -- a THIRD
-- separate copy from src/admin-auth.js (fixed earlier) and src/auth-nav.js
-- (also fixed earlier), and also missing sunnymarjuk@gmail.com. Unlike the
-- frontend copies, this one is much higher-impact: it doesn't just hide a
-- UI shortcut, it silently blocks/empties any RLS-gated read or write for
-- an admin it doesn't recognize, with no error -- just 0 rows.
--
-- Same fix as the other two copies: add the missing email. Not moving this
-- to a shared admin_emails table in this pass -- that would be the properly
-- durable fix if a fourth copy ever drifts out of sync, but three
-- hand-fixes in one day is a real signal worth remembering, not yet worth
-- a schema change nobody asked for.

create or replace function public.is_admin()
returns boolean
language sql
stable security definer
set search_path to 'public'
as $$
  select coalesce(auth.jwt() ->> 'email', '') in (
    'quazishaab@gmail.com',
    'mushroombangladesh.info@gmail.com',
    'abrarfahim.nsu@gmail.com',
    'sunnymarjuk@gmail.com'
  );
$$;
