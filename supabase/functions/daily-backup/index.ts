// Supabase Edge Function — Daily Backup
// Triggered by pg_cron every day at 18:30 UTC (00:30 Dhaka) — see
// supabase/migrations/29_daily_backup.sql for the schedule.
//
// Dumps every core business table to a dated CSV file in the `backups`
// Storage bucket, separate from the live tables, so a bad migration, an
// accidental delete, or an account-level issue doesn't take the only copy
// of the data with it. Then prunes anything older than 30 days so the
// bucket doesn't grow forever.
//
// Also mirrors the same 16 tables into a Google Sheet (one tab per table),
// if GSHEETS_* secrets are configured — soft-skipped otherwise, same
// convention as the CallMeBot alert below, so this stays fully optional
// and never blocks the actual (Storage) backup.
//
// ── SECRETS TO SET for the Sheets mirror (Dashboard → Edge Functions → Secrets) ──
//   GSHEETS_CLIENT_EMAIL    From the downloaded service-account JSON key file
//   GSHEETS_PRIVATE_KEY     From the same file — full "-----BEGIN PRIVATE
//                           KEY-----...-----END PRIVATE KEY-----" block
//   GSHEETS_SPREADSHEET_ID  The segment between /d/ and /edit in the Sheet's URL
// Share the target Sheet with the service account's client_email as Editor
// before this will work.

import { createClient } from 'jsr:@supabase/supabase-js@2';

function dhakaTodayISO(): string {
  return new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Dhaka' }).format(new Date());
}

// Real business records only -- tables with an external source of truth
// (weather_daily/Open-Meteo, site_section_engagement+site_scroll_depth/GA4)
// are re-fetchable and skipped. sensor_readings is also skipped for now: no
// external copy exists, but it's a continuous IoT stream (by far the
// highest row count) rather than a discrete business event -- a conscious
// scope call, easy to add here later if wanted.
//
// Each table's actual primary key, confirmed against its CREATE TABLE, is
// used as the pagination sort column -- .select('*') alone silently caps
// at PostgREST's db.max_rows (1000 by default) with no error, which for a
// backup job is the worst failure mode (a truncated snapshot reporting
// success). None of these tables are near that today, but the fetch loop
// below removes the risk permanently rather than bolting it on later.
const ORDER_COLUMN: Record<string, string> = {
  products: 'id', orders: 'id', order_items: 'id', coupons: 'id',
  settings: 'key', reviews: 'id', spawn_purchases: 'id', batches: 'batch_number',
  harvest_entries: 'id', farm_daily_logs: 'id', ai_settings: 'id',
  b2b_pipeline: 'id', one_off_expenses: 'id', channel_accounts: 'id',
  marketing_metrics: 'id', ad_campaigns: 'id',
};
const BACKUP_TABLES = Object.keys(ORDER_COLUMN);

// ai_settings.api_key is a live LLM provider credential stored in plaintext
// (migration 15) -- redacted here so rolling backups (Storage AND Sheets)
// don't turn into rolling copies of a live secret.
const REDACT: Record<string, string[]> = { ai_settings: ['api_key'] };

function csvCell(value: unknown): string {
  if (value === null || value === undefined) return '';
  const s = typeof value === 'object' ? JSON.stringify(value) : String(value);
  return `"${s.replace(/"/g, '""')}"`; // always quote -- simplest rule that's
                                        // safe across JSONB, TEXT[], Bengali
                                        // text, and free-text notes/addresses
}

function toCsv(table: string, rows: Record<string, unknown>[]): string {
  if (!rows.length) return ''; // 0 rows -> empty file, distinguishable from
                                // a missing file (query failed)
  const headers = Object.keys(rows[0]);
  const redacted = REDACT[table] ?? [];
  const lines = [headers.join(',')];
  for (const row of rows) {
    lines.push(headers.map(h =>
      csvCell(redacted.includes(h) && row[h] ? '[REDACTED]' : row[h])
    ).join(','));
  }
  return lines.join('\n');
}

const PAGE_SIZE = 1000;

// deno-lint-ignore no-explicit-any
async function fetchAllRows(sb: any, table: string): Promise<Record<string, unknown>[]> {
  const all: Record<string, unknown>[] = [];
  let from = 0;
  while (true) {
    const { data, error } = await sb.from(table).select('*')
      .order(ORDER_COLUMN[table])
      .range(from, from + PAGE_SIZE - 1);
    if (error) throw error;
    if (!data?.length) break;
    all.push(...data);
    if (data.length < PAGE_SIZE) break;
    from += PAGE_SIZE;
  }
  return all;
}

interface TableResult {
  table: string;
  ok: boolean;
  rowCount?: number;
  error?: string;
  sheets?: { ok: boolean; error?: string };
}

// deno-lint-ignore no-explicit-any
async function uploadCsvToStorage(sb: any, today: string, table: string, rows: Record<string, unknown>[]): Promise<void> {
  const csv = toCsv(table, rows);
  const { error } = await sb.storage.from('backups')
    .upload(`${today}/${table}.csv`, new Blob([csv], { type: 'text/csv' }), {
      contentType: 'text/csv', upsert: true,
    });
  if (error) throw error;
}

// ── Google Sheets mirror ────────────────────────────────────────────────
// Same service-account JWT technique already live in
// supabase/functions/sync-ga4/index.ts (getAccessToken) -- generalized here
// with a `scope` param since that copy is hardcoded to analytics.readonly.
// No client library needed, no user interaction needed on every run.

const SHEETS_API   = 'https://sheets.googleapis.com/v4/spreadsheets';
const SHEETS_SCOPE = 'https://www.googleapis.com/auth/spreadsheets';

interface SheetsContext { accessToken: string; spreadsheetId: string; }

function base64url(bytes: Uint8Array | string): string {
  const b64 = typeof bytes === 'string' ? btoa(bytes) : btoa(String.fromCharCode(...bytes));
  return b64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

async function getGoogleAccessToken(clientEmail: string, privateKeyPem: string, scope: string): Promise<string> {
  const TOKEN_URL = 'https://oauth2.googleapis.com/token';
  const now = Math.floor(Date.now() / 1000);
  const header = { alg: 'RS256', typ: 'JWT' };
  const claims = { iss: clientEmail, scope, aud: TOKEN_URL, exp: now + 3600, iat: now };
  const unsigned = `${base64url(JSON.stringify(header))}.${base64url(JSON.stringify(claims))}`;

  const pem = privateKeyPem
    .replace('-----BEGIN PRIVATE KEY-----', '')
    .replace('-----END PRIVATE KEY-----', '')
    .replace(/\s/g, '');
  const der = Uint8Array.from(atob(pem), (c) => c.charCodeAt(0));

  const key = await crypto.subtle.importKey(
    'pkcs8', der.buffer, { name: 'RSASSA-PKCS1-v1_5', hash: 'SHA-256' }, false, ['sign'],
  );
  const sig = await crypto.subtle.sign('RSASSA-PKCS1-v1_5', key, new TextEncoder().encode(unsigned));
  const jwt = `${unsigned}.${base64url(new Uint8Array(sig))}`;

  const res = await fetch(TOKEN_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({ grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer', assertion: jwt }),
  });
  const data = await res.json();
  if (!data.access_token) throw new Error(`Google OAuth token exchange failed: ${JSON.stringify(data)}`);
  return data.access_token;
}

// Soft-skip (returns null) if secrets aren't set yet -- same convention as
// CallMeBot's per-recipient key check below -- so the core Storage backup
// keeps working unaffected regardless of whether Sheets is configured.
async function getSheetsContext(): Promise<SheetsContext | null> {
  const clientEmail   = Deno.env.get('GSHEETS_CLIENT_EMAIL');
  const privateKey    = Deno.env.get('GSHEETS_PRIVATE_KEY');
  const spreadsheetId = Deno.env.get('GSHEETS_SPREADSHEET_ID');
  if (!clientEmail || !privateKey || !spreadsheetId) return null;
  try {
    const accessToken = await getGoogleAccessToken(clientEmail, privateKey.replace(/\\n/g, '\n'), SHEETS_SCOPE);
    return { accessToken, spreadsheetId };
  } catch (err) {
    console.error('Google Sheets auth failed, skipping Sheets mirror for this run:', err);
    return null;
  }
}

async function ensureTabsExist(ctx: SheetsContext, tables: string[]): Promise<void> {
  const metaRes = await fetch(`${SHEETS_API}/${ctx.spreadsheetId}?fields=sheets.properties.title`, {
    headers: { Authorization: `Bearer ${ctx.accessToken}` },
  });
  const meta = await metaRes.json();
  if (!metaRes.ok) throw new Error(`Sheets metadata fetch failed: ${JSON.stringify(meta)}`);
  // deno-lint-ignore no-explicit-any
  const existing = new Set((meta.sheets || []).map((s: any) => s.properties.title));
  const missing  = tables.filter(t => !existing.has(t));
  if (!missing.length) return;

  const res = await fetch(`${SHEETS_API}/${ctx.spreadsheetId}:batchUpdate`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${ctx.accessToken}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ requests: missing.map(title => ({ addSheet: { properties: { title } } })) }),
  });
  if (!res.ok) throw new Error(`Sheets addSheet failed: ${JSON.stringify(await res.json())}`);
}

function sheetCellValue(table: string, col: string, value: unknown): unknown {
  if (REDACT[table]?.includes(col) && value) return '[REDACTED]';
  if (value === null || value === undefined) return '';
  if (typeof value === 'object') return JSON.stringify(value);
  return value; // numbers/booleans stay real values -- nicer in a
                // spreadsheet than everything stringified like the CSV
}

async function writeTableToSheet(ctx: SheetsContext, table: string, rows: Record<string, unknown>[]): Promise<void> {
  const headers = rows.length ? Object.keys(rows[0]) : ['(no rows)'];
  const values  = [headers, ...rows.map(row => headers.map(h => sheetCellValue(table, h, row[h])))];

  // Clear first -- a shrinking table would otherwise leave stale rows past
  // the new data's end (values.update only overwrites the cells it sends).
  const clearRes = await fetch(
    `${SHEETS_API}/${ctx.spreadsheetId}/values/${encodeURIComponent(table)}!A1:ZZ100000:clear`,
    { method: 'POST', headers: { Authorization: `Bearer ${ctx.accessToken}` } },
  );
  if (!clearRes.ok) throw new Error(`Sheets clear failed for ${table}: ${JSON.stringify(await clearRes.json())}`);

  const updateRes = await fetch(
    `${SHEETS_API}/${ctx.spreadsheetId}/values/${encodeURIComponent(table)}!A1?valueInputOption=RAW`,
    {
      method: 'PUT',
      headers: { Authorization: `Bearer ${ctx.accessToken}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ values }),
    },
  );
  if (!updateRes.ok) throw new Error(`Sheets write failed for ${table}: ${JSON.stringify(await updateRes.json())}`);
}

// ── Per-table orchestration ──────────────────────────────────────────────
// Fetches each table's rows ONCE and reuses them for both destinations,
// rather than querying the database twice. A Sheets failure is tracked
// separately from `ok` (which stays tied to the Storage backup, the actual
// disaster-recovery guarantee) so a Sheets hiccup never looks like the
// core backup failed.
// deno-lint-ignore no-explicit-any
async function processTable(sb: any, today: string, table: string, sheets: SheetsContext | null): Promise<TableResult> {
  let rows: Record<string, unknown>[];
  try {
    rows = await fetchAllRows(sb, table);
  } catch (err) {
    console.error(`Backup failed for ${table}:`, err);
    return { table, ok: false, error: String(err) };
  }

  try {
    await uploadCsvToStorage(sb, today, table, rows);
  } catch (err) {
    console.error(`Backup failed for ${table}:`, err);
    return { table, ok: false, rowCount: rows.length, error: String(err) };
  }

  const result: TableResult = { table, ok: true, rowCount: rows.length };
  if (sheets) {
    try {
      await writeTableToSheet(sheets, table, rows);
      result.sheets = { ok: true };
    } catch (err) {
      console.error(`Sheets mirror failed for ${table}:`, err);
      result.sheets = { ok: false, error: String(err) };
    }
  }
  return result;
}

const RETENTION_DAYS = 30;

// Storage has no "delete folder" call -- a date-folder is just a key
// prefix, so removing every file under it is the only way to make it
// disappear from list(). Wrapped in its own try/catch and run after the
// backup step so a retention bug can never block or invalidate that day's
// actual backup.
// deno-lint-ignore no-explicit-any
async function pruneOldBackups(sb: any, today: string): Promise<{ foldersRemoved: number; filesRemoved: number; error?: string }> {
  try {
    const cutoff = new Date(today + 'T00:00:00Z');
    cutoff.setUTCDate(cutoff.getUTCDate() - RETENTION_DAYS);
    const cutoffStr = cutoff.toISOString().slice(0, 10);

    const { data: entries, error } = await sb.storage.from('backups')
      .list('', { limit: 1000, sortBy: { column: 'name', order: 'asc' } });
    if (error) throw error;

    const stale = (entries || [])
      .map((e: { name: string }) => e.name)
      .filter((name: string) => /^\d{4}-\d{2}-\d{2}$/.test(name) && name < cutoffStr);

    let foldersRemoved = 0, filesRemoved = 0;
    for (const folder of stale) {
      const { data: files, error: listErr } = await sb.storage.from('backups').list(folder, { limit: 1000 });
      if (listErr) { console.error(`Retention: could not list ${folder}:`, listErr); continue; }
      const paths = (files || []).map((f: { name: string }) => `${folder}/${f.name}`);
      if (paths.length) {
        const { error: rmErr } = await sb.storage.from('backups').remove(paths);
        if (rmErr) { console.error(`Retention: could not remove ${folder}:`, rmErr); continue; }
        filesRemoved += paths.length;
      }
      foldersRemoved++;
    }
    return { foldersRemoved, filesRemoved };
  } catch (err) {
    console.error('Retention sweep failed:', err);
    return { foldersRemoved: 0, filesRemoved: 0, error: String(err) };
  }
}

// Same CallMeBot shape as weekly-report/index.ts -- reused as-is, fired
// only on failure so a working backup stays silent (daily success noise
// would just get ignored, which defeats the point of the alert).
const CALLMEBOT_RECIPIENTS = [
  { phone: '8801970099378', keyEnv: 'CALLMEBOT_KEY_FAHIM' },
  { phone: '8801681884371', keyEnv: 'CALLMEBOT_KEY_SUNNY' },
];

async function sendFailureAlert(today: string, storageFailed: TableResult[], sheetsFailed: TableResult[]): Promise<void> {
  const lines = [`⚠️ SaFa Naturals — Daily Backup`, today, '─────────────────────'];
  if (storageFailed.length) {
    lines.push('Backup FAILED:', ...storageFailed.map(f => `${f.table}: ${f.error}`));
  }
  if (sheetsFailed.length) {
    lines.push('Sheets mirror failed (backup itself is fine):', ...sheetsFailed.map(f => `${f.table}: ${f.sheets?.error}`));
  }
  const msg = lines.join('\n');

  for (const { phone, keyEnv } of CALLMEBOT_RECIPIENTS) {
    const apiKey = Deno.env.get(keyEnv);
    if (!apiKey) continue;
    try {
      await fetch(`https://api.callmebot.com/whatsapp.php?phone=${phone}&text=${encodeURIComponent(msg)}&apikey=${apiKey}`);
    } catch (err) {
      console.error(`CallMeBot send threw for ${phone}:`, err);
    }
  }
}

Deno.serve(async (req) => {
  if (req.method !== 'POST') return new Response('Method not allowed', { status: 405 });

  // Same webhook-secret pattern as weekly-report/order-confirmation-email --
  // set once in Vault as 'order_webhook_secret', reused here.
  const WEBHOOK_SECRET = Deno.env.get('WEBHOOK_SECRET');
  if (WEBHOOK_SECRET && req.headers.get('x-webhook-secret') !== WEBHOOK_SECRET) {
    console.error('Rejected: bad or missing x-webhook-secret header');
    return new Response('Unauthorized', { status: 401 });
  }

  const SUPABASE_URL         = Deno.env.get('SUPABASE_URL')!;
  const SUPABASE_SERVICE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
  const sb = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

  const today = dhakaTodayISO();

  const sheets = await getSheetsContext();
  if (sheets) {
    try {
      await ensureTabsExist(sheets, BACKUP_TABLES);
    } catch (err) {
      console.error('Sheets ensureTabsExist failed, skipping Sheets mirror for this run:', err);
    }
  }

  const results       = await Promise.all(BACKUP_TABLES.map(table => processTable(sb, today, table, sheets)));
  const storageFailed = results.filter(r => !r.ok);
  const sheetsFailed  = results.filter(r => r.sheets && !r.sheets.ok);

  const retention = await pruneOldBackups(sb, today);

  if (storageFailed.length || sheetsFailed.length) await sendFailureAlert(today, storageFailed, sheetsFailed);

  console.log(`Daily backup ${today}: ${results.length - storageFailed.length}/${results.length} tables ok` +
    (sheets ? `, sheets ${results.length - sheetsFailed.length}/${results.length} ok` : ', sheets not configured') +
    `, retention removed ${retention.foldersRemoved} folder(s)/${retention.filesRemoved} file(s)`);

  return new Response(JSON.stringify({ date: today, tables: results, retention, sheetsConfigured: !!sheets }), {
    status: storageFailed.length ? 500 : 200,
    headers: { 'Content-Type': 'application/json' },
  });
});
