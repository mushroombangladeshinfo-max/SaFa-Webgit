# SaFa Naturals — Platform Integrations Guide

How to connect each marketing platform to the analytics warehouse.
**Until a platform is connected, enter its numbers manually (or via CSV) on
the Insights page — the moment you add the API keys, the sync function takes
over the same rows automatically.** No migration, nothing breaks.

---

## How the pipeline works

```
 Facebook / Instagram ──► sync-meta ────────┐
 TikTok ──────────────► sync-tiktok ────────┤
 Google Ads ──────────► sync-google-ads ────┼──► marketing_metrics ──► Insights
 LinkedIn ────────────► sync-linkedin ──────┤    (one row per day        dashboard
 WhatsApp ────────────► sync-whatsapp ──────┤     per channel)          (insights.html)
 Website (GA4) ────────► sync-ga4 ──────────┘
 Manual entry / CSV ───────────────────────────────────┘
 Orders · farm logs · expenses · IoT sensors ──► SQL views (v_kpi_daily, …)
 Farm weather (Open-Meteo) ──► sync-weather ──► weather_daily (one row/day)
```

`sync-weather` is the one exception to "connect it with API keys" below —
Open-Meteo needs no signup, no key, nothing to configure. It's already
deployed and scheduled; see its own section further down.

Each sync function runs once a day, pulls **yesterday's** numbers, and
upserts one row per channel. Re-running is always safe (idempotent).
A function with missing keys doesn't crash — it replies with exactly which
secrets it still needs.

---

## Secrets cheat-sheet

Set all of these in **Supabase Dashboard → Edge Functions → Secrets**.

| Platform | Secret | Where to get it |
|---|---|---|
| All (optional) | `CRON_SECRET` | Invent a random string; also send it as `x-cron-secret` header when scheduling — stops strangers triggering your syncs |
| Meta (FB+IG) | `META_ACCESS_TOKEN` | business.facebook.com → Business Settings → System Users → Generate Token (scopes: `pages_read_engagement`, `read_insights`, `ads_read`, `instagram_basic`, `instagram_manage_insights`) |
| | `META_PAGE_ID` | Your Facebook Page → About → Page ID |
| | `META_IG_USER_ID` | Graph Explorer: `GET /{page-id}?fields=instagram_business_account` |
| | `META_AD_ACCOUNT_ID` | Ads Manager URL — looks like `act_1234567890` (keep the `act_`) |
| TikTok | `TIKTOK_ACCESS_TOKEN` | developers.tiktok.com → app with "Business Account" product → OAuth |
| | `TIKTOK_BUSINESS_ID` | Returned during the TikTok OAuth handshake |
| Google Ads | `GOOGLE_ADS_DEVELOPER_TOKEN` | ads.google.com → Tools → API Center |
| | `GOOGLE_ADS_CLIENT_ID` / `GOOGLE_ADS_CLIENT_SECRET` | console.cloud.google.com → Credentials → OAuth client |
| | `GOOGLE_ADS_REFRESH_TOKEN` | One-time consent via developers.google.com/oauthplayground (scope `…/auth/adwords`) |
| | `GOOGLE_ADS_CUSTOMER_ID` | 10 digits, no dashes (top-right of Ads UI) |
| LinkedIn | `LINKEDIN_ACCESS_TOKEN` | developer.linkedin.com app → Community Management API → OAuth (⚠ expires ~60 days) |
| | `LINKEDIN_ORGANIZATION_ID` | Number in linkedin.com/company/`XXXXXXX`/admin |
| WhatsApp | `WA_ACCESS_TOKEN` | Already set (order notifications use it) |
| | `WA_WABA_ID` | developers.facebook.com → WhatsApp → API Setup → WhatsApp **Business Account** ID |
| Webhooks | `WEBHOOK_SECRET` | Invent a random string; also add it as `x-webhook-secret` header on both Database Webhooks (order notify + email) |
| Website (GA4) | `GA4_CLIENT_EMAIL` | From a Google Cloud service-account JSON key (IAM & Admin → Service Accounts → Keys → Add Key → JSON) |
| | `GA4_PRIVATE_KEY` | Same JSON file — the full `-----BEGIN PRIVATE KEY-----...` block, `\n` line breaks included |
| | `GA4_PROPERTY_ID` | GA4 Admin → Property Settings → Property ID (digits only, not the `G-XXXXXXXXXX` Measurement ID). Also grant the service account "Viewer" access under Property Access Management. |

Orders and revenue still come from your own database — the source of truth.
`sync-ga4` only adds sessions/users/engagement/conversions context alongside it.

### GA4 custom dimensions (required for Section Engagement / Scroll Depth)

The site already fires `section_view` (param `section_name`) and `scroll_depth`
(param `percent_scrolled`) events — see `src/analytics.js`. GA4 collects these
automatically, but its Data API will only return them by name once they're
registered as **custom dimensions**:

1. **analytics.google.com** → gear icon (Admin) → the property → **Custom
   definitions** → **Create custom dimensions**.
2. Create one named **Section Name**, scope **Event**, event parameter
   `section_name`.
3. Create a second named **Scroll Percent**, scope **Event**, event parameter
   `percent_scrolled`.
4. New dimensions only apply to events from that point forward — data from
   before registration won't backfill. `v_section_engagement_30d` and
   `v_scroll_depth_30d` (Insights → Channels tab) will stay empty until both
   are registered **and** `sync-ga4` has run at least once afterward.

---

## Deploying the functions

```bash
# One-time login + link (if not done before)
npx supabase login
npx supabase link --project-ref uiwmerejtrdrykqpumdu

# Deploy everything
npx supabase functions deploy sync-meta sync-tiktok sync-google-ads sync-linkedin sync-whatsapp sync-ga4
npx supabase functions deploy whatsapp-order-notify order-confirmation-email
```

## Testing a sync by hand

```bash
curl -X POST "https://uiwmerejtrdrykqpumdu.supabase.co/functions/v1/sync-meta" \
  -H "Authorization: Bearer <YOUR_ANON_KEY>" \
  -H "x-cron-secret: <YOUR_CRON_SECRET>"

# Backfill a specific day:
curl -X POST ".../sync-meta?date=2026-07-01" ...
```

A not-yet-configured platform replies with `configured: false` and the exact
list of missing secrets — nothing crashes.

## Scheduling (daily, automatic)

Supabase Dashboard → **Database → Extensions** → enable `pg_cron` and
`pg_net`, then run in SQL Editor (replace the two placeholders):

```sql
-- Daily platform syncs, staggered to be polite to rate limits (times UTC)
SELECT cron.schedule('sync-meta-daily',       '0 6 * * *',  $$
  SELECT net.http_post(
    url     := 'https://uiwmerejtrdrykqpumdu.supabase.co/functions/v1/sync-meta',
    headers := '{"Authorization":"Bearer ANON_KEY_HERE","x-cron-secret":"CRON_SECRET_HERE"}'::jsonb
  ) $$);
SELECT cron.schedule('sync-tiktok-daily',     '10 6 * * *', $$ SELECT net.http_post(url := 'https://uiwmerejtrdrykqpumdu.supabase.co/functions/v1/sync-tiktok',     headers := '{"Authorization":"Bearer ANON_KEY_HERE","x-cron-secret":"CRON_SECRET_HERE"}'::jsonb) $$);
SELECT cron.schedule('sync-google-ads-daily', '20 6 * * *', $$ SELECT net.http_post(url := 'https://uiwmerejtrdrykqpumdu.supabase.co/functions/v1/sync-google-ads', headers := '{"Authorization":"Bearer ANON_KEY_HERE","x-cron-secret":"CRON_SECRET_HERE"}'::jsonb) $$);
SELECT cron.schedule('sync-linkedin-daily',   '30 6 * * *', $$ SELECT net.http_post(url := 'https://uiwmerejtrdrykqpumdu.supabase.co/functions/v1/sync-linkedin',   headers := '{"Authorization":"Bearer ANON_KEY_HERE","x-cron-secret":"CRON_SECRET_HERE"}'::jsonb) $$);
SELECT cron.schedule('sync-whatsapp-daily',   '40 6 * * *', $$ SELECT net.http_post(url := 'https://uiwmerejtrdrykqpumdu.supabase.co/functions/v1/sync-whatsapp',   headers := '{"Authorization":"Bearer ANON_KEY_HERE","x-cron-secret":"CRON_SECRET_HERE"}'::jsonb) $$);
SELECT cron.schedule('sync-ga4-daily',        '50 6 * * *', $$ SELECT net.http_post(url := 'https://uiwmerejtrdrykqpumdu.supabase.co/functions/v1/sync-ga4',        headers := '{"Authorization":"Bearer ANON_KEY_HERE","x-cron-secret":"CRON_SECRET_HERE"}'::jsonb) $$);
SELECT cron.schedule('sync-weather-daily',    '0 7 * * *',  $$ SELECT net.http_post(url := 'https://uiwmerejtrdrykqpumdu.supabase.co/functions/v1/sync-weather',   headers := '{"Authorization":"Bearer ANON_KEY_HERE"}'::jsonb) $$);
```

6:00 UTC = 12:00 noon Dhaka — yesterday's numbers are final on every
platform by then.

## Connecting a platform: the 3-step ritual

1. Get the keys (table above) → paste into Edge Function **Secrets**.
2. Test with the curl command → check a row appeared in `marketing_metrics`.
3. In the Insights page (or SQL), set `channel_accounts.sync_enabled = TRUE`
   for that channel — the dashboard then shows it as "auto-synced".

## Farm weather (`sync-weather`) — already live, no setup needed

Deployed and scheduled as of 2026-07-28. Unlike every other sync above, this
one needs **zero configuration** — Open-Meteo (open-meteo.com) is free and
keyless, so there's no secrets table entry and no 3-step ritual to run.

Pulls day (06:00–17:59 local) vs night (18:00–05:59 local) temperature and
humidity, plus total rainfall, for the farm's own coordinates (Sirajganj,
24.4539°N 89.7006°E), and writes one row per day to `public.weather_daily`.
Also auto-classifies each day into the same normal/hot/rainy/cold/humid/
stormy vocabulary the old manual "আজকের আবহাওয়া" dropdown in quick-log.html
used — that dropdown had 0 of 4 entries ever filled in, so this replaces it
outright rather than trying to get the habit to stick.

Existing farm data only goes back a few days, so there's nothing to
correlate against yet — once `farm_daily_logs` (harvest, QC/contamination)
has a few weeks of entries, join it to `weather_daily` on date to check
things like "does contamination spike on humid/rainy stretches?"

```bash
# Manual test / backfill (works up to ~92 days back on the free endpoint)
curl -X POST "https://uiwmerejtrdrykqpumdu.supabase.co/functions/v1/sync-weather?date=2026-07-20" \
  -H "Authorization: Bearer <YOUR_ANON_KEY>"
```

Manual entries you made earlier for the same days are simply overwritten by
API data (same day + channel = same row). History stays consistent.
