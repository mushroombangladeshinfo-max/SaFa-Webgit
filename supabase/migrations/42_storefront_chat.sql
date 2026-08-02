-- Storefront AI assistant (index.html/product.html) — the first feature in
-- this app called directly from a public, unauthenticated browser page. This
-- is architecturally different from the two existing admin AI tools (SaFa
-- Assistant, AI Analyst): those read ai_settings.api_key straight into the
-- browser because only is_admin() emails can reach that table at all. Doing
-- the same for an anonymous storefront visitor would leak the shared Groq
-- key to anyone who opens devtools. The storefront-chat edge function reads
-- the key server-side (service role) and only ever returns completion text
-- to the browser — see supabase/functions/storefront-chat/index.ts.
--
-- storefront_chat_log is a lightweight per-IP rate limit for that function
-- (a public endpoint with no login has no other abuse control). No RLS
-- policies are created — RLS is enabled with zero policies, which denies
-- ALL client access by default; only the edge function's service-role
-- client (which bypasses RLS entirely) ever touches this table.
create table public.storefront_chat_log (
  id         bigint generated always as identity primary key,
  ip         text not null,
  created_at timestamptz not null default now()
);

alter table public.storefront_chat_log enable row level security;

create index storefront_chat_log_ip_created_idx on public.storefront_chat_log(ip, created_at);

-- Old rows are only ever needed for the last RATE_LIMIT_WINDOW_MIN (10
-- minutes, see the edge function) — self-cleaning via cron keeps this
-- table from growing unbounded on a public, unauthenticated endpoint.
select cron.schedule(
  'storefront-chat-log-cleanup',
  '0 * * * *',
  $$ delete from public.storefront_chat_log where created_at < now() - interval '1 day' $$
);
