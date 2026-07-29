// Supabase Edge Function — Weekly Farm Report
// Triggered by pg_cron every Friday 04:00 UTC (10:00 Dhaka) — see
// supabase/migrations/19_weekly_report.sql for the schedule.
//
// Summarizes the prior Saturday–Thursday (the standard Bangladesh business
// week) from v_kpi_daily: fresh harvest kg, farm sales, online sales, total
// sales, and total cost — then emails all admins (always) and best-effort
// WhatsApps both founders via CallMeBot (only once each founder's personal
// CALLMEBOT_KEY_* secret is set — until then this silently no-ops so it
// never blocks the email).

import { createClient } from 'jsr:@supabase/supabase-js@2';

const RESEND_API = 'https://api.resend.com/emails';
const FROM_NAME  = 'SaFa Naturals';
const FROM_EMAIL = 'onboarding@resend.dev';

// Same drift-risk caveat as the other hand-maintained admin-email copies
// (src/admin-auth.js, public.is_admin()) — update all of them together.
const ADMIN_EMAILS = [
  'mushroombangladesh.info@gmail.com',
  'quazishaab@gmail.com',
  'abrarfahim.nsu@gmail.com',
  'sunnymarjuk@gmail.com',
];

function fmt(n: number) {
  return '৳' + Math.round(n || 0).toLocaleString('en');
}

function dhakaTodayISO(): string {
  return new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Dhaka' }).format(new Date());
}
function addDays(iso: string, delta: number): string {
  const d = new Date(iso + 'T00:00:00Z');
  d.setUTCDate(d.getUTCDate() + delta);
  return d.toISOString().slice(0, 10);
}
function displayDate(iso: string): string {
  return new Date(iso + 'T00:00:00Z').toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
}

interface Totals {
  harvestKg: number;
  farmRevenue: number;
  webRevenue: number;
  totalSales: number;
  totalCost: number;
  net: number;
}

function buildEmailHtml(startDate: string, endDate: string, t: Totals): string {
  const row = (label: string, value: string, color = '#0a1a0f', big = false) => `
    <tr>
      <td style="padding:12px 0;border-bottom:1px solid #f0ebe3;font-size:14px;color:#666;">${label}</td>
      <td style="padding:12px 0;border-bottom:1px solid #f0ebe3;font-size:${big ? 20 : 16}px;font-weight:700;color:${color};text-align:right;">${value}</td>
    </tr>`;

  return `<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>Weekly Report — SaFa Naturals</title></head>
<body style="margin:0;padding:0;background:#f7f3ee;font-family:'Helvetica Neue',Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f7f3ee;padding:32px 16px;">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;">

        <tr><td style="background:#0a1a0f;border-radius:12px 12px 0 0;padding:32px 40px;text-align:center;">
          <div style="font-family:Georgia,serif;font-size:28px;font-weight:400;color:#f5efe6;letter-spacing:1px;">SaFa Naturals</div>
          <div style="font-size:11px;letter-spacing:3px;text-transform:uppercase;color:#c49a3c;margin-top:6px;">Weekly Report</div>
        </td></tr>

        <tr><td style="background:#c49a3c;padding:14px 40px;text-align:center;">
          <div style="font-size:14px;font-weight:700;color:#0a1a0f;letter-spacing:0.5px;">${displayDate(startDate)} – ${displayDate(endDate)}</div>
        </td></tr>

        <tr><td style="background:#ffffff;padding:36px 40px;">
          <table width="100%" cellpadding="0" cellspacing="0">
            ${row('🌱 Fresh Harvest', t.harvestKg.toFixed(1) + ' kg')}
            ${row('💰 Farm Sales', fmt(t.farmRevenue))}
            ${row('🛒 Online Sales', fmt(t.webRevenue))}
            ${row('📈 Total Sales', fmt(t.totalSales), '#c49a3c', true)}
            ${row('💸 Total Cost', fmt(t.totalCost))}
            ${row('✅ Net', fmt(t.net), t.net >= 0 ? '#2d6a3e' : '#b23b3b', true)}
          </table>
        </td></tr>

        <tr><td style="background:#f0ebe3;border-radius:0 0 12px 12px;padding:20px 40px;text-align:center;">
          <p style="font-size:12px;color:#999;margin:0;line-height:1.8;">
            SaFa Naturals Agrotech Farm · Alompur, Sirajganj, Bangladesh<br>
            Auto-generated every Friday from farm daily logs + online orders.
          </p>
        </td></tr>

      </table>
    </td></tr>
  </table>
</body>
</html>`;
}

async function sendEmail(startDate: string, endDate: string, t: Totals): Promise<{ ok: boolean; detail: unknown }> {
  const RESEND_KEY = Deno.env.get('RESEND_API_KEY');
  if (!RESEND_KEY) return { ok: false, detail: 'Missing RESEND_API_KEY secret' };

  const res = await fetch(RESEND_API, {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${RESEND_KEY}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      from:    `${FROM_NAME} <${FROM_EMAIL}>`,
      to:      ADMIN_EMAILS,
      subject: `Weekly Report: ${displayDate(startDate)} – ${displayDate(endDate)} · SaFa Naturals 🍄`,
      html:    buildEmailHtml(startDate, endDate, t),
    }),
  });
  const result = await res.json();
  if (!res.ok) console.error('Resend error:', JSON.stringify(result));
  return { ok: res.ok, detail: result };
}

function buildWaMessage(startDate: string, endDate: string, t: Totals): string {
  return [
    `📊 SaFa Naturals — Weekly Report`,
    `${displayDate(startDate)} – ${displayDate(endDate)}`,
    '─────────────────────',
    `🌱 Fresh Harvest: ${t.harvestKg.toFixed(1)} kg`,
    `💰 Farm Sales: ${fmt(t.farmRevenue)}`,
    `🛒 Online Sales: ${fmt(t.webRevenue)}`,
    `📈 Total Sales: ${fmt(t.totalSales)}`,
    `💸 Total Cost: ${fmt(t.totalCost)}`,
    `✅ Net: ${fmt(t.net)}`,
  ].join('\n');
}

// Best-effort — swallows failures (e.g. a recipient hasn't activated their
// CallMeBot key yet) so a WhatsApp problem never blocks the email, which is
// the channel that actually works today.
//
// Uses CallMeBot (api.callmebot.com) instead of Meta's WhatsApp Business
// Cloud API — same free relay service checkout.html already wires up for
// seller order alerts (currently dormant there too, blank key). No Meta
// Business verification, no message-template approval, plain free-form
// text — just a personal API key per recipient, each obtained by that
// person messaging CallMeBot's own WhatsApp number once. Each key only
// works to message the phone number that generated it, so each founder
// needs their own secret.
const CALLMEBOT_RECIPIENTS = [
  { phone: '8801970099378', keyEnv: 'CALLMEBOT_KEY_FAHIM' },
  { phone: '8801681884371', keyEnv: 'CALLMEBOT_KEY_SUNNY' },
];

async function sendWhatsApp(startDate: string, endDate: string, t: Totals): Promise<{ ok: boolean; detail: unknown }[]> {
  const msg = buildWaMessage(startDate, endDate, t);
  const results = [];

  for (const { phone, keyEnv } of CALLMEBOT_RECIPIENTS) {
    const apiKey = Deno.env.get(keyEnv);
    if (!apiKey) {
      console.log(`WhatsApp skipped for ${phone}: ${keyEnv} not configured yet`);
      results.push({ ok: false, detail: `${keyEnv} not configured` });
      continue;
    }
    try {
      const res = await fetch(`https://api.callmebot.com/whatsapp.php?phone=${phone}&text=${encodeURIComponent(msg)}&apikey=${apiKey}`);
      const detail = await res.text();
      if (!res.ok) console.error(`CallMeBot error for ${phone}:`, detail);
      results.push({ ok: res.ok, detail });
    } catch (err) {
      console.error(`CallMeBot send threw for ${phone}:`, err);
      results.push({ ok: false, detail: String(err) });
    }
  }
  return results;
}

Deno.serve(async (req) => {
  if (req.method !== 'POST') return new Response('Method not allowed', { status: 405 });

  // Same webhook-secret pattern as order-confirmation-email — set once in
  // Vault as 'order_webhook_secret', reused here rather than provisioning
  // a second secret for the same purpose.
  const WEBHOOK_SECRET = Deno.env.get('WEBHOOK_SECRET');
  if (WEBHOOK_SECRET && req.headers.get('x-webhook-secret') !== WEBHOOK_SECRET) {
    console.error('Rejected: bad or missing x-webhook-secret header');
    return new Response('Unauthorized', { status: 401 });
  }

  const SUPABASE_URL         = Deno.env.get('SUPABASE_URL')!;
  const SUPABASE_SERVICE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
  const sb = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

  const today     = dhakaTodayISO();
  const endDate   = addDays(today, -1);   // Thursday
  const startDate = addDays(endDate, -5); // Saturday

  const { data, error } = await sb
    .from('v_kpi_daily')
    .select('harvest_kg,farm_revenue,web_revenue,farm_expenses')
    .gte('day', startDate)
    .lte('day', endDate);

  if (error) {
    console.error('v_kpi_daily query failed:', error);
    return new Response(JSON.stringify({ error }), { status: 500, headers: { 'Content-Type': 'application/json' } });
  }

  const t: Totals = (data || []).reduce((acc, row) => {
    acc.harvestKg   += Number(row.harvest_kg)    || 0;
    acc.farmRevenue += Number(row.farm_revenue)  || 0;
    acc.webRevenue  += Number(row.web_revenue)   || 0;
    acc.totalCost   += Number(row.farm_expenses) || 0;
    return acc;
  }, { harvestKg: 0, farmRevenue: 0, webRevenue: 0, totalSales: 0, totalCost: 0, net: 0 });
  t.totalSales = t.farmRevenue + t.webRevenue;
  t.net        = t.totalSales - t.totalCost;

  const emailResult = await sendEmail(startDate, endDate, t);
  const waResults    = await sendWhatsApp(startDate, endDate, t);

  console.log(`Weekly report ${startDate}..${endDate}: harvest=${t.harvestKg}kg sales=${t.totalSales} cost=${t.totalCost} — email ${emailResult.ok ? 'sent' : 'FAILED'}, whatsapp ${waResults.filter(r => r.ok).length}/${waResults.length} sent`);

  return new Response(JSON.stringify({ startDate, endDate, totals: t, email: emailResult, whatsapp: waResults }), {
    headers: { 'Content-Type': 'application/json' },
  });
});
