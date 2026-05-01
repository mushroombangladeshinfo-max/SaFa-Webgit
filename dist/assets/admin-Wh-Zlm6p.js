import"./index-DshXEMtg.js";import{s as i}from"./main-pzK2-eGT.js";const I="mushrombangladesh.info@gmail.com",k="8801970099378",v=20,a={page:1,search:"",dateFrom:"",dateTo:"",statusFilter:"",totalCount:0,orders:[],realtimeSub:null},p=t=>"৳"+(t||0).toLocaleString("en-BD"),w=t=>new Intl.DateTimeFormat("en-GB",{day:"numeric",month:"short",year:"numeric"}).format(new Date(t)),y=t=>new Intl.DateTimeFormat("en-GB",{day:"numeric",month:"short",year:"numeric",hour:"2-digit",minute:"2-digit",hour12:!0}).format(new Date(t)),f=t=>t?t.charAt(0).toUpperCase()+t.slice(1):"";function m(t,e="success"){const n=document.createElement("div");n.className=`toast ${e}`,n.textContent=t,document.getElementById("toast-stack").appendChild(n),setTimeout(()=>n.remove(),3200)}function E(t){const e=document.getElementById("login-banner");document.getElementById("login-banner-text").textContent=t,e.classList.add("visible")}document.getElementById("pwd-toggle").addEventListener("click",function(){const t=document.getElementById("admin-password"),e=t.type==="password";t.type=e?"text":"password",this.innerHTML=e?'<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>':'<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>'});async function _(){const{data:{session:t}}=await i.auth.getSession();t&&t.user.email===I?B(t.user.email):t?(E("Access denied. This account does not have admin privileges."),await i.auth.signOut()):document.getElementById("login-page").style.display="flex"}function B(t){document.getElementById("login-page").style.display="none",document.getElementById("dash-page").style.display="block",document.getElementById("topbar-email").textContent=t;const e=new Date().toLocaleDateString("en-GB",{weekday:"long",day:"numeric",month:"long",year:"numeric"});document.getElementById("dash-subtitle").textContent=e,h(),l(),L()}document.getElementById("admin-login-form").addEventListener("submit",async t=>{t.preventDefault();const e=document.getElementById("login-btn");e.innerHTML='<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="animation:spin 1s linear infinite" aria-hidden="true"><circle cx="12" cy="12" r="10" stroke-opacity=".25"/><path d="M12 2a10 10 0 0 1 10 10"/></svg> Logging in...',e.disabled=!0;const{error:n}=await i.auth.signInWithPassword({email:document.getElementById("admin-email").value,password:document.getElementById("admin-password").value});n?(E(n.message),e.innerHTML="Log In to Dashboard",e.disabled=!1):_()});document.getElementById("logout-btn").addEventListener("click",async()=>{a.realtimeSub&&i.removeChannel(a.realtimeSub),await i.auth.signOut(),location.reload()});async function h(){const t=new Date;t.setHours(0,0,0,0);const[{data:e},{data:n},{data:s}]=await Promise.all([i.from("orders").select("total_amount,status").gte("created_at",t.toISOString()),i.from("orders").select("id",{count:"exact"}).eq("status","pending"),i.from("orders").select("total_amount,status").in("status",["delivered","confirmed","processing","shipped"])]);let o=0,d=0;(e||[]).forEach(u=>{u.status!=="cancelled"&&(o+=u.total_amount||0,d++)});const c=(n==null?void 0:n.length)||0,g=(s||[]).reduce((u,b)=>u+(b.total_amount||0),0);document.getElementById("stat-today-rev").textContent=p(o),document.getElementById("stat-today-orders").textContent=d,document.getElementById("stat-pending").textContent=c,document.getElementById("stat-total-rev").textContent=p(g)}async function l(){const t=document.getElementById("order-tbody");t.innerHTML=[1,2,3,4,5].map(()=>`
        <tr><td colspan="8"><div class="skel-row-wrap">
          <div class="skel" style="height:14px;width:90px"></div>
          <div class="skel" style="height:14px;width:160px"></div>
          <div class="skel" style="height:14px;width:120px"></div>
          <div class="skel" style="height:14px;flex:1"></div>
        </div></td></tr>`).join("");const e=(a.page-1)*v,n=e+v-1;let s=i.from("orders").select("*",{count:"exact"}).order("created_at",{ascending:!1}).range(e,n);a.search&&(s=s.or(`customer_phone.ilike.%${a.search}%,customer_name.ilike.%${a.search}%`)),a.dateFrom&&(s=s.gte("created_at",new Date(a.dateFrom+"T00:00:00").toISOString())),a.dateTo&&(s=s.lte("created_at",new Date(a.dateTo+"T23:59:59.999").toISOString())),a.statusFilter&&(s=s.eq("status",a.statusFilter));const{data:o,error:d,count:c}=await s;if(d){t.innerHTML='<tr><td colspan="8"><div class="table-empty"><div class="table-empty-icon">⚠️</div><p class="table-empty-text">Could not load orders</p></div></td></tr>';return}a.totalCount=c||0,a.orders=o||[],a.orders.length?t.innerHTML=a.orders.map(g=>S(g)).join(""):t.innerHTML='<tr><td colspan="8"><div class="table-empty"><div class="table-empty-icon">🍄</div><p class="table-empty-text">No orders found</p></div></td></tr>',C()}function S(t,e=!1){`${(t.status||"pending").toLowerCase()}`;const n=(t.items||[]).map(o=>`${o.name} ×${o.qty}`).join(", "),s=e?'<span class="new-badge">NEW</span>':"";return`
        <tr class="order-row" data-id="${t.id}" onclick="toggleRow('${t.id}')">
          <td style="width:28px;padding:14px 8px 14px 16px;">
            <svg class="expand-chevron" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="6 9 12 15 18 9"/></svg>
          </td>
          <td>
            <div class="cell-id">${t.order_number}${s}</div>
            <div class="cell-sub">${w(t.created_at)}</div>
          </td>
          <td class="cell-sub">${w(t.created_at)}</td>
          <td>
            <div>${t.customer_name}</div>
            <div class="cell-sub">${t.customer_phone}</div>
          </td>
          <td><div class="cell-sub">${t.thana}, ${t.district}</div></td>
          <td><div class="cell-items">${n||"—"}</div></td>
          <td><div class="cell-total">${p(t.total_amount)}</div></td>
          <td onclick="event.stopPropagation()">
            <select class="status-select" data-id="${t.id}" onchange="updateStatus('${t.id}',this.value)">
              ${["pending","confirmed","processing","shipped","delivered","cancelled","returned"].map(o=>`<option value="${o}" ${t.status===o?"selected":""}>${f(o)}</option>`).join("")}
            </select>
          </td>
        </tr>
        <tr id="detail-${t.id}" class="order-detail-row" style="display:none;">
          <td colspan="8">${T(t)}</td>
        </tr>`}function T(t){const e=(t.items||[]).map(s=>`<div class="od-row"><span class="od-label">${s.name} ×${s.qty}</span><span class="od-val">${p((s.price||0)*(s.qty||0))}</span></div>`).join(""),n=encodeURIComponent(`Hi ${t.customer_name}! 🍄

This is SaFa Naturals. Your order #${t.order_number} is being processed.

Please confirm your delivery details.

Thank you!`);return`
        <div class="order-detail-panel">
          <div class="od-grid">
            <div>
              <div class="od-section-title">Customer & Delivery</div>
              <div class="od-row"><span class="od-label">Name</span><span class="od-val">${t.customer_name}</span></div>
              <div class="od-row"><span class="od-label">Phone</span><span class="od-val">${t.customer_phone}</span></div>
              <div class="od-row"><span class="od-label">Address</span><span class="od-val">${t.full_address}, ${t.thana}, ${t.district}</span></div>
              ${t.special_notes?`<div class="od-row"><span class="od-label">Notes</span><span class="od-val" style="font-style:italic;color:rgba(245,239,230,.6);">${t.special_notes}</span></div>`:""}
              <div class="od-row"><span class="od-label">Placed</span><span class="od-val">${y(t.created_at)}</span></div>
            </div>
            <div>
              <div class="od-section-title">Order Items</div>
              <div class="od-items">${e}</div>
              <div class="od-row" style="margin-top:8px;"><span class="od-label">Subtotal</span><span class="od-val">${p(t.subtotal)}</span></div>
              <div class="od-row"><span class="od-label">Delivery</span><span class="od-val">${t.delivery_fee===0?'<span style="color:#5fcf80">Free</span>':p(t.delivery_fee)}</span></div>
              <div class="od-row" style="border-top:1px solid rgba(255,255,255,.08);margin-top:4px;padding-top:8px;">
                <span class="od-label" style="font-family:'Syne',sans-serif;font-size:10px;font-weight:700;letter-spacing:.12em;text-transform:uppercase;">Total</span>
                <span class="od-val" style="font-family:'Cormorant Garamond',serif;font-size:22px;color:var(--al);">${p(t.total_amount)}</span>
              </div>
            </div>
          </div>
          <div class="od-actions">
            <a class="f-action-btn green-btn" href="https://wa.me/${k}?text=${n}" target="_blank" rel="noopener noreferrer">
              <svg viewBox="0 0 24 24" width="12" height="12" fill="currentColor" aria-hidden="true"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/></svg>
              WhatsApp Customer
            </a>
            <button type="button" class="f-action-btn" onclick="printReceipt('${t.id}')">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="6 9 6 2 18 2 18 9"/><path d="M6 18H4a2 2 0 01-2-2v-5a2 2 0 012-2h16a2 2 0 012 2v5a2 2 0 01-2 2h-2"/><rect x="6" y="14" width="12" height="8"/></svg>
              Print Receipt
            </button>
          </div>
        </div>`}window.toggleRow=t=>{const e=document.getElementById(`detail-${t}`),n=document.querySelector(`tr.order-row[data-id="${t}"]`);if(!e||!n)return;const s=e.style.display!=="none";e.style.display=s?"none":"table-row",n.classList.toggle("expanded",!s)};window.updateStatus=async(t,e)=>{const{error:n}=await i.from("orders").update({status:e}).eq("id",t);n?m("Failed to update status","error"):(m(`Status → ${f(e)}`),h())};function L(){a.realtimeSub=i.channel("orders-live").on("postgres_changes",{event:"INSERT",schema:"public",table:"orders"},t=>{m(`New order: #${t.new.order_number}`,"info"),l(),h()}).on("postgres_changes",{event:"UPDATE",schema:"public",table:"orders"},()=>{h()}).subscribe()}function C(){const t=document.getElementById("pagination-bar"),e=Math.ceil(a.totalCount/v)||1;t.style.display="flex",document.getElementById("page-info").textContent=`Page ${a.page} of ${e} · ${a.totalCount} orders`,document.getElementById("btn-prev").disabled=a.page<=1,document.getElementById("btn-next").disabled=a.page>=e}document.getElementById("btn-prev").addEventListener("click",()=>{a.page--,l()});document.getElementById("btn-next").addEventListener("click",()=>{a.page++,l()});let $;document.getElementById("search-input").addEventListener("input",t=>{clearTimeout($),$=setTimeout(()=>{a.search=t.target.value.trim(),a.page=1,l()},300)});document.getElementById("filter-date-from").addEventListener("change",t=>{a.dateFrom=t.target.value,a.page=1,l()});document.getElementById("filter-date-to").addEventListener("change",t=>{a.dateTo=t.target.value,a.page=1,l()});document.getElementById("filter-status").addEventListener("change",t=>{a.statusFilter=t.target.value,a.page=1,l()});document.getElementById("clear-filters-btn").addEventListener("click",()=>{document.getElementById("search-input").value="",document.getElementById("filter-date-from").value="",document.getElementById("filter-date-to").value="",document.getElementById("filter-status").value="",a.search="",a.dateFrom="",a.dateTo="",a.statusFilter="",a.page=1,l()});document.getElementById("export-btn").addEventListener("click",async()=>{const t=document.getElementById("export-btn"),e=t.innerHTML;t.innerHTML="Exporting...",t.disabled=!0;try{let n=i.from("orders").select("*").order("created_at",{ascending:!1});a.search&&(n=n.or(`customer_phone.ilike.%${a.search}%,customer_name.ilike.%${a.search}%`)),a.dateFrom&&(n=n.gte("created_at",new Date(a.dateFrom+"T00:00:00").toISOString())),a.dateTo&&(n=n.lte("created_at",new Date(a.dateTo+"T23:59:59.999").toISOString())),a.statusFilter&&(n=n.eq("status",a.statusFilter));const{data:s,error:o}=await n;if(o)throw o;if(!(s!=null&&s.length)){m("No orders to export.","error");return}const d=["Order ID","Date","Customer Name","Phone","District","Thana","Address","Subtotal","Delivery","Total","Status","Items","Notes"],c=s.map(r=>[r.order_number,`"${y(r.created_at)}"`,`"${r.customer_name}"`,`" ${r.customer_phone}"`,`"${r.district}"`,`"${r.thana}"`,`"${(r.full_address||"").replace(/"/g,'""')}"`,r.subtotal,r.delivery_fee,r.total_amount,r.status,`"${(r.items||[]).map(x=>`${x.name} x${x.qty}`).join("; ")}"`,`"${(r.special_notes||"").replace(/"/g,'""')}"`].join(",")),g=[d.join(","),...c].join(`
`),u=new Blob([g],{type:"text/csv;charset=utf-8;"});Object.assign(document.createElement("a"),{href:URL.createObjectURL(u),download:`safa_orders_${new Date().toISOString().split("T")[0]}.csv`}).click(),m(`Exported ${s.length} orders`)}catch(n){m("Export failed","error"),console.error(n)}finally{t.innerHTML=e,t.disabled=!1}});window.printReceipt=t=>{const e=a.orders.find(d=>d.id===t);if(!e){m("Order not found","error");return}const n=`<style>
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
        <div class="hd"><h1>SaFa Naturals</h1><p>Order Receipt · ${e.order_number}</p></div>
        <table>
          <tr><td>Date:</td><td>${y(e.created_at)}</td></tr>
          <tr><td>Customer:</td><td>${e.customer_name}</td></tr>
          <tr><td>Phone:</td><td>${e.customer_phone}</td></tr>
          <tr><td>Address:</td><td>${e.full_address}, ${e.thana}, ${e.district}</td></tr>
          <tr><td>Status:</td><td>${f(e.status)}</td></tr>
          <tr><td>Payment:</td><td>Cash on Delivery</td></tr>
        </table>
        <h3>Items</h3>
        <table class="it">
          <thead><tr><th>Item</th><th>Qty</th><th style="text-align:right">Price</th><th style="text-align:right">Total</th></tr></thead>
          <tbody>${(e.items||[]).map(d=>{var c;return`<tr><td>${d.name}</td><td>${d.qty}</td><td style="text-align:right">৳${(c=d.price)==null?void 0:c.toLocaleString()}</td><td style="text-align:right">৳${((d.price||0)*(d.qty||0)).toLocaleString()}</td></tr>`}).join("")}</tbody>
        </table>
        <table style="width:50%;margin-left:auto;">
          <tr><td>Subtotal:</td><td style="text-align:right">৳${(e.subtotal||0).toLocaleString()}</td></tr>
          <tr><td>Delivery:</td><td style="text-align:right">${e.delivery_fee===0?"Free":"৳"+e.delivery_fee}</td></tr>
          <tr class="tr"><td>Total:</td><td style="text-align:right">৳${(e.total_amount||0).toLocaleString()}</td></tr>
        </table>
        ${e.special_notes?`<p style="margin-top:16px;padding:10px;background:#f9f9f9;border-left:3px solid #000;font-size:13px;font-style:italic;">${e.special_notes}</p>`:""}
        <div class="ft"><p>Thank you for your order — SaFa Naturals 🍄</p></div>
      </div>`,o=window.open("","_blank");o.document.write(`<!DOCTYPE html><html><head><title>Receipt ${e.order_number}</title>${n}</head><body>${s}</body></html>`),o.document.close(),o.focus(),setTimeout(()=>{o.print(),o.close()},300)};_();
