/* ============================================================
   src/filter-state.js
   Shared filter helpers — the commercial-dashboard pattern
   (Stripe/Linear/Shopify Admin): filter state lives in the URL query
   string, so a filtered view is shareable, bookmarkable, and survives
   a page refresh instead of silently resetting.
============================================================ */

/** Read filter values from the current URL, falling back to defaults
 *  for anything not present in the query string. */
export function readFiltersFromURL(defaults) {
  const params = new URLSearchParams(location.search);
  const state = { ...defaults };
  for (const key of Object.keys(defaults)) {
    if (params.has(key)) state[key] = params.get(key);
  }
  return state;
}

/** Write filter values into the URL (replaces the current history entry —
 *  no new entry per keystroke, and no page reload). Keys equal to their
 *  default are omitted, so the URL stays clean when nothing's filtered.
 *  Merges with whatever's already in the URL rather than rebuilding from
 *  scratch, so a page with more than one independent filter group (e.g.
 *  a date range AND a separate period selector) doesn't have each group's
 *  sync call erase the other's params. */
export function writeFiltersToURL(state, defaults) {
  const params = new URLSearchParams(location.search);
  for (const [key, val] of Object.entries(state)) {
    if (val !== undefined && val !== null && val !== '' && val !== defaults[key]) {
      params.set(key, val);
    } else {
      params.delete(key);
    }
  }
  const qs = params.toString();
  history.replaceState(null, '', qs ? `?${qs}` : location.pathname);
}

/** Delays calling fn until `wait` ms after the last call — standard
 *  debounce for search-as-you-type inputs. */
export function debounce(fn, wait = 300) {
  let t;
  return (...args) => { clearTimeout(t); t = setTimeout(() => fn(...args), wait); };
}

/** Local 'YYYY-MM-DD' for a Date (defaults to now) — used by the
 *  quick date-range presets (Today / This Week / This Month / This Year). */
function localDateStr(d = new Date()) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

/** Standard date-range presets, each returning { from, to } as local
 *  Y-M-D strings. Shared across every page with a date filter so the
 *  preset list and its math stay identical everywhere. */
export const DATE_PRESETS = {
  today:     () => { const t = localDateStr(); return { from: t, to: t }; },
  yesterday: () => { const d = new Date(); d.setDate(d.getDate() - 1); const s = localDateStr(d); return { from: s, to: s }; },
  this_week: () => {
    const now = new Date(); const dow = now.getDay();
    const mon = new Date(now); mon.setDate(mon.getDate() - (dow === 0 ? 6 : dow - 1));
    return { from: localDateStr(mon), to: localDateStr() };
  },
  this_month: () => {
    const now = new Date();
    return { from: `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-01`, to: localDateStr() };
  },
  this_year: () => {
    const now = new Date();
    return { from: `${now.getFullYear()}-01-01`, to: localDateStr() };
  },
};
