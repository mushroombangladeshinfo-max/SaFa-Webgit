# SaFa Naturals — Backend (Supabase)

Everything the site needs server-side lives in this folder. The database is
Supabase Postgres; serverless logic is Deno Edge Functions.

---

## Folder map

```
supabase/
├── migrations/
│   ├── 01_core_commerce.sql      ← products, orders, order_items, coupons,
│   │                                settings, reviews + RLS + indexes
│   ├── 02_rpc_functions.sql      ← validate_coupon, redeem_coupon,
│   │                                track_order, get_product_reviews
│   └── 04_analytics_warehouse.sql← marketing metrics + unified KPI views
│                                    (added in the analytics build)
├── farm_daily_logs.sql           ← farm operations log table   ("03a")
├── expenses_and_pipeline.sql     ← one-off expenses + B2B CRM  ("03b")
├── add_customer_email.sql        ← superseded by 01 (kept for history)
├── functions/
│   ├── _shared/metrics.ts        ← common upsert/guard helpers for syncs
│   ├── whatsapp-order-notify/    ← WhatsApp alert on new order (webhook)
│   ├── order-confirmation-email/ ← Resend email on new order   (webhook)
│   ├── sync-meta/                ← Facebook + Instagram + Meta Ads  ┐ daily
│   ├── sync-tiktok/              ← TikTok organic                   │ metric
│   ├── sync-google-ads/          ← Google Ads spend/conversions     │ syncs →
│   ├── sync-linkedin/            ← LinkedIn page stats              │ marketing_
│   └── sync-whatsapp/            ← WhatsApp conversation analytics  ┘ metrics
└── README.md                     ← this file
```

Platform API keys, deploy commands and cron scheduling: see
**[INTEGRATIONS.md](../INTEGRATIONS.md)** in the project root.

## Fresh-project setup (disaster recovery)

Run in the Supabase **SQL Editor**, in this order — every file is safe to
re-run (additive only, nothing destructive):

1. `migrations/01_core_commerce.sql`
2. `migrations/02_rpc_functions.sql`
3. `farm_daily_logs.sql`
4. `expenses_and_pipeline.sql`
5. `migrations/04_analytics_warehouse.sql`
6. The IoT sensor schema (embedded in `dashboard.html`'s setup panel)

Then:

- **Auth → URL Configuration**: set Site URL + redirect URLs to the live domain.
- **Edge functions**: `npx supabase functions deploy whatsapp-order-notify order-confirmation-email`
- **Secrets** (Dashboard → Edge Functions → Secrets):
  `WA_ACCESS_TOKEN`, `WA_PHONE_NUMBER_ID`, `RESEND_API_KEY`
- **Database → Webhooks**: two webhooks on `orders` INSERT → one per function.

## Security model (summary)

| Table | Anonymous visitor | Logged-in customer | Admin |
|---|---|---|---|
| products | read (active only) | read (active only) | full |
| orders | insert only | insert + read/cancel **own** | full |
| order_items | insert only | — | full |
| coupons | — (RPC only) | — (RPC only) | full |
| settings | read | read | full |
| reviews | insert (length-capped) | insert | full |
| farm/expenses/pipeline | — | — | full |

- "Admin" = email allow-list in the `is_admin()` SQL function
  (`migrations/01_core_commerce.sql`, section 0). **Edit that one function to
  add or remove an admin**, then re-run it.
- Anonymous flows that need data (order tracking, coupon check, reviews) go
  through `SECURITY DEFINER` RPCs that return only whitelisted fields —
  the tables themselves are never readable by the public.

## Conventions

- **Additive migrations only.** Never `DROP TABLE` / destructive `ALTER` in a
  numbered migration; add a new numbered file instead.
- `updated_at` maintained by the shared `touch_updated_at()` trigger.
- Money columns are `NUMERIC(10,2)` (BDT).
- Order numbers: `SAFA-DDMM-XXXX` generated client-side at checkout;
  row IDs are client-generated UUIDs so checkout never needs a read-back.
