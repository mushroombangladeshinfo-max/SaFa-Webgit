/* ============================================================
   src/admin-nav.js
   Shared admin navigation — mounted on every admin page.
   Usage:
     import { mountAdminNav } from '/src/admin-nav.js';
     // After auth resolves:
     mountAdminNav({ page: 'orders', supabase, email: 'you@example.com' });
   page values: 'orders' | 'customers' | 'products' | 'expenses' | 'pipeline' | 'farm'
============================================================ */

const NAV_LINKS = [
  { key: 'orders',    href: 'admin.html',     label: 'Orders',    icon: '📦' },
  { key: 'customers', href: 'customers.html',  label: 'Customers', icon: '👤' },
  { key: 'products',  href: 'products.html',   label: 'Products',  icon: '🍄' },
  { key: 'expenses',  href: 'expenses.html',   label: 'Expenses',  icon: '💰' },
  { key: 'pipeline',  href: 'pipeline.html',   label: 'Pipeline',  icon: '🤝' },
];

const FARM_LINKS = [
  { href: 'quick-log.html',      label: '⚡ Quick Log'      },
  { href: 'farm-log.html',       label: '📋 Farm Log'       },
  { href: 'farm-analytics.html', label: '📈 Farm Analytics' },
  { href: 'dashboard.html',      label: '📡 IoT Dashboard'  },
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
    /* Right side */
    .an-right{display:flex;align-items:center;gap:8px;margin-left:auto;flex-shrink:0;}
    .an-dot{width:6px;height:6px;border-radius:50%;background:#5fcf80;flex-shrink:0;animation:an-pulse 2.4s ease-in-out infinite;}
    @keyframes an-pulse{0%,100%{box-shadow:0 0 0 0 rgba(95,207,128,.5)}50%{box-shadow:0 0 0 4px rgba(95,207,128,0)}}
    .an-email{font-family:'DM Mono',monospace;font-size:10px;color:rgba(245,239,230,.28);}
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
      .an-links,.an-sep:first-of-type,.an-email{display:none!important;}
      .an-burger{display:flex;}
      .an-right .an-logout{display:none;}
    }
  `;
  document.head.appendChild(s);
}

export function mountAdminNav({ page, supabase, email }) {
  injectStyles();

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
      <a href="admin.html" class="an-logo">
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
        <span class="an-dot" title="Live"></span>
        <span class="an-email">${email || ''}</span>
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
    window.location.href = 'admin.html';
  }
  document.getElementById('an-logout-btn')?.addEventListener('click', doLogout);
  document.getElementById('an-logout-mobile')?.addEventListener('click', doLogout);
}
