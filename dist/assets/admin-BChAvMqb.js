import{s as l}from"./main-q8TLCeIc.js";const L="mushrombangladesh.info@gmail.com",r={currentPage:1,pageSize:15,searchQuery:"",totalOrders:0,orders:[],dateFrom:"",dateTo:""},a={loginSection:document.getElementById("login-section"),dashSection:document.getElementById("dashboard-section"),loginForm:document.getElementById("admin-login-form"),loginBtn:document.getElementById("login-btn"),logoutBtn:document.getElementById("logout-btn"),orderList:document.getElementById("order-list"),inventoryList:document.getElementById("inventory-list"),searchInput:document.getElementById("search-input"),dateFrom:document.getElementById("filter-date-from"),dateTo:document.getElementById("filter-date-to"),btnPrev:document.getElementById("btn-prev"),btnNext:document.getElementById("btn-next"),pageInfo:document.getElementById("page-info"),exportBtn:document.getElementById("export-btn"),refreshStockBtn:document.getElementById("refresh-stock-btn"),salesVal:document.getElementById("today-sales-val"),ordersVal:document.getElementById("today-orders-val"),toast:document.getElementById("toast"),pagination:document.getElementById("pagination-controls")},p=t=>new Intl.NumberFormat("en-BD",{style:"currency",currency:"BDT",minimumFractionDigits:0}).format(t).replace("BDT","৳").trim(),S=t=>new Intl.DateTimeFormat("en-GB",{day:"numeric",month:"short",year:"numeric"}).format(new Date(t)),x=t=>new Intl.DateTimeFormat("en-GB",{day:"numeric",month:"short",year:"numeric",hour:"2-digit",minute:"2-digit",hour12:!0}).format(new Date(t)),m=(t,e=!1)=>{a.toast.style.background=e?"var(--tl)":"#5fcf80",a.toast.textContent=t,a.toast.classList.add("show"),setTimeout(()=>a.toast.classList.remove("show"),3e3)},$=async()=>{const{data:{session:t}}=await l.auth.getSession();t&&t.user.email===L?(a.loginSection.style.display="none",a.dashSection.classList.remove("hidden"),u(),w(),y()):t&&(alert("Access Denied: You do not have admin privileges."),await l.auth.signOut())},E=async t=>{t.preventDefault();const e=document.getElementById("admin-email").value,n=document.getElementById("admin-password").value;a.loginBtn.classList.add("btn-loading");const{error:s}=await l.auth.signInWithPassword({email:e,password:n});a.loginBtn.classList.remove("btn-loading"),s?alert(s.message):$()},T=async()=>{await l.auth.signOut(),location.reload()},w=async()=>{const t=new Date;t.setHours(0,0,0,0);const{data:e,error:n}=await l.from("orders").select("total_amount, status").gte("created_at",t.toISOString());if(n)return console.error("Error fetching stats:",n.message);let s=0,c=0;e.forEach(i=>{i.status!=="cancelled"&&(s+=i.total_amount||0,c++)}),a.salesVal.textContent=p(s),a.ordersVal.textContent=c},_=t=>`
      <tr><td colspan="${t}">
        <div class="skeleton-box" style="margin-bottom: 8px;"></div>
        <div class="skeleton-box" style="width: 70%; opacity: 0.5;"></div>
      </td></tr>
    `,u=async()=>{a.orderList.innerHTML=_(8);const t=(r.currentPage-1)*r.pageSize,e=t+r.pageSize-1;let n=l.from("orders").select("*",{count:"exact"}).order("created_at",{ascending:!1}).range(t,e);if(r.searchQuery&&(n=n.ilike("customer_phone",`%${r.searchQuery}%`)),r.dateFrom){const o=new Date(r.dateFrom+"T00:00:00");n=n.gte("created_at",o.toISOString())}if(r.dateTo){const o=new Date(r.dateTo+"T23:59:59.999");n=n.lte("created_at",o.toISOString())}const{data:s,error:c,count:i}=await n;if(c){a.orderList.innerHTML='<tr><td colspan="8" class="admin-empty"><div class="admin-empty-icon">⚠️</div>Could not load orders.</td></tr>';return}if(r.totalOrders=i||0,r.orders=s,s.length===0){a.orderList.innerHTML='<tr><td colspan="8" class="admin-empty"><div class="admin-empty-icon">🍄</div>No orders found.</td></tr>',b();return}a.orderList.innerHTML=s.map(o=>{const g=o.payment_status!=="paid"?`<button class="btn-ghost-dark btn-admin-action btn-mark-paid" data-id="${o.id}">Mark Paid</button>`:"";return`
        <tr>
          <td style="font-family: var(--fl); font-weight: 700; letter-spacing: .05em;">${o.order_number}</td>
          <td>${S(o.created_at)}</td>
          <td>${o.customer_name}<br><span style="font-size:12px; color:rgba(245,239,230,.5);">${o.customer_phone}</span></td>
          <td>${o.thana}, ${o.district}</td>
          <td style="color: var(--al); font-weight:500;">${p(o.total_amount)}</td>
          <td>
            <select class="status-select" data-id="${o.id}">
              <option value="pending" ${o.status==="pending"?"selected":""}>Pending</option>
              <option value="confirmed" ${o.status==="confirmed"?"selected":""}>Confirmed</option>
              <option value="dispatched" ${o.status==="dispatched"?"selected":""}>Dispatched</option>
              <option value="delivered" ${o.status==="delivered"?"selected":""}>Delivered</option>
              <option value="cancelled" ${o.status==="cancelled"?"selected":""}>Cancelled</option>
            </select>
          </td>
          <td>
            <span class="payment-status-badge ${o.payment_status||"unpaid"}">${o.payment_status||"unpaid"}</span>
          </td>
          <td>
            <button class="btn-ghost-dark btn-admin-action btn-print" data-id="${o.id}">Print</button>
            ${g}
          </td>
        </tr>
      `}).join(""),b()},y=async()=>{a.inventoryList.innerHTML=_(4);try{const{data:t,error:e}=await l.from("products").select("id, name, inventory_count").order("name");if(e)throw e;if(!t||t.length===0){a.inventoryList.innerHTML='<tr><td colspan="4" class="admin-empty"><div class="admin-empty-icon">📦</div>No products found in inventory.</td></tr>';return}a.inventoryList.innerHTML=t.map(n=>`
          <tr>
            <td style="font-family: var(--fl); letter-spacing: .05em;">${n.id}</td>
            <td>${n.name}</td>
            <td style="color: ${n.inventory_count<=10?"var(--tl)":"var(--c)"}; font-weight: 500;">
              ${n.inventory_count}
            </td>
            <td>
              <button class="btn-ghost-dark btn-admin-action btn-update-stock" data-id="${n.id}" data-current="${n.inventory_count}">Update</button>
            </td>
          </tr>
        `).join("")}catch(t){console.error("[SaFa] Error loading inventory:",t),a.inventoryList.innerHTML='<tr><td colspan="4" class="admin-empty">Could not load inventory.</td></tr>'}},b=()=>{a.pagination.style.display="flex";const t=Math.ceil(r.totalOrders/r.pageSize)||1;a.pageInfo.textContent=`Page ${r.currentPage} of ${t}`,a.btnPrev.disabled=r.currentPage===1,a.btnNext.disabled=r.currentPage>=t},D=async(t,e)=>{const{error:n}=await l.from("orders").update({status:e}).eq("id",t);n?m("Error updating status",!0):(m("Order updated to "+e),u(),w())},P=async t=>{if(!confirm("Are you sure you want to mark this order as paid? This cannot be undone."))return;const{error:e}=await l.from("orders").update({payment_status:"paid"}).eq("id",t);e?m("Error marking as paid",!0):(m("Order marked as paid"),u())},O=async(t,e)=>{const n=prompt(`Update stock for ${t} (Current: ${e}):`,e);if(!(n===null||isNaN(parseInt(n))))try{const{error:s}=await l.from("products").update({inventory_count:parseInt(n)}).eq("id",t);if(s)throw s;m("Stock updated successfully"),y()}catch(s){console.error("[SaFa] Stock update failed:",s),m("Failed to update stock",!0)}},C=t=>{const e=r.orders.find(i=>i.id===t);if(!e){alert("Order not found.");return}const n=`
        <style>
          body { font-family: "DM Sans", -apple-system, BlinkMacSystemFont, sans-serif; margin: 20px; background: #fff; color: #000; line-height: 1.5; }
          .receipt-container { max-width: 550px; margin: 0 auto; }
          .header { text-align: center; border-bottom: 1px dashed #ccc; padding-bottom: 10px; margin-bottom: 20px; }
          .header h1 { font-family: "Cormorant Garamond", serif; font-size: 28px; margin: 0; font-weight: 400; }
          .header p { margin: 0; font-size: 11px; text-transform: uppercase; letter-spacing: 0.1em; color: #555; }
          .details-table { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
          .details-table td { padding: 8px 0; font-size: 14px; border-bottom: 1px solid #eee; vertical-align: top; }
          .details-table td:first-child { color: #333; width: 100px; }
          .details-table td:last-child { text-align: right; font-weight: 500; }
          h3 { font-family: "Syne", sans-serif; font-size: 12px; text-transform: uppercase; letter-spacing: 0.1em; margin-top: 30px; margin-bottom: 10px; border-bottom: 1px solid #000; padding-bottom: 5px; }
          .items-table { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
          .items-table th, .items-table td { padding: 8px; text-align: left; border-bottom: 1px solid #eee; font-size: 14px; }
          .items-table th { background: #f8f8f8; font-size: 12px; text-transform: uppercase; font-weight: 600; }
          .items-table .price, .items-table .total { text-align: right; }
          .totals-section { width: 50%; margin-left: auto; margin-top: 20px; }
          .totals-section td { padding: 5px 0; text-align: right; }
          .totals-section td:first-child { text-align: left; color: #333; }
          .grand-total td { font-size: 20px; font-family: "Cormorant Garamond", serif; font-weight: 600; border-top: 2px solid #000; padding-top: 10px; }
          .notes { margin-top: 20px; padding: 12px; background: #f9f9f9; border-left: 3px solid #000; font-size: 13px; font-style: italic; }
          .footer { text-align: center; margin-top: 30px; font-size: 12px; color: #777; }
          @media print { body { margin: 0; } }
        </style>
      `,s=`
        <div class="receipt-container">
          <div class="header">
            <h1>SaFa Naturals</h1>
            <p>Order Receipt</p>
          </div>
          <table class="details-table">
            <tr><td>Order ID:</td><td>${e.order_number}</td></tr>
            <tr><td>Date:</td><td>${x(e.created_at)}</td></tr>
            <tr><td>Customer:</td><td>${e.customer_name}</td></tr>
            <tr><td>Phone:</td><td>${e.customer_phone}</td></tr>
            <tr><td>Address:</td><td>${e.full_address}, ${e.thana}, ${e.district}</td></tr>
            <tr><td>Payment:</td><td>Cash on Delivery (${e.payment_status||"unpaid"})</td></tr>
          </table>
          <h3>Items</h3>
          <table class="items-table">
            <thead><tr><th>Item</th><th>Qty</th><th class="price">Price</th><th class="total">Total</th></tr></thead>
            <tbody>
              ${e.items.map(i=>`
                <tr>
                  <td>${i.name}</td>
                  <td>${i.qty}</td>
                  <td class="price">${p(i.price)}</td>
                  <td class="total">${p(i.qty*i.price)}</td>
                </tr>
              `).join("")}
            </tbody>
          </table>
          <table class="totals-section">
            <tr><td>Subtotal:</td><td class="price">${p(e.subtotal)}</td></tr>
            <tr><td>Delivery:</td><td class="price">${p(e.delivery_fee)}</td></tr>
            <tr class="grand-total"><td>Total:</td><td class="price">${p(e.total_amount)}</td></tr>
          </table>
          ${e.special_notes?`<div class="notes">${e.special_notes}</div>`:""}
          <div class="footer"><p>Thank you for your order!</p></div>
        </div>
      `,c=window.open("","_blank");c.document.write(`<!DOCTYPE html><html><head><title>Print Receipt - ${e.order_number}</title>${n}</head><body>${s}</body></html>`),c.document.close(),c.focus(),setTimeout(()=>{c.print(),c.close()},250)},F=async()=>{const t=a.exportBtn.textContent;a.exportBtn.textContent="Exporting...",a.exportBtn.disabled=!0;try{let e=l.from("orders").select("*").order("created_at",{ascending:!1});if(r.searchQuery&&(e=e.ilike("customer_phone",`%${r.searchQuery}%`)),r.dateFrom){const d=new Date(r.dateFrom+"T00:00:00");e=e.gte("created_at",d.toISOString())}if(r.dateTo){const d=new Date(r.dateTo+"T23:59:59.999");e=e.lte("created_at",d.toISOString())}const{data:n,error:s}=await e;if(s)throw s;if(!n||n.length===0)return m("No orders to export.",!0);const c=["Order ID","Date","Customer Name","Phone","District","Thana","Address","Subtotal","Delivery","Total","Payment Status","Order Status","Items","Notes"],i=n.map(d=>{const I=x(d.created_at).replace(/,/g,""),k=d.items.map(h=>`${h.name} (x${h.qty})`).join("; ");return[d.order_number,`"${I}"`,`"${d.customer_name}"`,`" ${d.customer_phone}"`,`"${d.district}"`,`"${d.thana}"`,`"${d.full_address.replace(/"/g,'""')}"`,d.subtotal,d.delivery_fee,d.total_amount,d.payment_status||"unpaid",d.status,`"${k}"`,`"${(d.special_notes||"").replace(/"/g,'""')}"`].join(",")}),o=[c.join(","),...i].join(`
`),g=new Blob([o],{type:"text/csv;charset=utf-8;"}),f=document.createElement("a");f.href=URL.createObjectURL(g),f.download=`safa_orders_${new Date().toISOString().split("T")[0]}.csv`,f.click()}catch{m("Error exporting CSV",!0)}finally{a.exportBtn.textContent=t,a.exportBtn.disabled=!1}};let v;a.searchInput.addEventListener("input",t=>{clearTimeout(v),v=setTimeout(()=>{r.searchQuery=t.target.value.trim(),r.currentPage=1,u()},300)});const B=()=>{r.dateFrom=a.dateFrom.value,r.dateTo=a.dateTo.value,r.currentPage=1,u()};a.dateFrom.addEventListener("change",B);a.dateTo.addEventListener("change",B);a.loginForm.addEventListener("submit",E);a.logoutBtn.addEventListener("click",T);a.exportBtn.addEventListener("click",F);a.refreshStockBtn.addEventListener("click",y);a.btnPrev.addEventListener("click",()=>{r.currentPage--,u()});a.btnNext.addEventListener("click",()=>{r.currentPage++,u()});a.orderList.addEventListener("change",t=>{t.target.classList.contains("status-select")&&D(t.target.dataset.id,t.target.value)});a.orderList.addEventListener("click",t=>{const e=t.target.closest(".btn-mark-paid"),n=t.target.closest(".btn-print");e&&P(e.dataset.id),n&&C(n.dataset.id)});a.inventoryList.addEventListener("click",t=>{const e=t.target.closest(".btn-update-stock");e&&O(e.dataset.id,e.dataset.current)});$();
