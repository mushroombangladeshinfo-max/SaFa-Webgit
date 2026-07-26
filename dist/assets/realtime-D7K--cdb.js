function m(){const t=document.activeElement;if(!t)return!1;const e=t.tagName;return e==="INPUT"||e==="TEXTAREA"||e==="SELECT"||t.isContentEditable===!0}function b(t,e,l,d,u={}){const{debounceMs:s=800,indicatorId:n}=u;let r;function a(){if(m()){r=setTimeout(a,s);return}d(),g(n)}function f(){clearTimeout(r),r=setTimeout(a,s)}const i=t.channel(e);return l.forEach(o=>{i.on("postgres_changes",{event:"*",schema:"public",table:o},f)}),i.subscribe(o=>{const c=n&&document.getElementById(n);c&&c.classList.toggle("rt-connected",o==="SUBSCRIBED")}),i}function g(t){if(!t)return;const e=document.getElementById(t);e&&(e.classList.add("rt-flash"),setTimeout(()=>e.classList.remove("rt-flash"),700))}function h(){if(document.getElementById("rt-styles"))return;const t=document.createElement("style");t.id="rt-styles",t.textContent=`
    .rt-indicator{display:inline-flex;align-items:center;gap:5px;font-family:'Syne','Hind Siliguri',sans-serif;font-size:9px;font-weight:700;letter-spacing:.1em;text-transform:uppercase;color:rgba(245,239,230,.3);transition:color .3s;}
    .rt-dot{width:6px;height:6px;border-radius:50%;background:rgba(245,239,230,.2);flex-shrink:0;transition:background .3s;}
    .rt-indicator.rt-connected{color:#5fcf80;}
    .rt-indicator.rt-connected .rt-dot{background:#5fcf80;animation:rt-pulse 2.4s ease-in-out infinite;}
    .rt-indicator.rt-flash{color:#d9b254;}
    .rt-indicator.rt-flash .rt-dot{background:#d9b254!important;animation:none;}
    @keyframes rt-pulse{0%,100%{box-shadow:0 0 0 0 rgba(95,207,128,.5)}50%{box-shadow:0 0 0 4px rgba(95,207,128,0)}}
  `,document.head.appendChild(t)}export{h as i,b as s};
