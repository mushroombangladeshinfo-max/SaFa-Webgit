/* ============================================================
   src/date-utils.js
   SaFa Naturals — Shared local-date helper
   ─────────────────────────────────────────────────────────
   Never use Date.toISOString().slice(0,10) to get a "Y-M-D" string.
   toISOString() always converts to UTC, which silently shifts the
   date backward for any timezone ahead of UTC (Bangladesh is +6) —
   between midnight and 6am local time, it returns YESTERDAY's date.
   This corrupts "today"/date-range filters, log_date defaults, and
   day-bucket grouping in exactly the way that's hard to notice until
   someone enters data in the early morning and it lands on the wrong day.
============================================================ */

/** Local 'YYYY-MM-DD' for a Date (defaults to now). */
export function localDateStr(d = new Date()) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

/** Local 'YYYY-MM-DD' for N days ago (0 = today). */
export function daysAgoStr(n) {
  const d = new Date();
  d.setDate(d.getDate() - n);
  return localDateStr(d);
}
