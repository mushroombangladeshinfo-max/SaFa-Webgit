/* ============================================================
   src/admin-nav.js
   Shared admin navigation — mounted on every admin page.
   Usage:
     import { mountAdminNav } from '/src/admin-nav.js';
     // After auth resolves:
     mountAdminNav({ page: 'orders', supabase, email: 'you@example.com' });
   page values: 'orders' | 'customers' | 'products' | 'expenses' | 'pipeline' | 'farm'
============================================================ */

import { founderName } from './admin-auth.js';

const NAV_LINKS = [
  { key: 'home',      href: 'home.html',      label: 'Overview',  icon: '🏠' },
  { key: 'orders',    href: 'orders.html',     label: 'Orders',    icon: '📦' },
  { key: 'customers', href: 'customers.html',  label: 'Customers', icon: '👤' },
  { key: 'products',  href: 'products.html',   label: 'Products',  icon: '🍄' },
  { key: 'expenses',  href: 'expenses.html',   label: 'Expenses',  icon: '💰' },
  { key: 'pipeline',  href: 'pipeline.html',   label: 'B2B',       icon: '🤝' },
  { key: 'insights',  href: 'insights.html',   label: 'Insights',  icon: '📊' },
];

const FARM_LINKS = [
  { href: 'quick-log.html',      label: '⚡ Quick Log'      },
  { href: 'farm-analytics.html', label: '📈 Farm Analytics' },
  { href: 'dashboard.html',      label: '📡 IoT Dashboard'  },
];

/* Searchable via Cmd+K palette — every backend destination in one place,
   with keyword aliases so e.g. "sales" finds Orders. */
const SEARCH_INDEX = [
  { href: 'home.html',           label: 'Overview',       icon: '🏠', hint: 'Dashboard & KPIs',        keywords: 'home dashboard summary kpi' },
  { href: 'orders.html',          label: 'Orders',         icon: '📦', hint: 'Manage customer orders',   keywords: 'sales orders shipping fulfillment' },
  { href: 'customers.html',      label: 'Customers',      icon: '👤', hint: 'Customer directory',       keywords: 'customers users contacts crm' },
  { href: 'products.html',       label: 'Products',       icon: '🍄', hint: 'Catalog & inventory',      keywords: 'products catalog inventory stock' },
  { href: 'expenses.html',       label: 'Expenses',       icon: '💰', hint: 'Costs & P&L',              keywords: 'expenses costs finance pnl profit loss' },
  { href: 'pipeline.html',       label: 'B2B',            icon: '🤝', hint: 'Wholesale pipeline',       keywords: 'b2b pipeline wholesale deals leads' },
  { href: 'insights.html',       label: 'Insights',       icon: '📊', hint: 'AI analyst & trends',      keywords: 'insights analytics ai reports trends' },
  { href: 'quick-log.html',      label: 'Quick Log',      icon: '⚡', hint: 'Mobile daily farm log',    keywords: 'quick log daily farm mobile harvest' },
  { href: 'farm-analytics.html', label: 'Farm Analytics',  icon: '📈', hint: 'Growth & yield charts',    keywords: 'farm analytics yield growth charts' },
  { href: 'dashboard.html',      label: 'IoT Dashboard',  icon: '📡', hint: 'Simulated sensor preview', keywords: 'iot dashboard sensors demo' },
];

function injectStyles() {
  if (document.getElementById('admin-nav-styles')) return;
  const s = document.createElement('style');
  s.id = 'admin-nav-styles';
  s.textContent = `
    .an{background:#0d1f12;border-bottom:1px solid rgba(255,255,255,.07);height:56px;display:flex;align-items:center;padding:0 24px;gap:16px;position:sticky;top:0;z-index:200;font-family:'DM Sans',sans-serif;}
    .an-logo{display:flex;align-items:center;gap:6px;text-decoration:none;flex-shrink:0;}
    .an-logo-main{font-family:'Syne',sans-serif;font-size:15px;font-weight:700;color:#f5efe6;}
    .an-logo-dot{color:rgba(196,154,60,.6);font-size:13px;}
    .an-logo-sub{font-family:'Syne',sans-serif;font-size:9px;font-weight:700;letter-spacing:.18em;text-transform:uppercase;color:rgba(245,239,230,.35);}
    .an-logo-pill{font-family:'Syne',sans-serif;font-size:8px;font-weight:700;letter-spacing:.14em;text-transform:uppercase;background:rgba(196,154,60,.1);border:1px solid rgba(196,154,60,.22);color:#c49a3c;border-radius:20px;padding:2px 8px;margin-left:4px;}
    .an-sep{width:1px;height:20px;background:rgba(255,255,255,.08);flex-shrink:0;}
    .an-links{display:flex;align-items:center;gap:2px;flex:1;}
    .an-link{display:inline-flex;align-items:center;gap:5px;padding:6px 11px;border-radius:6px;font-family:'Syne',sans-serif;font-size:9px;font-weight:700;letter-spacing:.12em;text-transform:uppercase;color:rgba(245,239,230,.38);text-decoration:none;background:none;border:none;cursor:pointer;transition:color .18s,background .18s;white-space:nowrap;}
    .an-link:hover{color:rgba(245,239,230,.85);background:rgba(255,255,255,.06);}
    .an-link.active{color:#c49a3c;background:rgba(196,154,60,.1);}
    .an-link-icon{font-size:11px;}
    /* Dropdown */
    .an-drop{position:relative;}
    .an-drop-trigger{display:inline-flex;align-items:center;gap:5px;padding:6px 11px;border-radius:6px;font-family:'Syne',sans-serif;font-size:9px;font-weight:700;letter-spacing:.12em;text-transform:uppercase;color:rgba(245,239,230,.38);background:none;border:none;cursor:pointer;transition:color .18s,background .18s;white-space:nowrap;}
    .an-drop-trigger:hover,.an-drop-trigger.open{color:rgba(245,239,230,.85);background:rgba(255,255,255,.06);}
    .an-drop-trigger svg{transition:transform .2s;}
    .an-drop-trigger.open svg{transform:rotate(180deg);}
    .an-drop-menu{position:absolute;top:calc(100% + 6px);left:0;background:#0d1f12;border:1px solid rgba(255,255,255,.1);border-radius:8px;padding:6px;min-width:180px;display:none;flex-direction:column;gap:2px;box-shadow:0 8px 32px rgba(0,0,0,.5);z-index:300;}
    .an-drop-menu.open{display:flex;}
    .an-drop-menu a{display:block;padding:8px 12px;border-radius:5px;font-family:'DM Sans',sans-serif;font-size:13px;color:rgba(245,239,230,.7);text-decoration:none;transition:background .15s,color .15s;}
    .an-drop-menu a:hover{background:rgba(255,255,255,.07);color:#f5efe6;}
    /* Search / command palette */
    .an-search-btn{display:inline-flex;align-items:center;gap:8px;background:rgba(255,255,255,.04);border:1px solid rgba(255,255,255,.08);border-radius:7px;padding:6px 8px 6px 10px;cursor:pointer;color:rgba(245,239,230,.35);font-family:'DM Sans',sans-serif;font-size:12px;transition:background .18s,border-color .18s,color .18s;flex-shrink:0;}
    .an-search-btn:hover{background:rgba(255,255,255,.08);border-color:rgba(255,255,255,.14);color:rgba(245,239,230,.6);}
    .an-search-btn svg{flex-shrink:0;}
    .an-search-label{white-space:nowrap;}
    .an-search-kbd{font-family:'DM Mono',monospace;font-size:10px;background:rgba(255,255,255,.07);border:1px solid rgba(255,255,255,.1);border-radius:4px;padding:1px 5px;color:rgba(245,239,230,.4);}
    @media(max-width:900px){.an-search-label,.an-search-kbd{display:none;}.an-search-btn{padding:6px;}}
    .an-palette-overlay{display:none;position:fixed;inset:0;background:rgba(6,12,8,.65);backdrop-filter:blur(3px);z-index:500;align-items:flex-start;justify-content:center;padding:12vh 16px 0;}
    .an-palette-overlay.open{display:flex;}
    .an-palette{width:100%;max-width:560px;background:#101f14;border:1px solid rgba(255,255,255,.1);border-radius:12px;box-shadow:0 20px 60px rgba(0,0,0,.55);overflow:hidden;font-family:'DM Sans',sans-serif;}
    .an-palette-input-wrap{display:flex;align-items:center;gap:10px;padding:14px 16px;border-bottom:1px solid rgba(255,255,255,.08);}
    .an-palette-input-wrap svg{flex-shrink:0;color:rgba(245,239,230,.35);}
    .an-palette-input{flex:1;background:none;border:none;outline:none;color:#f5efe6;font-family:'DM Sans',sans-serif;font-size:15px;}
    .an-palette-input::placeholder{color:rgba(245,239,230,.3);}
    .an-palette-esc{font-family:'DM Mono',monospace;font-size:10px;background:rgba(255,255,255,.07);border:1px solid rgba(255,255,255,.1);border-radius:4px;padding:2px 6px;color:rgba(245,239,230,.35);flex-shrink:0;}
    .an-palette-list{max-height:52vh;overflow-y:auto;padding:6px;}
    .an-palette-item{display:flex;align-items:center;gap:12px;padding:10px 12px;border-radius:8px;cursor:pointer;text-decoration:none;color:#f5efe6;}
    .an-palette-item.active{background:rgba(196,154,60,.14);}
    .an-palette-item-icon{font-size:16px;flex-shrink:0;width:22px;text-align:center;}
    .an-palette-item-label{font-size:13.5px;font-weight:600;}
    .an-palette-item-hint{font-size:11.5px;color:rgba(245,239,230,.35);margin-top:1px;}
    .an-palette-empty{padding:24px 16px;text-align:center;color:rgba(245,239,230,.35);font-size:13px;}
    /* Right side */
    .an-right{display:flex;align-items:center;gap:8px;margin-left:auto;flex-shrink:0;}
    .an-dot{width:6px;height:6px;border-radius:50%;background:#5fcf80;flex-shrink:0;animation:an-pulse 2.4s ease-in-out infinite;}
    @keyframes an-pulse{0%,100%{box-shadow:0 0 0 0 rgba(95,207,128,.5)}50%{box-shadow:0 0 0 4px rgba(95,207,128,0)}}
    .an-email{font-family:'DM Mono',monospace;font-size:10px;color:rgba(245,239,230,.28);}
    .an-user{display:flex;align-items:center;gap:7px;}
    .an-avatar{width:22px;height:22px;border-radius:50%;background:rgba(196,154,60,.16);border:1px solid rgba(196,154,60,.3);color:#c49a3c;font-family:'Syne',sans-serif;font-size:9px;font-weight:700;display:flex;align-items:center;justify-content:center;flex-shrink:0;}
    .an-name{font-family:'DM Sans',sans-serif;font-size:11.5px;color:rgba(245,239,230,.6);white-space:nowrap;}
    @media(max-width:900px){.an-name{display:none;}}
    .an-last{font-family:'DM Sans',sans-serif;font-size:10px;color:rgba(245,239,230,.28);white-space:nowrap;}
    .an-logout{font-family:'Syne',sans-serif;font-size:9px;font-weight:700;letter-spacing:.1em;text-transform:uppercase;background:none;border:none;color:rgba(245,239,230,.25);cursor:pointer;padding:5px 8px;border-radius:5px;transition:color .18s;}
    .an-logout:hover{color:rgba(245,239,230,.7);}
    /* Hamburger */
    .an-burger{display:none;flex-direction:column;gap:4px;background:none;border:none;cursor:pointer;padding:6px;margin-left:auto;}
    .an-burger span{display:block;width:18px;height:2px;background:rgba(245,239,230,.6);border-radius:2px;transition:all .2s;}
    /* Mobile drawer */
    .an-mobile-drawer{display:none;position:fixed;inset:56px 0 0 0;background:#0a1a0f;z-index:190;padding:16px;flex-direction:column;gap:4px;overflow-y:auto;}
    .an-mobile-drawer.open{display:flex;}
    .an-mobile-drawer .an-link{font-size:13px;letter-spacing:.06em;padding:12px 16px;border-radius:8px;width:100%;}
    .an-mobile-drawer .an-link-icon{font-size:16px;}
    .an-mobile-drawer .an-drop-menu{position:static;display:flex;flex-direction:column;background:rgba(255,255,255,.03);border:1px solid rgba(255,255,255,.06);margin-top:4px;}
    @media(max-width:900px){
      .an-links,.an-sep:first-of-type,.an-email,.an-last{display:none!important;}
      .an-burger{display:flex;}
      .an-right .an-logout{display:none;}
    }
  `;
  document.head.appendChild(s);
}

export function mountAdminNav({ page, supabase, email, lastLogin }) {
  injectStyles();

  const name = founderName(email);
  const initials = name.includes('&') ? 'F·S' : name.charAt(0);

  /* Idempotent: tear down any previously-mounted copy first. Auth flows
     commonly fire checkAuth()-style re-entry more than once (an explicit
     post-login call plus the SIGNED_IN listener, or a cached session
     firing SIGNED_IN on page load) — without this guard, a second call
     stacks a duplicate header instead of replacing the first. */
  document.querySelector('header.an')?.remove();
  document.getElementById('an-mobile-drawer')?.remove();
  document.getElementById('an-palette-overlay')?.remove();

  /* ── Build topbar HTML ── */
  const navLinksHTML = NAV_LINKS.map(l => `
    <a href="${l.href}" class="an-link${page === l.key ? ' active' : ''}" aria-current="${page === l.key ? 'page' : 'false'}">
      <span class="an-link-icon">${l.icon}</span>${l.label}
    </a>`).join('');

  const farmLinksHTML = FARM_LINKS.map(l =>
    `<a href="${l.href}">${l.label}</a>`
  ).join('');

  const html = `
    <header class="an" role="banner">
      <a href="home.html" class="an-logo">
        <span class="an-logo-main">SaFa</span>
        <span class="an-logo-dot">·</span>
        <span class="an-logo-sub">Naturals</span>
        <span class="an-logo-pill">Admin</span>
      </a>
      <div class="an-sep" aria-hidden="true"></div>
      <nav class="an-links" aria-label="Admin navigation">
        ${navLinksHTML}
        <div class="an-drop">
          <button type="button" class="an-drop-trigger" id="an-farm-btn" aria-haspopup="true" aria-expanded="false">
            <span class="an-link-icon">🌿</span>Farm
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" aria-hidden="true"><polyline points="6 9 12 15 18 9"/></svg>
          </button>
          <div class="an-drop-menu" id="an-farm-menu" role="menu">
            ${farmLinksHTML}
          </div>
        </div>
      </nav>
      <div class="an-right">
        <button type="button" class="an-search-btn" id="an-search-btn" aria-label="Search (Cmd+K)">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.3" aria-hidden="true"><circle cx="11" cy="11" r="7"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
          <span class="an-search-label">Search</span>
          <span class="an-search-kbd">⌘K</span>
        </button>
        ${lastLogin ? `<span class="an-last">${lastLogin}</span>` : ''}
        <span class="an-dot" title="Live"></span>
        <span class="an-user" title="${email || ''}">
          <span class="an-avatar">${initials}</span>
          <span class="an-name">${name}</span>
        </span>
        <button type="button" class="an-logout" id="an-logout-btn">Log Out</button>
      </div>
      <button type="button" class="an-burger" id="an-burger" aria-label="Menu" aria-expanded="false">
        <span></span><span></span><span></span>
      </button>
    </header>
    <!-- Mobile drawer -->
    <div class="an-mobile-drawer" id="an-mobile-drawer" role="navigation" aria-label="Mobile navigation">
      ${NAV_LINKS.map(l => `
        <a href="${l.href}" class="an-link${page === l.key ? ' active' : ''}">
          <span class="an-link-icon">${l.icon}</span>${l.label}
        </a>`).join('')}
      <div style="height:1px;background:rgba(255,255,255,.06);margin:8px 0;"></div>
      <div style="font-family:'Syne',sans-serif;font-size:9px;font-weight:700;letter-spacing:.14em;text-transform:uppercase;color:rgba(245,239,230,.2);padding:4px 16px;">Farm Tools</div>
      ${FARM_LINKS.map(l => `<a href="${l.href}" class="an-link" style="letter-spacing:0;font-family:'DM Sans',sans-serif;font-size:13px;font-weight:400;text-transform:none;">${l.label}</a>`).join('')}
      <div style="height:1px;background:rgba(255,255,255,.06);margin:8px 0;"></div>
      <button type="button" class="an-link" id="an-logout-mobile" style="color:rgba(245,239,230,.4);">Log Out</button>
    </div>
    <!-- Command palette -->
    <div class="an-palette-overlay" id="an-palette-overlay" role="dialog" aria-modal="true" aria-label="Search admin pages">
      <div class="an-palette">
        <div class="an-palette-input-wrap">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.3" aria-hidden="true"><circle cx="11" cy="11" r="7"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
          <input type="text" class="an-palette-input" id="an-palette-input" placeholder="Jump to a page…" autocomplete="off" spellcheck="false">
          <span class="an-palette-esc">ESC</span>
        </div>
        <div class="an-palette-list" id="an-palette-list"></div>
      </div>
    </div>`;

  /* ── Mount ── */
  const wrap = document.createElement('div');
  wrap.innerHTML = html;
  document.body.prepend(...wrap.children);

  /* ── Farm dropdown ── */
  const farmBtn  = document.getElementById('an-farm-btn');
  const farmMenu = document.getElementById('an-farm-menu');
  farmBtn?.addEventListener('click', (e) => {
    e.stopPropagation();
    const open = farmMenu.classList.toggle('open');
    farmBtn.classList.toggle('open', open);
    farmBtn.setAttribute('aria-expanded', open);
  });
  document.addEventListener('click', () => {
    farmMenu?.classList.remove('open');
    farmBtn?.classList.remove('open');
    farmBtn?.setAttribute('aria-expanded', 'false');
  });

  /* ── Mobile hamburger ── */
  const burger = document.getElementById('an-burger');
  const drawer = document.getElementById('an-mobile-drawer');
  burger?.addEventListener('click', () => {
    const open = drawer.classList.toggle('open');
    burger.setAttribute('aria-expanded', open);
  });

  /* ── Logout ── */
  async function doLogout() {
    await supabase.auth.signOut();
    window.location.href = 'orders.html';
  }
  document.getElementById('an-logout-btn')?.addEventListener('click', doLogout);
  document.getElementById('an-logout-mobile')?.addEventListener('click', doLogout);

  /* ── Command palette (Cmd/Ctrl+K) ── */
  const overlay   = document.getElementById('an-palette-overlay');
  const input     = document.getElementById('an-palette-input');
  const list      = document.getElementById('an-palette-list');
  let results     = SEARCH_INDEX.filter(p => p.href !== currentFile());
  let activeIndex = 0;

  function currentFile() {
    return location.pathname.split('/').pop() || 'home.html';
  }

  function renderResults() {
    if (!results.length) {
      list.innerHTML = `<div class="an-palette-empty">No pages match that search.</div>`;
      return;
    }
    list.innerHTML = results.map((p, i) => `
      <a href="${p.href}" class="an-palette-item${i === activeIndex ? ' active' : ''}" data-idx="${i}">
        <span class="an-palette-item-icon">${p.icon}</span>
        <span>
          <div class="an-palette-item-label">${p.label}</div>
          <div class="an-palette-item-hint">${p.hint}</div>
        </span>
      </a>`).join('');
  }

  function filterResults(query) {
    const q = query.trim().toLowerCase();
    const pool = SEARCH_INDEX.filter(p => p.href !== currentFile());
    results = !q ? pool : pool.filter(p =>
      p.label.toLowerCase().includes(q) || p.keywords.includes(q) ||
      q.split(/\s+/).every(term => p.keywords.includes(term) || p.label.toLowerCase().includes(term))
    );
    activeIndex = 0;
    renderResults();
  }

  function openPalette() {
    overlay.classList.add('open');
    input.value = '';
    filterResults('');
    setTimeout(() => input.focus(), 0);
  }
  function closePalette() {
    overlay.classList.remove('open');
  }

  document.getElementById('an-search-btn')?.addEventListener('click', openPalette);

  document.addEventListener('keydown', (e) => {
    const isCmdK = (e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k';
    if (isCmdK) {
      e.preventDefault();
      overlay.classList.contains('open') ? closePalette() : openPalette();
    } else if (e.key === 'Escape' && overlay.classList.contains('open')) {
      closePalette();
    }
  });

  overlay.addEventListener('mousedown', (e) => {
    if (e.target === overlay) closePalette();
  });

  input.addEventListener('input', () => filterResults(input.value));

  input.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (results.length) { activeIndex = (activeIndex + 1) % results.length; renderResults(); }
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (results.length) { activeIndex = (activeIndex - 1 + results.length) % results.length; renderResults(); }
    } else if (e.key === 'Enter') {
      e.preventDefault();
      const target = results[activeIndex];
      if (target) window.location.href = target.href;
    }
  });

  list.addEventListener('mousemove', (e) => {
    const item = e.target.closest('.an-palette-item');
    if (!item) return;
    const idx = Number(item.dataset.idx);
    if (idx !== activeIndex) { activeIndex = idx; renderResults(); }
  });
}
