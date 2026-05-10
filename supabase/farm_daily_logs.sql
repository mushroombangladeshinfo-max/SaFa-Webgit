-- ══════════════════════════════════════════════════════════════
-- SaFa Naturals — farm_daily_logs table
-- Run this in: Supabase Dashboard → SQL Editor → New query
-- ══════════════════════════════════════════════════════════════

CREATE TABLE IF NOT EXISTS farm_daily_logs (
  id              BIGSERIAL PRIMARY KEY,
  log_date        DATE NOT NULL UNIQUE,
  created_at      TIMESTAMPTZ DEFAULT NOW(),
  updated_at      TIMESTAMPTZ DEFAULT NOW(),

  -- Harvest
  harvest_fresh_a     NUMERIC(8,3),
  harvest_fresh_b     NUMERIC(8,3),
  harvest_fresh_rej   NUMERIC(8,3),
  harvest_dried       NUMERIC(8,3),
  harvest_powder      NUMERIC(8,3),
  harvest_rooms       TEXT[],
  harvest_primary_batch TEXT,
  harvest_flush_num   INT,

  -- Quality Control
  qc_pass         NUMERIC(8,3),
  qc_fail         NUMERIC(8,3),
  qc_fail_reason  TEXT,
  contam_event    BOOLEAN DEFAULT FALSE,
  contam_room     TEXT,
  contam_type     TEXT,
  contam_bags     INT,
  contam_action   TEXT,

  -- Spawn & Substrate
  spawn_bought_kg     NUMERIC(8,3),
  spawn_price_per_kg  NUMERIC(8,2),
  spawn_supplier      TEXT,
  spawn_used_kg       NUMERIC(8,3),
  substrate_kg        NUMERIC(8,3),
  substrate_type      TEXT,
  bags_inoculated     INT,
  bags_discarded      INT,

  -- Processing
  pr_fresh_in     NUMERIC(8,3),
  pr_dried_out    NUMERIC(8,3),
  pr_dried_in     NUMERIC(8,3),
  pr_powder_out   NUMERIC(8,3),
  pr_notes        TEXT,

  -- Sales
  s_fresh_kg      NUMERIC(8,3),
  s_fresh_price   NUMERIC(8,2),
  s_dried_kg      NUMERIC(8,3),
  s_dried_price   NUMERIC(8,2),
  s_powder_kg     NUMERIC(8,3),
  s_powder_price  NUMERIC(8,2),
  s_orders        INT,
  s_waste         NUMERIC(8,3),
  s_b2b_name      TEXT,
  s_b2b_qty       NUMERIC(8,3),
  s_b2b_value     NUMERIC(10,2),

  -- Closing Stock
  st_fresh        NUMERIC(8,3),
  st_dried        NUMERIC(8,3),
  st_powder       NUMERIC(8,3),

  -- Expenses
  ex_spawn        NUMERIC(10,2),
  ex_substrate    NUMERIC(10,2),
  ex_packaging    NUMERIC(10,2),
  ex_labor        NUMERIC(10,2),
  ex_electricity  NUMERIC(10,2),
  ex_transport    NUMERIC(10,2),
  ex_water        NUMERIC(10,2),
  ex_other        NUMERIC(10,2),
  ex_notes        TEXT,

  -- Operations
  op_rooms        INT,
  op_bags_total   INT,
  op_workers      INT,
  op_shifts       INT,
  op_new_batches  INT,
  op_done_batches INT,
  op_bags_removed INT,
  op_energy_kwh   NUMERIC(8,2),
  op_issue        BOOLEAN DEFAULT FALSE,
  op_issue_desc   TEXT,

  -- Notes & Rating
  n_weather           TEXT,
  n_overall_rating    INT CHECK (n_overall_rating BETWEEN 1 AND 5),
  n_observations      TEXT,
  n_tomorrow          TEXT,
  n_unusual           TEXT,
  submitted_by        TEXT
);

-- Auto-update updated_at on every save
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN NEW.updated_at = NOW(); RETURN NEW; END;
$$;

DROP TRIGGER IF EXISTS farm_daily_logs_updated_at ON farm_daily_logs;
CREATE TRIGGER farm_daily_logs_updated_at
  BEFORE UPDATE ON farm_daily_logs
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- Row Level Security — admin emails only
ALTER TABLE farm_daily_logs ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "admin_only" ON farm_daily_logs;
CREATE POLICY "admin_only" ON farm_daily_logs
  FOR ALL TO authenticated
  USING (
    auth.jwt() ->> 'email' = ANY(ARRAY[
      'mushroombangladesh.info@gmail.com',
      'quazishaab@gmail.com'
    ])
  )
  WITH CHECK (
    auth.jwt() ->> 'email' = ANY(ARRAY[
      'mushroombangladesh.info@gmail.com',
      'quazishaab@gmail.com'
    ])
  );
