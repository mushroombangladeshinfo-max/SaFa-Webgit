import"./main-B3pLGffD.js";import{s as i}from"./supabase-CkkPnFpI.js";const E="your_actual_email@example.com";let l=1;const f=15;let m="",x=0,$=[],p="",u="";async function _(){const{data:{session:e}}=await i.auth.getSession();e&&e.user.email===E?(document.getElementById("login-section").classList.add("hidden"),document.getElementById("dashboard-section").classList.remove("hidden"),c(),v(),fetchInventory()):e&&(alert("Access Denied: You do not have admin privileges."),await i.auth.signOut())}window.adminLogin=async()=>{const e=document.getElementById("admin-email").value,t=document.getElementById("admin-password").value,{error:a}=await i.auth.signInWithPassword({email:e,password:t});a?alert(a.message):_()};window.adminLogout=async()=>{await i.auth.signOut(),location.reload()};let y;window.handleSearch=e=>{clearTimeout(y),y=setTimeout(()=>{m=e.trim(),l=1,c()},300)};window.handleDateChange=()=>{p=document.getElementById("filter-date-from").value,u=document.getElementById("filter-date-to").value,l=1,c()};async function v(){const e=new Date;e.setHours(0,0,0,0);const{data:t,error:a}=await i.from("orders").select("total_amount, status").gte("created_at",e.toISOString());if(a)return console.error("Error fetching stats:",a.message);let o=0,d=0;t.forEach(s=>{s.status!=="cancelled"&&(o+=s.total_amount||0,d++)}),document.getElementById("today-sales-val").textContent=`৳${o.toLocaleString()}`,document.getElementById("today-orders-val").textContent=d}async function c(){const e=(l-1)*f,t=e+f-1;let a=i.from("orders").select("*",{count:"exact"}).order("created_at",{ascending:!1}).range(e,t);if(m&&(a=a.ilike("customer_phone",`%${m}%`)),p){const n=new Date(p+"T00:00:00");a=a.gte("created_at",n.toISOString())}if(u){const n=new Date(u+"T23:59:59.999");a=a.lte("created_at",n.toISOString())}const{data:o,error:d,count:s}=await a;if(d)return alert("Could not fetch orders: "+d.message);if(x=s||0,$=o,o.length===0){document.getElementById("order-list").innerHTML='<tr><td colspan="8" style="text-align: center; padding: 30px; color: rgba(245,239,230,.5);">No orders found.</td></tr>',w();return}document.getElementById("order-list").innerHTML=o.map(n=>{const g=n.payment_status!=="paid"?`<button class="btn-ghost-dark btn-admin-action btn-mark-paid" onclick="window.markAsPaid('${n.id}')">Mark Paid</button>`:"";return`
        <tr>
          <td style="font-family: var(--fl); font-weight: 700; letter-spacing: .05em;">${n.order_number}</td>
          <td>${new Date(n.created_at).toLocaleDateString("en-GB",{day:"numeric",month:"short"})}</td>
          <td>${n.customer_name}<br><span style="font-size:12px; color:rgba(245,239,230,.5);">${n.customer_phone}</span></td>
          <td>${n.thana}, ${n.district}</td>
          <td style="color: var(--al); font-weight:500;">৳${n.total_amount.toLocaleString()}</td>
          <td>
            <select onchange="window.updateOrderStatus('${n.id}', this.value)">
              <option value="pending" ${n.status==="pending"?"selected":""}>Pending</option>
              <option value="confirmed" ${n.status==="confirmed"?"selected":""}>Confirmed</option>
              <option value="dispatched" ${n.status==="dispatched"?"selected":""}>Dispatched</option>
              <option value="delivered" ${n.status==="delivered"?"selected":""}>Delivered</option>
              <option value="cancelled" ${n.status==="cancelled"?"selected":""}>Cancelled</option>
            </select>
          </td>
          <td>
            <span class="payment-status-badge ${n.payment_status||"unpaid"}">${n.payment_status||"unpaid"}</span>
          </td>
          <td>
            <button class="btn-ghost-dark btn-admin-action" onclick="window.printReceipt('${n.id}')">Print</button>
            ${g}
          </td>
        </tr>
      `}).join(""),w()}window.changePage=e=>{l+=e,c()};function w(){const e=document.getElementById("btn-prev"),t=document.getElementById("btn-next"),a=document.getElementById("page-info"),o=document.getElementById("pagination-controls");o.style.display="flex";const d=Math.ceil(x/f)||1;a.textContent=`Page ${l} of ${d}`,e.disabled=l===1,t.disabled=l>=d}window.updateOrderStatus=async(e,t)=>{const{error:a}=await i.from("orders").update({status:t}).eq("id",e),o=document.getElementById("toast");a?(o.style.background="var(--tl)",o.textContent="Error updating status"):(o.style.background="#5fcf80",o.textContent="Order updated to "+t,c(),v()),o.classList.add("show"),setTimeout(()=>o.classList.remove("show"),3e3)};window.markAsPaid=async e=>{if(!confirm("Are you sure you want to mark this order as paid? This cannot be undone."))return;const{error:t}=await i.from("orders").update({payment_status:"paid"}).eq("id",e);t?alert("Error marking as paid: "+t.message):c()};window.printReceipt=e=>{const t=$.find(s=>s.id===e);if(!t){alert("Order not found.");return}const a=`
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; margin: 20px; background: #fff; color: #000; line-height: 1.5; }
          .receipt-container { max-width: 550px; margin: 0 auto; }
          .header { text-align: center; border-bottom: 1px dashed #ccc; padding-bottom: 10px; margin-bottom: 20px; }
          .header h1 { font-size: 24px; margin: 0; font-weight: 600; }
          .header p { margin: 0; font-size: 12px; color: #555; }
          .details-table { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
          .details-table td { padding: 8px 0; font-size: 14px; border-bottom: 1px solid #eee; vertical-align: top; }
          .details-table td:first-child { color: #333; width: 100px; }
          .details-table td:last-child { text-align: right; font-weight: 500; }
          h3 { font-size: 16px; margin-top: 30px; margin-bottom: 10px; border-bottom: 1px solid #ccc; padding-bottom: 5px; }
          .items-table { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
          .items-table th, .items-table td { padding: 8px; text-align: left; border-bottom: 1px solid #eee; font-size: 14px; }
          .items-table th { background: #f8f8f8; font-size: 12px; text-transform: uppercase; font-weight: 600; }
          .items-table .price, .items-table .total { text-align: right; }
          .totals-section { width: 50%; margin-left: auto; margin-top: 20px; }
          .totals-section td { padding: 5px 0; text-align: right; }
          .totals-section td:first-child { text-align: left; color: #333; }
          .grand-total td { font-size: 18px; font-weight: bold; border-top: 2px solid #000; padding-top: 10px; }
          .notes { margin-top: 20px; padding: 10px; background: #f8f8f8; border-radius: 4px; font-size: 13px; }
          .footer { text-align: center; margin-top: 30px; font-size: 12px; color: #777; }
          @media print { body { margin: 0; } }
        </style>
      `,o=`
        <div class="receipt-container">
          <div class="header">
            <h1>SaFa Naturals</h1>
            <p>Order Receipt</p>
          </div>
          <table class="details-table">
            <tr><td>Order ID:</td><td>${t.order_number}</td></tr>
            <tr><td>Date:</td><td>${new Date(t.created_at).toLocaleString("en-BD",{dateStyle:"medium",timeStyle:"short"})}</td></tr>
            <tr><td>Customer:</td><td>${t.customer_name}</td></tr>
            <tr><td>Phone:</td><td>${t.customer_phone}</td></tr>
            <tr><td>Address:</td><td>${t.full_address}, ${t.thana}, ${t.district}</td></tr>
            <tr><td>Payment:</td><td>Cash on Delivery (${t.payment_status||"unpaid"})</td></tr>
          </table>
          <h3>Items</h3>
          <table class="items-table">
            <thead><tr><th>Item</th><th>Qty</th><th class="price">Price</th><th class="total">Total</th></tr></thead>
            <tbody>
              ${t.items.map(s=>`
                <tr>
                  <td>${s.name}</td>
                  <td>${s.qty}</td>
                  <td class="price">৳${s.price.toLocaleString()}</td>
                  <td class="total">৳${(s.qty*s.price).toLocaleString()}</td>
                </tr>
              `).join("")}
            </tbody>
          </table>
          <table class="totals-section">
            <tr><td>Subtotal:</td><td class="price">৳${t.subtotal.toLocaleString()}</td></tr>
            <tr><td>Delivery:</td><td class="price">৳${t.delivery_fee.toLocaleString()}</td></tr>
            <tr class="grand-total"><td>Total:</td><td class="price">৳${t.total_amount.toLocaleString()}</td></tr>
          </table>
          ${t.special_notes?`<div class="notes"><h4>Notes:</h4><p>${t.special_notes}</p></div>`:""}
          <div class="footer"><p>Thank you for your order!</p></div>
        </div>
      `,d=window.open("","_blank");d.document.write(`<!DOCTYPE html><html><head><title>Print Receipt - ${t.order_number}</title>${a}</head><body>${o}</body></html>`),d.document.close(),d.focus(),setTimeout(()=>{d.print(),d.close()},250)};window.exportCSV=async()=>{const e=document.getElementById("export-btn"),t=e.textContent;e.textContent="Exporting...",e.disabled=!0;try{let a=i.from("orders").select("*").order("created_at",{ascending:!1});if(m&&(a=a.ilike("customer_phone",`%${m}%`)),p){const r=new Date(p+"T00:00:00");a=a.gte("created_at",r.toISOString())}if(u){const r=new Date(u+"T23:59:59.999");a=a.lte("created_at",r.toISOString())}const{data:o,error:d}=await a;if(d)throw d;if(!o||o.length===0)return alert("No orders to export.");const s=["Order ID","Date","Customer Name","Phone","District","Thana","Address","Subtotal","Delivery","Total","Payment Status","Order Status","Items","Notes"],n=o.map(r=>{const I=new Date(r.created_at).toLocaleString("en-BD").replace(/,/g,""),D=r.items.map(b=>`${b.name} (x${b.qty})`).join("; ");return[r.order_number,`"${I}"`,`"${r.customer_name}"`,`" ${r.customer_phone}"`,`"${r.district}"`,`"${r.thana}"`,`"${r.full_address.replace(/"/g,'""')}"`,r.subtotal,r.delivery_fee,r.total_amount,r.payment_status||"unpaid",r.status,`"${D}"`,`"${(r.special_notes||"").replace(/"/g,'""')}"`].join(",")}),g=[s.join(","),...n].join(`
`),S=new Blob([g],{type:"text/csv;charset=utf-8;"}),h=document.createElement("a");h.href=URL.createObjectURL(S),h.download=`safa_orders_${new Date().toISOString().split("T")[0]}.csv`,h.click()}catch(a){alert("Error exporting CSV: "+a.message)}finally{e.textContent=t,e.disabled=!1}};_();
