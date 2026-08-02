-- Spawn purchase replacement tracking. A recurring, named pattern: some
-- kg of a delivery arrives already moldy, the supplier promises a
-- replacement, and until now there was no way to see which promises are
-- still outstanding vs already fulfilled -- the existing kg_refunded/
-- refund_amount/refund_notes fields only capture the eventual outcome,
-- not the "still waiting" state in between.
--
-- replacement_status is the primary, simple mechanism (matches how the
-- user wants to work with it: click to update in the table, same pattern
-- as spawn-lab.html's statusSelect()). replacement_for_purchase_id is a
-- secondary, optional link for when the actual replacement delivery gets
-- logged as its own purchase row -- lets "purchase #14 was the make-good
-- for purchase #8" be traced precisely, without being required for the
-- simple case of just flipping a status.
alter table public.spawn_purchases
  add column replacement_status text not null default 'none'
    check (replacement_status in ('none','promised','received')),
  add column replacement_for_purchase_id bigint references public.spawn_purchases(id);

create index spawn_purchases_replacement_for_idx on public.spawn_purchases(replacement_for_purchase_id);
