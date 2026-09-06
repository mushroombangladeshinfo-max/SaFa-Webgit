-- Personal Job Search Command Center (Phase 1 — core operational system).
-- A new, self-contained module unrelated to the farm business: one admin
-- user's personal ATS/CRM/interview-prep tracker, gated by the same
-- is_admin() RLS as everything else since this app has no per-user
-- partitioning and every admin already sees all business data anyway.
--
-- Six tables. job_opportunities is the hub; job_contacts/job_activities/
-- job_interviews/job_interview_questions hang off it; job_career_profile is
-- a singleton config row (same id=true trick as ai_settings, see
-- 15_ai_settings.sql) that every AI feature reads as grounding context so
-- the user never re-types their background per job.
--
-- No new SQL views: unlike the farm's transactional tables (which justify
-- v_kpi_daily etc.), a personal job search stays at a scale (dozens-to-low-
-- hundreds of rows) where client-side aggregation is simpler and plenty
-- fast — same approach pipeline.html already uses for all its filtering.

create table public.job_opportunities (
  id           uuid primary key default gen_random_uuid(),
  seq          bigint generated always as identity,

  -- Identification
  company              text not null,
  job_title            text not null,
  career_track         text check (career_track in ('A','B','C','X')),
  role_family          text,
  employment_type      text check (employment_type in ('Werkstudent','Internship','Part-Time','Full-Time','Graduate Programme','Temporary','Freelance','Other')),
  location             text,
  country              text,
  work_mode            text check (work_mode in ('remote','hybrid','onsite')),
  job_url              text,
  source               text check (source in ('LinkedIn','Company Website','Referral','Recruiter','University','Indeed','StepStone','Bundesagentur fur Arbeit','Networking','Professor / Advisor','Agency','Other')),
  date_found           date not null default current_date,
  posting_date         date,
  application_deadline date,

  -- Germany-specific vacancy info
  german_requirement             text check (german_requirement in ('None','Preferred','A1','A2','B1','B2','C1','Fluent','Native')),
  english_requirement            text,
  student_status_required        boolean,
  working_hours                  text,
  visa_notes                     text,
  relocation_required            boolean,
  international_candidate_friendly text check (international_candidate_friendly in ('Yes','No','Unclear')),

  -- Job description preservation (original text is never overwritten)
  job_description text,
  ai_summary      text,
  ai_extracted    jsonb,

  -- Eligibility gate (separate from fit) — each yes/no/unclear
  elig_student_status  text check (elig_student_status  in ('yes','no','unclear')),
  elig_working_hours   text check (elig_working_hours   in ('yes','no','unclear')),
  elig_location        text check (elig_location        in ('yes','no','unclear')),
  elig_language        text check (elig_language        in ('yes','no','unclear')),
  elig_work_auth       text check (elig_work_auth       in ('yes','no','unclear')),
  elig_experience      text check (elig_experience      in ('yes','no','unclear')),
  elig_mandatory_tech  text check (elig_mandatory_tech  in ('yes','no','unclear')),
  eligibility_status   text check (eligibility_status in ('PASS','REVIEW','FAIL')),

  -- Fit scoring: 9-dim rating maps (1-5 each: exp, skills, role, edu, lang,
  -- career_value, location, company_attract, networking). jsonb here is a
  -- deliberate exception to this schema's usual flat-column style — these
  -- are 9 parallel sub-ratings of ONE opportunity, not repeatable rows, and
  -- 18 flat columns would be worse. Manual overrides AI per-key; an unset
  -- manual key falls back to the AI suggestion (both editable in the UI).
  fit_manual         jsonb,
  fit_ai             jsonb,
  fit_score          numeric,
  fit_classification text check (fit_classification in ('A+ Exceptional','A Strong','B Worth Applying','C Selective','D Usually Skip')),

  interest int check (interest between 1 and 5),

  priority_score numeric,
  priority_label text check (priority_label in ('P1 - Act Now','P2 - High','P3 - Normal','P4 - Low','Skip')),

  -- Pipeline stage. Closed is a separate flag, not a stage, so rejected/
  -- withdrawn opportunities stay visible in historical analytics instead
  -- of needing a dedicated terminal column on the active Kanban board.
  stage            text not null default 'discovered' check (stage in (
    'discovered','evaluating','preparing','ready_to_apply','applied',
    'recruiter_screen','hiring_manager','assessment','further_interview',
    'final_interview','offer','negotiation','accepted'
  )),
  stage_entered_at timestamptz not null default now(),

  -- Application tracking
  applied                          boolean not null default false,
  applied_date                     date,
  application_channel              text,
  cv_version                       text,
  cover_letter_used                boolean,
  referral_used                    boolean,
  application_questions_completed  boolean,
  application_confirmation_received boolean,
  application_reference_number     text,
  application_notes                text,

  -- Follow-up
  next_action      text,
  next_action_date date,

  -- Closed / rejection tracking (never delete — see 92 in the brief)
  closed          boolean not null default false,
  closed_date     date,
  closed_reason   text,
  rejection_stage text,
  known_reason    text check (known_reason in (
    'No Response','Automatic Rejection','Experience Mismatch','German Requirement',
    'Technical Skill Gap','Seniority','Location','Work Authorization','Availability',
    'Salary','Recruiter Screen','Interview','Assessment','Internal Candidate',
    'Role Cancelled','Role Filled','Unknown'
  )),

  notes text,

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index job_opportunities_stage_idx  on public.job_opportunities(stage);
create index job_opportunities_closed_idx on public.job_opportunities(closed);

alter table public.job_opportunities enable row level security;
create policy "admin full access" on public.job_opportunities
  for all using (public.is_admin()) with check (public.is_admin());

create trigger trg_job_opportunities_touch
  before update on public.job_opportunities
  for each row execute function public.touch_updated_at();

alter publication supabase_realtime add table public.job_opportunities;


create table public.job_contacts (
  id                  uuid primary key default gen_random_uuid(),
  full_name           text not null,
  company             text,
  role_position        text,
  department          text,
  contact_type        text check (contact_type in (
    'Recruiter','Hiring Manager','Employee','Alumni','Professor','Career Services',
    'Agency Recruiter','Startup Contact','Former Colleague','Former Manager',
    'Personal Contact','Other'
  )),
  linkedin_url        text,
  email               text,
  relationship_strength text,
  how_found           text,
  shared_institution  text,
  alumni_connection   boolean,
  first_contact_date  date,
  last_interaction    date,
  response_status     text,
  referral_requested  boolean not null default false,
  referral_received   boolean not null default false,
  relationship_stage  text check (relationship_stage in (
    'Cold','Identified','Contacted','Responded','Conversation','Warm',
    'Referral Requested','Referral Offered','Referral Submitted','Long-Term Relationship'
  )) default 'Identified',
  next_followup_date  date,
  notes               text,
  created_at          timestamptz not null default now(),
  updated_at          timestamptz not null default now()
);

alter table public.job_contacts enable row level security;
create policy "admin full access" on public.job_contacts
  for all using (public.is_admin()) with check (public.is_admin());

create trigger trg_job_contacts_touch
  before update on public.job_contacts
  for each row execute function public.touch_updated_at();

alter publication supabase_realtime add table public.job_contacts;


create table public.job_activities (
  id             uuid primary key default gen_random_uuid(),
  opportunity_id uuid references public.job_opportunities(id) on delete set null,
  contact_id     uuid references public.job_contacts(id) on delete set null,
  activity_type  text check (activity_type in (
    'Application','LinkedIn Message','Email','Phone Call','Recruiter Call',
    'Networking Meeting','Interview','Follow-up','Thank-you','Assessment',
    'Offer Discussion','Rejection Feedback','Other'
  )),
  channel        text,
  activity_date  date not null default current_date,
  summary        text,
  outcome        text,
  next_step      text,
  next_step_date date,
  created_at     timestamptz not null default now()
);

create index job_activities_opportunity_idx on public.job_activities(opportunity_id);
create index job_activities_contact_idx     on public.job_activities(contact_id);

alter table public.job_activities enable row level security;
create policy "admin full access" on public.job_activities
  for all using (public.is_admin()) with check (public.is_admin());

alter publication supabase_realtime add table public.job_activities;


create table public.job_interviews (
  id               uuid primary key default gen_random_uuid(),
  opportunity_id   uuid not null references public.job_opportunities(id) on delete cascade,
  round            text,
  interview_type   text check (interview_type in (
    'Recruiter Screen','Hiring Manager','Behavioural','Technical','Case Study',
    'Presentation','Panel','Final Interview','HR','Informal Conversation','Other'
  )),
  interview_date     date,
  interview_time     text,
  duration_minutes   int,
  interviewers       text,
  status             text not null default 'scheduled' check (status in ('scheduled','completed','cancelled')),
  location_or_link   text,
  outcome            text,

  -- Prep workspace (freeform, matches this schema's house convention of
  -- flat text columns for free-text workspaces rather than sub-tables)
  company_research           text,
  role_research              text,
  expected_questions         text,
  star_stories               text,
  tech_prep                  text,
  questions_to_ask           text,
  logistics_notes            text,
  general_notes              text,
  post_interview_reflection  text,

  -- Self-assessment (10 keys, 1-5 each): communication, structure,
  -- role_knowledge, company_knowledge, technical_knowledge, evidence,
  -- confidence, motivation, questions_asked, german_performance
  self_assessment jsonb,

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index job_interviews_opportunity_idx on public.job_interviews(opportunity_id);

alter table public.job_interviews enable row level security;
create policy "admin full access" on public.job_interviews
  for all using (public.is_admin()) with check (public.is_admin());

create trigger trg_job_interviews_touch
  before update on public.job_interviews
  for each row execute function public.touch_updated_at();

alter publication supabase_realtime add table public.job_interviews;


-- Real child table (not jsonb) because this feature explicitly requires
-- cross-interview aggregation later ("identify repeated questions").
create table public.job_interview_questions (
  id           uuid primary key default gen_random_uuid(),
  interview_id uuid not null references public.job_interviews(id) on delete cascade,
  question     text not null,
  tag          text check (tag in (
    'Leadership','Conflict','Failure','Teamwork','Analytics','Sales','Commercial',
    'Technical','Motivation','Company','Salary','Availability','German','Visa',
    'Behavioural','Case','Other'
  )),
  created_at   timestamptz not null default now()
);

create index job_interview_questions_interview_idx on public.job_interview_questions(interview_id);

alter table public.job_interview_questions enable row level security;
create policy "admin full access" on public.job_interview_questions
  for all using (public.is_admin()) with check (public.is_admin());

alter publication supabase_realtime add table public.job_interview_questions;


-- Singleton career profile every AI feature reads as grounding context —
-- same id=true trick as ai_settings (15_ai_settings.sql).
create table public.job_career_profile (
  id                  boolean primary key default true,
  education           text,
  work_experience     text,
  projects            text,
  skills              text,
  languages           text,
  certifications      text,
  career_preferences  text,
  work_authorization  text,
  target_locations    text,
  target_roles        text,
  salary_preferences  text,
  availability        text,
  career_narrative     text,
  updated_at          timestamptz not null default now(),
  constraint job_career_profile_singleton check (id)
);

alter table public.job_career_profile enable row level security;
create policy "admin full access" on public.job_career_profile
  for all using (public.is_admin()) with check (public.is_admin());

create trigger trg_job_career_profile_touch
  before update on public.job_career_profile
  for each row execute function public.touch_updated_at();

insert into public.job_career_profile (id) values (true);
