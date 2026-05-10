-- ══════════════════════════════════════════════════════════════
-- Run in: Supabase Dashboard → SQL Editor → New query
-- ══════════════════════════════════════════════════════════════

-- One-off / capital expenses (equipment, rent, repairs, etc.)
CREATE TABLE IF NOT EXISTS one_off_expenses (
  id          BIGSERIAL PRIMARY KEY,
  created_at  TIMESTAMPTZ DEFAULT NOW(),
  expense_date DATE NOT NULL DEFAULT CURRENT_DATE,
  category    TEXT NOT NULL, -- Equipment, Rent, Repair, Utilities, Marketing, Other
  description TEXT NOT NULL,
  amount      NUMERIC(12,2) NOT NULL,
  vendor      TEXT,
  receipt_url TEXT,
  notes       TEXT,
  added_by    TEXT
);
ALTER TABLE one_off_expenses ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "admin_only" ON one_off_expenses;
CREATE POLICY "admin_only" ON one_off_expenses FOR ALL TO authenticated
  USING (auth.jwt() ->> 'email' = ANY(ARRAY['mushroombangladesh.info@gmail.com','quazishaab@gmail.com']))
  WITH CHECK (auth.jwt() ->> 'email' = ANY(ARRAY['mushroombangladesh.info@gmail.com','quazishaab@gmail.com']));

-- B2B customer pipeline
CREATE TABLE IF NOT EXISTS b2b_pipeline (
  id            BIGSERIAL PRIMARY KEY,
  created_at    TIMESTAMPTZ DEFAULT NOW(),
  updated_at    TIMESTAMPTZ DEFAULT NOW(),
  business_name TEXT NOT NULL,
  contact_name  TEXT,
  phone         TEXT,
  email         TEXT,
  business_type TEXT, -- Restaurant, Hotel, Cafe, Pharmacy, Retailer, Other
  location      TEXT,
  district      TEXT,
  status        TEXT DEFAULT 'cold', -- cold, contacted, interested, proposal, won, lost
  monthly_potential NUMERIC(10,2), -- estimated monthly order value
  notes         TEXT,
  last_contact  DATE,
  next_followup DATE,
  added_by      TEXT
);
ALTER TABLE b2b_pipeline ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "admin_only" ON b2b_pipeline;
CREATE POLICY "admin_only" ON b2b_pipeline FOR ALL TO authenticated
  USING (auth.jwt() ->> 'email' = ANY(ARRAY['mushroombangladesh.info@gmail.com','quazishaab@gmail.com']))
  WITH CHECK (auth.jwt() ->> 'email' = ANY(ARRAY['mushroombangladesh.info@gmail.com','quazishaab@gmail.com']));

-- Auto-update updated_at on b2b_pipeline
DROP TRIGGER IF EXISTS b2b_pipeline_updated_at ON b2b_pipeline;
CREATE TRIGGER b2b_pipeline_updated_at
  BEFORE UPDATE ON b2b_pipeline
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();
