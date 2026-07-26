/* ============================================================
   src/realtime.js
   Shared Supabase Realtime helper — subscribes to Postgres change
   events on one or more tables and calls a debounced refresh
   callback, instead of every page rolling its own subscription
   boilerplate (or worse, polling on a timer).

   Two things a naive realtime hookup usually gets wrong, handled here:
   - A burst of changes (e.g. a batch import) shouldn't re-fetch once
     per row — debounced to a single refresh after things settle.
   - Firing a refresh while the user is mid-edit (typing in a form,
     an add/edit modal open) can blow away unsaved input. Checked via
     document.activeElement rather than per-page modal-class knowledge,
     so it works the same way on every page without extra wiring.
============================================================ */

function isUserEditing() {
  const el = document.activeElement;
  if (!el) return false;
  const tag = el.tagName;
  return tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT' || el.isContentEditable === true;
}

/**
 * @param {SupabaseClient} supabase
 * @param {string} channelName  unique per page, e.g. 'home-live'
 * @param {string[]} tables     table names to watch, e.g. ['orders','farm_daily_logs']
 * @param {() => void} onChange called (debounced) after any INSERT/UPDATE/DELETE on those tables
 * @param {{ debounceMs?: number, indicatorId?: string }} [opts]
 * @returns the Supabase channel (call supabase.removeChannel(channel) to stop listening)
 */
export function subscribeRealtime(supabase, channelName, tables, onChange, opts = {}) {
  const { debounceMs = 800, indicatorId } = opts;
  let timer;

  function attemptFire() {
    if (isUserEditing()) { timer = setTimeout(attemptFire, debounceMs); return; }
    onChange();
    flashIndicator(indicatorId);
  }
  function trigger() {
    clearTimeout(timer);
    timer = setTimeout(attemptFire, debounceMs);
  }

  const channel = supabase.channel(channelName);
  tables.forEach(table => {
    channel.on('postgres_changes', { event: '*', schema: 'public', table }, trigger);
  });
  channel.subscribe(status => {
    const el = indicatorId && document.getElementById(indicatorId);
    if (!el) return;
    el.classList.toggle('rt-connected', status === 'SUBSCRIBED');
  });

  return channel;
}

function flashIndicator(indicatorId) {
  if (!indicatorId) return;
  const el = document.getElementById(indicatorId);
  if (!el) return;
  el.classList.add('rt-flash');
  setTimeout(() => el.classList.remove('rt-flash'), 700);
}

/** Inline CSS for the <span id="..." class="rt-indicator"><span class="rt-dot"></span>Live</span>
 *  markup — inject once per page via injectRealtimeStyles(). */
export function injectRealtimeStyles() {
  if (document.getElementById('rt-styles')) return;
  const s = document.createElement('style');
  s.id = 'rt-styles';
  s.textContent = `
    .rt-indicator{display:inline-flex;align-items:center;gap:5px;font-family:'Syne','Hind Siliguri',sans-serif;font-size:9px;font-weight:700;letter-spacing:.1em;text-transform:uppercase;color:rgba(245,239,230,.3);transition:color .3s;}
    .rt-dot{width:6px;height:6px;border-radius:50%;background:rgba(245,239,230,.2);flex-shrink:0;transition:background .3s;}
    .rt-indicator.rt-connected{color:#5fcf80;}
    .rt-indicator.rt-connected .rt-dot{background:#5fcf80;animation:rt-pulse 2.4s ease-in-out infinite;}
    .rt-indicator.rt-flash{color:#d9b254;}
    .rt-indicator.rt-flash .rt-dot{background:#d9b254!important;animation:none;}
    @keyframes rt-pulse{0%,100%{box-shadow:0 0 0 0 rgba(95,207,128,.5)}50%{box-shadow:0 0 0 4px rgba(95,207,128,0)}}
  `;
  document.head.appendChild(s);
}
