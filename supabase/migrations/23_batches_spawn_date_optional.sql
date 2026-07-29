-- User is backfilling a real batch ("Batch 1") that's been producing since
-- before this tracking system existed — spawn/inoculation date is a real
-- fact they want to supply later, not now, and spawn_date was NOT NULL
-- (migration 18), which would force a guessed placeholder date into a
-- traceability field whose entire point is being accurate. NULL is honest;
-- a fabricated date is not.

alter table public.batches alter column spawn_date drop not null;
