-- Phase 2 expansion: Offers tracking, Skills Intelligence, and an
-- outcome/reason split for closed opportunities.

-- Splits *what happened* (closed_outcome) from *why* (the existing
-- known_reason, which already captures German requirement/technical
-- gap/etc). Previously only known_reason existed, which conflated the two
-- — e.g. "Role Filled" is an outcome, "Technical Skill Gap" is a reason,
-- both lived in the same list.
alter table public.job_opportunities
  add column closed_outcome text check (closed_outcome in (
    'Rejected','Withdrawn','No Response','Role Filled','Role Cancelled','Accepted','Other'
  ));

create table public.job_offers (
  id                 uuid primary key default gen_random_uuid(),
  opportunity_id     uuid not null references public.job_opportunities(id) on delete cascade,
  base_salary        numeric,
  bonus_notes        text,
  benefits           text,
  start_date         date,
  response_deadline  date,
  status             text not null default 'pending' check (status in ('pending','accepted','declined','negotiating','expired')),
  received_date      date not null default current_date,
  notes              text,
  created_at         timestamptz not null default now(),
  updated_at         timestamptz not null default now()
);

create index job_offers_opportunity_idx on public.job_offers(opportunity_id);

alter table public.job_offers enable row level security;
create policy "admin full access" on public.job_offers
  for all using (public.is_admin()) with check (public.is_admin());

create trigger trg_job_offers_touch
  before update on public.job_offers
  for each row execute function public.touch_updated_at();

alter publication supabase_realtime add table public.job_offers;


-- Reference table (small, admin-managed), not a per-event entry table —
-- bigint identity like recurring_expenses/ai_settings, not uuid. Mention
-- counts are deliberately NOT stored here: they're computed client-side by
-- scanning job_opportunities.job_description at render time, since a
-- stored count would drift the moment a new opportunity is added.
create table public.job_skills (
  id         bigint generated always as identity primary key,
  skill      text not null,
  category   text check (category in (
    'Technical','Analytics','CRM','Commercial','Marketing','Sales','Operations',
    'Supply Chain','Finance','Project Management','Communication','Language',
    'Industry Knowledge','Other'
  )),
  my_level   text not null default 'None' check (my_level in ('None','Basic','Intermediate','Advanced','Expert')),
  evidence   text,
  notes      text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.job_skills enable row level security;
create policy "admin full access" on public.job_skills
  for all using (public.is_admin()) with check (public.is_admin());

create trigger trg_job_skills_touch
  before update on public.job_skills
  for each row execute function public.touch_updated_at();

alter publication supabase_realtime add table public.job_skills;
