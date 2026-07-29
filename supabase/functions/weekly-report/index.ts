// Supabase Edge Function — Weekly Farm Report
// Triggered by pg_cron every Friday 04:00 UTC (10:00 Dhaka) — see
// supabase/migrations/19_weekly_report.sql for the schedule.
//
// Summarizes the prior Saturday–Thursday (the standard Bangladesh business
// week) from v_kpi_daily: fresh harvest kg, farm sales, online sales, total
// sales, and total cost — then emails all admins (always) and best-effort
// WhatsApps both founders (only once a WhatsApp Business template is
// approved and WA_ACCESS_TOKEN/WA_PHONE_NUMBER_ID secrets are set — until
// then this silently no-ops so it never blocks the email).

import { createClient } from 'jsr:@supabase/supabase-js@2';

const RESEND_API = 'https://api.resend.com/emails';
const FROM_NAME  = 'SaFa Naturals';
const FROM_EMAIL = 'onboarding@resend.dev';
const WA_API_URL = 'https://graph.facebook.com/v20.0';

// Same drift-risk caveat as the other hand-maintained admin-email copies
// (src/admin-auth.js, public.is_admin()) — update all of them together.
const ADMIN_EMAILS = [
  'mushroombangladesh.info@gmail.com',
  'quazishaab@gmail.com',
  'abrarfahim.nsu@gmail.com',
  'sunnymarjuk@gmail.com',
];

// Founders' personal WhatsApp numbers — Cloud API can only send 1:1, never
// into a group, so both get their own message.
const WA_RECIPIENTS = ['8801970099378', '8801681884371'];

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

// Best-effort — swallows failures (e.g. missing secrets, unapproved
// template) so a WhatsApp problem never blocks the email, which is the
// channel that actually works today.
async function sendWhatsApp(startDate: string, endDate: string, t: Totals): Promise<{ ok: boolean; detail: unknown }[]> {
  const WA_ACCESS_TOKEN    = Deno.env.get('WA_ACCESS_TOKEN');
  const WA_PHONE_NUMBER_ID = Deno.env.get('WA_PHONE_NUMBER_ID');
  if (!WA_ACCESS_TOKEN || !WA_PHONE_NUMBER_ID) {
    console.log('WhatsApp skipped: WA_ACCESS_TOKEN / WA_PHONE_NUMBER_ID not configured yet');
    return [{ ok: false, detail: 'not configured' }];
  }

  const payloadFor = (to: string) => ({
    messaging_product: 'whatsapp',
    to,
    type: 'template',
    template: {
      name: 'weekly_farm_report',
      language: { code: 'en' },
      components: [{
        type: 'body',
        parameters: [
          { type: 'text', text: displayDate(startDate) },
          { type: 'text', text: displayDate(endDate) },
          { type: 'text', text: t.harvestKg.toFixed(1) + ' kg' },
          { type: 'text', text: fmt(t.farmRevenue) },
          { type: 'text', text: fmt(t.webRevenue) },
          { type: 'text', text: fmt(t.totalSales) },
          { type: 'text', text: fmt(t.totalCost) },
          { type: 'text', text: fmt(t.net) },
        ],
      }],
    },
  });

  const results = [];
  for (const to of WA_RECIPIENTS) {
    try {
      const res = await fetch(`${WA_API_URL}/${WA_PHONE_NUMBER_ID}/messages`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${WA_ACCESS_TOKEN}`, 'Content-Type': 'application/json' },
        body: JSON.stringify(payloadFor(to)),
      });
      const result = await res.json();
      if (!res.ok) console.error(`WhatsApp API error for ${to}:`, JSON.stringify(result));
      results.push({ ok: res.ok, detail: result });
    } catch (err) {
      console.error(`WhatsApp send threw for ${to}:`, err);
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
