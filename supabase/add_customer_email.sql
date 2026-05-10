-- Run in Supabase SQL Editor
-- Adds customer_email column to orders table (safe to run even if column exists)
ALTER TABLE orders ADD COLUMN IF NOT EXISTS customer_email TEXT;
