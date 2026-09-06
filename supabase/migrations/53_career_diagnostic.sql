-- Career Diagnostic & Clarification Engine — adds a critical AI-driven
-- onboarding pass on top of job_profiles before AI Fit Analysis / Interview
-- Prep are allowed to run against a profile. Adopted from a reference
-- implementation (job-search-command-center v2), scaled down for this
-- app's actual shape: no separate users/auth (is_admin() already covers
-- that), no file upload/CV Studio (still plain text), so this is additive
-- columns on the existing job_profiles table rather than new tables.
--
-- status: 'draft' until the diagnostic conversation is confirmed by the
-- user; 'confirmed' unlocks downstream AI reading structured_profile.
-- diagnostic_session holds the latest full AI response (working
-- scratchpad, overwritten each turn, including any pending nextQuestion).
-- structured_profile / strategy_json are frozen snapshots written only at
-- confirm time — never mutated by a later in-progress diagnostic until
-- THAT one is also confirmed.

alter table public.job_profiles
  add column master_cv_text      text,
  add column status              text not null default 'draft',
  add column diagnostic_session  jsonb,
  add column diagnostic_answers  jsonb not null default '[]'::jsonb,
  add column structured_profile  jsonb,
  add column strategy_json       jsonb,
  add column profile_completeness integer not null default 0,
  add column intent_confidence   text not null default 'low',
  add column profile_version     integer not null default 1,
  add column confirmed_at        timestamptz;

alter table public.job_profiles
  add constraint job_profiles_status_check check (status in ('draft', 'confirmed')),
  add constraint job_profiles_intent_confidence_check check (intent_confidence in ('low', 'medium', 'high')),
  add constraint job_profiles_completeness_check check (profile_completeness between 0 and 100);

-- Don't lock out a profile that was already being used successfully before
-- this migration existed (e.g. an already-filled-in career profile) —
-- treat "already has real background text" as implicitly confirmed so AI
-- Fit Analysis / Interview Prep keep working without forcing a re-run of
-- the diagnostic on data that predates this feature.
update public.job_profiles
set status = 'confirmed', confirmed_at = now()
where status = 'draft'
  and (
    coalesce(work_experience, '') <> '' or
    coalesce(education, '') <> '' or
    coalesce(skills, '') <> ''
  );
