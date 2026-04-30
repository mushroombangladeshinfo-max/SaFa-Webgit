import"./main-B3pLGffD.js";import{s as l}from"./supabase-CkkPnFpI.js";const i=document.getElementById("auth-view"),c=document.getElementById("account-view"),n=document.getElementById("auth-error");let p=[];window.switchTab=t=>{n.classList.remove("visible");const e=t==="login";document.getElementById("tab-login").classList.toggle("active",e),document.getElementById("tab-signup").classList.toggle("active",!e),document.getElementById("login-form").style.display=e?"block":"none",document.getElementById("signup-form").style.display=e?"none":"block"};window.handleLogin=async t=>{t.preventDefault();const e=document.getElementById("login-btn");e.textContent="Logging in...",e.disabled=!0;const{error:a}=await l.auth.signInWithPassword({email:document.getElementById("login-email").value,password:document.getElementById("login-password").value});a?(n.textContent=a.message,n.classList.add("visible"),e.textContent="Log In",e.disabled=!1):location.reload()};window.handleSignup=async t=>{t.preventDefault();const e=document.getElementById("signup-btn");e.textContent="Signing up...",e.disabled=!0;const{data:a,error:o}=await l.auth.signUp({email:document.getElementById("signup-email").value,password:document.getElementById("signup-password").value,options:{data:{first_name:document.getElementById("signup-name").value,phone:document.getElementById("signup-phone").value}}});o?(n.textContent=o.message,n.classList.add("visible"),e.textContent="Create Account",e.disabled=!1):a.session?location.reload():(n.textContent="Success! Please check your email to verify your account.",n.classList.add("visible"),n.style.borderColor="#5fcf80",n.style.color="#5fcf80",n.style.background="rgba(95,207,128,.08)",e.textContent="Create Account",e.disabled=!1)};window.handleLogout=async()=>{await l.auth.signOut(),location.href="index.html"};l.auth.getSession().then(({data:{session:t}})=>{if(t){i.style.display="none",c.style.display="block";const e=t.user.user_metadata||{},a=e.first_name||t.user.email.split("@")[0];document.getElementById("acc-name").textContent=a,document.getElementById("acc-avatar").textContent=a[0].toUpperCase(),document.getElementById("acc-email").textContent=t.user.email,document.getElementById("acc-phone").textContent=e.phone||"Not provided",u(t.user)}else i.style.display="block",c.style.display="none"});window.openOrderModal=t=>{const e=p.find(s=>s.id===t);if(!e)return;const a=new Date(e.created_at).toLocaleString("en-BD",{day:"2-digit",month:"short",year:"numeric",hour:"2-digit",minute:"2-digit",hour12:!0}),o=e.items.map(s=>`
        <div class="cd-row">
          <span class="cd-label">${s.name}</span>
          <span class="cd-val">
            ${s.qty} × ৳${s.price.toLocaleString()}
            = <span style="color:var(--al);">৳${(s.price*s.qty).toLocaleString()}</span>
          </span>
        </div>`).join("");document.getElementById("modal-receipt-details").innerHTML=`
        <div class="cd-row">
          <span class="cd-label">Order ID</span>
          <span class="cd-val" style="font-family:var(--fl);letter-spacing:.06em;font-weight:700;">${e.order_number}</span>
        </div>
        <div class="cd-row">
          <span class="cd-label">Status</span>
          <span class="cd-val order-status ${e.status.toLowerCase()}" style="display:inline-block; margin-top:2px;">${e.status}</span>
        </div>
        <div class="cd-row">
          <span class="cd-label">Date</span>
          <span class="cd-val">${a}</span>
        </div>
        <div class="cd-row">
          <span class="cd-label">Deliver to</span>
          <span class="cd-val">
            ${e.thana}, ${e.district}<br>
            <span style="font-weight:300;color:rgba(245,239,230,.5);font-size:12.5px;">${e.full_address}</span>
          </span>
        </div>
        ${o}
        <div class="cd-row">
          <span class="cd-label">Delivery</span>
          <span class="cd-val">${e.delivery_fee===0?'<span style="color:#5fcf80;">Free</span>':"৳"+e.delivery_fee}</span>
        </div>
        <div class="cd-row" style="border-top:1px solid rgba(255,255,255,.08); padding-top:14px; margin-top:4px;">
          <span class="cd-label" style="font-family:var(--fl);font-size:11px;letter-spacing:.1em;text-transform:uppercase;">Total</span>
          <span class="cd-val" style="color:var(--al);font-size:22px;font-family:var(--fd);font-weight:300;">
            ৳${e.total_amount.toLocaleString()}
          </span>
        </div>
        ${e.special_notes?`
        <div class="cd-row" style="flex-direction: column; align-items: flex-start; gap: 8px; margin-top: 12px; border-bottom:none;">
          <span class="cd-label">Notes</span>
          <span class="cd-val" style="text-align: left; font-style: italic; color: rgba(245,239,230,.7); max-width:100%;">${e.special_notes}</span>
        </div>`:""}
      `;const r=document.getElementById("orderModal");r.style.display="flex",requestAnimationFrame(()=>r.classList.add("open")),document.body.style.overflow="hidden"};window.closeOrderModal=()=>{const t=document.getElementById("orderModal");t.classList.remove("open"),setTimeout(()=>{t.style.display="none",document.body.style.overflow=""},300)};window.cancelOrder=async t=>{if(confirm("Are you sure you want to cancel this order?"))try{const{error:e}=await l.from("orders").update({status:"cancelled"}).eq("id",t);if(e)throw e;const{data:{session:a}}=await l.auth.getSession();a&&u(a.user)}catch(e){console.error("[SaFa] Error cancelling order:",e),alert("Could not cancel the order. Please try again later.")}};async function u(t){const e=document.getElementById("order-history-list");if(e)try{const{data:a,error:o}=await l.from("orders").select("*").eq("user_id",t.id).order("created_at",{ascending:!1});if(o)throw o;if(p=a,a.length===0){e.innerHTML='<p class="order-history-empty">You have no past orders.</p>';return}const r=a.map(s=>{const m=new Date(s.created_at).toLocaleDateString("en-GB",{day:"numeric",month:"short",year:"numeric"}),g=s.items.map(d=>`${d.name} (×${d.qty})`).join(", "),y=s.status.toLowerCase()==="pending"?`<button class="btn-ghost-dark btn-details btn-cancel" onclick="window.cancelOrder('${s.id}')">Cancel</button>`:"";return`
            <div class="order-history-card">
              <div class="order-header">
                <span class="order-id">Order #${s.order_number}</span>
                <span class="order-status ${s.status.toLowerCase()}">${s.status}</span>
              </div>
              <div class="order-body">
                <div class="order-meta">
                  <span><strong>Date:</strong> ${m}</span>
                  <span><strong>Total:</strong> ৳${s.total_amount.toLocaleString()}</span>
                </div>
                <div class="order-items-preview">${g}</div>
                <div class="order-actions">
                  <button class="btn-ghost-dark btn-details" onclick="window.openOrderModal('${s.id}')">View Details</button>
                  ${y}
                </div>
              </div>
            </div>`}).join("");e.innerHTML=r}catch(a){console.error("[SaFa] Error fetching orders:",a),e.innerHTML='<p class="order-history-empty">Could not load your orders. Please try again later.</p>'}}
