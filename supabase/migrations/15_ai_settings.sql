-- Shared AI assistant config (provider/url/model/key), replacing the
-- per-browser localStorage copy. The old design meant every new device or
-- browser any admin logged in from started with a blank, unconfigured
-- assistant — Sunny Bhai hit this immediately on his own device even though
-- Fahim had already set a Groq key up. For a small team where every admin
-- already has full access to the entire business's data anyway, one shared
-- key stored server-side is strictly better UX than each person maintaining
-- their own separate Groq account.
--
-- Singleton table: `id boolean primary key default true` + a check that it
-- must be true is a standard Postgres trick to guarantee at most one row.

create table public.ai_settings (
  id         boolean primary key default true,
  provider   text not null default 'openai',
  url        text not null default 'https://api.groq.com/openai',
  model      text not null default 'llama-3.1-8b-instant',
  api_key    text,
  updated_at timestamptz not null default now(),
  constraint ai_settings_singleton check (id)
);

alter table public.ai_settings enable row level security;

create policy ai_settings_admin on public.ai_settings
  for all using (is_admin()) with check (is_admin());

create trigger trg_ai_settings_touch
  before update on public.ai_settings
  for each row execute function public.touch_updated_at();

insert into public.ai_settings (id) values (true);
