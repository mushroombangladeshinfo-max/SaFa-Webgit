-- Lets a logged-in customer's guest (pre-account) orders become visible in
-- their Order History. checkout.html never requires an account, so most
-- orders are placed with user_id = null; account.html previously only ever
-- queried orders.eq('user_id', user.id), meaning a guest order was
-- permanently invisible even after that same person later signed up.
--
-- Only safe to auto-link on EMAIL, not phone: this project's auth config
-- (mailer_autoconfirm=false, mailer_allow_unverified_email_sign_ins=false)
-- guarantees a session only exists for a confirmed email, so matching
-- against auth.users.email can't be spoofed by someone claiming an address
-- they don't own. Phone has no equivalent verification here (no OTP flow),
-- so it stays exactly what it already is: the two-factor key for
-- track.html's track_order(order_number, phone) RPC -- a deliberate
-- one-order-at-a-time lookup, not a blanket account-linking mechanism.

create or replace function public.claim_guest_orders()
returns integer
language plpgsql
security definer
set search_path = public
as $$
declare
  my_email text;
  claimed_count integer;
begin
  select lower(email) into my_email from auth.users where id = auth.uid();
  if my_email is null then
    return 0;
  end if;

  update orders
  set user_id = auth.uid()
  where user_id is null
    and lower(customer_email) = my_email;

  get diagnostics claimed_count = row_count;
  return claimed_count;
end;
$$;

-- Postgres grants EXECUTE to PUBLIC by default on new functions, and this
-- Supabase project's schema-level default privileges additionally grant
-- EXECUTE to anon on every new public-schema function. Both are harmless
-- here in practice (an anon caller has auth.uid() = null, so the function
-- just no-ops), but revoke both explicitly anyway rather than relying only
-- on that no-op — matches the intent that only a real logged-in session can
-- call this.
revoke execute on function public.claim_guest_orders() from public;
revoke execute on function public.claim_guest_orders() from anon;
grant execute on function public.claim_guest_orders() to authenticated;
