import"./index-DshXEMtg.js";import{s as i}from"./main-EM0ZYaKl.js";const k="mushrombangladesh.info@gmail.com",C="8801970099378",b=20,o={page:1,search:"",dateFrom:"",dateTo:"",statusFilter:"",totalCount:0,orders:[],realtimeSub:null},g=e=>"৳"+(e||0).toLocaleString("en-BD"),x=e=>new Intl.DateTimeFormat("en-GB",{day:"numeric",month:"short",year:"numeric"}).format(new Date(e)),w=e=>new Intl.DateTimeFormat("en-GB",{day:"numeric",month:"short",year:"numeric",hour:"2-digit",minute:"2-digit",hour12:!0}).format(new Date(e)),$=e=>e?e.charAt(0).toUpperCase()+e.slice(1):"";function r(e,t="success"){const n=document.createElement("div");n.className=`toast ${t}`,n.textContent=e,document.getElementById("toast-stack").appendChild(n),setTimeout(()=>n.remove(),3200)}function _(e){const t=document.getElementById("login-banner");document.getElementById("login-banner-text").textContent=e,t.classList.add("visible")}document.getElementById("pwd-toggle").addEventListener("click",function(){const e=document.getElementById("admin-password"),t=e.type==="password";e.type=t?"text":"password",this.innerHTML=t?'<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>':'<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>'});async function B(){const{data:{session:e}}=await i.auth.getSession();e&&e.user.email===k?L(e.user.email):e?(_("Access denied. This account does not have admin privileges."),await i.auth.signOut()):document.getElementById("login-page").style.display="flex"}function L(e){document.getElementById("login-page").style.display="none",document.getElementById("dash-page").style.display="block",document.getElementById("topbar-email").textContent=e;const t=new Date().toLocaleDateString("en-GB",{weekday:"long",day:"numeric",month:"long",year:"numeric"});document.getElementById("dash-subtitle").textContent=t,h(),p(),D()}document.getElementById("admin-login-form").addEventListener("submit",async e=>{e.preventDefault();const t=document.getElementById("login-btn");t.innerHTML='<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="animation:spin 1s linear infinite" aria-hidden="true"><circle cx="12" cy="12" r="10" stroke-opacity=".25"/><path d="M12 2a10 10 0 0 1 10 10"/></svg> Logging in...',t.disabled=!0;const{error:n}=await i.auth.signInWithPassword({email:document.getElementById("admin-email").value,password:document.getElementById("admin-password").value});n?(_(n.message),t.innerHTML="Log In to Dashboard",t.disabled=!1):B()});document.getElementById("logout-btn").addEventListener("click",async()=>{o.realtimeSub&&i.removeChannel(o.realtimeSub),await i.auth.signOut(),location.reload()});async function h(){const e=new Date;e.setHours(0,0,0,0);const[{data:t},{data:n},{data:s}]=await Promise.all([i.from("orders").select("total_amount,status").gte("created_at",e.toISOString()),i.from("orders").select("id",{count:"exact"}).eq("status","pending"),i.from("orders").select("total_amount,status").in("status",["delivered","confirmed","processing","shipped"])]);let a=0,d=0;(t||[]).forEach(u=>{u.status!=="cancelled"&&(a+=u.total_amount||0,d++)});const l=(n==null?void 0:n.length)||0,m=(s||[]).reduce((u,y)=>u+(y.total_amount||0),0);document.getElementById("stat-today-rev").textContent=g(a),document.getElementById("stat-today-orders").textContent=d,document.getElementById("stat-pending").textContent=l,document.getElementById("stat-total-rev").textContent=g(m)}async function p(){const e=document.getElementById("order-tbody");e.innerHTML=[1,2,3,4,5].map(()=>`
        <tr><td colspan="8"><div class="skel-row-wrap">
          <div class="skel" style="height:14px;width:90px"></div>
          <div class="skel" style="height:14px;width:160px"></div>
          <div class="skel" style="height:14px;width:120px"></div>
          <div class="skel" style="height:14px;flex:1"></div>
        </div></td></tr>`).join("");const t=(o.page-1)*b,n=t+b-1;let s=i.from("orders").select("*",{count:"exact"}).order("created_at",{ascending:!1}).range(t,n);o.search&&(s=s.or(`customer_phone.ilike.%${o.search}%,customer_name.ilike.%${o.search}%`)),o.dateFrom&&(s=s.gte("created_at",new Date(o.dateFrom+"T00:00:00").toISOString())),o.dateTo&&(s=s.lte("created_at",new Date(o.dateTo+"T23:59:59.999").toISOString())),o.statusFilter&&(s=s.eq("status",o.statusFilter));const{data:a,error:d,count:l}=await s;if(d){e.innerHTML='<tr><td colspan="8"><div class="table-empty"><div class="table-empty-icon">⚠️</div><p class="table-empty-text">Could not load orders</p></div></td></tr>';return}o.totalCount=l||0,o.orders=a||[],o.orders.length?e.innerHTML=o.orders.map(m=>S(m)).join(""):e.innerHTML='<tr><td colspan="8"><div class="table-empty"><div class="table-empty-icon">🍄</div><p class="table-empty-text">No orders found</p></div></td></tr>',M()}function S(e,t=!1){`${(e.status||"pending").toLowerCase()}`;const n=(e.items||[]).map(a=>`${a.name} ×${a.qty}`).join(", "),s=t?'<span class="new-badge">NEW</span>':"";return`
        <tr class="order-row" data-id="${e.id}" onclick="toggleRow('${e.id}')">
          <td style="width:28px;padding:14px 8px 14px 16px;">
            <svg class="expand-chevron" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="6 9 12 15 18 9"/></svg>
          </td>
          <td>
            <div class="cell-id">${e.order_number}${s}</div>
            <div class="cell-sub">${x(e.created_at)}</div>
          </td>
          <td class="cell-sub">${x(e.created_at)}</td>
          <td>
            <div>${e.customer_name}</div>
            <div class="cell-sub">${e.customer_phone}</div>
          </td>
          <td><div class="cell-sub">${e.thana}, ${e.district}</div></td>
          <td><div class="cell-items">${n||"—"}</div></td>
          <td><div class="cell-total">${g(e.total_amount)}</div></td>
          <td onclick="event.stopPropagation()">
            <select class="status-select" data-id="${e.id}" onchange="updateStatus('${e.id}',this.value)">
              ${["pending","confirmed","processing","shipped","delivered","cancelled","returned"].map(a=>`<option value="${a}" ${e.status===a?"selected":""}>${$(a)}</option>`).join("")}
            </select>
          </td>
        </tr>
        <tr id="detail-${e.id}" class="order-detail-row" style="display:none;">
          <td colspan="8">${T(e)}</td>
        </tr>`}function T(e){const t=(e.items||[]).map(s=>`<div class="od-row"><span class="od-label">${s.name} ×${s.qty}</span><span class="od-val">${g((s.price||0)*(s.qty||0))}</span></div>`).join(""),n=encodeURIComponent(`Hi ${e.customer_name}! 🍄

This is SaFa Naturals. Your order #${e.order_number} is being processed.

Please confirm your delivery details.

Thank you!`);return`
        <div class="order-detail-panel">
          <div class="od-grid">
            <div>
              <div class="od-section-title">Customer & Delivery</div>
              <div class="od-row"><span class="od-label">Name</span><span class="od-val">${e.customer_name}</span></div>
              <div class="od-row"><span class="od-label">Phone</span><span class="od-val">${e.customer_phone}</span></div>
              <div class="od-row"><span class="od-label">Address</span><span class="od-val">${e.full_address}, ${e.thana}, ${e.district}</span></div>
              ${e.special_notes?`<div class="od-row"><span class="od-label">Notes</span><span class="od-val" style="font-style:italic;color:rgba(245,239,230,.6);">${e.special_notes}</span></div>`:""}
              <div class="od-row"><span class="od-label">Placed</span><span class="od-val">${w(e.created_at)}</span></div>
            </div>
            <div>
              <div class="od-section-title">Order Items</div>
              <div class="od-items">${t}</div>
              <div class="od-row" style="margin-top:8px;"><span class="od-label">Subtotal</span><span class="od-val">${g(e.subtotal)}</span></div>
              <div class="od-row"><span class="od-label">Delivery</span><span class="od-val">${e.delivery_fee===0?'<span style="color:#5fcf80">Free</span>':g(e.delivery_fee)}</span></div>
              <div class="od-row" style="border-top:1px solid rgba(255,255,255,.08);margin-top:4px;padding-top:8px;">
                <span class="od-label" style="font-family:'Syne',sans-serif;font-size:10px;font-weight:700;letter-spacing:.12em;text-transform:uppercase;">Total</span>
                <span class="od-val" style="font-family:'Cormorant Garamond',serif;font-size:22px;color:var(--al);">${g(e.total_amount)}</span>
              </div>
            </div>
          </div>
          <div class="od-actions">
            <a class="f-action-btn green-btn" href="https://wa.me/${C}?text=${n}" target="_blank" rel="noopener noreferrer">
              <svg viewBox="0 0 24 24" width="12" height="12" fill="currentColor" aria-hidden="true"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/></svg>
              WhatsApp Customer
            </a>
            <button type="button" class="f-action-btn" onclick="printReceipt('${e.id}')">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="6 9 6 2 18 2 18 9"/><path d="M6 18H4a2 2 0 01-2-2v-5a2 2 0 012-2h16a2 2 0 012 2v5a2 2 0 01-2 2h-2"/><rect x="6" y="14" width="12" height="8"/></svg>
              Print Receipt
            </button>
          </div>
        </div>`}window.toggleRow=e=>{const t=document.getElementById(`detail-${e}`),n=document.querySelector(`tr.order-row[data-id="${e}"]`);if(!t||!n)return;const s=t.style.display!=="none";t.style.display=s?"none":"table-row",n.classList.toggle("expanded",!s)};window.updateStatus=async(e,t)=>{const{error:n}=await i.from("orders").update({status:t}).eq("id",e);n?r("Failed to update status","error"):(r(`Status → ${$(t)}`),h())};function D(){o.realtimeSub=i.channel("orders-live").on("postgres_changes",{event:"INSERT",schema:"public",table:"orders"},e=>{r(`New order: #${e.new.order_number}`,"info"),p(),h()}).on("postgres_changes",{event:"UPDATE",schema:"public",table:"orders"},()=>{h()}).subscribe()}function M(){const e=document.getElementById("pagination-bar"),t=Math.ceil(o.totalCount/b)||1;e.style.display="flex",document.getElementById("page-info").textContent=`Page ${o.page} of ${t} · ${o.totalCount} orders`,document.getElementById("btn-prev").disabled=o.page<=1,document.getElementById("btn-next").disabled=o.page>=t}document.getElementById("btn-prev").addEventListener("click",()=>{o.page--,p()});document.getElementById("btn-next").addEventListener("click",()=>{o.page++,p()});let I;document.getElementById("search-input").addEventListener("input",e=>{clearTimeout(I),I=setTimeout(()=>{o.search=e.target.value.trim(),o.page=1,p()},300)});document.getElementById("filter-date-from").addEventListener("change",e=>{o.dateFrom=e.target.value,o.page=1,p()});document.getElementById("filter-date-to").addEventListener("change",e=>{o.dateTo=e.target.value,o.page=1,p()});document.getElementById("filter-status").addEventListener("change",e=>{o.statusFilter=e.target.value,o.page=1,p()});document.getElementById("clear-filters-btn").addEventListener("click",()=>{document.getElementById("search-input").value="",document.getElementById("filter-date-from").value="",document.getElementById("filter-date-to").value="",document.getElementById("filter-status").value="",o.search="",o.dateFrom="",o.dateTo="",o.statusFilter="",o.page=1,p()});document.getElementById("export-btn").addEventListener("click",async()=>{const e=document.getElementById("export-btn"),t=e.innerHTML;e.innerHTML="Exporting...",e.disabled=!0;try{let n=i.from("orders").select("*").order("created_at",{ascending:!1});o.search&&(n=n.or(`customer_phone.ilike.%${o.search}%,customer_name.ilike.%${o.search}%`)),o.dateFrom&&(n=n.gte("created_at",new Date(o.dateFrom+"T00:00:00").toISOString())),o.dateTo&&(n=n.lte("created_at",new Date(o.dateTo+"T23:59:59.999").toISOString())),o.statusFilter&&(n=n.eq("status",o.statusFilter));const{data:s,error:a}=await n;if(a)throw a;if(!(s!=null&&s.length)){r("No orders to export.","error");return}const d=["Order ID","Date","Customer Name","Phone","District","Thana","Address","Subtotal","Delivery","Total","Status","Items","Notes"],l=s.map(c=>[c.order_number,`"${w(c.created_at)}"`,`"${c.customer_name}"`,`" ${c.customer_phone}"`,`"${c.district}"`,`"${c.thana}"`,`"${(c.full_address||"").replace(/"/g,'""')}"`,c.subtotal,c.delivery_fee,c.total_amount,c.status,`"${(c.items||[]).map(E=>`${E.name} x${E.qty}`).join("; ")}"`,`"${(c.special_notes||"").replace(/"/g,'""')}"`].join(",")),m=[d.join(","),...l].join(`
`),u=new Blob([m],{type:"text/csv;charset=utf-8;"});Object.assign(document.createElement("a"),{href:URL.createObjectURL(u),download:`safa_orders_${new Date().toISOString().split("T")[0]}.csv`}).click(),r(`Exported ${s.length} orders`)}catch(n){r("Export failed","error"),console.error(n)}finally{e.innerHTML=t,e.disabled=!1}});window.printReceipt=e=>{const t=o.orders.find(d=>d.id===e);if(!t){r("Order not found","error");return}const n=`<style>
        body{font-family:"DM Sans",-apple-system,sans-serif;margin:24px;background:#fff;color:#000;line-height:1.5;}
        .rc{max-width:560px;margin:0 auto;}
        .hd{text-align:center;border-bottom:2px solid #000;padding-bottom:12px;margin-bottom:20px;}
        .hd h1{font-family:"Cormorant Garamond",serif;font-size:28px;margin:0;font-weight:400;}
        .hd p{margin:4px 0 0;font-size:11px;text-transform:uppercase;letter-spacing:.1em;color:#555;}
        table{width:100%;border-collapse:collapse;margin-bottom:16px;}
        td{padding:7px 0;font-size:14px;border-bottom:1px solid #eee;vertical-align:top;}
        td:first-child{color:#555;width:110px;}td:last-child{text-align:right;font-weight:500;}
        h3{font-size:11px;text-transform:uppercase;letter-spacing:.1em;margin:20px 0 8px;border-bottom:1px solid #000;padding-bottom:4px;}
        .it td{font-size:13px;} .it th{font-size:11px;text-transform:uppercase;background:#f5f5f5;}
        .tr td{font-size:18px;font-family:"Cormorant Garamond",serif;font-weight:600;border-top:2px solid #000;padding-top:8px;}
        .ft{text-align:center;margin-top:24px;font-size:12px;color:#777;border-top:1px dashed #ccc;padding-top:12px;}
        @media print{body{margin:0;}}
      </style>`,s=`<div class="rc">
        <div class="hd"><h1>SaFa Naturals</h1><p>Order Receipt · ${t.order_number}</p></div>
        <table>
          <tr><td>Date:</td><td>${w(t.created_at)}</td></tr>
          <tr><td>Customer:</td><td>${t.customer_name}</td></tr>
          <tr><td>Phone:</td><td>${t.customer_phone}</td></tr>
          <tr><td>Address:</td><td>${t.full_address}, ${t.thana}, ${t.district}</td></tr>
          <tr><td>Status:</td><td>${$(t.status)}</td></tr>
          <tr><td>Payment:</td><td>Cash on Delivery</td></tr>
        </table>
        <h3>Items</h3>
        <table class="it">
          <thead><tr><th>Item</th><th>Qty</th><th style="text-align:right">Price</th><th style="text-align:right">Total</th></tr></thead>
          <tbody>${(t.items||[]).map(d=>{var l;return`<tr><td>${d.name}</td><td>${d.qty}</td><td style="text-align:right">৳${(l=d.price)==null?void 0:l.toLocaleString()}</td><td style="text-align:right">৳${((d.price||0)*(d.qty||0)).toLocaleString()}</td></tr>`}).join("")}</tbody>
        </table>
        <table style="width:50%;margin-left:auto;">
          <tr><td>Subtotal:</td><td style="text-align:right">৳${(t.subtotal||0).toLocaleString()}</td></tr>
          <tr><td>Delivery:</td><td style="text-align:right">${t.delivery_fee===0?"Free":"৳"+t.delivery_fee}</td></tr>
          <tr class="tr"><td>Total:</td><td style="text-align:right">৳${(t.total_amount||0).toLocaleString()}</td></tr>
        </table>
        ${t.special_notes?`<p style="margin-top:16px;padding:10px;background:#f9f9f9;border-left:3px solid #000;font-size:13px;font-style:italic;">${t.special_notes}</p>`:""}
        <div class="ft"><p>Thank you for your order — SaFa Naturals 🍄</p></div>
      </div>`,a=window.open("","_blank");a.document.write(`<!DOCTYPE html><html><head><title>Receipt ${t.order_number}</title>${n}</head><body>${s}</body></html>`),a.document.close(),a.focus(),setTimeout(()=>{a.print(),a.close()},300)};window.switchDashTab=function(e){const t=e==="orders";document.getElementById("panel-orders").style.display=t?"block":"none",document.getElementById("panel-promotions").style.display=t?"none":"block",document.getElementById("tab-orders").classList.toggle("active",t),document.getElementById("tab-promos").classList.toggle("active",!t),t||(F(),v())};async function F(){try{const{data:e}=await i.from("settings").select("key,value");if(!e)return;const t=Object.fromEntries(e.map(n=>[n.key,n.value]));t.free_delivery_threshold&&(document.getElementById("set-fdthreshold").value=t.free_delivery_threshold),t.delivery_fee&&(document.getElementById("set-deliveryfee").value=t.delivery_fee)}catch{}}window.saveSetting=async function(e,t){const n=document.getElementById(t).value;if(!n||isNaN(n)){r("Enter a valid number","error");return}const{error:s}=await i.from("settings").upsert({key:e,value:String(n),updated_at:new Date().toISOString()},{onConflict:"key"});s?r("Failed to save setting","error"):r(`${e==="free_delivery_threshold"?"Free delivery threshold":"Delivery fee"} → ৳${Number(n).toLocaleString()}`)};async function v(){const e=document.getElementById("coupons-tbody");e.innerHTML='<tr><td colspan="8"><div class="table-empty"><div class="table-empty-text">Loading...</div></div></td></tr>';const{data:t,error:n}=await i.from("coupons").select("*").order("created_at",{ascending:!1});if(n){e.innerHTML='<tr><td colspan="8"><div class="table-empty"><div class="table-empty-icon">⚠️</div><p class="table-empty-text">Could not load — run the SQL first</p></div></td></tr>';return}const s=t||[];if(document.getElementById("cs-active").textContent=s.filter(a=>a.active).length,document.getElementById("cs-total").textContent=s.length,document.getElementById("cs-uses").textContent=s.reduce((a,d)=>a+(d.uses||0),0),document.getElementById("cs-maxuses").textContent=s.filter(a=>a.max_uses).length,!s.length){e.innerHTML='<tr><td colspan="8"><div class="table-empty"><div class="table-empty-icon">🏷️</div><p class="table-empty-text">No coupons yet — use Quick Add above or create one.</p></div></td></tr>';return}e.innerHTML=s.map(a=>{const d=a.type==="percent"?`${a.value}%`:`৳${a.value}`,l=a.max_uses?`${a.uses||0} / ${a.max_uses}`:`${a.uses||0}`,m=a.expires_at?x(a.expires_at):"—";return`
          <tr>
            <td>
              <div class="cell-id">${a.code}</div>
              <div class="cell-sub">${a.description||""}</div>
            </td>
            <td><span class="status-badge ${a.type==="percent"?"s-confirmed":"s-processing"}">${a.type}</span></td>
            <td><span class="cell-total">${d}</span></td>
            <td class="cell-sub">৳${(a.min_order||0).toLocaleString()}</td>
            <td class="cell-sub">${l}</td>
            <td class="cell-sub">${m}</td>
            <td onclick="event.stopPropagation()">
              <label class="tog" title="${a.active?"Active":"Inactive"}">
                <input type="checkbox" ${a.active?"checked":""} onchange="toggleCoupon('${a.id}',this.checked)">
                <span class="tog-track"><span class="tog-thumb"></span></span>
              </label>
            </td>
            <td onclick="event.stopPropagation()">
              <button type="button" class="f-clear-btn" onclick="openDelModal('${a.id}','${a.code}')" title="Delete">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6"/><path d="M10 11v6M14 11v6"/><path d="M9 6V4a1 1 0 011-1h4a1 1 0 011 1v2"/></svg>
              </button>
            </td>
          </tr>`}).join("")}window.toggleCoupon=async function(e,t){const{error:n}=await i.from("coupons").update({active:t}).eq("id",e);n?(r("Failed to update","error"),v()):r(t?"Coupon activated ✓":"Coupon deactivated")};let f=null;window.openDelModal=function(e,t){f=e,document.getElementById("del-code-label").textContent=t,document.getElementById("del-modal").classList.add("open")};window.closeDelModal=function(){document.getElementById("del-modal").classList.remove("open"),f=null};window.confirmDelete=async function(){if(!f)return;const{error:e}=await i.from("coupons").delete().eq("id",f);closeDelModal(),e?r("Delete failed","error"):(r("Coupon deleted"),v())};window.addQuickTier=async function(e,t,n,s,a){const d=event.target;d.disabled=!0,d.textContent="…";const{error:l}=await i.from("coupons").insert([{code:e,type:t,value:n,min_order:s,description:a,active:!0}]);d.disabled=!1,d.textContent="+ Add",(l==null?void 0:l.code)==="23505"?r(`"${e}" already exists`,"error"):l?r("Failed to create","error"):(r(`${e} created ✓`),v())};window.toggleAddForm=function(){const e=document.getElementById("add-coupon-form"),t=document.getElementById("toggle-add-btn"),n=e.classList.toggle("add-form-hidden");t.textContent=n?"+ Create Coupon":"✕ Cancel"};window.submitCoupon=async function(){const e=document.getElementById("ac-code").value.trim().toUpperCase(),t=document.getElementById("ac-type").value,n=parseFloat(document.getElementById("ac-value").value),s=parseFloat(document.getElementById("ac-min").value)||0,a=document.getElementById("ac-maxuses").value?parseInt(document.getElementById("ac-maxuses").value):null,d=document.getElementById("ac-expires").value||null,l=document.getElementById("ac-desc").value.trim();if(!e){r("Code is required","error");return}if(isNaN(n)||n<=0){r("Enter a valid discount value","error");return}if(t==="percent"&&n>100){r("Percent cannot exceed 100","error");return}const m={code:e,type:t,value:n,min_order:s,active:!0,description:l||null};a&&(m.max_uses=a),d&&(m.expires_at=new Date(d+"T00:00:00").toISOString());const{error:u}=await i.from("coupons").insert([m]);if((u==null?void 0:u.code)==="23505"){r(`"${e}" already exists`,"error");return}if(u){r("Failed to create coupon","error");return}r(`${e} created ✓`),["ac-code","ac-value","ac-min","ac-maxuses","ac-expires","ac-desc"].forEach(y=>{document.getElementById(y).value=""}),toggleAddForm(),v()};B();
