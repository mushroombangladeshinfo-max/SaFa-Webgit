import{f as K}from"./admin-auth-4ZiUUGs_.js";const j=[{key:"home",href:"home.html",label:"Overview",icon:"🏠"},{key:"orders",href:"orders.html",label:"Orders",icon:"📦"},{key:"customers",href:"customers.html",label:"Customers",icon:"👤"},{key:"products",href:"products.html",label:"Products",icon:"🍄"},{key:"expenses",href:"expenses.html",label:"Expenses",icon:"💰"},{key:"pipeline",href:"pipeline.html",label:"B2B",icon:"🤝"},{key:"insights",href:"insights.html",label:"Insights",icon:"📊"}],I=[{href:"quick-log.html",label:"⚡ Quick Log"},{href:"harvest-log.html",label:"🍄 Harvest Log"},{href:"spawn-lab.html",label:"🧫 Spawn Lab"},{href:"farm-analytics.html",label:"📈 Farm Analytics"},{href:"dashboard.html",label:"📡 IoT Dashboard"}],M=[{href:"job-dashboard.html",label:"🎯 Dashboard"},{href:"job-opportunities.html",label:"💼 Opportunities"},{href:"job-contacts.html",label:"🗂 Contacts"},{href:"job-interviews.html",label:"🎤 Interviews"},{href:"job-copilot.html",label:"✦ AI Copilot"},{href:"job-settings.html",label:"⚙ Career Profile"}],$=[{href:"home.html",label:"Overview",icon:"🏠",hint:"Dashboard & KPIs",keywords:"home dashboard summary kpi"},{href:"orders.html",label:"Orders",icon:"📦",hint:"Manage customer orders",keywords:"sales orders shipping fulfillment"},{href:"customers.html",label:"Customers",icon:"👤",hint:"Customer directory",keywords:"customers users contacts crm"},{href:"products.html",label:"Products",icon:"🍄",hint:"Catalog & inventory",keywords:"products catalog inventory stock"},{href:"expenses.html",label:"Expenses",icon:"💰",hint:"Costs & P&L",keywords:"expenses costs finance pnl profit loss"},{href:"pipeline.html",label:"B2B",icon:"🤝",hint:"Wholesale pipeline",keywords:"b2b pipeline wholesale deals leads"},{href:"insights.html",label:"Insights",icon:"📊",hint:"AI analyst & trends",keywords:"insights analytics ai reports trends"},{href:"quick-log.html",label:"Quick Log",icon:"⚡",hint:"Mobile daily farm log",keywords:"quick log daily farm mobile harvest"},{href:"harvest-log.html",label:"Harvest Log",icon:"🍄",hint:"Every harvest entry, filterable",keywords:"harvest log entries batches rooms pivot table"},{href:"spawn-lab.html",label:"Spawn Lab",icon:"🧫",hint:"In-house culture & grain spawn production",keywords:"spawn lab culture agar petri liquid grain inoculation production"},{href:"farm-analytics.html",label:"Farm Analytics",icon:"📈",hint:"Growth & yield charts",keywords:"farm analytics yield growth charts"},{href:"dashboard.html",label:"IoT Dashboard",icon:"📡",hint:"Simulated sensor preview",keywords:"iot dashboard sensors demo"},{href:"job-dashboard.html",label:"Job Dashboard",icon:"🎯",hint:"Job search command center",keywords:"job search dashboard priorities pipeline funnel"},{href:"job-opportunities.html",label:"Opportunities",icon:"💼",hint:"Job applications tracker",keywords:"job opportunities applications kanban ats fit score"},{href:"job-contacts.html",label:"Job Contacts",icon:"🗂",hint:"Networking CRM",keywords:"job contacts networking recruiter referral"},{href:"job-interviews.html",label:"Interviews",icon:"🎤",hint:"Interview prep & tracking",keywords:"job interviews prep questions star"},{href:"job-copilot.html",label:"AI Copilot",icon:"✦",hint:"Job search AI assistant",keywords:"job ai copilot assistant chat"},{href:"job-settings.html",label:"Career Profile",icon:"⚙",hint:"Background used by AI",keywords:"job career profile settings resume cv"}];function O(){if(document.getElementById("admin-nav-styles"))return;const o=document.createElement("style");o.id="admin-nav-styles",o.textContent=`
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
  `,document.head.appendChild(o)}function T({page:o,supabase:z,email:u,lastLogin:x}){O();const g=K(u),C=g.includes("&")?"F·S":g.charAt(0);document.querySelector("header.an")?.remove(),document.getElementById("an-mobile-drawer")?.remove(),document.getElementById("an-palette-overlay")?.remove();const B=j.map(e=>`
    <a href="${e.href}" class="an-link${o===e.key?" active":""}" aria-current="${o===e.key?"page":"false"}">
      <span class="an-link-icon">${e.icon}</span>${e.label}
    </a>`).join(""),D=I.map(e=>`<a href="${e.href}">${e.label}</a>`).join(""),A=M.map(e=>`<a href="${e.href}">${e.label}</a>`).join(""),H=`
    <header class="an" role="banner">
      <a href="home.html" class="an-logo">
        <span class="an-logo-main">SaFa</span>
        <span class="an-logo-dot">·</span>
        <span class="an-logo-sub">Naturals</span>
        <span class="an-logo-pill">Admin</span>
      </a>
      <div class="an-sep" aria-hidden="true"></div>
      <nav class="an-links" aria-label="Admin navigation">
        ${B}
        <div class="an-drop">
          <button type="button" class="an-drop-trigger" id="an-farm-btn" aria-haspopup="true" aria-expanded="false">
            <span class="an-link-icon">🌿</span>Farm
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" aria-hidden="true"><polyline points="6 9 12 15 18 9"/></svg>
          </button>
          <div class="an-drop-menu" id="an-farm-menu" role="menu">
            ${D}
          </div>
        </div>
        <div class="an-drop">
          <button type="button" class="an-drop-trigger" id="an-jobs-btn" aria-haspopup="true" aria-expanded="false">
            <span class="an-link-icon">💼</span>Jobs
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" aria-hidden="true"><polyline points="6 9 12 15 18 9"/></svg>
          </button>
          <div class="an-drop-menu" id="an-jobs-menu" role="menu">
            ${A}
          </div>
        </div>
      </nav>
      <div class="an-right">
        <a href="/" target="_blank" rel="noopener" class="an-search-btn" aria-label="View live site (opens in a new tab)" title="View live site">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.3" aria-hidden="true"><path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6"/><path d="M15 3h6v6"/><path d="M10 14L21 3"/></svg>
          <span class="an-search-label">View Site</span>
        </a>
        <button type="button" class="an-search-btn" id="an-search-btn" aria-label="Search (Cmd+K)">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.3" aria-hidden="true"><circle cx="11" cy="11" r="7"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
          <span class="an-search-label">Search</span>
          <span class="an-search-kbd">⌘K</span>
        </button>
        ${x?`<span class="an-last">${x}</span>`:""}
        <span class="an-dot" title="Live"></span>
        <span class="an-user" title="${u||""}">
          <span class="an-avatar">${C}</span>
          <span class="an-name">${g}</span>
        </span>
        <button type="button" class="an-logout" id="an-logout-btn">Log Out</button>
      </div>
      <button type="button" class="an-burger" id="an-burger" aria-label="Menu" aria-expanded="false">
        <span></span><span></span><span></span>
      </button>
    </header>
    <!-- Mobile drawer -->
    <div class="an-mobile-drawer" id="an-mobile-drawer" role="navigation" aria-label="Mobile navigation">
      ${j.map(e=>`
        <a href="${e.href}" class="an-link${o===e.key?" active":""}">
          <span class="an-link-icon">${e.icon}</span>${e.label}
        </a>`).join("")}
      <div style="height:1px;background:rgba(255,255,255,.06);margin:8px 0;"></div>
      <div style="font-family:'Syne',sans-serif;font-size:9px;font-weight:700;letter-spacing:.14em;text-transform:uppercase;color:rgba(245,239,230,.2);padding:4px 16px;">Farm Tools</div>
      ${I.map(e=>`<a href="${e.href}" class="an-link" style="letter-spacing:0;font-family:'DM Sans',sans-serif;font-size:13px;font-weight:400;text-transform:none;">${e.label}</a>`).join("")}
      <div style="height:1px;background:rgba(255,255,255,.06);margin:8px 0;"></div>
      <div style="font-family:'Syne',sans-serif;font-size:9px;font-weight:700;letter-spacing:.14em;text-transform:uppercase;color:rgba(245,239,230,.2);padding:4px 16px;">Job Search</div>
      ${M.map(e=>`<a href="${e.href}" class="an-link" style="letter-spacing:0;font-family:'DM Sans',sans-serif;font-size:13px;font-weight:400;text-transform:none;">${e.label}</a>`).join("")}
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
    </div>`,y=document.createElement("div");y.innerHTML=H,document.body.prepend(...y.children);const r=document.getElementById("an-farm-btn"),b=document.getElementById("an-farm-menu");r?.addEventListener("click",e=>{e.stopPropagation();const a=b.classList.toggle("open");r.classList.toggle("open",a),r.setAttribute("aria-expanded",a),h?.classList.remove("open"),i?.classList.remove("open")});const i=document.getElementById("an-jobs-btn"),h=document.getElementById("an-jobs-menu");i?.addEventListener("click",e=>{e.stopPropagation();const a=h.classList.toggle("open");i.classList.toggle("open",a),i.setAttribute("aria-expanded",a),b?.classList.remove("open"),r?.classList.remove("open")}),document.addEventListener("click",()=>{b?.classList.remove("open"),r?.classList.remove("open"),r?.setAttribute("aria-expanded","false"),h?.classList.remove("open"),i?.classList.remove("open"),i?.setAttribute("aria-expanded","false")});const v=document.getElementById("an-burger"),N=document.getElementById("an-mobile-drawer");v?.addEventListener("click",()=>{const e=N.classList.toggle("open");v.setAttribute("aria-expanded",e)});async function k(){await z.auth.signOut(),window.location.href="orders.html"}document.getElementById("an-logout-btn")?.addEventListener("click",k),document.getElementById("an-logout-mobile")?.addEventListener("click",k);const s=document.getElementById("an-palette-overlay"),p=document.getElementById("an-palette-input"),f=document.getElementById("an-palette-list");let n=$.filter(e=>e.href!==w()),t=0;function w(){return location.pathname.split("/").pop()||"home.html"}function c(){if(!n.length){f.innerHTML='<div class="an-palette-empty">No pages match that search.</div>';return}f.innerHTML=n.map((e,a)=>`
      <a href="${e.href}" class="an-palette-item${a===t?" active":""}" data-idx="${a}">
        <span class="an-palette-item-icon">${e.icon}</span>
        <span>
          <div class="an-palette-item-label">${e.label}</div>
          <div class="an-palette-item-hint">${e.hint}</div>
        </span>
      </a>`).join("")}function L(e){const a=e.trim().toLowerCase(),d=$.filter(l=>l.href!==w());n=a?d.filter(l=>l.label.toLowerCase().includes(a)||l.keywords.includes(a)||a.split(/\s+/).every(S=>l.keywords.includes(S)||l.label.toLowerCase().includes(S))):d,t=0,c()}function E(){s.classList.add("open"),p.value="",L(""),setTimeout(()=>p.focus(),0)}function m(){s.classList.remove("open")}document.getElementById("an-search-btn")?.addEventListener("click",E),document.addEventListener("keydown",e=>{(e.metaKey||e.ctrlKey)&&e.key.toLowerCase()==="k"?(e.preventDefault(),s.classList.contains("open")?m():E()):e.key==="Escape"&&s.classList.contains("open")&&m()}),s.addEventListener("mousedown",e=>{e.target===s&&m()}),p.addEventListener("input",()=>L(p.value)),p.addEventListener("keydown",e=>{if(e.key==="ArrowDown")e.preventDefault(),n.length&&(t=(t+1)%n.length,c());else if(e.key==="ArrowUp")e.preventDefault(),n.length&&(t=(t-1+n.length)%n.length,c());else if(e.key==="Enter"){e.preventDefault();const a=n[t];a&&(window.location.href=a.href)}}),f.addEventListener("mousemove",e=>{const a=e.target.closest(".an-palette-item");if(!a)return;const d=Number(a.dataset.idx);d!==t&&(t=d,c())})}export{T as m};
