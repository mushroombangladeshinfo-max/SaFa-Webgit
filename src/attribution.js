/* ============================================================
   src/attribution.js
   SaFa Naturals — Order Attribution (UTM capture)
   ─────────────────────────────────────────────────────────
   Solves the "which channel actually drove this order" gap:
   marketing_metrics tells you aggregate channel performance,
   GA4 tells you self-reported conversions, but neither one lets
   you point at a specific row in `orders` and say which channel
   drove it. This does that, by capturing UTM params off the URL
   and carrying them through to checkout.

   Attribution model: LAST-TOUCH. If a new visit arrives with UTM
   params, they overwrite whatever was stored before (matches how
   Meta/Google Ads report their own "conversions", so your numbers
   are comparable). Visits with no UTM params (e.g. clicking around
   the site) never erase existing attribution.

   Call captureAttribution() once per page load (main.js does this).
   Call getAttribution() at checkout to read the stored values.
============================================================ */

const STORAGE_KEY = 'safaAttribution';

/** Reads utm_source/utm_medium/utm_campaign off the current URL, if
 *  present, and stores them (overwriting any previous attribution). */
export function captureAttribution() {
  const params = new URLSearchParams(window.location.search);
  const source   = params.get('utm_source');
  const medium   = params.get('utm_medium');
  const campaign = params.get('utm_campaign');

  if (!source && !medium && !campaign) return; // nothing to capture this visit

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({
      utm_source:   source   || null,
      utm_medium:   medium   || null,
      utm_campaign: campaign || null,
      captured_at:  new Date().toISOString(),
      landing_page: window.location.pathname,
    }));
  } catch { /* localStorage unavailable (private browsing etc.) — attribution just won't persist */ }
}

/** Reads back whatever attribution is currently stored, for attaching
 *  to an order at checkout. Returns nulls if nothing was ever captured
 *  (e.g. a direct/organic visit with no UTM params, ever). */
export function getAttribution() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { utm_source: null, utm_medium: null, utm_campaign: null };
    const d = JSON.parse(raw);
    return { utm_source: d.utm_source, utm_medium: d.utm_medium, utm_campaign: d.utm_campaign };
  } catch {
    return { utm_source: null, utm_medium: null, utm_campaign: null };
  }
}
