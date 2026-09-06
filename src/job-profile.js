/* ============================================================
   src/job-profile.js
   Multi-profile support for the Job Search Command Center — lets more
   than one person's job search (or the same person's separate career
   tracks) be tracked side by side without mixing data. Which profile is
   "active" is a per-browser convenience stored in localStorage, not a
   URL param or server-side session: it's an organizational choice, not
   an access-control boundary (every profile-scoped table still only
   carries the site's usual is_admin() RLS), so there was no need to make
   ~40 existing internal links across the module profile-aware.
============================================================ */

import { escapeHtml } from './html-utils.js';

const STORAGE_KEY = 'jobActiveProfileId';

export function getActiveProfileId() {
  const v = localStorage.getItem(STORAGE_KEY);
  return v ? +v : null;
}
export function setActiveProfileId(id) {
  localStorage.setItem(STORAGE_KEY, String(id));
}

export async function loadProfiles(supabase) {
  const { data } = await supabase.from('job_profiles').select('id,profile_name').order('profile_name');
  return data || [];
}

/** Resolves the working active profile id: validates the stored id still
 *  exists, falls back to the first available profile if not (or null if
 *  there are genuinely zero profiles — shouldn't happen post-migration,
 *  since one is always created, but the Profiles UI on job-settings.html
 *  also refuses to delete the last one). */
export async function ensureActiveProfileId(supabase) {
  const profiles = await loadProfiles(supabase);
  if (!profiles.length) return null;
  const stored = getActiveProfileId();
  if (stored && profiles.some(p => p.id === stored)) return stored;
  setActiveProfileId(profiles[0].id);
  return profiles[0].id;
}

/** Injects the switcher's own CSS once per page — same idempotent pattern
 *  as realtime.js's injectRealtimeStyles(), so no page needs its own copy
 *  of these rules in its <style> block. */
export function injectProfileSwitcherStyles() {
  if (document.getElementById('profile-switcher-styles')) return;
  const s = document.createElement('style');
  s.id = 'profile-switcher-styles';
  s.textContent = `
    .profile-switcher-bar{display:flex;align-items:center;gap:8px;margin-bottom:16px;}
    .profile-switcher-bar select{background:#0d1f12;border:1px solid rgba(255,255,255,.07);border-radius:6px;color:#f5efe6;font-family:'DM Sans','Hind Siliguri',sans-serif;font-size:13px;padding:7px 10px;outline:none;}
    .profile-switcher-bar select:focus{border-color:rgba(196,154,60,.5);}
    .profile-switcher-bar button{font-family:'Syne','Hind Siliguri',sans-serif;font-size:10px;font-weight:700;letter-spacing:.1em;text-transform:uppercase;padding:7px 12px;border-radius:6px;border:1px solid rgba(255,255,255,.07);background:rgba(196,154,60,.1);color:#c49a3c;cursor:pointer;}
    .profile-switcher-bar button:hover{background:rgba(196,154,60,.18);}
  `;
  document.head.appendChild(s);
}

/** Renders the small always-visible switcher bar into `containerEl` and
 *  wires it up. `onSwitch()` is called (no args) whenever the user picks
 *  a different profile or creates a new one — the page's own load(). */
export async function renderProfileSwitcher(supabase, containerEl, onSwitch) {
  injectProfileSwitcherStyles();
  containerEl.className = 'profile-switcher-bar';
  const profiles = await loadProfiles(supabase);
  const activeId = getActiveProfileId();
  containerEl.innerHTML = `
    <select id="profile-switcher-select" aria-label="Active profile">
      ${profiles.map(p => `<option value="${p.id}" ${p.id===activeId?'selected':''}>${escapeHtml(p.profile_name)}</option>`).join('')}
    </select>
    <button type="button" id="profile-switcher-new">+ New Profile</button>
  `;
  containerEl.querySelector('#profile-switcher-select').addEventListener('change', (e) => {
    setActiveProfileId(+e.target.value);
    onSwitch();
  });
  containerEl.querySelector('#profile-switcher-new').addEventListener('click', async () => {
    const name = prompt('Name for the new profile (e.g. "My Job Search", "Sunny\'s Search"):');
    if (!name || !name.trim()) return;
    const { data, error } = await supabase.from('job_profiles').insert([{ profile_name: name.trim() }]).select().single();
    if (error) { alert(error.message); return; }
    setActiveProfileId(data.id);
    onSwitch();
    renderProfileSwitcher(supabase, containerEl, onSwitch);
  });
}

