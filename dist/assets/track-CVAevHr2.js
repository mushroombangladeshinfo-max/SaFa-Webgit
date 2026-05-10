import"./modulepreload-polyfill-B5Qt9EMX.js";import{c as f}from"./index-B-jIxwbw.js";const b=f("https://uiwmerejtrdrykqpumdu.supabase.co","eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVpd21lcmVqdHJkcnlrcXB1bWR1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzU3NzQ1MjIsImV4cCI6MjA5MTM1MDUyMn0.bF1GPeGFhAphNFG-E6MfZCrZihT3iTeCFIDi6g3w0n0"),w=[{key:"pending",label:`অর্ডার
দেওয়া হয়েছে`,icon:y()},{key:"confirmed",label:`নিশ্চিত
হয়েছে`,icon:I()},{key:"processing",label:`প্রস্তুত
হচ্ছে`,icon:M()},{key:"shipped",label:`পাঠানো
হয়েছে`,icon:$()},{key:"delivered",label:`পৌঁছে
গেছে`,icon:B()}],u=["pending","confirmed","processing","shipped","delivered"];function y(){return`<svg fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
    <path stroke-linecap="round" stroke-linejoin="round"
      d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"/></svg>`}function I(){return`<svg fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
    <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7"/></svg>`}function M(){return`<svg fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
    <path stroke-linecap="round" stroke-linejoin="round"
      d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573
         1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426
         1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37
         2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724
         1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0
         00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066
         -2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"/>
    <path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
  </svg>`}function $(){return`<svg fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
    <path stroke-linecap="round" stroke-linejoin="round"
      d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z"/>
    <path stroke-linecap="round" stroke-linejoin="round"
      d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10m9 0H9m4 0h5m-5-8h4l2 4"/>
  </svg>`}function B(){return`<svg fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
    <path stroke-linecap="round" stroke-linejoin="round"
      d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1
         1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/>
  </svg>`}function l(e){const n=document.getElementById("error-banner");document.getElementById("error-text").textContent=e,n.classList.add("show")}function E(){document.getElementById("error-banner").classList.remove("show")}function m(e){const n=document.getElementById("btn-track");n.disabled=e,n.classList.toggle("loading",e)}function C(e){return`status-badge badge-${e}`}function L(e){return{pending:"অপেক্ষায়",confirmed:"নিশ্চিত",processing:"প্রস্তুত হচ্ছে",shipped:"পাঠানো হয়েছে",delivered:"ডেলিভারি হয়েছে",cancelled:"বাতিল"}[e]||e}function j(e){return e?new Date(e).toLocaleDateString("bn-BD",{day:"numeric",month:"long",year:"numeric"}):"—"}function c(e){return"৳"+Number(e||0).toLocaleString("bn-BD")}function x(e){const n=e.status==="cancelled",s=Array.isArray(e.items)?e.items:[],a=u.indexOf(e.status),r=n||a<0?0:Math.round(a/(u.length-1)*100),v=w.map((t,o)=>{let p="";return n||(o<a?p="done":o===a&&(p="active")),`
      <div class="step ${p}">
        <div class="step-dot">${t.icon}</div>
        <div class="step-label">${t.label.replace(`
`,"<br/>")}</div>
      </div>`}).join(""),h=s.length?s.map(t=>`
        <div class="item-row">
          <span class="item-name">${t.name||t.title||"পণ্য"}</span>
          <span class="item-qty">×${t.qty||t.quantity||1}</span>
          <span class="item-price">${c((t.price||0)*(t.qty||t.quantity||1))}</span>
        </div>`).join(""):'<div class="item-row"><span class="item-name" style="color:var(--muted)">পণ্যের বিবরণ পাওয়া যায়নি</span></div>',g=s.reduce((t,o)=>t+(o.price||0)*(o.qty||o.quantity||1),0),d=e.delivery_charge||0,k=encodeURIComponent(`হ্যালো, আমার অর্ডার নম্বর ${e.order_number} সম্পর্কে জানতে চাই।`);return`
    <div class="status-header">
      <div class="status-top">
        <div class="order-meta">
          <h3>${e.order_number}</h3>
          <span>${j(e.created_at)}</span>
        </div>
        <span class="${C(e.status)}">${L(e.status)}</span>
      </div>

      ${n?`
        <div class="cancelled-banner">
          <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <circle cx="12" cy="12" r="10"/>
            <path stroke-linecap="round" stroke-linejoin="round" d="M15 9l-6 6M9 9l6 6"/>
          </svg>
          <p>এই অর্ডারটি বাতিল করা হয়েছে। কোনো প্রশ্ন থাকলে WhatsApp-এ যোগাযোগ করুন।</p>
        </div>`:`
        <div class="stepper">
          <div class="stepper-progress" style="width:${r}%"></div>
          ${v}
        </div>`}
    </div>

    <div class="detail-body">
      <div class="info-grid">
        <div class="info-item">
          <label>গ্রাহকের নাম</label>
          <span>${e.customer_name||"—"}</span>
        </div>
        <div class="info-item">
          <label>জেলা</label>
          <span>${e.district||"—"}</span>
        </div>
        <div class="info-item" style="grid-column:1/-1">
          <label>ঠিকানা</label>
          <span>${e.address||"—"}</span>
        </div>
        ${e.notes?`
        <div class="info-item" style="grid-column:1/-1">
          <label>নোট</label>
          <span>${e.notes}</span>
        </div>`:""}
      </div>

      <div class="section-title">অর্ডারকৃত পণ্য</div>
      <div class="items-list">${h}</div>

      <div class="totals">
        <div class="total-row">
          <span>পণ্যের মূল্য</span>
          <span>${c(g||e.total_amount-d)}</span>
        </div>
        <div class="total-row">
          <span>ডেলিভারি চার্জ</span>
          <span>${d===0?"বিনামূল্যে ✨":c(d)}</span>
        </div>
        <div class="total-row grand">
          <span>মোট</span>
          <span>${c(e.total_amount)}</span>
        </div>
      </div>

      <div class="actions">
        <a class="btn-wa"
           href="https://wa.me/8801970099378?text=${k}"
           target="_blank" rel="noopener">
          <svg viewBox="0 0 24 24" fill="currentColor">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15
              -.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463
              -2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606
              .134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371
              -.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51
              -.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016
              -1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487
              .709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719
              2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
            <path d="M12 0C5.373 0 0 5.373 0 12c0 2.123.554 4.117 1.528 5.845L.057 23.25a.75.75
              0 00.916.915l5.405-1.471A11.943 11.943 0 0012 24c6.627 0 12-5.373 12-12S18.627 0
              12 0zm0 21.75c-1.99 0-3.855-.544-5.455-1.49l-.39-.232-4.04 1.099 1.1-4.041
              -.231-.389A9.718 9.718 0 012.25 12C2.25 6.615 6.615 2.25 12 2.25S21.75 6.615
              21.75 12 17.385 21.75 12 21.75z"/>
          </svg>
          WhatsApp সাপোর্ট
        </a>
        <a class="btn-home" href="/">
          <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round"
              d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1
                 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/>
          </svg>
          আরও অর্ডার করুন
        </a>
      </div>
    </div>
  `}window.trackOrder=async function(){E();const e=document.getElementById("inp-order").value.trim(),n=document.getElementById("inp-phone").value.trim();if(!e){l("অর্ডার নম্বর দিন।");return}if(!n){l("ফোন নম্বর দিন।");return}m(!0),document.getElementById("result-card").classList.remove("show");try{const{data:s,error:a}=await b.rpc("track_order",{p_order_number:e,p_phone:n});if(a)throw a;if(!s){l("অর্ডার পাওয়া যায়নি। অর্ডার নম্বর ও ফোন নম্বর মিলিয়ে দেখুন।");return}const r=document.getElementById("result-card");r.innerHTML=x(s),r.classList.add("show"),r.scrollIntoView({behavior:"smooth",block:"start"})}catch(s){l("সংযোগে সমস্যা হয়েছে। একটু পরে আবার চেষ্টা করুন।"),console.error(s)}finally{m(!1)}};document.addEventListener("keydown",e=>{e.key==="Enter"&&(document.activeElement===document.getElementById("inp-order")||document.activeElement===document.getElementById("inp-phone"))&&window.trackOrder()});const i=new URLSearchParams(location.search);i.get("order")&&(document.getElementById("inp-order").value=i.get("order"));i.get("phone")&&(document.getElementById("inp-phone").value=i.get("phone"));i.get("order")&&i.get("phone")&&window.trackOrder();
