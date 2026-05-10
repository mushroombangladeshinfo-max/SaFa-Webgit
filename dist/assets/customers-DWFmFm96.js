import"./modulepreload-polyfill-B5Qt9EMX.js";import{createClient as f}from"https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm";import{r as w}from"./admin-auth-rHatrkP5.js";import{m as $}from"./admin-nav-BmaD9ZLf.js";const p=f("https://uiwmerejtrdrykqpumdu.supabase.co","eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVpd21lcmVqdHJkcnlrcXB1bWR1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzU3NzQ1MjIsImV4cCI6MjA5MTM1MDUyMn0.bF1GPeGFhAphNFG-E6MfZCrZihT3iTeCFIDi6g3w0n0"),y=await w(p);y||(window.location.href="admin.html");$({page:"customers",supabase:p,email:y.user.email});const i=n=>"৳"+(n||0).toLocaleString("en-BD"),I=new Intl.DateTimeFormat("en-GB",{day:"numeric",month:"short",year:"numeric"}),m=n=>I.format(new Date(n)),h=n=>n?n.charAt(0).toUpperCase()+n.slice(1):"",b="8801970099378";function g(n,t="info"){const e=Object.assign(document.createElement("div"),{className:`toast ${t}`,textContent:n});document.getElementById("toast-stack").appendChild(e),setTimeout(()=>e.remove(),3500)}let o=[],d="spent",u="all";async function C(){const{data:n,error:t}=await p.from("orders").select("id,order_number,customer_name,customer_phone,district,thana,total_amount,status,created_at").order("created_at",{ascending:!1});if(t){document.getElementById("cust-tbody").innerHTML=`<tr><td colspan="8"><div class="table-empty"><div class="table-empty-icon">⚠️</div><p class="table-empty-text">${t.message}</p></div></td></tr>`;return}const e={};(n||[]).forEach(s=>{const a=s.customer_phone||"unknown";e[a]||(e[a]={phone:a,name:s.customer_name,district:s.district,thana:s.thana,orders:[],totalSpent:0}),e[a].orders.push(s),e[a].totalSpent+=s.total_amount||0,new Date(s.created_at)>new Date(e[a].orders[0]?.created_at||0)&&(e[a].name=s.customer_name,e[a].district=s.district,e[a].thana=s.thana)}),o=Object.values(e).sort((s,a)=>a.totalSpent-s.totalSpent);const r=o.filter(s=>s.orders.length>=2).length,l=o.reduce((s,a)=>s+a.totalSpent,0);document.getElementById("s-total").textContent=o.length,document.getElementById("s-repeat").textContent=r,document.getElementById("s-revenue").textContent=i(l),document.getElementById("s-aov").textContent=o.length?i(Math.round(l/o.length)):"—",c()}function _(){const n=document.getElementById("search-input").value.trim().toLowerCase();let t=[...o];return u==="repeat"?t=t.filter(e=>e.orders.length>=2):u==="new"&&(t=t.filter(e=>e.orders.length===1)),n&&(t=t.filter(e=>e.name?.toLowerCase().includes(n)||e.phone.includes(n)||(e.district||"").toLowerCase().includes(n))),d==="spent"&&t.sort((e,r)=>r.totalSpent-e.totalSpent),d==="orders"&&t.sort((e,r)=>r.orders.length-e.orders.length),d==="recent"&&t.sort((e,r)=>new Date(r.orders[0]?.created_at||0)-new Date(e.orders[0]?.created_at||0)),d==="name"&&t.sort((e,r)=>(e.name||"").localeCompare(r.name||"")),t}function c(){const n=_();if(document.getElementById("result-count").textContent=`${n.length} customer${n.length!==1?"s":""}`,!n.length){document.getElementById("cust-tbody").innerHTML='<tr><td colspan="8"><div class="table-empty"><div class="table-empty-icon">👤</div><p class="table-empty-text">No customers found</p></div></td></tr>';return}document.getElementById("cust-tbody").innerHTML=n.map(t=>{const e=t.orders[0],r=`s-${(e?.status||"pending").toLowerCase()}`,l=encodeURIComponent(`হ্যালো ${t.name}! 🍄 SaFa Naturals থেকে বলছি।`),s=t.phone.replace(/\+/g,"");return`
          <tr class="order-row" onclick="window.toggleCust('${s}')">
            <td class="td-chevron"><svg class="expand-chevron" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"/></svg></td>
            <td>
              <div class="cell-id">${t.name||"—"}</div>
              <div class="cell-sub">${t.orders.length} order${t.orders.length!==1?"s":""}</div>
            </td>
            <td><span class="cell-phone">${t.phone}</span></td>
            <td class="cell-sub">${t.thana?t.thana+", ":""}${t.district||"—"}</td>
            <td>
              <div class="cust-order-count">${t.orders.length}</div>
              ${t.orders.length>=2?'<div class="cust-repeat-label">Repeat buyer</div>':""}
            </td>
            <td><div class="cell-spent">${i(t.totalSpent)}</div></td>
            <td class="cell-sub">${e?m(e.created_at):"—"}</td>
            <td><span class="status-badge ${r}">${h(e?.status||"unknown")}</span></td>
          </tr>
          <tr id="cust-det-${s}" style="display:none;">
            <td colspan="8">
              <div class="cust-orders-panel">
                <div class="cust-orders-title">Order History · ${t.name}</div>
                ${t.orders.map(a=>`
                  <div class="cust-order-row">
                    <div>
                      <div class="cust-order-id">#${a.order_number}</div>
                      <div class="cust-order-meta">${m(a.created_at)}</div>
                    </div>
                    <span class="status-badge s-${(a.status||"pending").toLowerCase()}">${h(a.status||"pending")}</span>
                    <div class="cust-order-total">${i(a.total_amount)}</div>
                  </div>`).join("")}
                <div class="cust-wa-wrap">
                  <a class="f-action-btn green-btn" href="https://wa.me/${b}?text=${l}" target="_blank" rel="noopener">
                    <svg viewBox="0 0 24 24" width="11" height="11" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/></svg>
                    WhatsApp ${t.name?.split(" ")[0]||""}
                  </a>
                </div>
              </div>
            </td>
          </tr>`}).join("")}window.toggleCust=n=>{const t=document.getElementById(`cust-det-${n}`),e=document.querySelector(`tr[onclick="window.toggleCust('${n}')"]`);if(!t)return;const r=t.style.display!=="none";t.style.display=r?"none":"table-row",e?.classList.toggle("expanded",!r)};let v;document.getElementById("search-input").addEventListener("input",()=>{clearTimeout(v),v=setTimeout(c,250)});document.getElementById("sort-select").addEventListener("change",n=>{d=n.target.value,c()});document.getElementById("type-select").addEventListener("change",n=>{u=n.target.value,c()});document.getElementById("export-btn").addEventListener("click",()=>{if(!o.length){g("No data to export","error");return}const n=[["Name","Phone","District","Thana","Orders","Total Spent","Last Order","Last Status"],...o.map(t=>{const e=t.orders[0];return[`"${t.name}"`,`" ${t.phone}"`,`"${t.district||""}"`,`"${t.thana||""}"`,t.orders.length,t.totalSpent,e?m(e.created_at):"",e?.status||""].join(",")})].join(`
`);Object.assign(document.createElement("a"),{href:"data:text/csv;charset=utf-8,"+encodeURIComponent(n),download:`safa_customers_${new Date().toISOString().slice(0,10)}.csv`}).click(),g(`Exported ${o.length} customers`)});C();
